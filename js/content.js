import { round, score } from './score.js';

const dir = '/data';


export async function fetchList() {

    try {

        const response =
            await fetch(`${dir}/_list.json`);

        const paths =
            await response.json();

        const levels =
            await Promise.all(
                paths.map(async path => {

                    const response =
                        await fetch(`${dir}/${path}.json`);

                    const data =
                        await response.json();

                    return {
                        ...data,
                        path
                    };

                })
            );

        levels.sort(
            (a, b) =>
                (b.percent || 0) -
                (a.percent || 0)
        );

        return [levels, null];

    } catch (error) {

        console.error(
            'Failed to load list:',
            error
        );

        return [
            null,
            ['Failed to load list.']
        ];

    }

}


export function findLevel(list, identifier) {

    if (!list)
        return null;

    return list.find(level =>

        level.name === identifier ||

        level.path === identifier ||

        String(level.id) ===
            String(identifier) ||

        `${level.path}.json` ===
            identifier

    ) || null;

}


export async function fetchPacks() {

    try {

        const response =
            await fetch(`${dir}/_packs.json`);

        return [
            await response.json(),
            null
        ];

    } catch (error) {

        console.error(
            'Failed to load packs:',
            error
        );

        return [
            null,
            ['Failed to load packs.']
        ];

    }

}


export async function fetchLevelPacks(list) {

    const [
        packs,
        err
    ] =
        await fetchPacks();

    if (!packs)
        return [[], err];


    const result =
        list.map(level => {

            const levelPacks =
                packs.filter(pack =>
                    pack.levels &&
                    pack.levels.some(
                        identifier =>
                            identifier === level.path ||
                            identifier === level.name ||
                            String(identifier) ===
                                String(level.id)
                    )
                );

            return {
                ...level,
                packs: levelPacks
            };

        });

    return [result, null];

}


export async function fetchEditors() {

    try {

        const response =
            await fetch(`${dir}/_editors.json`);

        return [
            await response.json(),
            null
        ];

    } catch (error) {

        console.error(
            'Failed to load editors:',
            error
        );

        return [
            null,
            ['Failed to load editors.']
        ];

    }

}


function normalizeUsername(username) {

    return String(username || '')
        .trim()
        .toLowerCase();

}


export function getLevelCompletedUsers(level) {

    const users =
        new Set();


    /*
     * The verifier completed the level.
     */

    if (level.verifier) {

        users.add(
            normalizeUsername(
                level.verifier
            )
        );

    }


    /*
     * Every 100% completion counts.
     */

    if (level.records) {

        level.records.forEach(record => {

            if (
                Number(record.percent) >= 100 &&
                record.user
            ) {

                users.add(
                    normalizeUsername(
                        record.user
                    )
                );

            }

        });

    }


    return users;

}


export function getCompletedPacks(
    username,
    packs,
    list
) {

    const normalized =
        normalizeUsername(username);


    if (!packs || !list)
        return [];


    return packs.filter(pack => {

        if (
            !pack.levels ||
            !pack.levels.length
        )
            return false;


        return pack.levels.every(
            identifier => {

                const level =
                    findLevel(
                        list,
                        identifier
                    );

                if (!level)
                    return false;


                const completed =
                    getLevelCompletedUsers(
                        level
                    );

                return completed.has(
                    normalized
                );

            }
        );

    });

}


function getCreatedLevels(
    username,
    list
) {

    const normalized =
        normalizeUsername(username);


    return list.filter(level => {

        /*
         * creator: "Username"
         */

        if (level.creator) {

            return (
                normalizeUsername(
                    level.creator
                ) === normalized
            );

        }


        /*
         * creators: ["Username", ...]
         */

        if (
            Array.isArray(
                level.creators
            )
        ) {

            return level.creators.some(
                creator =>
                    normalizeUsername(
                        creator
                    ) === normalized
            );

        }


        return false;

    }).map(level => ({

        rank:
            level.rank ??
            level.position ??
            0,

        level:
            level.name,

        link:
            level.link ||
            level.url ||
            null

    }));

}


export async function fetchLeaderboard() {

    try {

        const [
            list,
            listErr
        ] =
            await fetchList();


        if (!list) {

            return [
                [],
                listErr || [
                    'Failed to load levels.'
                ]
            ];

        }


        const [
            packs,
            packErr
        ] =
            await fetchPacks();


        if (!packs) {

            return [
                [],
                packErr || [
                    'Failed to load packs.'
                ]
            ];

        }


        const scoreMap =
            new Map();


        function getPlayer(username) {

            const key =
                normalizeUsername(
                    username
                );


            if (!key)
                return null;


            if (!scoreMap.has(key)) {

                scoreMap.set(
                    key,
                    {
                        user: username,
                        total: 0,
                        verified: [],
                        completed: [],
                        progressed: [],
                        created: [],
                        packs: []
                    }
                );

            }


            return scoreMap.get(key);

        }


        list.forEach(level => {

            const levelScore =
                Number(
                    score(level)
                ) || 0;


            /*
             * VERIFIED
             */

            if (level.verifier) {

                const player =
                    getPlayer(
                        level.verifier
                    );


                if (player) {

                    player.total +=
                        levelScore;


                    player.verified.push({

                        rank:
                            level.rank ??
                            level.position ??
                            0,

                        level:
                            level.name,

                        score:
                            levelScore,

                        link:
                            level.link ||
                            level.url ||
                            null

                    });

                }

            }


            /*
             * COMPLETED / PROGRESS
             */

            if (level.records) {

                level.records.forEach(
                    record => {

                        if (!record.user)
                            return;


                        const player =
                            getPlayer(
                                record.user
                            );


                        if (!player)
                            return;


                        const percent =
                            Number(
                                record.percent
                            ) || 0;


                        const recordScore =
                            levelScore *
                            (percent / 100);


                        if (
                            percent >= 100
                        ) {

                            player.total +=
                                recordScore;


                            player.completed.push({

                                rank:
                                    level.rank ??
                                    level.position ??
                                    0,

                                level:
                                    level.name,

                                score:
                                    recordScore,

                                link:
                                    level.link ||
                                    level.url ||
                                    null

                            });

                        } else if (
                            percent > 0
                        ) {

                            player.total +=
                                recordScore;


                            player.progressed.push({

                                rank:
                                    level.rank ??
                                    level.position ??
                                    0,

                                level:
                                    level.name,

                                percent,

                                score:
                                    recordScore,

                                link:
                                    level.link ||
                                    level.url ||
                                    null

                            });

                        }

                    }
                );

            }

        });


        /*
         * CREATED LEVELS
         */

        scoreMap.forEach(player => {

            player.created =
                getCreatedLevels(
                    player.user,
                    list
                );

        });


        /*
         * COMPLETED PACKS
         */

        scoreMap.forEach(player => {

            player.packs =
                getCompletedPacks(
                    player.user,
                    packs,
                    list
                );

        });


        /*
         * Sort all player data.
         */

        const leaderboard =
            Array.from(
                scoreMap.values()
            )
            .map(player => ({

                ...player,

                total:
                    round(
                        player.total
                    )

            }))
            .sort(
                (a, b) =>
                    b.total - a.total
            );


        return [
            leaderboard,
            packErr || []
        ];

    } catch (error) {

        console.error(
            'Failed to create leaderboard:',
            error
        );

        return [
            [],
            [
                'Failed to load leaderboard.'
            ]
        ];

    }

}

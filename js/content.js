import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';


/* =========================================================
   LIST
   ========================================================= */

export async function fetchList() {

    const listResult =
        await fetch(`${dir}/_list.json`);

    try {

        const list =
            await listResult.json();

        return await Promise.all(

            list.map(
                async (path, rank) => {

                    const levelResult =
                        await fetch(
                            `${dir}/${path}.json`
                        );

                    try {

                        const level =
                            await levelResult.json();

                        return [
                            {
                                ...level,

                                path,

                                records:
                                    (level.records || []).sort(
                                        (a, b) =>
                                            Number(b.percent) -
                                            Number(a.percent)
                                    ),
                            },

                            null,
                        ];

                    } catch {

                        console.error(
                            `Failed to load level #${rank + 1} ${path}.`
                        );

                        return [
                            null,
                            path
                        ];

                    }

                }
            )

        );

    } catch {

        console.error(
            `Failed to load list.`
        );

        return null;

    }

}


/* =========================================================
   FIND LEVEL
   ========================================================= */

export function findLevel(
    list,
    identifier
) {

    if (
        !Array.isArray(list)
    ) {

        return -1;

    }


    const search =
        String(identifier)
            .trim()
            .toLowerCase();


    for (
        let i = 0;
        i < list.length;
        i++
    ) {

        const level =
            list[i]?.[0];


        if (!level) {
            continue;
        }


        /*
         * Level name
         */

        if (
            String(level.name)
                .trim()
                .toLowerCase() === search
        ) {

            return i;

        }


        /*
         * Level path
         */

        if (
            String(level.path)
                .trim()
                .toLowerCase() === search
        ) {

            return i;

        }


        /*
         * Level ID
         */

        if (
            String(level.id)
                .trim()
                .toLowerCase() === search
        ) {

            return i;

        }

    }


    return -1;

}


/* =========================================================
   PACKS
   ========================================================= */

export async function fetchPacks() {

    try {

        const packsResult =
            await fetch(
                `${dir}/_packs.json`
            );

        if (!packsResult.ok) {

            throw new Error(
                `HTTP ${packsResult.status}`
            );

        }

        return await packsResult.json();

    } catch (error) {

        console.error(
            "Failed to load packs.",
            error
        );

        return [];

    }

}


/* =========================================================
   LEVEL -> PACKS
   ========================================================= */

export async function fetchLevelPacks() {

    const packs =
        await fetchPacks();


    if (!packs) {
        return {};
    }


    const levelPacks = {};


    packs.forEach(pack => {

        if (
            !Array.isArray(pack.levels)
        ) {

            return;

        }


        pack.levels.forEach(level => {

            if (
                !levelPacks[level]
            ) {

                levelPacks[level] = [];

            }


            levelPacks[level].push({

                id: pack.id,

                name: pack.name,

                color:
                    pack.color || '#ffffff'

            });

        });

    });


    return levelPacks;

}


/* =========================================================
   GET PACK LEVELS
   ========================================================= */

export function getPackLevels(
    pack,
    list
) {

    if (
        !pack ||
        !Array.isArray(pack.levels) ||
        !Array.isArray(list)
    ) {

        return [];

    }


    return pack.levels
        .map(identifier => {

            const index =
                findLevel(
                    list,
                    identifier
                );


            if (
                index === -1
            ) {

                return null;

            }


            return list[index]?.[0] || null;

        })
        .filter(level => level);

}


/* =========================================================
   GET COMPLETED PLAYERS FOR PACK
   ========================================================= */

export function getCompletedPlayersForPack(
    pack,
    list
) {

    const levels =
        getPackLevels(
            pack,
            list
        );


    /*
     * Every referenced level must exist.
     */

    if (
        levels.length !==
        pack.levels.length
    ) {

        return [];

    }


    /*
     * A pack with no levels
     * cannot have a Victor.
     */

    if (
        levels.length === 0
    ) {

        return [];

    }


    /*
     * username -> original username
     */

    const candidates =
        new Map();


    /*
     * Start with EVERY player
     * who completed the first level.
     */

    for (
        const record
        of levels[0].records || []
    ) {

        const percent =
            Number(record.percent);


        if (
            percent >= 100 &&
            record.user
        ) {

            const username =
                String(record.user).trim();


            if (
                username.length > 0
            ) {

                candidates.set(
                    username.toLowerCase(),
                    username
                );

            }

        }

    }


    /*
     * Check every other level.
     */

    for (
        let i = 1;
        i < levels.length;
        i++
    ) {

        const completedUsers =
            new Set();


        for (
            const record
            of levels[i].records || []
        ) {

            const percent =
                Number(record.percent);


            if (
                percent >= 100 &&
                record.user
            ) {

                completedUsers.add(
                    String(record.user)
                        .trim()
                        .toLowerCase()
                );

            }

        }


        /*
         * Remove everybody who hasn't
         * completed this level.
         */

        for (
            const username
            of candidates.keys()
        ) {

            if (
                !completedUsers.has(
                    username
                )
            ) {

                candidates.delete(
                    username
                );

            }

        }


        /*
         * Nobody can complete the pack anymore.
         */

        if (
            candidates.size === 0
        ) {

            return [];

        }

    }


    return Array.from(
        candidates.values()
    ).sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity: 'base'
                }
            )
    );

}


/* =========================================================
   CHECK IF USER COMPLETED PACK
   ========================================================= */

export function hasCompletedPack(
    pack,
    username,
    list
) {

    if (
        !pack ||
        !username
    ) {

        return false;

    }


    const completedPlayers =
        getCompletedPlayersForPack(
            pack,
            list
        );


    const search =
        String(username)
            .trim()
            .toLowerCase();


    return completedPlayers.some(
        player =>
            String(player)
                .trim()
                .toLowerCase() === search
    );

}


/* =========================================================
   GET PACKS COMPLETED BY USER
   ========================================================= */

export function getCompletedPacksForUser(
    username,
    packs,
    list
) {

    if (
        !username ||
        !Array.isArray(packs) ||
        !Array.isArray(list)
    ) {

        return [];

    }


    return packs.filter(
        pack =>
            hasCompletedPack(
                pack,
                username,
                list
            )
    );

}


/* =========================================================
   EDITORS
   ========================================================= */

export async function fetchEditors() {

    try {

        const editorsResults =
            await fetch(
                `${dir}/_editors.json`
            );

        const editors =
            await editorsResults.json();

        return editors;

    } catch {

        return null;

    }

}


/* =========================================================
   LEADERBOARD
   ========================================================= */

export async function fetchLeaderboard() {

    const list =
        await fetchList();


    if (!list) {

        return [
            [],
            ['_list.json']
        ];

    }


    const totalLevels =
        list.length;


    const scoreMap = {};

    const errs = [];


    list.forEach(
        ([level, err], rank) => {

            if (err) {

                errs.push(err);

                return;

            }


            /*
             * Verification
             */

            const verifier =
                Object.keys(scoreMap).find(
                    u =>
                        u.toLowerCase() ===
                        level.verifier.toLowerCase()
                ) ||
                level.verifier;


            scoreMap[verifier] ??= {

                verified: [],

                completed: [],

                progressed: [],

                packs: []

            };


            const {
                verified
            } = scoreMap[verifier];


            verified.push({

                rank:
                    rank + 1,

                level:
                    level.name,

                score:
                    score(
                        rank + 1,
                        100,
                        level.percentToQualify,
                        totalLevels
                    ),

                link:
                    level.verification

            });


            /*
             * Records
             */

            (
                level.records || []
            ).forEach(
                record => {

                    const user =
                        Object.keys(scoreMap).find(
                            u =>
                                u.toLowerCase() ===
                                record.user.toLowerCase()
                        ) ||
                        record.user;


                    scoreMap[user] ??= {

                        verified: [],

                        completed: [],

                        progressed: [],

                        packs: []

                    };


                    const {
                        completed,
                        progressed
                    } = scoreMap[user];


                    /*
                     * Completed
                     */

                    if (
                        Number(record.percent) >= 100
                    ) {

                        completed.push({

                            rank:
                                rank + 1,

                            level:
                                level.name,

                            score:
                                score(
                                    rank + 1,
                                    100,
                                    level.percentToQualify,
                                    totalLevels
                                ),

                            link:
                                record.link

                        });


                        return;

                    }


                    /*
                     * Progressed
                     */

                    progressed.push({

                        rank:
                            rank + 1,

                        level:
                            level.name,

                        percent:
                            Number(record.percent),

                        score:
                            score(
                                rank + 1,
                                Number(record.percent),
                                level.percentToQualify,
                                totalLevels
                            ),

                        link:
                            record.link

                    });

                }
            );

        }
    );


    /*
     * Load packs
     */

    const packs =
        await fetchPacks();


    /*
     * Add completed packs
     * to every player.
     */

    if (
        Array.isArray(packs)
    ) {

        Object.entries(scoreMap)
            .forEach(
                ([user, data]) => {

                    data.packs =
                        getCompletedPacksForUser(
                            user,
                            packs,
                            list
                        ).map(
                            pack => ({

                                id:
                                    pack.id,

                                name:
                                    pack.name,

                                color:
                                    pack.color ||
                                    '#ffffff',

                                levels:
                                    pack.levels.length

                            })
                        );

                }
            );

    }


    /*
     * Create leaderboard entries.
     */

    const res =
        Object.entries(scoreMap)
            .map(
                ([user, scores]) => {

                    const {

                        verified,

                        completed,

                        progressed,

                        packs

                    } = scores;


                    const total =
                        [
                            verified,
                            completed,
                            progressed
                        ]
                            .flat()
                            .reduce(
                                (prev, cur) =>
                                    prev +
                                    cur.score,
                                0
                            );


                    return {

                        user,

                        total:
                            round(total),

                        ...scores

                    };

                }
            );


    /*
     * Sort by total score.
     */

    return [

        res.sort(
            (a, b) =>
                b.total -
                a.total
        ),

        errs

    ];

}

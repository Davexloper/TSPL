import { round, score } from './score.js';

const dir = '/data';


/* =========================================================
   LEVEL LIST
   ========================================================= */

export async function fetchList() {

    const listResult =
        await fetch(`${dir}/_list.json`);

    try {

        const list =
            await listResult.json();

        return await Promise.all(

            list.map(async (path, rank) => {

                const levelResult =
                    await fetch(`${dir}/${path}.json`);

                try {

                    const level =
                        await levelResult.json();

                    return [
                        {
                            ...level,

                            path,

                            records:
                                Array.isArray(level.records)
                                    ? level.records.sort(
                                        (a, b) =>
                                            b.percent -
                                            a.percent
                                    )
                                    : []
                        },

                        null
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

            })

        );

    } catch {

        console.error(
            'Failed to load list.'
        );

        return null;
    }
}


/* =========================================================
   FIND LEVEL
   ========================================================= */

export function findLevel(list, identifier) {

    if (!Array.isArray(list)) {
        return -1;
    }

    if (
        identifier === undefined ||
        identifier === null
    ) {
        return -1;
    }

    const search =
        String(identifier)
            .trim()
            .toLowerCase();


    return list.findIndex(
        ([level]) => {

            if (!level) {
                return false;
            }

            const name =
                String(level.name ?? '')
                    .trim()
                    .toLowerCase();

            const path =
                String(level.path ?? '')
                    .trim()
                    .toLowerCase();

            const id =
                String(level.id ?? '')
                    .trim()
                    .toLowerCase();


            return (
                name === search ||
                path === search ||
                id === search ||
                `${path}.json` === search
            );

        }
    );
}


/* =========================================================
   PACKS
   ========================================================= */

export async function fetchPacks() {

    try {

        const packsResult =
            await fetch(`${dir}/_packs.json`);

        return await packsResult.json();

    } catch {

        console.error(
            'Failed to load packs.'
        );

        return null;
    }
}


/* =========================================================
   LEVEL -> PACKS
   ========================================================= */

export async function fetchLevelPacks() {

    const packs =
        await fetchPacks();

    if (!Array.isArray(packs)) {
        return {};
    }

    const list =
        await fetchList();

    if (!list) {
        return {};
    }

    const levelPacks = {};


    packs.forEach(pack => {

        if (
            !pack ||
            !Array.isArray(pack.levels)
        ) {
            return;
        }


        pack.levels.forEach(identifier => {

            const index =
                findLevel(
                    list,
                    identifier
                );


            if (index === -1) {
                return;
            }


            const level =
                list[index]?.[0];

            if (!level) {
                return;
            }


            const key =
                level.path;


            if (!levelPacks[key]) {
                levelPacks[key] = [];
            }


            levelPacks[key].push({

                id: pack.id,

                name: pack.name,

                color:
                    pack.color || '#ff7a00'

            });

        });

    });


    return levelPacks;
}


/* =========================================================
   EDITORS
   ========================================================= */

export async function fetchEditors() {

    try {

        const editorsResults =
            await fetch(`${dir}/_editors.json`);

        return await editorsResults.json();

    } catch {

        return null;
    }
}


/* =========================================================
   LEVEL -> COMPLETED USERS
   ========================================================= */

function getLevelCompletedUsers(level) {

    const users = new Map();


    if (!level) {
        return users;
    }


    /*
     * VERIFIER
     */

    if (level.verifier) {

        const verifier =
            String(level.verifier).trim();

        if (verifier) {

            users.set(
                verifier.toLowerCase(),
                verifier
            );

        }

    }


    /*
     * 100% RECORDS
     */

    for (
        const record
        of level.records || []
    ) {

        if (
            record &&
            Number(record.percent) === 100 &&
            record.user
        ) {

            const username =
                String(record.user).trim();

            if (!username) {
                continue;
            }


            const key =
                username.toLowerCase();


            if (!users.has(key)) {

                users.set(
                    key,
                    username
                );

            }

        }

    }


    return users;
}


/* =========================================================
   COMPLETED PACKS FOR PLAYER
   ========================================================= */

export function getCompletedPacks(
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


    const userKey =
        String(username)
            .trim()
            .toLowerCase();


    const completedPacks = [];


    for (
        const pack
        of packs
    ) {

        if (
            !pack ||
            !Array.isArray(pack.levels) ||
            pack.levels.length === 0
        ) {
            continue;
        }


        let completed = true;


        for (
            const identifier
            of pack.levels
        ) {

            const index =
                findLevel(
                    list,
                    identifier
                );


            if (index === -1) {

                completed = false;

                break;

            }


            const level =
                list[index]?.[0];


            if (!level) {

                completed = false;

                break;

            }


            const users =
                getLevelCompletedUsers(
                    level
                );


            if (
                !users.has(userKey)
            ) {

                completed = false;

                break;

            }

        }


        if (completed) {

            completedPacks.push({

                id: pack.id,

                name: pack.name,

                color:
                    pack.color || '#ff7a00',

                levels:
                    pack.levels.length

            });

        }

    }


    return completedPacks;
}


/* =========================================================
   CREATED LEVELS FOR PLAYER
   ========================================================= */

/*
 * Supports both:
 *
 * creator: "Username"
 *
 * and:
 *
 * creators: ["Username", "Username2"]
 */

export function getCreatedLevels(
    username,
    list
) {

    if (
        !username ||
        !Array.isArray(list)
    ) {
        return [];
    }


    const userKey =
        String(username)
            .trim()
            .toLowerCase();


    const createdLevels = [];


    list.forEach(
        ([level], index) => {

            if (!level) {
                return;
            }


            const creators = [];


            /*
             * Single creator
             */

            if (level.creator) {

                creators.push(
                    String(level.creator)
                );

            }


            /*
             * Multiple creators
             */

            if (
                Array.isArray(level.creators)
            ) {

                creators.push(
                    ...level.creators.map(
                        creator =>
                            String(creator)
                    )
                );

            }


            const isCreator =
                creators.some(
                    creator =>
                        creator
                            .trim()
                            .toLowerCase() ===
                        userKey
                );


            if (!isCreator) {
                return;
            }


            createdLevels.push({

                rank:
                    index + 1,

                level:
                    level.name,

                link:
                    level.verification ||
                    level.link ||
                    null,

                path:
                    level.path

            });

        }
    );


    return createdLevels;
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


    const packs =
        await fetchPacks();


    const totalLevels =
        list.length;


    const scoreMap = {};

    const errs = [];


    /* =====================================================
       LEVELS
       ===================================================== */

    list.forEach(
        ([level, err], rank) => {

            if (err) {

                errs.push(err);

                return;

            }


            /*
             * VERIFIER
             */

            if (level.verifier) {

                const verifier =
                    Object.keys(scoreMap).find(
                        u =>
                            u.toLowerCase() ===
                            level.verifier.toLowerCase()
                    ) || level.verifier;


                scoreMap[verifier] ??= {

                    verified: [],

                    completed: [],

                    progressed: [],

                    created: []

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

            }


            /*
             * RECORDS
             */

            for (
                const record
                of level.records || []
            ) {

                if (!record.user) {
                    continue;
                }


                const user =
                    Object.keys(scoreMap).find(
                        u =>
                            u.toLowerCase() ===
                            record.user.toLowerCase()
                    ) || record.user;


                scoreMap[user] ??= {

                    verified: [],

                    completed: [],

                    progressed: [],

                    created: []

                };


                const {
                    completed,
                    progressed
                } = scoreMap[user];


                /*
                 * COMPLETED
                 */

                if (
                    Number(record.percent) === 100
                ) {

                    const alreadyCompleted =
                        completed.some(
                            item =>
                                item.rank ===
                                rank + 1
                        );


                    if (!alreadyCompleted) {

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

                    }


                    continue;

                }


                /*
                 * PROGRESSED
                 */

                progressed.push({

                    rank:
                        rank + 1,

                    level:
                        level.name,

                    percent:
                        record.percent,

                    score:
                        score(
                            rank + 1,
                            record.percent,
                            level.percentToQualify,
                            totalLevels
                        ),

                    link:
                        record.link

                });

            }

        }
    );


    /* =====================================================
       ADD COMPLETED PACKS + CREATED LEVELS
       ===================================================== */

    for (
        const user
        of Object.keys(scoreMap)
    ) {

        scoreMap[user].packs =
            getCompletedPacks(
                user,
                packs || [],
                list
            );


        scoreMap[user].created =
            getCreatedLevels(
                user,
                list
            );

    }


    /* =====================================================
       BUILD RESULT
       ===================================================== */

    const res =
        Object.entries(scoreMap)
            .map(
                ([user, scores]) => {

                    const {
                        verified,
                        completed,
                        progressed,
                        packs,
                        created
                    } = scores;


                    const total =
                        [
                            verified,
                            completed,
                            progressed
                        ]
                            .flat()
                            .reduce(
                                (
                                    prev,
                                    cur
                                ) =>
                                    prev +
                                    cur.score,
                                0
                            );


                    return {

                        user,

                        total:
                            round(total),

                        verified,

                        completed,

                        progressed,

                        packs:
                            packs || [],

                        created:
                            created || []

                    };

                }
            );


    /* =====================================================
       SORT
       ===================================================== */

    return [

        res.sort(
            (a, b) =>
                b.total -
                a.total
        ),

        errs

    ];

}

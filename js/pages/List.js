import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';


/* =========================================================
   LIST
   ========================================================= */

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);

    try {
        const list = await listResult.json();

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
                                            b.percent - a.percent
                                    )
                                    : [],
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
            }),
        );

    } catch {

        console.error(
            'Failed to load list.'
        );

        return null;
    }
}


/* =========================================================
   PACKS
   ========================================================= */

export async function fetchPacks() {

    try {

        const packsResult =
            await fetch(`${dir}/_packs.json`);

        if (!packsResult.ok) {
            throw new Error(
                `HTTP ${packsResult.status}`
            );
        }

        const packs =
            await packsResult.json();

        if (!Array.isArray(packs)) {
            throw new Error(
                '_packs.json must contain an array.'
            );
        }

        return packs;

    } catch (error) {

        console.error(
            'Failed to load packs:',
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

    const levelPacks = {};

    for (const pack of packs) {

        if (!Array.isArray(pack.levels)) {
            continue;
        }

        for (const identifier of pack.levels) {

            const key =
                String(identifier)
                    .toLowerCase();

            if (!levelPacks[key]) {
                levelPacks[key] = [];
            }

            levelPacks[key].push({

                id: pack.id,

                name: pack.name,

                color:
                    pack.color ||
                    '#ffffff',

                levels:
                    pack.levels

            });
        }
    }

    return levelPacks;
}


/* =========================================================
   FIND LEVEL
   ========================================================= */

/**
 * Finds a level by:
 *
 * - level name
 * - level path
 * - level ID
 */
export function findLevel(list, identifier) {

    if (!list || identifier === undefined || identifier === null) {
        return -1;
    }

    const search =
        String(identifier)
            .toLowerCase()
            .trim();


    return list.findIndex(([level]) => {

        if (!level) {
            return false;
        }

        const name =
            String(level.name || '')
                .toLowerCase()
                .trim();

        const path =
            String(level.path || '')
                .toLowerCase()
                .trim();

        const id =
            String(level.id || '')
                .toLowerCase()
                .trim();

        return (
            name === search ||
            path === search ||
            id === search
        );
    });
}


/* =========================================================
   COMPLETED PLAYERS FOR PACK
   ========================================================= */

/**
 * Returns all players that completed
 * every level in a pack with 100%.
 */
export function getPackCompletedPlayers(
    list,
    pack
) {

    if (
        !list ||
        !pack ||
        !Array.isArray(pack.levels) ||
        pack.levels.length === 0
    ) {
        return [];
    }


    /*
     * Find every actual level belonging
     * to this pack.
     */

    const packLevels = [];

    for (const identifier of pack.levels) {

        const index =
            findLevel(
                list,
                identifier
            );

        if (index === -1) {

            console.warn(
                `Pack "${pack.name}" references level "${identifier}" but it could not be found.`
            );

            continue;
        }

        const level =
            list[index][0];

        if (!level) {
            continue;
        }

        packLevels.push(level);
    }


    /*
     * If we couldn't find all levels,
     * don't mark anyone as completing
     * the pack.
     */

    if (
        packLevels.length !==
        pack.levels.length
    ) {
        return [];
    }


    /*
     * Collect players who have 100%
     * on every level.
     */

    const players =
        new Map();


    for (const level of packLevels) {

        const completedUsers =
            new Set();

        for (const record of level.records || []) {

            if (
                record.percent === 100 &&
                record.user
            ) {

                completedUsers.add(
                    record.user.toLowerCase()
                );

                if (!players.has(
                    record.user.toLowerCase()
                )) {

                    players.set(
                        record.user.toLowerCase(),
                        {
                            name: record.user,
                            levels: new Set()
                        }
                    );
                }

                players
                    .get(
                        record.user.toLowerCase()
                    )
                    .levels
                    .add(level.name);
            }
        }


        /*
         * Remove players that didn't
         * complete this level.
         */

        for (const [
            username,
            player
        ] of players) {

            if (
                !completedUsers.has(username)
            ) {

                players.delete(username);
            }
        }
    }


    return Array.from(
        players.values()
    )
        .filter(
            player =>
                player.levels.size ===
                packLevels.length
        )
        .map(
            player =>
                player.name
        )
        .sort(
            (a, b) =>
                a.localeCompare(b)
        );
}


/* =========================================================
   COMPLETED PACKS FOR PLAYER
   ========================================================= */

export function getCompletedPacks(
    list,
    packs,
    username
) {

    if (
        !list ||
        !packs ||
        !username
    ) {
        return [];
    }


    const searchUsername =
        username.toLowerCase();


    return packs.filter(
        pack => {

            const players =
                getPackCompletedPlayers(
                    list,
                    pack
                );

            return players.some(
                player =>
                    player.toLowerCase() ===
                    searchUsername
            );
        }
    );
}


/* =========================================================
   PACK PROGRESS
   ========================================================= */

export function getPackProgress(
    list,
    pack,
    username
) {

    if (
        !list ||
        !pack ||
        !Array.isArray(pack.levels)
    ) {

        return {
            completed: 0,
            total: 0,
            complete: false,
            levels: []
        };
    }


    const levels = [];

    let completed = 0;


    for (
        let i = 0;
        i < pack.levels.length;
        i++
    ) {

        const identifier =
            pack.levels[i];

        const index =
            findLevel(
                list,
                identifier
            );


        if (index === -1) {

            levels.push({

                identifier,

                name: identifier,

                path: identifier,

                completed: false

            });

            continue;
        }


        const level =
            list[index][0];


        const record =
            (level.records || []).find(
                record =>
                    record.user &&
                    record.user.toLowerCase() ===
                    username.toLowerCase() &&
                    record.percent === 100
            );


        const isCompleted =
            Boolean(record);


        if (isCompleted) {
            completed++;
        }


        levels.push({

            identifier,

            name: level.name,

            path: level.path,

            completed: isCompleted

        });
    }


    return {

        completed,

        total: pack.levels.length,

        complete:
            completed ===
            pack.levels.length,

        levels

    };
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

        return await editorsResults.json();

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

    const packs =
        await fetchPacks();


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


    /* =====================================================
       PROCESS LEVELS
       ===================================================== */

    list.forEach(
        ([level, err], rank) => {

            if (err) {

                errs.push(err);

                return;
            }


            /* =============================================
               VERIFIER
               ============================================= */

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

            };


            scoreMap[verifier]
                .verified
                .push({

                    rank:
                        rank + 1,

                    level:
                        level.name,

                    path:
                        level.path,

                    score:
                        score(
                            rank + 1,
                            100,
                            level.percentToQualify,
                            totalLevels
                        ),

                    link:
                        level.verification,

                });


            /* =============================================
               RECORDS
               ============================================= */

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
                    ) ||
                    record.user;


                scoreMap[user] ??= {

                    verified: [],

                    completed: [],

                    progressed: [],

                };


                /* =========================================
                   COMPLETED
                   ========================================= */

                if (
                    record.percent ===
                    100
                ) {

                    scoreMap[user]
                        .completed
                        .push({

                            rank:
                                rank + 1,

                            level:
                                level.name,

                            path:
                                level.path,

                            score:
                                score(
                                    rank + 1,
                                    100,
                                    level.percentToQualify,
                                    totalLevels
                                ),

                            link:
                                record.link,

                        });

                    continue;
                }


                /* =========================================
                   PROGRESSED
                   ========================================= */

                scoreMap[user]
                    .progressed
                    .push({

                        rank:
                            rank + 1,

                        level:
                            level.name,

                        path:
                            level.path,

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
                            record.link,

                    });
            }
        }
    );


    /* =====================================================
       CREATE FINAL ENTRIES
       ===================================================== */

    const res =
        Object.entries(scoreMap)
            .map(
                ([user, scores]) => {

                    const {
                        verified,
                        completed,
                        progressed
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


                    const completedPacks =
                        getCompletedPacks(
                            list,
                            packs,
                            user
                        );


                    return {

                        user,

                        total:
                            round(total),

                        verified,

                        completed,

                        progressed,

                        completedPacks

                    };
                }
            );


    /* =====================================================
       SORT
       ===================================================== */

    res.sort(
        (a, b) =>
            b.total -
            a.total
    );


    return [
        res,
        errs
    ];
}

import { round, score } from './score.js';

/**
 * Path to directory containing `_list.json` and all levels
 */
const dir = '/data';

export async function fetchList() {
    const listResult = await fetch(`${dir}/_list.json`);

    try {
        const list = await listResult.json();

        return await Promise.all(
            list.map(async (path, rank) => {
                const levelResult = await fetch(`${dir}/${path}.json`);

                try {
                    const level = await levelResult.json();

                    return [
                        {
                            ...level,
                            path,
                            records: level.records.sort(
                                (a, b) => b.percent - a.percent,
                            ),
                        },
                        null,
                    ];
                } catch {
                    console.error(
                        `Failed to load level #${rank + 1} ${path}.`
                    );

                    return [null, path];
                }
            }),
        );
    } catch {
        console.error(`Failed to load list.`);
        return null;
    }
}


/* =========================================================
   PACKS
   ========================================================= */

export async function fetchPacks() {
    try {
        const packsResult = await fetch(`${dir}/_packs.json`);

        if (!packsResult.ok) {
            throw new Error(`HTTP ${packsResult.status}`);
        }

        return await packsResult.json();
    } catch (error) {
        console.error("Failed to load packs.", error);
        return null;
    }
}


/**
 * Get packs belonging to a level.
 *
 * _packs.json uses level names:
 *
 * "levels": [
 *     "Bloodbath",
 *     "Cataclysm"
 * ]
 */
export async function fetchLevelPacks() {
    const packs = await fetchPacks();

    if (!packs) {
        return {};
    }

    const levelPacks = {};

    packs.forEach(pack => {
        if (!Array.isArray(pack.levels)) {
            return;
        }

        pack.levels.forEach(level => {
            const key = String(level).toLowerCase();

            if (!levelPacks[key]) {
                levelPacks[key] = [];
            }

            levelPacks[key].push({
                id: pack.id,
                name: pack.name,
                color: pack.color || "#ffffff"
            });
        });
    });

    return levelPacks;
}


/**
 * Find all players who completed every level
 * inside a pack.
 */
export function getPackVictors(pack, list) {
    if (!pack || !Array.isArray(pack.levels) || !list) {
        return [];
    }

    const completedByUser = {};

    /*
     * Go through every level.
     */
    list.forEach(([level]) => {
        if (!level) {
            return;
        }

        /*
         * Find which pack level this is.
         */
        const packLevel = pack.levels.find(
            packLevel =>
                String(packLevel).toLowerCase() ===
                String(level.name).toLowerCase()
        );

        if (!packLevel) {
            return;
        }

        /*
         * Get all 100% records.
         */
        level.records.forEach(record => {
            if (record.percent !== 100) {
                return;
            }

            const username = record.user;

            const key = username.toLowerCase();

            if (!completedByUser[key]) {
                completedByUser[key] = {
                    user: username,
                    levels: new Set()
                };
            }

            completedByUser[key].levels.add(
                String(level.name).toLowerCase()
            );
        });
    });


    /*
     * A player is a victor when they completed
     * EVERY level in the pack.
     */
    return Object.values(completedByUser)
        .filter(player =>
            pack.levels.every(level =>
                player.levels.has(
                    String(level).toLowerCase()
                )
            )
        )
        .map(player => player.user);
}


/**
 * Get all packs completed by a player.
 */
export function getCompletedPacks(user, list, packs) {
    if (!user || !list || !packs) {
        return [];
    }

    return packs.filter(pack =>
        getPackVictors(pack, list)
            .some(
                victor =>
                    victor.toLowerCase() === user.toLowerCase()
            )
    );
}


/* =========================================================
   EDITORS
   ========================================================= */

export async function fetchEditors() {
    try {
        const editorsResults = await fetch(`${dir}/_editors.json`);
        const editors = await editorsResults.json();

        return editors;
    } catch {
        return null;
    }
}


/* =========================================================
   LEADERBOARD
   ========================================================= */

export async function fetchLeaderboard() {
    const list = await fetchList();

    if (!list) {
        return [[], ['_list.json']];
    }

    const totalLevels = list.length;

    const scoreMap = {};
    const errs = [];

    list.forEach(([level, err], rank) => {
        if (err) {
            errs.push(err);
            return;
        }

        /*
         * Verification
         */
        const verifier = Object.keys(scoreMap).find(
            (u) => u.toLowerCase() === level.verifier.toLowerCase(),
        ) || level.verifier;

        scoreMap[verifier] ??= {
            verified: [],
            completed: [],
            progressed: [],
        };

        const { verified } = scoreMap[verifier];

        verified.push({
            rank: rank + 1,
            level: level.name,

            score: score(
                rank + 1,
                100,
                level.percentToQualify,
                totalLevels
            ),

            link: level.verification,
        });


        /*
         * Records
         */
        level.records.forEach((record) => {
            const user = Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === record.user.toLowerCase(),
            ) || record.user;

            scoreMap[user] ??= {
                verified: [],
                completed: [],
                progressed: [],
            };

            const { completed, progressed } = scoreMap[user];


            /*
             * Completed
             */
            if (record.percent === 100) {
                completed.push({
                    rank: rank + 1,
                    level: level.name,

                    score: score(
                        rank + 1,
                        100,
                        level.percentToQualify,
                        totalLevels
                    ),

                    link: record.link,
                });

                return;
            }


            /*
             * Progressed
             */
            progressed.push({
                rank: rank + 1,
                level: level.name,
                percent: record.percent,

                score: score(
                    rank + 1,
                    record.percent,
                    level.percentToQualify,
                    totalLevels
                ),

                link: record.link,
            });
        });
    });


    /*
     * Load packs
     */
    const packs = await fetchPacks();


    /*
     * Add completed packs to players
     */
    if (packs) {
        Object.keys(scoreMap).forEach(user => {
            scoreMap[user].packs = getCompletedPacks(
                user,
                list,
                packs
            );
        });
    } else {
        Object.keys(scoreMap).forEach(user => {
            scoreMap[user].packs = [];
        });
    }


    /*
     * Wrap in extra Object containing
     * the user and total score
     */
    const res = Object.entries(scoreMap).map(([user, scores]) => {
        const {
            verified,
            completed,
            progressed,
            packs
        } = scores;

        const total = [verified, completed, progressed]
            .flat()
            .reduce(
                (prev, cur) => prev + cur.score,
                0
            );

        return {
            user,
            total: round(total),
            verified,
            completed,
            progressed,
            packs
        };
    });


    /*
     * Sort by total score
     */
    return [
        res.sort((a, b) => b.total - a.total),
        errs
    ];
}

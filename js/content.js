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
                            records: Array.isArray(level.records)
                                ? level.records.sort(
                                      (a, b) => b.percent - a.percent
                                  )
                                : [],
                        },
                        null,
                    ];
                } catch {
                    console.error(
                        `Failed to load level #${rank + 1} ${path}.`
                    );

                    return [null, path];
                }
            })
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

        const packs = await packsResult.json();

        if (!Array.isArray(packs)) {
            throw new Error('_packs.json must contain an array');
        }

        return packs;
    } catch (error) {
        console.error('Failed to load packs.', error);
        return null;
    }
}


/**
 * Create a lookup containing all packs for every level.
 *
 * A pack can reference a level by:
 * - level name
 * - level path
 * - level id
 */
export async function fetchLevelPacks() {
    const packs = await fetchPacks();

    if (!packs) {
        return {};
    }

    const levelPacks = {};

    packs.forEach((pack) => {
        if (!Array.isArray(pack.levels)) {
            return;
        }

        pack.levels.forEach((levelReference) => {
            const key = String(levelReference).toLowerCase();

            if (!levelPacks[key]) {
                levelPacks[key] = [];
            }

            levelPacks[key].push({
                id: pack.id,
                name: pack.name,
                color: pack.color || '#ffffff',
            });
        });
    });

    return levelPacks;
}


/**
 * Find all packs a level belongs to.
 */
export function getPacksForLevel(level, packs) {
    if (!level || !packs) {
        return [];
    }

    const references = [
        level.name,
        level.path,
        level.id,
    ]
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value).toLowerCase());

    return packs.filter((pack) => {
        if (!Array.isArray(pack.levels)) {
            return false;
        }

        return pack.levels.some((packLevel) =>
            references.includes(String(packLevel).toLowerCase())
        );
    });
}


/**
 * Get the IDs of levels completed by a player.
 */
function getCompletedLevelIds(user, list) {
    const completed = new Set();

    list.forEach(([level]) => {
        if (!level) {
            return;
        }

        const record = level.records?.find(
            (record) =>
                record.percent === 100 &&
                record.user.toLowerCase() === user.toLowerCase()
        );

        if (record) {
            completed.add(String(level.id));
            completed.add(String(level.name).toLowerCase());
            completed.add(String(level.path).toLowerCase());
        }
    });

    return completed;
}


/**
 * Check whether a player completed an entire pack.
 */
function hasCompletedPack(user, pack, list) {
    if (!Array.isArray(pack.levels) || pack.levels.length === 0) {
        return false;
    }

    const completedLevels = getCompletedLevelIds(user, list);

    return pack.levels.every((packLevel) => {
        const reference = String(packLevel).toLowerCase();

        return completedLevels.has(reference);
    });
}


/**
 * Get all packs completed by a player.
 */
export function getCompletedPacks(user, list, packs) {
    if (!user || !list || !packs) {
        return [];
    }

    return packs.filter((pack) =>
        hasCompletedPack(user, pack, list)
    );
}


/**
 * Creates a normalized pack completion object for the UI.
 */
export async function fetchCompletedPacks() {
    const list = await fetchList();
    const packs = await fetchPacks();

    if (!list || !packs) {
        return [];
    }

    const users = new Set();

    list.forEach(([level]) => {
        if (!level) {
            return;
        }

        level.records?.forEach((record) => {
            if (record.percent === 100 && record.user) {
                users.add(record.user);
            }
        });
    });

    return Array.from(users).map((user) => ({
        user,
        packs: getCompletedPacks(user, list, packs),
    }));
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

    const packs = await fetchPacks();

    /*
     * Number of levels on the list.
     */
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
        const verifier =
            Object.keys(scoreMap).find(
                (u) => u.toLowerCase() === level.verifier.toLowerCase()
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
            const user =
                Object.keys(scoreMap).find(
                    (u) =>
                        u.toLowerCase() === record.user.toLowerCase()
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
     * Add completed packs to every player.
     */
    if (packs) {
        Object.keys(scoreMap).forEach((user) => {
            scoreMap[user].packs = getCompletedPacks(
                user,
                list,
                packs
            );
        });
    } else {
        Object.keys(scoreMap).forEach((user) => {
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
            packs,
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
            packs,
        };
    });


    /*
     * Sort by total score
     */
    return [
        res.sort((a, b) => b.total - a.total),
        errs,
    ];
}

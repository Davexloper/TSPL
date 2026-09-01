import {
    fetchPacks,
    fetchList
} from '../content.js';

import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },

    template: `

        <main
            v-if="loading"
            class="page-packs"
        >

            <Spinner></Spinner>

        </main>


        <main
            v-else
            class="page-packs"
        >

            <div class="packs-container">

                <!-- NO PACKS -->

                <div
                    v-if="packs.length === 0"
                    class="no-packs"
                >

                    <h2>No Packs</h2>

                    <p>
                        No packs have been added yet.
                    </p>

                </div>


                <!-- PACKS -->

                <div
                    v-for="pack in packs"
                    :key="pack.id"
                    class="pack"
                    :style="{
                        '--pack-color':
                            pack.color || '#ffffff'
                    }"
                >

                    <!-- HEADER -->

                    <div class="pack-header">

                        <div class="pack-info">

                            <h1>
                                {{ pack.name }}
                            </h1>

                            <p>
                                {{ pack.levels.length }}
                                Levels
                            </p>

                        </div>


                        <span
                            class="pack-color"
                            :style="{
                                backgroundColor:
                                    pack.color || '#ffffff'
                            }"
                        ></span>

                    </div>


                    <!-- LEVELS -->

                    <div class="pack-levels">

                        <button
                            v-for="(
                                identifier,
                                index
                            ) in pack.levels"
                            :key="identifier"
                            class="pack-level"
                            @click="openLevel(identifier)"
                        >

                            <span
                                class="pack-level-rank"
                            >
                                #{{ index + 1 }}
                            </span>


                            <span
                                class="pack-level-name"
                            >
                                {{ getLevelName(identifier) }}
                            </span>

                        </button>

                    </div>


                    <!-- VICTORS -->

                    <div class="pack-completed">

                        <div class="pack-completed-header">

                            <h2>
                                Victors
                            </h2>

                            <span>
                                {{ getCompletedPlayers(pack).length }}
                            </span>

                        </div>


                        <div
                            v-if="
                                getCompletedPlayers(pack).length > 0
                            "
                            class="pack-completed-players"
                        >

                            <div
                                v-for="
                                    player
                                    in getCompletedPlayers(pack)
                                "
                                :key="player"
                                class="pack-completed-player"
                            >

                                {{ player }}

                            </div>

                        </div>


                        <p
                            v-else
                            class="empty"
                        >
                            Nobody yet.
                        </p>

                    </div>

                </div>

            </div>

        </main>
    `,


    data: () => ({

        packs: [],

        list: [],

        loading: true

    }),


    async mounted() {

        this.packs =
            await fetchPacks() || [];

        this.list =
            await fetchList() || [];

        this.loading =
            false;

    },


    methods: {

        /* =====================================================
           FIND LEVEL
           ===================================================== */

        getLevel(identifier) {

            const search =
                String(identifier)
                    .trim()
                    .toLowerCase();


            for (
                const entry of this.list
            ) {

                const level =
                    entry?.[0];


                if (!level) {
                    continue;
                }


                /*
                 * Match by name
                 */

                if (
                    String(level.name)
                        .trim()
                        .toLowerCase() === search
                ) {

                    return level;

                }


                /*
                 * Match by path
                 */

                if (
                    String(level.path)
                        .trim()
                        .toLowerCase() === search
                ) {

                    return level;

                }


                /*
                 * Match by ID
                 */

                if (
                    String(level.id)
                        .trim()
                        .toLowerCase() === search
                ) {

                    return level;

                }

            }


            console.error(
                'Could not find pack level:',
                identifier
            );

            return null;

        },


        /* =====================================================
           GET LEVEL NAME
           ===================================================== */

        getLevelName(identifier) {

            const level =
                this.getLevel(
                    identifier
                );


            return (
                level?.name ||
                identifier
            );

        },


        /* =====================================================
           OPEN EXACT LEVEL
           ===================================================== */

        openLevel(identifier) {

            const level =
                this.getLevel(
                    identifier
                );


            if (!level) {

                console.error(
                    `Pack level "${identifier}" could not be found.`
                );

                return;

            }


            this.$router.push({

                path: '/',

                query: {

                    level:
                        level.path

                }

            });

        },


        /* =====================================================
           GET COMPLETED PLAYERS
           
           A player counts as completing a level when:
           
           1. They have a record with 100%
           
           OR
           
           2. They are the verifier
           
           The player must have completed EVERY
           level in the pack.
           ===================================================== */

        getCompletedPlayers(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels) ||
                pack.levels.length === 0
            ) {

                return [];

            }


            /*
             * Find all levels.
             */

            const levels =
                pack.levels.map(
                    identifier =>
                        this.getLevel(identifier)
                );


            /*
             * If one of the levels doesn't exist,
             * nobody can complete the pack.
             */

            if (
                levels.some(
                    level => !level
                )
            ) {

                console.error(
                    'Pack contains a level that could not be found:',
                    pack.name
                );

                return [];

            }


            /*
             * Create a Set/Map of completed
             * players for EVERY level.
             */

            const completedPerLevel =
                levels.map(level => {

                    const players =
                        new Map();


                    /*
                     * VERIFIER
                     */

                    if (
                        level.verifier
                    ) {

                        const verifier =
                            String(
                                level.verifier
                            ).trim();


                        if (
                            verifier.length > 0
                        ) {

                            players.set(
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
                            Number(
                                record.percent
                            ) >= 100 &&
                            record.user
                        ) {

                            const username =
                                String(
                                    record.user
                                ).trim();


                            if (
                                username.length > 0
                            ) {

                                players.set(
                                    username.toLowerCase(),
                                    username
                                );

                            }

                        }

                    }


                    return players;

                });


            /*
             * Start with everybody who completed
             * the FIRST level.
             */

            const candidates =
                new Map(
                    completedPerLevel[0]
                );


            /*
             * Check every remaining level.
             */

            for (
                let i = 1;
                i < completedPerLevel.length;
                i++
            ) {

                const completed =
                    completedPerLevel[i];


                /*
                 * Remove anyone who did not
                 * complete this level.
                 */

                for (
                    const username
                    of candidates.keys()
                ) {

                    if (
                        !completed.has(
                            username
                        )
                    ) {

                        candidates.delete(
                            username
                        );

                    }

                }


                /*
                 * Nobody left.
                 */

                if (
                    candidates.size === 0
                ) {

                    return [];

                }

            }


            /*
             * Return original usernames.
             */

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

    }

};

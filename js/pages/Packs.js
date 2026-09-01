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

        <!-- =====================================================
             LOADING
             ===================================================== -->

        <main
            v-if="loading"
            class="page-packs"
        >

            <Spinner></Spinner>

        </main>


        <!-- =====================================================
             PACKS PAGE
             ===================================================== -->

        <main
            v-else
            class="page-packs"
        >

            <div class="packs-layout">


                <!-- =================================================
                     LEFT SIDE - PACK LIST
                     ================================================= -->

                <section class="packs-sidebar">


                    <!-- HEADER -->

                    <div class="packs-sidebar-header">

                        <div>

                            <h1>
                                Packs
                            </h1>

                            <p>
                                {{ packs.length }}
                                {{ packs.length === 1 ? 'Pack' : 'Packs' }}
                            </p>

                        </div>

                    </div>


                    <!-- PACK LIST -->

                    <div
                        v-if="packs.length > 0"
                        class="packs-list"
                    >

                        <button
                            v-for="pack in packs"
                            :key="pack.id"
                            class="pack-item"
                            :class="{
                                active:
                                    selectedPack &&
                                    selectedPack.id === pack.id
                            }"
                            :style="{
                                '--pack-color':
                                    pack.color || '#ffffff'
                            }"
                            @click="selectPack(pack)"
                        >

                            <span
                                class="pack-item-color"
                            ></span>


                            <span class="pack-item-info">

                                <span class="pack-item-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-item-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>


                            <span class="pack-item-progress">

                                {{ getCompletedPlayers(pack).length }}

                                /

                                {{ pack.levels.length }}

                            </span>

                        </button>

                    </div>


                    <!-- NO PACKS -->

                    <div
                        v-else
                        class="no-packs"
                    >

                        <h2>
                            No Packs
                        </h2>

                        <p>
                            No packs have been added yet.
                        </p>

                    </div>

                </section>



                <!-- =================================================
                     RIGHT SIDE - PACK DETAILS
                     ================================================= -->

                <section
                    v-if="selectedPack"
                    class="pack-detail"
                    :style="{
                        '--pack-color':
                            selectedPack.color || '#ffffff'
                    }"
                >


                    <!-- =================================================
                         PACK HEADER
                         ================================================= -->

                    <header class="pack-detail-header">

                        <div class="pack-detail-title">

                            <div
                                class="pack-detail-dot"
                            ></div>


                            <div>

                                <h1>
                                    {{ selectedPack.name }}
                                </h1>

                                <p>
                                    {{ selectedPack.levels.length }}
                                    Levels
                                </p>

                            </div>

                        </div>


                        <div class="pack-detail-completion">

                            <strong>
                                {{ getCompletedPlayers(selectedPack).length }}
                            </strong>

                            <span>
                                / completed
                            </span>

                        </div>

                    </header>


                    <!-- PROGRESS BAR -->

                    <div class="pack-progress">

                        <div
                            class="pack-progress-fill"
                            :style="{
                                width:
                                    getPackProgress(selectedPack) + '%'
                            }"
                        ></div>

                    </div>



                    <!-- =================================================
                         LEVELS
                         ================================================= -->

                    <section class="pack-level-section">

                        <div class="section-title">

                            <h2>
                                Levels
                            </h2>

                            <span>
                                {{ selectedPack.levels.length }}
                            </span>

                        </div>


                        <div class="pack-levels">

                            <button
                                v-for="(
                                    identifier,
                                    index
                                ) in selectedPack.levels"
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


                                <span
                                    class="pack-level-arrow"
                                >
                                    →
                                </span>

                            </button>

                        </div>

                    </section>



                    <!-- =================================================
                         VICTORS
                         ================================================= -->

                    <section class="pack-victors-section">

                        <div class="section-title">

                            <h2>
                                Victors
                            </h2>

                            <span>
                                {{ getCompletedPlayers(selectedPack).length }}
                            </span>

                        </div>


                        <div
                            v-if="
                                getCompletedPlayers(selectedPack).length > 0
                            "
                            class="pack-completed-players"
                        >

                            <div
                                v-for="
                                    player
                                    in getCompletedPlayers(selectedPack)
                                "
                                :key="player"
                                class="pack-completed-player"
                            >

                                <span class="victor-avatar">
                                    {{ player.charAt(0).toUpperCase() }}
                                </span>

                                <span class="victor-name">
                                    {{ player }}
                                </span>

                            </div>

                        </div>


                        <div
                            v-else
                            class="pack-no-victors"
                        >

                            <span>
                                No victors yet
                            </span>

                        </div>

                    </section>

                </section>



                <!-- =================================================
                     NOTHING SELECTED
                     ================================================= -->

                <section
                    v-else
                    class="pack-detail empty-detail"
                >

                    <h2>
                        Select a Pack
                    </h2>

                    <p>
                        Choose a pack from the list.
                    </p>

                </section>

            </div>

        </main>
    `,


    // =============================================================
    // DATA
    // =============================================================

    data: () => ({

        packs: [],

        list: [],

        selectedPack: null,

        loading: true

    }),


    // =============================================================
    // MOUNTED
    // =============================================================

    async mounted() {

        this.packs =
            await fetchPacks() || [];


        this.list =
            await fetchList() || [];


        /*
         * Automatically select the first pack.
         */

        if (
            this.packs.length > 0
        ) {

            this.selectedPack =
                this.packs[0];

        }


        this.loading =
            false;

    },


    // =============================================================
    // METHODS
    // =============================================================

    methods: {


        /* =========================================================
           SELECT PACK
           ========================================================= */

        selectPack(pack) {

            this.selectedPack =
                pack;

        },


        /* =========================================================
           PACK PROGRESS
           ========================================================= */

        getPackProgress(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels) ||
                pack.levels.length === 0
            ) {

                return 0;

            }


            const completed =
                this.getCompletedPlayers(pack).length;


            /*
             * This represents the amount of
             * victors relative to the number
             * of levels.
             */

            const progress =
                Math.min(
                    100,
                    (completed / pack.levels.length) * 100
                );


            return progress;

        },


        /* =========================================================
           FIND LEVEL
           ========================================================= */

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


        /* =========================================================
           GET LEVEL NAME
           ========================================================= */

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


        /* =========================================================
           OPEN LEVEL
           ========================================================= */

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


        /* =========================================================
           GET COMPLETED PLAYERS
           
           A player completes the pack when:
           
           - They are the verifier
             OR
           - They have a 100% record
           
           AND they have completed EVERY level.
           ========================================================= */

        getCompletedPlayers(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels) ||
                pack.levels.length === 0
            ) {

                return [];

            }


            /*
             * Find every level.
             */

            const levels =
                pack.levels.map(
                    identifier =>
                        this.getLevel(identifier)
                );


            /*
             * If a level cannot be found,
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
             * Get completed players
             * for every individual level.
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
             * Start with everyone
             * who completed level 1.
             */

            const candidates =
                new Map(
                    completedPerLevel[0]
                );


            /*
             * Check every other level.
             */

            for (
                let i = 1;
                i < completedPerLevel.length;
                i++
            ) {

                const completed =
                    completedPerLevel[i];


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
             * Return usernames.
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

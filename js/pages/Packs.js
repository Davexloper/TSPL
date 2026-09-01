import {
    fetchPacks,
    fetchList,
    findLevel
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


                <!-- =================================================
                     NO PACKS
                     ================================================= -->

                <div
                    v-if="packs.length === 0"
                    class="no-packs"
                >

                    <h2>
                        No Packs
                    </h2>

                    <p>
                        No packs have been added yet.
                    </p>

                </div>


                <!-- =================================================
                     PACKS
                     ================================================= -->

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
                                    pack.color
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
                            @click="
                                openLevel(identifier)
                            "
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


                    <!-- COMPLETED PLAYERS -->

                    <div
                        class="pack-completed"
                        v-if="
                            getCompletedPlayers(pack).length
                        "
                    >

                        <div class="pack-completed-header">

                            <h2>
                                Completed by
                            </h2>

                            <span>
                                {{
                                    getCompletedPlayers(pack).length
                                }}
                            </span>

                        </div>


                        <div class="pack-completed-players">

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

                    </div>


                    <div
                        v-else
                        class="pack-completed empty"
                    >

                        <h2>
                            Completed by
                        </h2>

                        <p>
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

        loading: true,

    }),


    async mounted() {

        this.packs =
            await fetchPacks();


        this.list =
            await fetchList();


        this.loading =
            false;

    },


    methods: {

        /* =====================================================
           OPEN EXACT LEVEL
           ===================================================== */

        openLevel(identifier) {

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (index === -1) {

                console.error(
                    `Pack level "${identifier}" could not be found.`
                );

                return;
            }


            const level =
                this.list[index]?.[0];


            if (!level) {
                return;
            }


            /*
             * Navigate to the list page and
             * tell List.js exactly which level
             * should be selected.
             */

            this.$router.push({

                path: '/',

                query: {

                    level:
                        level.path ||
                        level.name

                }

            });

        },


        /* =====================================================
           GET LEVEL NAME
           ===================================================== */

        getLevelName(identifier) {

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (index === -1) {

                return identifier;

            }


            return (
                this.list[index][0]?.name ||
                identifier
            );

        },


        /* =====================================================
           COMPLETED PLAYERS
           ===================================================== */

        getCompletedPlayers(pack) {

            if (
                !pack ||
                !Array.isArray(
                    pack.levels
                )
            ) {

                return [];

            }


            /*
             * First find every actual
             * level in the pack.
             */

            const levels =
                pack.levels
                    .map(
                        identifier =>
                            findLevel(
                                this.list,
                                identifier
                            )
                    )
                    .filter(
                        index =>
                            index !== -1
                    )
                    .map(
                        index =>
                            this.list[index][0]
                    );


            /*
             * If even one level doesn't
             * exist, nobody can complete
             * the pack.
             */

            if (
                levels.length !==
                pack.levels.length
            ) {

                return [];

            }


            /*
             * Collect every player who
             * completed the first level.
             */

            const candidates =
                new Map();


            for (
                const record
                of levels[0].records || []
            ) {

                if (
                    record.percent ===
                    100 &&
                    record.user
                ) {

                    candidates.set(

                        record.user.toLowerCase(),

                        record.user

                    );

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

                const level =
                    levels[i];


                const completedUsers =
                    new Set(
                        (
                            level.records ||
                            []
                        )
                            .filter(
                                record =>
                                    record.percent ===
                                    100 &&
                                    record.user
                            )
                            .map(
                                record =>
                                    record.user
                                        .toLowerCase()
                            )
                    );


                for (
                    const [
                        username
                    ]
                    of candidates
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

            }


            return Array.from(
                candidates.values()
            ).sort(
                (a, b) =>
                    a.localeCompare(b)
            );

        },

    },

};

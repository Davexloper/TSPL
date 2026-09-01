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

        this.packs = await fetchPacks() || [];

        this.list = await fetchList() || [];

        this.loading = false;

    },


    methods: {

        /* =====================================================
           FIND LEVEL IN CURRENT LIST
           ===================================================== */

        findLevelInList(identifier) {

            if (!this.list) {
                return null;
            }

            const search =
                String(identifier).toLowerCase();


            for (let i = 0; i < this.list.length; i++) {

                const level =
                    this.list[i]?.[0];


                if (!level) {
                    continue;
                }


                /*
                 * Match by level name
                 */

                if (
                    String(level.name).toLowerCase() ===
                    search
                ) {

                    return {
                        index: i,
                        level
                    };

                }


                /*
                 * Match by path
                 */

                if (
                    String(level.path).toLowerCase() ===
                    search
                ) {

                    return {
                        index: i,
                        level
                    };

                }


                /*
                 * Match by ID
                 */

                if (
                    String(level.id).toLowerCase() ===
                    search
                ) {

                    return {
                        index: i,
                        level
                    };

                }

            }


            return null;

        },


        /* =====================================================
           OPEN EXACT LEVEL
           ===================================================== */

        openLevel(identifier) {

            const result =
                this.findLevelInList(
                    identifier
                );


            if (!result) {

                console.error(
                    `Pack level "${identifier}" could not be found.`
                );

                return;

            }


            /*
             * Use the actual list index.
             */

            this.$router.push({

                path: '/',

                query: {

                    level:
                        result.level.path

                }

            });

        },


        /* =====================================================
           GET LEVEL NAME
           ===================================================== */

        getLevelName(identifier) {

            const result =
                this.findLevelInList(
                    identifier
                );


            if (!result) {

                return identifier;

            }


            return (
                result.level.name ||
                identifier
            );

        },


        /* =====================================================
           COMPLETED PLAYERS
           ===================================================== */

        getCompletedPlayers(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels)
            ) {

                return [];

            }


            /*
             * Find every level in the pack.
             */

            const levels =
                pack.levels
                    .map(identifier => {

                        const result =
                            this.findLevelInList(
                                identifier
                            );

                        return result
                            ? result.level
                            : null;

                    })
                    .filter(level => level);


            /*
             * If a pack references a level
             * that does not exist, nobody
             * can complete the pack.
             */

            if (
                levels.length !==
                pack.levels.length
            ) {

                return [];

            }


            /*
             * Get every player who completed
             * the first level.
             */

            const candidates =
                new Map();


            for (
                const record
                of levels[0].records || []
            ) {

                if (
                    record.percent === 100 &&
                    record.user
                ) {

                    const username =
                        record.user;


                    candidates.set(
                        username.toLowerCase(),
                        username
                    );

                }

            }


            /*
             * Check every remaining level.
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
                                    record.percent === 100 &&
                                    record.user
                            )
                            .map(
                                record =>
                                    record.user.toLowerCase()
                            )
                    );


                /*
                 * Remove players who haven't
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

            }


            /*
             * These players completed
             * EVERY level in the pack.
             */

            return Array.from(
                candidates.values()
            ).sort(
                (a, b) =>
                    a.localeCompare(b)
            );

        }

    }

};

import {
    fetchPacks,
    fetchList,
    getCompletedPlayersForPack,
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

                <div
                    v-if="packs.length === 0"
                    class="no-packs"
                >

                    <h2>No Packs</h2>

                    <p>
                        No packs have been added yet.
                    </p>

                </div>


                <div
                    v-for="pack in packs"
                    :key="pack.id"
                    class="pack"
                    :style="{
                        '--pack-color':
                            pack.color || '#ffffff'
                    }"
                >

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


                    <div class="pack-completed">

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


                        <div
                            v-if="
                                getCompletedPlayers(pack).length
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

        findLevel(identifier) {

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (
                index === -1
            ) {

                return null;

            }


            return this.list[index]?.[0] || null;

        },


        /* =====================================================
           GET LEVEL NAME
           ===================================================== */

        getLevelName(identifier) {

            const level =
                this.findLevel(
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

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (
                index === -1
            ) {

                console.error(
                    `Pack level "${identifier}" could not be found.`
                );

                return;

            }


            /*
             * Save the exact level path
             * in the URL.
             */

            this.$router.push({

                path: '/',

                query: {

                    level:
                        this.list[index][0].path

                }

            });

        },


        /* =====================================================
           COMPLETED PLAYERS
           ===================================================== */

        getCompletedPlayers(pack) {

            return getCompletedPlayersForPack(
                pack,
                this.list
            );

        }

    }

};

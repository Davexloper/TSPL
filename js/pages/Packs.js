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

                    <!-- PACK HEADER -->

                    <div class="pack-header">

                        <div class="pack-info">

                            <h1>
                                {{ pack.name }}
                            </h1>

                            <p>
                                {{ pack.levels.length }} Levels
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
                                {{ getLevel(identifier)?.name || identifier }}
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


                        <p v-else>
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

        console.log(
            'PACKS:',
            this.packs
        );

        console.log(
            'LEVEL LIST:',
            this.list
        );

        this.loading =
            false;

    },


    methods: {

        /* =====================================================
           FIND LEVEL BY NAME / ID / PATH
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


                if (
                    String(level.name)
                        .trim()
                        .toLowerCase() === search
                ) {

                    return level;

                }


                if (
                    String(level.path)
                        .trim()
                        .toLowerCase() === search
                ) {

                    return level;

                }


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
           OPEN LEVEL
           ===================================================== */

        openLevel(identifier) {

            const level =
                this.getLevel(
                    identifier
                );


            if (!level) {
                return;
            }


            const index =
                this.list.findIndex(
                    entry =>
                        entry?.[0] === level
                );


            if (index === -1) {
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
             * Resolve every pack level.
             */

            const levels =
                pack.levels.map(
                    identifier =>
                        this.getLevel(
                            identifier
                        )
                );


            /*
             * If one level could not be found,
             * don't incorrectly mark anyone
             * as a Victor.
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
             * Map:
             *
             * lowercase username
             * ->
             * original username
             */

            const players =
                new Map();


            /*
             * Start with players who
             * completed the FIRST level.
             */

            for (
                const record
                of levels[0].records || []
            ) {

                const percent =
                    Number(
                        record.percent
                    );


                if (
                    percent === 100 &&
                    record.user
                ) {

                    const username =
                        String(
                            record.user
                        ).trim();


                    players.set(
                        username.toLowerCase(),
                        username
                    );

                }

            }


            /*
             * Now check every other level.
             */

            for (
                let i = 1;
                i < levels.length;
                i++
            ) {

                const completed =
                    new Set();


                for (
                    const record
                    of levels[i].records || []
                ) {

                    if (
                        Number(
                            record.percent
                        ) === 100 &&
                        record.user
                    ) {

                        completed.add(
                            String(
                                record.user
                            )
                                .trim()
                                .toLowerCase()
                        );

                    }

                }


                /*
                 * Remove anyone who hasn't
                 * completed this level.
                 */

                for (
                    const username
                    of players.keys()
                ) {

                    if (
                        !completed.has(
                            username
                        )
                    ) {

                        players.delete(
                            username
                        );

                    }

                }


                /*
                 * Nobody left.
                 */

                if (
                    players.size === 0
                ) {

                    return [];

                }

            }


            return Array.from(
                players.values()
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

import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },


    data: () => ({

        leaderboard: [],

        loading: true,

        selected: 0,

        err: []

    }),


    template: `

        <main
            v-if="loading"
            class="page-leaderboard-container"
        >

            <Spinner></Spinner>

        </main>


        <main
            v-else
            class="page-leaderboard-container"
        >

            <div class="page-leaderboard">


                <!-- =========================================
                     PLAYER LIST
                     ========================================= -->

                <div class="board-container">

                    <table class="board">

                        <tr
                            v-for="
                                (ientry, i)
                                in leaderboard
                            "
                            :key="ientry.user"
                        >

                            <td class="rank">

                                <p>
                                    #{{ i + 1 }}
                                </p>

                            </td>


                            <td class="total">

                                <p>
                                    {{ Math.round(ientry.total) }}
                                </p>

                            </td>


                            <td class="user">

                                <button
                                    @click="
                                        openProfile(
                                            ientry.user
                                        )
                                    "
                                >
                                    {{ ientry.user }}
                                </button>

                            </td>

                        </tr>

                    </table>

                </div>


                <!-- =========================================
                     PLAYER INFORMATION
                     ========================================= -->

                <div
                    class="player-container"
                    v-if="entry"
                >

                    <div class="player">


                        <!-- PLAYER -->

                        <div class="player-header">

                            <h1>
                                #{{ selected + 1 }}
                                {{ entry.user }}
                            </h1>

                            <p>
                                {{ Math.round(entry.total) }}
                                Points
                            </p>

                        </div>


                        <!-- =================================
                             COMPLETED PACKS
                             ================================= -->

                        <section
                            v-if="
                                entry.packs &&
                                entry.packs.length
                            "
                            class="player-section packs-section"
                        >

                            <div class="section-header">

                                <h2>
                                    Completed Packs
                                </h2>

                                <span>
                                    {{ entry.packs.length }}
                                </span>

                            </div>


                            <div class="completed-packs">

                                <div
                                    v-for="
                                        pack in entry.packs
                                    "
                                    :key="pack.id"

                                    class="completed-pack"

                                    :style="{
                                        '--pack-color':
                                            pack.color
                                    }"
                                >

                                    <span
                                        class="completed-pack-color"
                                    ></span>

                                    <div>

                                        <strong>
                                            {{ pack.name }}
                                        </strong>

                                        <small>
                                            {{ pack.levels }}
                                            Levels Completed
                                        </small>

                                    </div>

                                </div>

                            </div>

                        </section>


                        <!-- =================================
                             NO PACKS
                             ================================= -->

                        <section
                            v-else
                            class="player-section packs-section"
                        >

                            <div class="section-header">

                                <h2>
                                    Completed Packs
                                </h2>

                                <span>
                                    0
                                </span>

                            </div>

                            <p class="no-data">
                                No completed packs.
                            </p>

                        </section>


                        <!-- =================================
                             VERIFIED
                             ================================= -->

                        <section
                            v-if="
                                entry.verified &&
                                entry.verified.length
                            "
                            class="player-section"
                        >

                            <div class="section-header">

                                <h2>
                                    Verified
                                </h2>

                                <span>
                                    {{ entry.verified.length }}
                                </span>

                            </div>


                            <table class="table">

                                <tr
                                    v-for="
                                        item in entry.verified
                                    "
                                    :key="
                                        'verified-' +
                                        item.rank +
                                        '-' +
                                        item.level
                                    "
                                >

                                    <td class="rank">

                                        #{{ item.rank }}

                                    </td>


                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="item.link"
                                        >
                                            {{ item.level }}
                                        </a>

                                    </td>


                                    <td class="score">

                                        +{{ Math.round(item.score) }}

                                    </td>

                                </tr>

                            </table>

                        </section>


                        <!-- =================================
                             COMPLETED
                             ================================= -->

                        <section
                            v-if="
                                entry.completed &&
                                entry.completed.length
                            "
                            class="player-section"
                        >

                            <div class="section-header">

                                <h2>
                                    Completed
                                </h2>

                                <span>
                                    {{ entry.completed.length }}
                                </span>

                            </div>


                            <table class="table">

                                <tr
                                    v-for="
                                        item in entry.completed
                                    "
                                    :key="
                                        'completed-' +
                                        item.rank +
                                        '-' +
                                        item.level
                                    "
                                >

                                    <td class="rank">

                                        #{{ item.rank }}

                                    </td>


                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="item.link"
                                        >
                                            {{ item.level }}
                                        </a>

                                    </td>


                                    <td class="score">

                                        +{{ Math.round(item.score) }}

                                    </td>


                                </tr>

                            </table>

                        </section>


                        <!-- =================================
                             PROGRESSED
                             ================================= -->

                        <section
                            v-if="
                                entry.progressed &&
                                entry.progressed.length
                            "
                            class="player-section"
                        >

                            <div class="section-header">

                                <h2>
                                    Progressed
                                </h2>

                                <span>
                                    {{ entry.progressed.length }}
                                </span>

                            </div>


                            <table class="table">

                                <tr
                                    v-for="
                                        item in entry.progressed
                                    "
                                    :key="
                                        'progressed-' +
                                        item.rank +
                                        '-' +
                                        item.level +
                                        '-' +
                                        item.percent
                                    "
                                >

                                    <td class="rank">

                                        #{{ item.rank }}

                                    </td>


                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="item.link"
                                        >
                                            {{ item.percent }}%
                                            {{ item.level }}
                                        </a>

                                    </td>


                                    <td class="score">

                                        +{{ Math.round(item.score) }}

                                    </td>


                                    </tr>

                            </table>

                        </section>


                    </div>

                </div>

            </div>

        </main>
    `,


    computed: {

        entry() {

            return (
                this.leaderboard[
                    this.selected
                ] || null
            );

        }

    },


    async mounted() {

        try {

            const [
                leaderboard,
                err
            ] =
                await fetchLeaderboard();


            this.leaderboard =
                leaderboard || [];


            this.err =
                err || [];


        } catch (error) {

            console.error(
                'Failed to load leaderboard:',
                error
            );

            this.leaderboard = [];

            this.err = [
                'Failed to load leaderboard.'
            ];

        }


        this.loading =
            false;

    },


    methods: {

        localize,

        openProfile(username) {

            this.$router.push(
                '/profile/' +
                encodeURIComponent(username)
            );

        }

    }

};

import {
    fetchLeaderboard
} from '../content.js';

import {
    localize
} from '../util.js';

import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },


    data: () => ({

        leaderboard: [],

        loading: true,

        selected: 0,

        err: [],

    }),


    template: `

        <main v-if="loading">

            <Spinner></Spinner>

        </main>


        <main
            v-else
            class="page-leaderboard-container"
        >

            <div class="page-leaderboard">


                <!-- =================================================
                     ERRORS
                     ================================================= -->

                <div class="error-container">

                    <p
                        class="error"
                        v-if="err.length > 0"
                    >

                        Leaderboard may be incorrect,
                        as the following levels could not
                        be loaded:

                        {{ err.join(', ') }}

                    </p>

                </div>


                <!-- =================================================
                     LEADERBOARD
                     ================================================= -->

                <div class="board-container">

                    <table class="board">

                        <tr
                            v-for="(ientry, i) in leaderboard"
                            :key="ientry.user"
                        >

                            <td class="rank">

                                <p class="type-label-lg">
                                    #{{ i + 1 }}
                                </p>

                            </td>


                            <td class="total">

                                <p class="type-label-lg">
                                    {{ Math.round(ientry.total) }}
                                </p>

                            </td>


                            <td
                                class="user"
                                :class="{
                                    active:
                                        selected === i
                                }"
                            >

                                <button
                                    @click="
                                        selected = i
                                    "
                                >

                                    <span
                                        class="type-label-lg"
                                    >
                                        {{ ientry.user }}
                                    </span>

                                </button>

                            </td>

                        </tr>

                    </table>

                </div>


                <!-- =================================================
                     PLAYER
                     ================================================= -->

                <div class="player-container">

                    <div
                        class="player"
                        v-if="entry"
                    >


                        <h1>
                            #{{ selected + 1 }}
                            {{ entry.user }}
                        </h1>


                        <h3>
                            {{ Math.round(entry.total) }}
                        </h3>


                        <!-- =================================================
                             VERIFIED
                             ================================================= -->

                        <h2
                            v-if="
                                entry.verified.length > 0
                            "
                        >

                            Verified
                            ({{ entry.verified.length }})

                        </h2>


                        <table class="table">

                            <tr
                                v-for="
                                    score
                                    in entry.verified
                                "
                                :key="
                                    'verified-' +
                                    score.path
                                "
                            >

                                <td class="rank">

                                    <p>
                                        #{{ score.rank }}
                                    </p>

                                </td>


                                <td class="level">

                                    <a
                                        class="type-label-lg"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.level }}
                                    </a>

                                </td>


                                <td class="score">

                                    <p>
                                        +{{
                                            Math.round(
                                                score.score
                                            )
                                        }}
                                    </p>

                                </td>

                            </tr>

                        </table>


                        <!-- =================================================
                             COMPLETED
                             ================================================= -->

                        <h2
                            v-if="
                                entry.completed.length > 0
                            "
                        >

                            Completed
                            ({{ entry.completed.length }})

                        </h2>


                        <table class="table">

                            <tr
                                v-for="
                                    score
                                    in entry.completed
                                "
                                :key="
                                    'completed-' +
                                    score.path
                                "
                            >

                                <td class="rank">

                                    <p>
                                        #{{ score.rank }}
                                    </p>

                                </td>


                                <td class="level">

                                    <a
                                        class="type-label-lg"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.level }}
                                    </a>

                                </td>


                                <td class="score">

                                    <p>
                                        +{{
                                            Math.round(
                                                score.score
                                            )
                                        }}
                                    </p>

                                </td>

                            </tr>

                        </table>


                        <!-- =================================================
                             PROGRESSED
                             ================================================= -->

                        <h2
                            v-if="
                                entry.progressed.length > 0
                            "
                        >

                            Progressed
                            ({{ entry.progressed.length }})

                        </h2>


                        <table class="table">

                            <tr
                                v-for="
                                    score
                                    in entry.progressed
                                "
                                :key="
                                    'progressed-' +
                                    score.path
                                "
                            >

                                <td class="rank">

                                    <p>
                                        #{{ score.rank }}
                                    </p>

                                </td>


                                <td class="level">

                                    <a
                                        class="type-label-lg"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.percent }}%
                                        {{ score.level }}
                                    </a>

                                </td>


                                <td class="score">

                                    <p>
                                        +{{
                                            Math.round(
                                                score.score
                                            )
                                        }}
                                    </p>

                                </td>

                            </tr>

                        </table>


                        <!-- =================================================
                             COMPLETED PACKS
                             ================================================= -->

                        <div
                            v-if="
                                entry.completedPacks &&
                                entry.completedPacks.length > 0
                            "
                            class="completed-packs"
                        >

                            <h2>
                                Completed Packs
                                ({{ entry.completedPacks.length }})
                            </h2>


                            <div class="pack-list">

                                <div
                                    v-for="
                                        pack
                                        in entry.completedPacks
                                    "
                                    :key="pack.id"
                                    class="completed-pack"
                                    :style="{
                                        '--pack-color':
                                            pack.color ||
                                            '#ffffff'
                                    }"
                                >

                                    <div
                                        class="completed-pack-color"
                                        :style="{
                                            backgroundColor:
                                                pack.color
                                        }"
                                    ></div>


                                    <div
                                        class="completed-pack-info"
                                    >

                                        <p
                                            class="type-label-lg"
                                        >
                                            {{ pack.name }}
                                        </p>


                                        <span>
                                            {{ pack.levels.length }}
                                            Levels
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>


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

        },

    },


    async mounted() {

        const [
            leaderboard,
            err
        ] =
            await fetchLeaderboard();


        this.leaderboard =
            leaderboard;


        this.err =
            err;


        this.loading =
            false;


        /*
         * Make sure selected never
         * points to a nonexistent player.
         */

        if (
            this.selected >=
            this.leaderboard.length
        ) {

            this.selected = 0;

        }

    },


    methods: {

        localize,

    },

};

import {
    fetchLeaderboard
} from '../content.js';

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
                     ERROR
                     ========================================= -->

                <div
                    class="error-container"
                    v-if="err.length > 0"
                >

                    <p class="error">

                        Leaderboard may be incorrect,
                        as the following levels could not
                        be loaded:

                        {{ err.join(', ') }}

                    </p>

                </div>


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
                            :class="{
                                selected:
                                    selected === i
                            }"
                        >

                            <!-- RANK -->

                            <td class="rank">

                                <p>
                                    #{{ i + 1 }}
                                </p>

                            </td>


                            <!-- POINTS -->

                            <td class="total">

                                <p>
                                    {{ Math.round(ientry.total) }}
                                </p>

                            </td>


                            <!-- USER -->

                            <td class="user">

                                <button
                                    @click="
                                        selected = i
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


                        <!-- PLAYER HEADER -->

                        <div class="player-header">

                            <div>

                                <h1>
                                    #{{ selected + 1 }}
                                    {{ entry.user }}
                                </h1>

                                <p class="player-points">
                                    {{ Math.round(entry.total) }}
                                    Points
                                </p>

                            </div>

                        </div>


                        <!-- =================================
                             COMPLETED PACKS
                             ================================= -->

                        <section
                            class="player-section packs-section"
                            v-if="
                                entry.packs &&
                                entry.packs.length > 0
                            "
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
                                            pack.color ||
                                            '#ff7a00'
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
                             VERIFIED
                             ================================= -->

                        <section
                            class="player-section"
                            v-if="
                                entry.verified &&
                                entry.verified.length > 0
                            "
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
                                        score in entry.verified
                                    "
                                    :key="
                                        'verified-' +
                                        score.rank +
                                        '-' +
                                        score.level
                                    "
                                >

                                    <td class="rank">
                                        #{{ score.rank }}
                                    </td>

                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.level }}
                                        </a>

                                    </td>

                                    <td class="score">
                                        +{{ Math.round(score.score) }}
                                    </td>

                                </tr>

                            </table>

                        </section>


                        <!-- =================================
                             COMPLETED
                             ================================= -->

                        <section
                            class="player-section"
                            v-if="
                                entry.completed &&
                                entry.completed.length > 0
                            "
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
                                        score in entry.completed
                                    "
                                    :key="
                                        'completed-' +
                                        score.rank +
                                        '-' +
                                        score.level
                                    "
                                >

                                    <td class="rank">
                                        #{{ score.rank }}
                                    </td>

                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.level }}
                                        </a>

                                    </td>

                                    <td class="score">
                                        +{{ Math.round(score.score) }}
                                    </td>

                                </tr>

                            </table>

                        </section>


                        <!-- =================================
                             PROGRESSED
                             ================================= -->

                        <section
                            class="player-section"
                            v-if="
                                entry.progressed &&
                                entry.progressed.length > 0
                            "
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
                                        score in entry.progressed
                                    "
                                    :key="
                                        'progressed-' +
                                        score.rank +
                                        '-' +
                                        score.level
                                    "
                                >

                                    <td class="rank">
                                        #{{ score.rank }}
                                    </td>

                                    <td class="level">

                                        <a
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.percent }}%
                                            {{ score.level }}
                                        </a>

                                    </td>

                                    <td class="score">
                                        +{{ Math.round(score.score) }}
                                    </td>

                                </tr>

                            </table>

                        </section>


                        <!-- =================================
                             NO INFORMATION
                             ================================= -->

                        <div
                            class="no-player-data"
                            v-if="
                                (!entry.verified ||
                                 entry.verified.length === 0) &&

                                (!entry.completed ||
                                 entry.completed.length === 0) &&

                                (!entry.progressed ||
                                 entry.progressed.length === 0) &&

                                (!entry.packs ||
                                 entry.packs.length === 0)
                            "
                        >

                            No records yet.

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

        }

    },


    async mounted() {

        try {

            const [
                leaderboard,
                err
            ] = await fetchLeaderboard();


            this.leaderboard =
                leaderboard || [];


            this.err =
                err || [];


        } catch (error) {

            console.error(
                'Failed to load leaderboard.',
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

        localize

    }

};

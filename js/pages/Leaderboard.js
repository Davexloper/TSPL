import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {

    components: {
        Spinner,
    },

    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),

    template: `
        <main v-if="loading" class="page-leaderboard-loading">
            <Spinner></Spinner>
        </main>

        <main
            v-else
            class="page-leaderboard-container"
        >

            <div class="page-leaderboard">

                <!-- ERROR -->
                <div
                    v-if="err.length > 0"
                    class="error-container"
                >
                    <p class="error">
                        Leaderboard may be incorrect, as the following
                        levels could not be loaded:
                        {{ err.join(', ') }}
                    </p>
                </div>


                <!-- LEADERBOARD -->
                <div class="leaderboard-layout">

                    <!-- LEFT: PLAYER LIST -->
                    <aside class="board-container">

                        <div class="board-header">
                            <span>RANK</span>
                            <span>POINTS</span>
                            <span>PLAYER</span>
                        </div>

                        <div class="board">

                            <button
                                v-for="(ientry, i) in leaderboard"
                                :key="ientry.user"
                                class="board-row"
                                :class="{
                                    active: selected === i
                                }"
                                @click="selected = i"
                            >

                                <span class="rank">
                                    #{{ i + 1 }}
                                </span>

                                <span class="total">
                                    {{ Math.round(ientry.total) }}
                                </span>

                                <span class="user">
                                    {{ ientry.user }}
                                </span>

                            </button>

                        </div>

                    </aside>


                    <!-- RIGHT: PLAYER -->
                    <section class="player-container">

                        <div
                            v-if="entry"
                            class="player"
                        >

                            <!-- PLAYER HEADER -->
                            <header class="player-header">

                                <div class="player-rank">
                                    #{{ selected + 1 }}
                                </div>

                                <div class="player-info">

                                    <h1>
                                        {{ entry.user }}
                                    </h1>

                                    <p>
                                        {{ Math.round(entry.total) }}
                                        points
                                    </p>

                                </div>

                            </header>


                            <!-- VERIFIED -->
                            <section
                                v-if="entry.verified.length > 0"
                                class="score-section"
                            >

                                <div class="section-header">
                                    <h2>
                                        Verified
                                    </h2>

                                    <span>
                                        {{ entry.verified.length }}
                                    </span>
                                </div>


                                <div class="score-table">

                                    <div
                                        v-for="score in entry.verified"
                                        :key="
                                            score.rank +
                                            score.level
                                        "
                                        class="score-row"
                                    >

                                        <span class="score-rank">
                                            #{{ score.rank }}
                                        </span>

                                        <a
                                            class="score-level"
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.level }}
                                        </a>

                                        <span class="score-points">
                                            +{{ localize(score.score) }}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            <!-- COMPLETED -->
                            <section
                                v-if="entry.completed.length > 0"
                                class="score-section"
                            >

                                <div class="section-header">
                                    <h2>
                                        Completed
                                    </h2>

                                    <span>
                                        {{ entry.completed.length }}
                                    </span>
                                </div>


                                <div class="score-table">

                                    <div
                                        v-for="score in entry.completed"
                                        :key="
                                            score.rank +
                                            score.level
                                        "
                                        class="score-row"
                                    >

                                        <span class="score-rank">
                                            #{{ score.rank }}
                                        </span>

                                        <a
                                            class="score-level"
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.level }}
                                        </a>

                                        <span class="score-points">
                                            +{{ localize(score.score) }}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            <!-- PROGRESSED -->
                            <section
                                v-if="entry.progressed.length > 0"
                                class="score-section"
                            >

                                <div class="section-header">
                                    <h2>
                                        Progressed
                                    </h2>

                                    <span>
                                        {{ entry.progressed.length }}
                                    </span>
                                </div>


                                <div class="score-table">

                                    <div
                                        v-for="score in entry.progressed"
                                        :key="
                                            score.rank +
                                            score.level +
                                            score.percent
                                        "
                                        class="score-row"
                                    >

                                        <span class="score-rank">
                                            #{{ score.rank }}
                                        </span>

                                        <a
                                            class="score-level"
                                            target="_blank"
                                            :href="score.link"
                                        >
                                            {{ score.percent }}%
                                            {{ score.level }}
                                        </a>

                                        <span class="score-points">
                                            +{{ localize(score.score) }}
                                        </span>

                                    </div>

                                </div>

                            </section>

                        </div>

                    </section>

                </div>

            </div>

        </main>
    `,

    computed: {

        entry() {
            return this.leaderboard[this.selected];
        },

    },

    async mounted() {

        const [
            leaderboard,
            err
        ] = await fetchLeaderboard();

        this.leaderboard = leaderboard;
        this.err = err;
        this.loading = false;

    },

    methods: {

        localize,

    },

};

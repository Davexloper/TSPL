import { fetchLeaderboard, fetchPacks } from '../content.js';
import { localize } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },

    data: () => ({
        leaderboard: [],
        packs: [],
        loading: true,
        selected: 0,
        err: [],
    }),

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-leaderboard-container">

            <div class="page-leaderboard">

                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded:
                        {{ err.join(', ') }}
                    </p>
                </div>

                <div class="board-container">

                    <table class="board">

                        <tr v-for="(ientry, i) in leaderboard">

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
                                :class="{ 'active': selected == i }"
                            >
                                <button @click="selected = i">
                                    <span class="type-label-lg">
                                        {{ ientry.user }}
                                    </span>
                                </button>
                            </td>

                        </tr>

                    </table>

                </div>


                <div class="player-container">

                    <div
                        class="player"
                        v-if="entry"
                    >

                        <h1>
                            #{{ selected + 1 }} {{ entry.user }}
                        </h1>

                        <h3>
                            {{ Math.round(entry.total) }}
                        </h3>


                        <!-- VERIFIED -->

                        <h2 v-if="entry.verified.length > 0">
                            Verified ({{ entry.verified.length }})
                        </h2>

                        <table class="table">

                            <tr v-for="score in entry.verified">

                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
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
                                        +{{ Math.round(score.score) }}
                                    </p>
                                </td>

                            </tr>

                        </table>


                        <!-- COMPLETED -->

                        <h2 v-if="entry.completed.length > 0">
                            Completed ({{ entry.completed.length }})
                        </h2>

                        <table class="table">

                            <tr v-for="score in entry.completed">

                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
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
                                        +{{ Math.round(score.score) }}
                                    </p>
                                </td>

                            </tr>

                        </table>


                        <!-- PROGRESSED -->

                        <h2 v-if="entry.progressed.length > 0">
                            Progressed ({{ entry.progressed.length }})
                        </h2>

                        <table class="table">

                            <tr v-for="score in entry.progressed">

                                <td class="rank">
                                    <p>#{{ score.rank }}</p>
                                </td>

                                <td class="level">
                                    <a
                                        class="type-label-lg"
                                        target="_blank"
                                        :href="score.link"
                                    >
                                        {{ score.percent }}% {{ score.level }}
                                    </a>
                                </td>

                                <td class="score">
                                    <p>
                                        +{{ Math.round(score.score) }}
                                    </p>
                                </td>

                            </tr>

                        </table>


                        <!-- COMPLETED PACKS -->

                        <div
                            v-if="completedPacks.length > 0"
                            class="completed-packs"
                        >

                            <h2>
                                Completed Packs ({{ completedPacks.length }})
                            </h2>

                            <div class="pack-list">

                                <div
                                    v-for="pack in completedPacks"
                                    :key="pack.id"
                                    class="completed-pack"
                                    :style="{
                                        borderColor: pack.color
                                    }"
                                >

                                    <div
                                        class="completed-pack-color"
                                        :style="{
                                            backgroundColor: pack.color
                                        }"
                                    ></div>

                                    <div class="completed-pack-info">

                                        <p class="type-label-lg">
                                            {{ pack.name }}
                                        </p>

                                        <span>
                                            {{ pack.completed }}/{{ pack.total }}
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
            return this.leaderboard[this.selected];
        },

        completedPacks() {

            if (!this.entry || !this.packs.length) {
                return [];
            }

            const completedLevels = new Set(
                this.entry.completed.map(
                    level => level.level
                )
            );

            return this.packs
                .map(pack => {

                    const completed = pack.levels.filter(
                        level => completedLevels.has(level)
                    ).length;

                    return {
                        ...pack,
                        completed,
                        total: pack.levels.length
                    };

                })
                .filter(pack =>
                    pack.total > 0 &&
                    pack.completed === pack.total
                );
        },

    },

    async mounted() {

        const [leaderboard, err] = await fetchLeaderboard();

        this.leaderboard = leaderboard;
        this.err = err;

        this.packs = await fetchPacks();

        if (!this.packs) {
            this.packs = [];
        }

        this.loading = false;
    },

    methods: {
        localize,
    },
};

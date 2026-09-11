import { store } from "../main.js";
import { embed } from "../util.js";
import { fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

export default {
    components: {
        Spinner,
        LevelAuthors
    },

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-list">

            <!-- =========================================
                 LEFT — LEVEL LIST
                 ========================================= -->

            <section class="list-container">

                <div class="list-header">
                    <div>
                        <span class="list-title">TSPL</span>
                        <span class="list-subtitle">The Shitty List</span>
                    </div>

                    <span class="list-count">
                        {{ list.length }} levels
                    </span>
                </div>

                <div class="list-scroll">

                    <button
                        v-for="([item, err], i) in list"
                        :key="i"
                        class="list-level"
                        :class="{
                            active: selected === i,
                            error: !item
                        }"
                        @click="selected = i"
                    >

                        <span class="list-rank">
                            {{ i + 1 <= 150 ? '#' + (i + 1) : 'L' }}
                        </span>

                        <span class="list-level-name">
                            {{ item?.name || 'Error (' + err + '.json)' }}
                        </span>

                        <span
                            v-if="item"
                            class="list-arrow"
                        >
                            →
                        </span>

                    </button>

                </div>

            </section>


            <!-- =========================================
                 CENTER — LEVEL
                 ========================================= -->

            <section class="level-container">

                <div
                    v-if="level"
                    class="level-panel"
                >

                    <div class="level-heading">

                        <div class="level-rank">
                            #{{ selected + 1 }}
                        </div>

                        <div>
                            <h1>{{ level.name }}</h1>

                            <LevelAuthors
                                :author="level.author"
                                :creators="level.creators"
                                :verifier="level.verifier"
                            ></LevelAuthors>
                        </div>

                    </div>


                    <!-- VIDEO -->

                    <div class="video-wrapper">

                        <iframe
                            class="video"
                            id="videoframe"
                            :src="video"
                            frameborder="0"
                            allowfullscreen
                        ></iframe>

                    </div>


                    <!-- STATS -->

                    <div class="stats">

                        <div class="stat">
                            <span class="stat-label">
                                Points
                            </span>

                            <strong>
                                {{ listScore(selected + 1) }}
                            </strong>
                        </div>

                        <div class="stat">
                            <span class="stat-label">
                                ID
                            </span>

                            <strong>
                                {{ level.id }}
                            </strong>
                        </div>

                        <div class="stat">
                            <span class="stat-label">
                                Password
                            </span>

                            <strong>
                                {{ level.password || 'Free to Copy' }}
                            </strong>
                        </div>

                    </div>


                    <!-- LEVEL INFO -->

                    <div class="level-info">

                        <div>
                            <span class="info-label">
                                Verification
                            </span>

                            <a
                                :href="level.verification"
                                target="_blank"
                            >
                                Watch video
                            </a>
                        </div>

                        <div v-if="level.showcase">
                            <span class="info-label">
                                Showcase
                            </span>

                            <a
                                :href="level.showcase"
                                target="_blank"
                            >
                                Watch showcase
                            </a>
                        </div>

                    </div>

                </div>


                <!-- NO LEVEL -->

                <div
                    v-else
                    class="level-empty"
                >
                    <span>¯\\_(ツ)_/¯</span>
                    <p>No level selected</p>
                </div>

            </section>


            <!-- =========================================
                 RIGHT — RECORDS ONLY
                 ========================================= -->

            <aside class="records-container">

                <div
                    v-if="level"
                    class="records-panel"
                >

                    <div class="records-header">

                        <div>
                            <span class="records-label">
                                RECORDS
                            </span>

                            <h2>
                                {{ level.name }}
                            </h2>
                        </div>

                        <span class="records-count">
                            {{ level.records?.length || 0 }}
                        </span>

                    </div>


                    <!-- QUALIFICATION -->

                    <div class="qualification">

                        <span>
                            Qualification
                        </span>

                        <strong v-if="selected + 1 <= 75">
                            {{ level.percentToQualify }}%
                        </strong>

                        <strong v-else-if="selected + 1 <= 150">
                            100%
                        </strong>

                        <strong v-else>
                            Closed
                        </strong>

                    </div>


                    <!-- RECORD LIST -->

                    <div class="records-list">

                        <div
                            v-if="!level.records || level.records.length === 0"
                            class="no-records"
                        >
                            No records yet.
                        </div>

                        <a
                            v-for="record in level.records"
                            :key="record.user + '-' + record.percent"
                            :href="record.link"
                            target="_blank"
                            class="record"
                        >

                            <div class="record-percent">
                                {{ record.percent }}%
                            </div>

                            <div class="record-user">
                                <span>
                                    {{ record.user }}
                                </span>

                                <small v-if="record.mobile">
                                    Mobile
                                </small>
                            </div>

                            <div class="record-hz">
                                {{ record.hz }}Hz
                            </div>

                        </a>

                    </div>

                </div>

            </aside>


            <!-- =========================================
                 ERRORS
                 ========================================= -->

            <div
                v-if="errors.length"
                class="page-errors"
            >

                <p
                    v-for="error in errors"
                    :key="error"
                >
                    {{ error }}
                </p>

            </div>

        </main>
    `,

    data: () => ({
        list: [],
        loading: true,
        selected: 0,
        errors: [],
        store
    }),

    computed: {

        level() {
            return this.list[this.selected]?.[0] || null;
        },

        video() {

            if (!this.level) {
                return "";
            }

            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        }

    },

    async mounted() {

        try {

            this.list = await fetchList();

            if (!this.list) {

                this.errors.push(
                    "Failed to load list. Retry in a few minutes or notify list staff."
                );

                this.list = [];

            } else {

                this.errors.push(
                    ...this.list
                        .filter(([_, err]) => err)
                        .map(([_, err]) => {
                            return `Failed to load level. (${err}.json)`;
                        })
                );

            }

        } catch (error) {

            console.error(error);

            this.errors.push(
                "Failed to load list."
            );

            this.list = [];

        } finally {

            this.loading = false;

        }

    },

    methods: {

        embed,

        /**
         * Calculate points based on the total number of levels.
         *
         * #1 = 250 points
         * Last level = 1 point
         */
        listScore(rank) {

            const totalLevels = this.list.length;

            if (totalLevels <= 1) {
                return 250;
            }

            const points =
                250 -
                (rank - 1) *
                (249 / (totalLevels - 1));

            return Math.max(
                1,
                Math.round(points)
            );
        }

    }
};

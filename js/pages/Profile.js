import { fetchLeaderboard } from '../content.js';
import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },


    data: () => ({

        entry: null,

        rank: 0,

        loading: true,

        error: null

    }),


    template: `

        <main
            v-if="loading"
            class="page-profile-container"
        >

            <Spinner></Spinner>

        </main>


        <main
            v-else-if="entry"
            class="page-profile-container"
        >

            <div class="page-profile">


                <!-- =========================================
                     PROFILE HEADER
                     ========================================= -->

                <div class="profile-header">

                    <h1>
                        {{ entry.user }}
                    </h1>

                    <div class="profile-stats">

                        <div class="profile-stat">

                            <strong>
                                #{{ rank }}
                            </strong>

                            <span>
                                Worldwide Rank
                            </span>

                        </div>


                        <div class="profile-stat">

                            <strong>
                                {{ Math.round(entry.total) }}
                            </strong>

                            <span>
                                Points
                            </span>

                        </div>


                        <div class="profile-stat">

                            <strong>
                                {{ entry.completed.length }}
                            </strong>

                            <span>
                                Extremes Completed
                            </span>

                        </div>

                    </div>

                </div>


                <!-- =========================================
                     COMPLETED LEVELS
                     ========================================= -->

                <section class="profile-section">

                    <div class="profile-section-header">

                        <h2>
                            Completed Levels
                        </h2>

                        <span>
                            {{ entry.completed.length }}
                        </span>

                    </div>


                    <div
                        v-if="
                            entry.completed &&
                            entry.completed.length
                        "
                        class="profile-levels"
                    >

                        <div
                            v-for="
                                item in entry.completed
                            "
                            :key="
                                'completed-' +
                                item.rank +
                                '-' +
                                item.level
                            "
                            class="profile-level"
                        >

                            <span class="profile-level-rank">
                                #{{ item.rank }}
                            </span>


                            <a
                                v-if="item.link"
                                :href="item.link"
                                target="_blank"
                            >
                                {{ item.level }}
                            </a>

                            <span v-else>
                                {{ item.level }}
                            </span>


                            <span class="profile-level-score">
                                +{{ Math.round(item.score) }}
                            </span>

                        </div>

                    </div>


                    <p
                        v-else
                        class="no-data"
                    >
                        No completed levels.
                    </p>

                </section>


                <!-- =========================================
                     COMPLETED PACKS
                     ========================================= -->

                <section class="profile-section">

                    <div class="profile-section-header">

                        <h2>
                            Completed Packs
                        </h2>

                        <span>
                            {{ entry.packs.length }}
                        </span>

                    </div>


                    <div
                        v-if="
                            entry.packs &&
                            entry.packs.length
                        "
                        class="profile-packs"
                    >

                        <div
                            v-for="
                                pack in entry.packs
                            "
                            :key="pack.id"
                            class="profile-pack"
                            :style="{
                                '--pack-color':
                                    pack.color
                            }"
                        >

                            <span
                                class="profile-pack-color"
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


                    <p
                        v-else
                        class="no-data"
                    >
                        No completed packs.
                    </p>

                </section>


                <!-- =========================================
                     CREATED LEVELS
                     ========================================= -->

                <section class="profile-section">

                    <div class="profile-section-header">

                        <h2>
                            Created Levels
                        </h2>

                        <span>
                            {{ entry.created.length }}
                        </span>

                    </div>


                    <div
                        v-if="
                            entry.created &&
                            entry.created.length
                        "
                        class="profile-levels"
                    >

                        <div
                            v-for="
                                item in entry.created
                            "
                            :key="
                                'created-' +
                                item.rank +
                                '-' +
                                item.level
                            "
                            class="profile-level"
                        >

                            <span class="profile-level-rank">
                                #{{ item.rank }}
                            </span>


                            <a
                                v-if="item.link"
                                :href="item.link"
                                target="_blank"
                            >
                                {{ item.level }}
                            </a>

                            <span v-else>
                                {{ item.level }}
                            </span>

                        </div>

                    </div>


                    <p
                        v-else
                        class="no-data"
                    >
                        No created levels.
                    </p>

                </section>


            </div>

        </main>


        <!-- =========================================
             PLAYER NOT FOUND
             ========================================= -->

        <main
            v-else
            class="page-profile-container"
        >

            <div class="page-profile">

                <section class="profile-section">

                    <h2>
                        Player not found
                    </h2>

                    <p class="no-data">
                        This player does not exist on the leaderboard.
                    </p>

                </section>

            </div>

        </main>

    `,


    async mounted() {

        try {

            const [
                leaderboard,
                err
            ] =
                await fetchLeaderboard();


            if (err && err.length) {
                console.warn(
                    'Leaderboard errors:',
                    err
                );
            }


            const username =
                this.$route.params.username;


            const decodedUsername =
                decodeURIComponent(
                    username || ''
                );


            /*
             * Find player case-insensitively.
             */

            const index =
                leaderboard.findIndex(
                    player =>
                        player.user
                            .toLowerCase() ===
                        decodedUsername
                            .toLowerCase()
                );


            if (index === -1) {

                this.entry = null;

                return;

            }


            this.entry =
                leaderboard[index];


            /*
             * Leaderboard is already sorted
             * by points, so the index is the
             * worldwide rank.
             */

            this.rank =
                index + 1;


        } catch (error) {

            console.error(
                'Failed to load profile:',
                error
            );

            this.error =
                'Failed to load profile.';

            this.entry = null;

        } finally {

            this.loading = false;

        }

    }

};

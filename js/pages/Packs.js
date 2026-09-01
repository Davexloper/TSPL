import { fetchList, fetchPacks } from "../content.js";
import Spinner from "../components/Spinner.js";

export default {
    components: {
        Spinner
    },

    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>

        <main v-else class="page-packs">

            <div class="packs-container">

                <div
                    v-for="pack in packs"
                    :key="pack.id"
                    class="pack"
                    :style="{ '--pack-color': pack.color }"
                >

                    <div class="pack-header">

                        <div class="pack-info">
                            <h1>{{ pack.name }}</h1>

                            <p>
                                {{ pack.levels.length }}
                                {{ pack.levels.length === 1 ? 'Level' : 'Levels' }}
                            </p>
                        </div>

                        <div
                            class="pack-color"
                            :style="{ backgroundColor: pack.color }"
                        ></div>

                    </div>

                    <div class="pack-levels">

                        <button
                            v-for="levelPath in pack.levels"
                            :key="levelPath"
                            class="pack-level"
                            @click="openLevel(levelPath)"
                        >

                            <span class="pack-level-rank">
                                #{{ getLevelRank(levelPath) }}
                            </span>

                            <span class="pack-level-name">
                                {{ getLevelName(levelPath) }}
                            </span>

                        </button>

                    </div>

                </div>

                <div
                    v-if="packs.length === 0"
                    class="no-packs"
                >
                    <h2>No Packs</h2>

                    <p>
                        No packs have been added yet.
                    </p>
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
        this.list = await fetchList();
        this.packs = await fetchPacks();

        if (!this.packs) {
            this.packs = [];
        }

        if (!this.list) {
            this.list = [];
        }

        this.loading = false;
    },

    methods: {

        findLevelIndex(levelIdentifier) {
            return this.list.findIndex(([level]) => {
                if (!level) {
                    return false;
                }

                return (
                    level.path === levelIdentifier ||
                    level.name === levelIdentifier
                );
            });
        },

        getLevel(levelIdentifier) {
            const index = this.findLevelIndex(levelIdentifier);

            if (index === -1) {
                return null;
            }

            return this.list[index][0];
        },

        getLevelName(levelIdentifier) {
            const level = this.getLevel(levelIdentifier);

            return level?.name || levelIdentifier;
        },

        getLevelRank(levelIdentifier) {
            const index = this.findLevelIndex(levelIdentifier);

            return index === -1 ? "?" : index + 1;
        },

        openLevel(levelIdentifier) {
            const index = this.findLevelIndex(levelIdentifier);

            if (index === -1) {
                console.error(
                    `Could not find level "${levelIdentifier}" in the list.`
                );

                return;
            }

            sessionStorage.setItem(
                "selectedLevel",
                index.toString()
            );

            this.$router.push("/");
        }

    }
};

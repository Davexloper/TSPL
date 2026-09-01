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
                            v-for="levelIdentifier in pack.levels"
                            :key="levelIdentifier"
                            class="pack-level"
                            @click="openLevel(levelIdentifier)"
                        >
                            <span class="pack-level-rank">
                                #{{ getLevelRank(levelIdentifier) }}
                            </span>

                            <span class="pack-level-name">
                                {{ getLevelName(levelIdentifier) }}
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
        this.packs = await fetchPacks() || [];

        this.loading = false;
    },

    methods: {

        findLevelIndex(identifier) {
            return this.list.findIndex(([level]) => {
                if (!level) {
                    return false;
                }

                return (
                    level.path === identifier ||
                    level.name === identifier
                );
            });
        },

        getLevelName(identifier) {
            const index = this.findLevelIndex(identifier);

            if (index === -1) {
                return identifier;
            }

            return this.list[index][0].name;
        },

        getLevelRank(identifier) {
            const index = this.findLevelIndex(identifier);

            return index === -1 ? "?" : index + 1;
        },

        openLevel(identifier) {
            const index = this.findLevelIndex(identifier);

            if (index === -1) {
                console.error(
                    `Level "${identifier}" could not be found in _list.json.`
                );

                return;
            }

            this.$router.push({
                path: "/",
                query: {
                    level: index
                }
            });
        }

    }
};

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
                            <h1>
                                {{ pack.name }}
                            </h1>

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

        getLevel(levelPath) {
            const result = this.list.find(
                ([level]) => level?.path === levelPath
            );

            return result ? result[0] : null;
        },

        getLevelName(levelPath) {
            const level = this.getLevel(levelPath);

            return level?.name || levelPath;
        },

        getLevelRank(levelPath) {
            const index = this.list.findIndex(
                ([level]) => level?.path === levelPath
            );

            return index === -1 ? "?" : index + 1;
        },

        openLevel(levelPath) {
            const index = this.list.findIndex(
                ([level]) => level?.path === levelPath
            );

            if (index !== -1) {
                window.location.hash = `#/${index + 1}`;
            }
        }

    }
};

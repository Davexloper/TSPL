import {
    fetchPacks
} from '../content.js';

import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },


    template: `

        <!-- LOADING -->

        <main
            v-if="loading"
            class="page-packs"
        >
            <Spinner></Spinner>
        </main>


        <!-- PACKS -->

        <main
            v-else
            class="page-packs"
        >

            <div class="packs-page">

                <!-- =========================================
                     BRONZE
                     ========================================= -->

                <section class="difficulty-section bronze">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Bronze Packs</h2>

                            <span>
                                {{ getPacks('Bronze').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Bronze')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#cd7f32'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     SILVER
                     ========================================= -->

                <section class="difficulty-section silver">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Silver Packs</h2>

                            <span>
                                {{ getPacks('Silver').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Silver')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#c0c0c0'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     IRON
                     ========================================= -->

                <section class="difficulty-section iron">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Iron Packs</h2>

                            <span>
                                {{ getPacks('Iron').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Iron')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#707070'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     GOLD
                     ========================================= -->

                <section class="difficulty-section gold">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Gold Packs</h2>

                            <span>
                                {{ getPacks('Gold').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Gold')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#ffd700'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     DIAMOND
                     ========================================= -->

                <section class="difficulty-section diamond">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Diamond Packs</h2>

                            <span>
                                {{ getPacks('Diamond').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Diamond')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#4ddcff'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     RUBY
                     ========================================= -->

                <section class="difficulty-section ruby">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Ruby Packs</h2>

                            <span>
                                {{ getPacks('Ruby').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Ruby')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#e0115f'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>


                <!-- =========================================
                     PLATINUM
                     ========================================= -->

                <section class="difficulty-section platinum">

                    <div class="difficulty-header">
                        <div class="difficulty-icon">
                            ◆
                        </div>

                        <div>
                            <h2>Platinum Packs</h2>

                            <span>
                                {{ getPacks('Platinum').length }} Packs
                            </span>
                        </div>
                    </div>


                    <div class="difficulty-list">

                        <button
                            v-for="pack in getPacks('Platinum')"
                            :key="pack.id"
                            class="pack-card"
                            :style="{
                                '--pack-color':
                                    pack.color || '#b9a7ff'
                            }"
                            @click="openPack(pack)"
                        >

                            <span class="pack-color"></span>

                            <span class="pack-content">

                                <span class="pack-name">
                                    {{ pack.name }}
                                </span>

                                <span class="pack-level-count">
                                    {{ pack.levels.length }} Levels
                                </span>

                            </span>

                            <span class="pack-arrow">
                                →
                            </span>

                        </button>

                    </div>

                </section>

            </div>

        </main>
    `,


    // =============================================
    // DATA
    // =============================================

    data: () => ({

        packs: [],

        loading: true

    }),


    // =============================================
    // LOAD
    // =============================================

    async mounted() {

        this.packs =
            await fetchPacks() || [];

        this.loading = false;

    },


    // =============================================
    // METHODS
    // =============================================

    methods: {

        getPacks(difficulty) {

            return this.packs.filter(
                pack =>
                    String(pack.difficulty || '')
                        .toLowerCase()
                    ===
                    difficulty.toLowerCase()
            );

        },


        openPack(pack) {

            this.$router.push({

                path: '/',

                query: {

                    level:
                        pack.levels?.[0] || ''

                }

            });

        }

    }

};

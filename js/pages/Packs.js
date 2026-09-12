import {
    fetchPacks,
    fetchList
} from '../content.js';

import Spinner from '../components/Spinner.js';


export default {

    components: {
        Spinner
    },


    template: `

        <!-- =====================================================
             LOADING
             ===================================================== -->

        <main
            v-if="loading"
            class="page-packs"
        >
            <Spinner></Spinner>
        </main>


        <!-- =====================================================
             PACKS
             ===================================================== -->

        <main
            v-else
            class="page-packs"
        >

            <div class="packs-layout">

                <!-- =================================================
                     LEFT SIDE - DIFFICULTY PACKS
                     ================================================= -->

                <section class="packs-sidebar">

                    <div class="packs-sidebar-header">

                        <div>
                            <h1>Packs</h1>

                            <p>
                                {{ packs.length }}
                                {{ packs.length === 1 ? 'Pack' : 'Packs' }}
                            </p>
                        </div>

                    </div>


                    <!-- =================================================
                         DIFFICULTY GRID
                         ================================================= -->

                    <div class="difficulty-grid">

                        <!-- ================= BRONZE ================= -->

                        <section class="difficulty-section bronze">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Bronze</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#cd7f32'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Bronze').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= SILVER ================= -->

                        <section class="difficulty-section silver">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Silver</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#c0c0c0'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Silver').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= IRON ================= -->

                        <section class="difficulty-section iron">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Iron</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#777777'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Iron').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= GOLD ================= -->

                        <section class="difficulty-section gold">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Gold</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#ffd700'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Gold').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= DIAMOND ================= -->

                        <section class="difficulty-section diamond">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Diamond</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#4ddcff'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Diamond').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= RUBY ================= -->

                        <section class="difficulty-section ruby">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Ruby</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#e0115f'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Ruby').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>


                        <!-- ================= PLATINUM ================= -->

                        <section class="difficulty-section platinum">

                            <div class="difficulty-header">

                                <div class="difficulty-icon">
                                    ◆
                                </div>

                                <div>
                                    <h2>Platinum</h2>

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
                                    :class="{
                                        active:
                                            selectedPack &&
                                            selectedPack.id === pack.id
                                    }"
                                    :style="{
                                        '--pack-color':
                                            pack.color || '#b9a7ff'
                                    }"
                                    @click="selectPack(pack)"
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


                                <div
                                    v-if="getPacks('Platinum').length === 0"
                                    class="difficulty-empty"
                                >
                                    No packs
                                </div>

                            </div>

                        </section>

                    </div>

                </section>


                <!-- =================================================
                     RIGHT SIDE - PACK DETAILS
                     ================================================= -->

                <section
                    v-if="selectedPack"
                    class="pack-detail"
                    :style="{
                        '--pack-color':
                            selectedPack.color || '#ffffff'
                    }"
                >

                    <!-- HEADER -->

                    <header class="pack-detail-header">

                        <div class="pack-detail-title">

                            <div class="pack-detail-dot"></div>

                            <div>

                                <h1>
                                    {{ selectedPack.name }}
                                </h1>

                                <p>
                                    {{ selectedPack.levels.length }}
                                    Levels
                                </p>

                            </div>

                        </div>


                        <div class="pack-detail-completion">

                            <strong>
                                {{ getCompletedPlayers(selectedPack).length }}
                            </strong>

                            <span>
                                completed
                            </span>

                        </div>

                    </header>


                    <!-- PROGRESS -->

                    <div class="pack-progress">

                        <div
                            class="pack-progress-fill"
                            :style="{
                                width:
                                    getPackProgress(selectedPack) + '%'
                            }"
                        ></div>

                    </div>


                    <!-- LEVELS -->

                    <section class="pack-level-section">

                        <div class="section-title">

                            <h2>
                                Levels
                            </h2>

                            <span>
                                {{ selectedPack.levels.length }}
                            </span>

                        </div>


                        <div class="pack-levels">

                            <button
                                v-for="(
                                    identifier,
                                    index
                                ) in selectedPack.levels"
                                :key="identifier"
                                class="pack-level"
                                @click="openLevel(identifier)"
                            >

                                <span class="pack-level-rank">
                                    #{{ index + 1 }}
                                </span>

                                <span class="pack-level-name">
                                    {{ getLevelName(identifier) }}
                                </span>

                                <span class="pack-level-arrow">
                                    →
                                </span>

                            </button>

                        </div>

                    </section>


                    <!-- VICTORS -->

                    <section class="pack-victors-section">

                        <div class="section-title">

                            <h2>
                                Victors
                            </h2>

                            <span>
                                {{ getCompletedPlayers(selectedPack).length }}
                            </span>

                        </div>


                        <div
                            v-if="
                                getCompletedPlayers(selectedPack).length > 0
                            "
                            class="pack-completed-players"
                        >

                            <div
                                v-for="
                                    player
                                    in getCompletedPlayers(selectedPack)
                                "
                                :key="player"
                                class="pack-completed-player"
                            >

                                <span class="victor-avatar">
                                    {{ player.charAt(0).toUpperCase() }}
                                </span>

                                <span class="victor-name">
                                    {{ player }}
                                </span>

                            </div>

                        </div>


                        <div
                            v-else
                            class="pack-no-victors"
                        >
                            <span>
                                No victors yet
                            </span>
                        </div>

                    </section>

                </section>


                <!-- EMPTY -->

                <section
                    v-else
                    class="pack-detail empty-detail"
                >

                    <h2>
                        Select a Pack
                    </h2>

                    <p>
                        Choose a pack from the list.
                    </p>

                </section>

            </div>

        </main>
    `,


    // =============================================================
    // DATA
    // =============================================================

    data: () => ({

        packs: [],

        list: [],

        selectedPack: null,

        loading: true

    }),


    // =============================================================
    // LOAD
    // =============================================================

    async mounted() {

        this.packs =
            await fetchPacks() || [];


        this.list =
            await fetchList() || [];


        /*
         * Select the first pack automatically.
         * Prefer Bronze if available.
         */

        const bronze =
            this.getPacks('Bronze');


        if (bronze.length > 0) {

            this.selectedPack =
                bronze[0];

        } else if (this.packs.length > 0) {

            this.selectedPack =
                this.packs[0];

        }


        this.loading =
            false;

    },


    // =============================================================
    // METHODS
    // =============================================================

    methods: {

        // =========================================================
        // GET PACKS BY DIFFICULTY
        // =========================================================

        getPacks(difficulty) {

            return this.packs.filter(
                pack =>
                    String(pack.difficulty || '')
                        .trim()
                        .toLowerCase()
                    ===
                    difficulty
                        .trim()
                        .toLowerCase()
            );

        },


        // =========================================================
        // SELECT PACK
        // =========================================================

        selectPack(pack) {

            this.selectedPack =
                pack;

        },


        // =========================================================
        // PACK PROGRESS
        // =========================================================

        getPackProgress(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels) ||
                pack.levels.length === 0
            ) {

                return 0;

            }


            const completed =
                this.getCompletedPlayers(pack).length;


            return Math.min(
                100,
                (completed / pack.levels.length) * 100
            );

        },


        // =========================================================
        // FIND LEVEL
        // =========================================================

        getLevel(identifier) {

            const search =
                String(identifier)
                    .trim()
                    .toLowerCase();


            for (
                const entry of this.list
            ) {

                const level =
                    entry?.[0];


                if (!level) {
                    continue;
                }


                // NAME

                if (
                    String(level.name)
                        .trim()
                        .toLowerCase()
                    === search
                ) {

                    return level;

                }


                // PATH

                if (
                    String(level.path)
                        .trim()
                        .toLowerCase()
                    === search
                ) {

                    return level;

                }


                // ID

                if (
                    String(level.id)
                        .trim()
                        .toLowerCase()
                    === search
                ) {

                    return level;

                }

            }


            console.error(
                'Could not find pack level:',
                identifier
            );


            return null;

        },


        // =========================================================
        // LEVEL NAME
        // =========================================================

        getLevelName(identifier) {

            const level =
                this.getLevel(identifier);


            return (
                level?.name ||
                identifier
            );

        },


        // =========================================================
        // OPEN LEVEL
        // =========================================================

        openLevel(identifier) {

            const level =
                this.getLevel(identifier);


            if (!level) {

                console.error(
                    `Pack level "${identifier}" could not be found.`
                );

                return;

            }


            this.$router.push({

                path: '/',

                query: {

                    level:
                        level.path

                }

            });

        },


        // =========================================================
        // GET COMPLETED PLAYERS
        // =========================================================

        getCompletedPlayers(pack) {

            if (
                !pack ||
                !Array.isArray(pack.levels) ||
                pack.levels.length === 0
            ) {

                return [];

            }


            const levels =
                pack.levels.map(
                    identifier =>
                        this.getLevel(identifier)
                );


            if (
                levels.some(
                    level => !level
                )
            ) {

                console.error(
                    'Pack contains a level that could not be found:',
                    pack.name
                );

                return [];

            }


            const completedPerLevel =
                levels.map(level => {

                    const players =
                        new Map();


                    // VERIFIER

                    if (
                        level.verifier
                    ) {

                        const verifier =
                            String(
                                level.verifier
                            ).trim();


                        if (
                            verifier.length > 0
                        ) {

                            players.set(
                                verifier.toLowerCase(),
                                verifier
                            );

                        }

                    }


                    // 100% RECORDS

                    for (
                        const record
                        of level.records || []
                    ) {

                        if (
                            Number(
                                record.percent
                            ) >= 100 &&
                            record.user
                        ) {

                            const username =
                                String(
                                    record.user
                                ).trim();


                            if (
                                username.length > 0
                            ) {

                                players.set(
                                    username.toLowerCase(),
                                    username
                                );

                            }

                        }

                    }


                    return players;

                });


            const candidates =
                new Map(
                    completedPerLevel[0]
                );


            for (
                let i = 1;
                i < completedPerLevel.length;
                i++
            ) {

                const completed =
                    completedPerLevel[i];


                for (
                    const username
                    of candidates.keys()
                ) {

                    if (
                        !completed.has(username)
                    ) {

                        candidates.delete(
                            username
                        );

                    }

                }


                if (
                    candidates.size === 0
                ) {

                    return [];

                }

            }


            return Array.from(
                candidates.values()
            ).sort(
                (a, b) =>
                    a.localeCompare(
                        b,
                        undefined,
                        {
                            sensitivity: 'base'
                        }
                    )
            );

        }

    }

};

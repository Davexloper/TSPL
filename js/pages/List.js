import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";

import {
    fetchEditors,
    fetchList,
    fetchLevelPacks,
    findLevel
} from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";


const roleIconMap = {

    owner: "crown",

    admin: "user-gear",

    helper: "user-shield",

    dev: "code",

    trial: "user-lock",

};


export default {

    components: {

        Spinner,

        LevelAuthors

    },


    template: `

        <main v-if="loading">

            <Spinner></Spinner>

        </main>


        <main
            v-else
            class="page-list"
        >


            <!-- =================================================
                 LEVEL LIST
                 ================================================= -->

            <div class="list-container">

                <table
                    class="list"
                    v-if="list"
                >

                    <tr
                        v-for="([level, err], i) in list"
                        :key="i"
                    >

                        <td class="rank">

                            <p
                                v-if="i + 1 <= 150"
                                class="type-label-lg"
                            >
                                #{{ i + 1 }}
                            </p>

                            <p
                                v-else
                                class="type-label-lg"
                            >
                                Legacy
                            </p>

                        </td>


                        <td
                            class="level"
                            :class="{
                                active: selected === i,
                                error: !level
                            }"
                        >

                            <button
                                @click="selectLevel(i)"
                            >

                                <span class="type-label-lg">
                                    {{
                                        level?.name ||
                                        \`Error (\${err}.json)\`
                                    }}
                                </span>

                            </button>

                        </td>

                    </tr>

                </table>

            </div>


            <!-- =================================================
                 LEVEL INFORMATION
                 ================================================= -->

            <div class="level-container">

                <div
                    class="level"
                    v-if="level"
                >


                    <h1>
                        {{ level.name }}
                    </h1>


                    <!-- =================================================
                         PACKS
                         ================================================= -->

                    <div
                        v-if="currentPacks.length"
                        class="level-packs"
                    >

                        <div
                            v-for="pack in currentPacks"
                            :key="pack.id"
                            class="level-pack-panel"
                            :style="{
                                '--pack-color': pack.color
                            }"
                        >

                            <div class="level-pack-header">

                                <div class="level-pack-title">

                                    <span
                                        class="level-pack-color"
                                        :style="{
                                            backgroundColor: pack.color
                                        }"
                                    ></span>

                                    <h3>
                                        {{ pack.name }}
                                    </h3>

                                </div>


                                <span
                                    class="level-pack-progress"
                                >
                                    {{ pack.levels.length }} Levels
                                </span>

                            </div>


                            <div class="level-pack-levels">

                                <div
                                    v-for="(
                                        identifier,
                                        packIndex
                                    ) in pack.levels"
                                    :key="identifier"
                                    class="level-pack-level"
                                    :class="{
                                        current:
                                            isPackLevel(
                                                identifier
                                            )
                                    }"
                                    @click="
                                        openPackLevel(
                                            identifier
                                        )
                                    "
                                >

                                    <span
                                        class="level-pack-status"
                                        :class="{
                                            current:
                                                isPackLevel(
                                                    identifier
                                                )
                                        }"
                                    >
                                        {{ packIndex + 1 }}
                                    </span>


                                    <span
                                        class="level-pack-level-name"
                                    >
                                        {{ getPackLevelName(identifier) }}
                                    </span>

                                </div>

                            </div>


                            <!-- COMPLETED PLAYERS -->

                            <div
                                v-if="
                                    getPackCompletedPlayers(
                                        pack
                                    ).length
                                "
                                class="level-pack-players"
                            >

                                <h4>
                                    Completed by
                                </h4>


                                <div
                                    v-for="player in getPackCompletedPlayers(pack)"
                                    :key="player"
                                    class="level-pack-player"
                                >

                                    <span
                                        class="level-pack-player-name"
                                    >
                                        {{ player }}
                                    </span>

                                    <span
                                        class="level-pack-player-count"
                                    >
                                        100%
                                    </span>

                                </div>

                            </div>


                            <div
                                v-else
                                class="level-pack-players"
                            >

                                <h4>
                                    Completed by
                                </h4>

                                <p>
                                    Nobody yet.
                                </p>

                            </div>

                        </div>

                    </div>


                    <!-- =================================================
                         AUTHORS
                         ================================================= -->

                    <LevelAuthors
                        :author="level.author"
                        :creators="level.creators"
                        :verifier="level.verifier"
                    ></LevelAuthors>


                    <!-- =================================================
                         VIDEO
                         ================================================= -->

                    <iframe
                        class="video"
                        id="videoframe"
                        :src="video"
                        frameborder="0"
                    ></iframe>


                    <!-- =================================================
                         STATS
                         ================================================= -->

                    <ul class="stats">

                        <li>

                            <div class="type-title-sm">
                                Points when completed
                            </div>

                            <p>
                                {{ listScore(selected + 1) }}
                            </p>

                        </li>


                        <li>

                            <div class="type-title-sm">
                                ID
                            </div>

                            <p>
                                {{ level.id }}
                            </p>

                        </li>


                        <li>

                            <div class="type-title-sm">
                                Password
                            </div>

                            <p>
                                {{ level.password || 'Free to Copy' }}
                            </p>

                        </li>

                    </ul>


                    <!-- =================================================
                         RECORDS
                         ================================================= -->

                    <h2>
                        Records
                    </h2>


                    <p v-if="selected + 1 <= 75">

                        <strong>
                            {{ level.percentToQualify }}%
                        </strong>

                        or better to qualify

                    </p>


                    <p v-else-if="selected + 1 <= 150">

                        <strong>
                            100%
                        </strong>

                        or better to qualify

                    </p>


                    <p v-else>

                        This level does not accept new records.

                    </p>


                    <table class="records">

                        <tr
                            v-for="record in level.records"
                            :key="
                                record.user +
                                record.percent
                            "
                            class="record"
                        >

                            <td class="percent">

                                <p>
                                    {{ record.percent }}%
                                </p>

                            </td>


                            <td class="user">

                                <a
                                    :href="record.link"
                                    target="_blank"
                                    class="type-label-lg"
                                >
                                    {{ record.user }}
                                </a>

                            </td>


                            <td class="mobile">

                                <img
                                    v-if="record.mobile"
                                    :src="
                                        \`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`
                                    "
                                    alt="Mobile"
                                >

                            </td>


                            <td class="hz">

                                <p>
                                    {{ record.hz }}Hz
                                </p>

                            </td>

                        </tr>

                    </table>

                </div>


                <!-- =================================================
                     NO LEVEL
                     ================================================= -->

                <div
                    v-else
                    class="level"
                    style="
                        height: 100%;
                        justify-content: center;
                        align-items: center;
                    "
                >

                    <p>
                        (ノಠ益ಠ)ノ彡┻━┻
                    </p>

                </div>

            </div>


            <!-- =================================================
                 META
                 ================================================= -->

           <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md"></a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Submission Requirements</h3>
                    <p>
                        Achieved the record without using hacks (however, FPS bypass is allowed, up to 240 FPS [CBF too])
                    </p>
                    <p>
                        Achieved the record on the level that is listed on the site - please check the level ID before you submit a record
                    </p>
                    <p>
                        Have either source audio or clicks/taps in the Raw Footage (You don't need it in the Record): Edited audio only does not count.
                    </p>
                    <p>
                        The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt. Everyplay records are exempt from this
                    </p>
                    <p>
                        The recording must also show the player hit the endwall, or the completion will be invalidated.
                    </p>
                    <p>
                        Do not use secret routes or bug routes
                    </p>
                    <p>
                        Do not use easy modes, only a record of the unmodified level qualifies
                    </p>
                    <p>
                        Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level
                    </p>
                </div>
            </div>
        </main>
    `,


    data: () => ({

        list: [],

        editors: [],

        levelPacks: {},

        loading: true,

        selected: 0,

        errors: [],

        roleIconMap,

        store,

    }),


    computed: {

        level() {

            return this.list?.[this.selected]?.[0];

        },


        currentPacks() {

            if (!this.level) {
                return [];
            }


            const result = [];


            const possibleKeys = [

                String(this.level.name)
                    .toLowerCase(),

                String(this.level.path)
                    .toLowerCase(),

                String(this.level.id)
                    .toLowerCase(),

            ];


            for (
                const key
                of possibleKeys
            ) {

                if (
                    this.levelPacks[key]
                ) {

                    for (
                        const pack
                        of this.levelPacks[key]
                    ) {

                        if (
                            !result.some(
                                p =>
                                    p.id ===
                                    pack.id
                            )
                        ) {

                            result.push(pack);

                        }
                    }
                }
            }


            return result;
        },


        video() {

            if (!this.level) {
                return '';
            }


            if (!this.level.showcase) {

                return embed(
                    this.level.verification
                );
            }


            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },

    },


    async mounted() {

        this.list =
            await fetchList();


        this.editors =
            await fetchEditors();


        this.levelPacks =
            await fetchLevelPacks();


        if (!this.list) {

            this.errors = [

                'Failed to load list. Retry in a few minutes or notify list staff.',

            ];

        } else {

            this.errors.push(
                ...this.list
                    .filter(
                        ([_, err]) =>
                            err
                    )
                    .map(
                        ([_, err]) =>
                            `Failed to load level. (${err}.json)`
                    )
            );


            if (!this.editors) {

                this.errors.push(
                    'Failed to load list editors.'
                );

            }


            /*
             * Open level from URL query.
             *
             * Example:
             *
             * #/?level=Bloodbath
             */

            const requestedLevel =
                this.$route?.query?.level;


            if (requestedLevel) {

                const index =
                    findLevel(
                        this.list,
                        requestedLevel
                    );


                if (index !== -1) {

                    this.selected =
                        index;

                }
            }

        }


        this.loading = false;
    },


    methods: {

        embed,


        /* =====================================================
           SELECT LEVEL
           ===================================================== */

        selectLevel(index) {

            this.selected =
                index;


            const level =
                this.list[index]?.[0];


            if (
                level &&
                this.$route
            ) {

                this.$router.replace({

                    path: '/',

                    query: {
                        level:
                            level.path ||
                            level.name
                    }

                });

            }
        },


        /* =====================================================
           OPEN PACK LEVEL
           ===================================================== */

        openPackLevel(identifier) {

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (index === -1) {

                console.error(
                    `Could not find pack level: ${identifier}`
                );

                return;
            }


            const level =
                this.list[index]?.[0];


            if (!level) {
                return;
            }


            this.selected =
                index;


            if (this.$router) {

                this.$router.replace({

                    path: '/',

                    query: {

                        level:
                            level.path ||
                            level.name

                    }

                });

            }

        },


        /* =====================================================
           GET PACK LEVEL NAME
           ===================================================== */

        getPackLevelName(identifier) {

            const index =
                findLevel(
                    this.list,
                    identifier
                );


            if (index === -1) {

                return identifier;

            }


            return (
                this.list[index][0]?.name ||
                identifier
            );
        },


        /* =====================================================
           CURRENT LEVEL
           ===================================================== */

        isPackLevel(identifier) {

            if (!this.level) {
                return false;
            }


            const found =
                findLevel(
                    this.list,
                    identifier
                );


            if (found === -1) {
                return false;
            }


            return (
                found ===
                this.selected
            );
        },


        /* =====================================================
           COMPLETED PACK PLAYERS
           ===================================================== */

        getPackCompletedPlayers(pack) {

            const players = [];


            /*
             * A player completed a pack if
             * they have 100% on every level.
             */

            for (
                const [level]
                of this.list
            ) {

                if (!level) {
                    continue;
                }


                const isInPack =
                    pack.levels.some(
                        identifier => {

                            const search =
                                String(
                                    identifier
                                ).toLowerCase();

                            return (
                                String(
                                    level.name
                                ).toLowerCase() ===
                                search ||

                                String(
                                    level.path
                                ).toLowerCase() ===
                                search ||

                                String(
                                    level.id
                                ).toLowerCase() ===
                                search
                            );

                        }
                    );


                if (!isInPack) {
                    continue;
                }


                for (
                    const record
                    of level.records || []
                ) {

                    if (
                        record.percent ===
                        100 &&
                        record.user
                    ) {

                        if (
                            !players.includes(
                                record.user
                            )
                        ) {

                            players.push(
                                record.user
                            );
                        }

                    }

                }

            }


            /*
             * Keep only players who have
             * completed EVERY pack level.
             */

            return players.filter(
                username => {

                    return pack.levels.every(
                        identifier => {

                            const index =
                                findLevel(
                                    this.list,
                                    identifier
                                );


                            if (
                                index === -1
                            ) {
                                return false;
                            }


                            const level =
                                this.list[index][0];


                            return (
                                level.records ||
                                []
                            ).some(
                                record =>
                                    record.user &&
                                    record.user.toLowerCase() ===
                                    username.toLowerCase() &&
                                    record.percent ===
                                    100
                            );

                        }
                    );

                }
            );
        },


        /* =====================================================
           SCORE
           ===================================================== */

        listScore(rank) {

            const totalLevels =
                this.list.length;


            if (
                totalLevels <= 1
            ) {

                return 250;

            }


            const points =
                250 -
                (rank - 1) *
                (249 /
                    (totalLevels - 1));


            return Math.max(
                1,
                Math.round(points)
            );
        },


        score,

    },

};

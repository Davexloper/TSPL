import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import {
    fetchList,
    fetchLevelPacks,
    findLevel
} from "../content.js";
import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

export default {
    components:{ Spinner, LevelAuthors },

    template:`
        <main v-if="loading">
            <Spinner/>
        </main>

        <main v-else class="page-list">

            <div class="list-container">

                <div class="level-search">
                    <input
                        v-model="levelSearch"
                        type="text"
                        placeholder="Search levels..."
                    >
                </div>

                <table class="list" v-if="filteredLevels.length">
                    <tr
                        v-for="item in filteredLevels"
                        :key="item.index"
                    >
                        <td class="rank">
                            <p>
                                {{ item.index+1<=150
                                    ? "#"+(item.index+1)
                                    : "Legacy"
                                }}
                            </p>
                        </td>

                        <td
                            class="level"
                            :class="{
                                active:selected===item.index,
                                error:!item.level
                            }"
                        >
                            <button @click="selectLevel(item.index)">
                                {{ item.level?.name || `Error (${item.err}.json)` }}
                            </button>
                        </td>
                    </tr>
                </table>

                <div
                    v-else
                    class="level-search-empty"
                >
                    No levels found.
                </div>

            </div>

            <div class="level-container">
                <div class="level" v-if="level">

                    <h1>{{ level.name }}</h1>

                    <div v-if="currentPacks.length" class="level-packs">
                        <div
                            v-for="pack in currentPacks"
                            :key="pack.id"
                            class="level-pack-panel"
                            :style="{'--pack-color':pack.color}"
                        >
                            <div class="level-pack-header">
                                <div class="level-pack-title">
                                    <span
                                        class="level-pack-color"
                                        :style="{backgroundColor:pack.color}"
                                    ></span>
                                    <h3>{{ pack.name }}</h3>
                                </div>

                                <span class="level-pack-progress">
                                    {{ pack.levels.length }} Levels
                                </span>
                            </div>

                            <div class="level-pack-levels">
                                <div
                                    v-for="(identifier,index) in pack.levels"
                                    :key="identifier"
                                    class="level-pack-level"
                                    :class="{current:isPackLevel(identifier)}"
                                    @click="openPackLevel(identifier)"
                                >
                                    <span>{{ index+1 }}</span>
                                    <span>{{ getPackLevelName(identifier) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <LevelAuthors
                        :author="level.author"
                        :creators="level.creators"
                        :verifier="level.verifier"
                    />

                    <iframe
                        class="video"
                        :src="video"
                        frameborder="0"
                    ></iframe>

                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points</div>
                            <p>{{ listScore(selected+1) }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>

                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || "Free to Copy" }}</p>
                        </li>
                    </ul>

                </div>

                <div
                    v-else
                    class="level"
                    style="height:100%;justify-content:center;align-items:center"
                >
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>

            <div class="meta-container">
                <div class="meta">

                    <div class="records-header">
                        <h2>Records ({{ filteredRecords.length }})</h2>
                    </div>

                    <div class="record-search">
                        <input
                            v-model="recordSearch"
                            type="text"
                            placeholder="Search"
                        >
                    </div>

                    <div class="record-list">
                        <div
                            v-for="record in filteredRecords"
                            :key="record.user + record.percent"
                            class="record"
                        >

                            <div class="record-avatar">
                                {{ String(record.user || "?").charAt(0).toUpperCase() }}
                            </div>

                            <div class="record-info">
                                <a
                                    class="record-user"
                                    :href="record.link"
                                    target="_blank"
                                >
                                    {{ record.user }}
                                </a>

                                <span class="record-date">
                                    {{ record.date || record.percent + "%" }}
                                </span>
                            </div>

                            <a
                                v-if="record.video || record.youtube"
                                class="record-video"
                                :href="record.video || record.youtube"
                                target="_blank"
                            >
                                ▶
                            </a>

                            <div v-else></div>
                        </div>

                        <p
                            v-if="!filteredRecords.length"
                            class="record-empty"
                        >
                            No records found.
                        </p>
                    </div>

                </div>
            </div>

        </main>
    `,

    data:() => ({
        list:[],
        levelPacks:{},
        loading:true,
        selected:0,
        errors:[],
        levelSearch:"",
        recordSearch:"",
        store
    }),

    computed:{
        level(){
            return this.list?.[this.selected]?.[0];
        },

        filteredLevels(){
            const q=this.levelSearch.trim().toLowerCase();

            return this.list
                .map(([level,err],index)=>({
                    level,
                    err,
                    index
                }))
                .filter(item=>{
                    if(!q)return true;

                    return String(item.level?.name||"")
                        .toLowerCase()
                        .includes(q);
                });
        },

        currentPacks(){
            if(!this.level)return [];

            const keys=[
                String(this.level.name).toLowerCase(),
                String(this.level.path).toLowerCase(),
                String(this.level.id).toLowerCase()
            ];

            return keys.flatMap(k=>this.levelPacks[k]||[])
                .filter((p,i,a)=>
                    a.findIndex(x=>x.id===p.id)===i
                );
        },

        video(){
            if(!this.level)return "";

            return embed(
                this.level.showcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },

        filteredRecords(){
            const records=this.level?.records||[];
            const q=this.recordSearch.trim().toLowerCase();

            return q
                ? records.filter(r=>
                    String(r.user||"")
                        .toLowerCase()
                        .includes(q)
                )
                : records;
        }
    },

    async mounted(){
        this.list=await fetchList();
        this.levelPacks=await fetchLevelPacks();

        if(!this.list){
            this.errors=[
                "Failed to load list. Retry in a few minutes or notify list staff."
            ];
        }else{
            this.errors.push(
                ...this.list
                    .filter(([_,err])=>err)
                    .map(([_,err])=>
                        `Failed to load level. (${err}.json)`
                    )
            );

            const requested=this.$route?.query?.level;

            if(requested){
                const index=findLevel(this.list,requested);

                if(index!==-1)
                    this.selected=index;
            }
        }

        this.loading=false;
    },

    methods:{
        embed,

        selectLevel(index){
            this.selected=index;

            const level=this.list[index]?.[0];

            if(level&&this.$route){
                this.$router.replace({
                    path:"/",
                    query:{
                        level:level.path||level.name
                    }
                });
            }

            this.recordSearch="";
        },

        openPackLevel(identifier){
            const index=findLevel(this.list,identifier);

            if(index===-1)return;

            this.selectLevel(index);
        },

        getPackLevelName(identifier){
            const index=findLevel(this.list,identifier);

            return index===-1
                ? identifier
                : this.list[index][0]?.name||identifier;
        },

        isPackLevel(identifier){
            if(!this.level)return false;

            return findLevel(this.list,identifier)===this.selected;
        },

        listScore(rank){
            const total=this.list.length;

            if(total<=1)return 250;

            return Math.max(
                1,
                Math.round(
                    250-(rank-1)*(249/(total-1))
                )
            );
        },

        score
    }
};

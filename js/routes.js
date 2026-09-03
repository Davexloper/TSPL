import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Packs from './pages/Packs.js';
import Profile from './pages/Profile.js';


export default [

    {
        path: '/',
        component: List
    },

    {
        path: '/leaderboard',
        component: Leaderboard
    },

    {
        path: '/profile/:username',
        component: Profile
    },

    {
        path: '/roulette',
        component: Roulette
    },

    {
        path: '/packs',
        component: Packs
    },

];

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';
import subscriptionComponent from "../components/subscription-lock.js";

createApp({
    data() {
        return {
            message: 'History page',
            flaggedIncidents: [],
            helpedIncidents: [],
            flaggedIncidentsReady: false,
            helpedIncidentsReady: false,
        };
    },
    methods: {
        async dataFromIncidents(){
            const userId = localStorage.getItem("userId");
            this.flaggedIncidents = await getAllIncidentsFromUser(userId);
        },
        async dataFromIncidentHelped(){
            const userId = localStorage.getItem("userId");
            this.helpedIncidents = await getAllHelpedIncidentsFromUser(userId);
        },
    },
    async mounted() {
        await this.dataFromIncidentHelped();
        this.helpedIncidentsReady = true;
        await this.dataFromIncidents();
        this.flaggedIncidentsReady = true;
    },
    components: {
        headerComponent,
        navComponent,
        subscriptionComponent
    }
}).mount('#app');

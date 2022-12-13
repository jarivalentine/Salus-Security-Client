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
        async filterByTypeFlagged(event){
            if (event.target.value === "None"){
                await this.dataFromIncidents();
                return;
            }
            const userId = localStorage.getItem("userId");
            const allUserIncidents = await getAllIncidentsFromUser(userId);
            this.flaggedIncidents = allUserIncidents.filter(incident => incident.type === event.target.value);
        },
        async filterByTypeHelped(event){
            if (event.target.value === "None"){
                await this.dataFromIncidentHelped();
                return;
            }
            const userId = localStorage.getItem("userId");
            const allUserIncidents = await getAllHelpedIncidentsFromUser(userId);
            this.helpedIncidents = allUserIncidents.filter(incident => incident.type === event.target.value);
        },
    },
    async mounted() {
        await applyOrRemoveLockedMechanism('div.history');
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

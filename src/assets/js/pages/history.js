const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'History page',
            flaggedIncidents: [],
            helpedIncidents: [],
            causedIncidents: [],
            flaggedIncidentsReady: false,
            helpedIncidentsReady: false,
            causedIncidentsReady: false,
        };
    },
    methods: {
        async dataFromIncidents(){
            console.log(await getAllIncidentsFromUser(localStorage.getItem("userId")));
        },
        async dataFromIncidentHelped(){

        },
        async dataFromIncidentsCaused(){

        },
    },
    async mounted() {
        await this.dataFromIncidents();
        this.flaggedIncidentsReady = true;
        await this.dataFromIncidentHelped();
        this.helpedIncidentsReady = true;
        await this.dataFromIncidentsCaused();
        this.causedIncidentsReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Flag page',
            incident: localStorage.getItem("incident"),
            incidentType: "No type",
            incidentLabels: [],
            incidentBystanders: [],
            incidentAggressors: [],
            extraInformation: [],
            incidentDatetime: null,
            incidentValidated: null,
            informationReady: false,
        };
    },
    methods: {
        async displayItems(){
            if (this.incident === null) return;
            this.incident = JSON.parse(this.incident);
            this.incidentType = this.incident["type"];
            this.incidentLabels = this.incident["labels"];
            const bystanders = await getAllBystandersFromIncident(this.incident["id"]);
            const aggressors = await getAllAggressorsFromIncident(this.incident["id"]);
            console.log(this.incident);
            this.incidentBystanders = this.presentUsers(bystanders);
            this.incidentAggressors = this.presentUsers(aggressors);

            if (this.incident["validated"]){
                this.incidentValidated = "This incident is deemed valid by the Salus Security AI";
            } else {
                this.incidentValidated = "This incident is deemed invalid by the Salus Security AI";
            }
            this.incidentDatetime = this.displayDate(this.incident["datetime"]);
        },
        displayDate(date){
            const year = new Date(date).getFullYear();
            const month = new Date(date).getMonth();
            const day = new Date(date).getDay();
            const hours = new Date(date).getHours();
            const minutes = new Date(date).getMinutes();
            const seconds = new Date(date).getSeconds();
            return `${day}/${month}/${year} on ${hours}:${minutes}:${seconds}`;
        },
        presentUsers(users){
            const listOfUsers = [];
            users.map(index => {
               listOfUsers.push(`${index.firstname} ${index.lastname} (${index.id})`);
            });
            return listOfUsers;
        },
    },
    async mounted() {
        await this.displayItems();
        this.informationReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

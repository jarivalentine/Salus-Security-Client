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
            console.log(this.incident["id"]);
            this.incidentBystanders = this.presentUsers(bystanders);
            this.incidentAggressors = this.presentUsers(aggressors);
        },
        presentUsers(users){
            const listOfUsers = [];
            users.map(index => {
               listOfUsers.push(`${index.firstname} ${index.lastname} (id: ${index.id})`);
            });
            return listOfUsers;
        },
        addExtraInformation(){

        }
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

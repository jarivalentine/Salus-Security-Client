const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';
import subscriptionLock from "../components/subscription-lock.js";


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
            incidentFinished: false,
        };
    },
    methods: {
        async displayItems(){
            if (this.incident === null) {
                return;
            }
            this.incident = JSON.parse(this.incident);
            this.incidentType = this.incident["type"];
            this.incidentLabels = this.incident["labels"];
            const bystanders = await getAllBystandersFromIncident(this.incident["id"]);
            const aggressors = await getAllAggressorsFromIncident(this.incident["id"]);
            this.incidentBystanders = this.presentUsers(bystanders);
            this.incidentAggressors = this.presentUsers(aggressors);

            if (this.incident["validated"]){
                this.incidentValidated = "This incident is deemed valid by the Salus Security AI";
            } else {
                this.incidentValidated = "This incident is deemed invalid by the Salus Security AI";
            }
            this.incidentDatetime = `${new Date(this.incident["datetime"]).toLocaleDateString()} at ${new Date(this.incident["datetime"]).toLocaleTimeString()}`;
        },
        presentUsers(users){
            const listOfUsers = [];
            users.map(index => {
               listOfUsers.push(`${index.firstname} ${index.lastname} (${index.id})`);
            });
            return listOfUsers;
        },

        async finishRecording(){
            const incidentId = JSON.parse(localStorage.getItem("incident")).id;
            const incident = await getIncident(incidentId);
            if (incident.state !== "ACTIVE") {
                return;
            }
            await validateIncident(incidentId);
            this.incidentFinished = true;
            window.location.href = 'index.html';
        }
    },
    async mounted() {
        await this.displayItems();
        this.informationReady = true;
    },
    components: {
        headerComponent,
        navComponent,
        subscriptionLock
    }
}).mount('#app');

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Charts page',
            lat: "",
            long: ""
        };
    },
    methods: {
        async allIncidentsThisYear(){
            const allIncidents = await getAllIncidents();

            const incidentsCurrentYear = allIncidents.filter(index => {
                return new Date().getFullYear() === new Date(index.datetime).getFullYear();
            });
            console.log(incidentsCurrentYear);

            await this.percentageOfBystanders();
        },

        async percentageOfBystanders(){
            const allIncidents = await getAllIncidents();
            const incidentsWithBystanders = [];
            const total = allIncidents.length;
            let amount = 0;

            for (let i = 1; i <= allIncidents.length; i++) {
                incidentsWithBystanders.push({"incident": await getAllBystandersFromIncident(i)});
            }

            incidentsWithBystanders.map(index => {
                if (index.incident.length !== 0) amount += 1;
            });

            const fraction = parseInt((amount/total).toFixed(2));
            console.log(fraction);
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

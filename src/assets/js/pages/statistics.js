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
            this.$refs.totalIncidents.innerHTML = incidentsCurrentYear.length;

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

            const fraction = parseFloat((amount/total).toFixed(2))*100;
            this.displayPieChartBystanders(fraction);
        },
        displayPieChartBystanders(fraction){
            const ctx = document.querySelector("#pie-chart-bystanders").getContext('2d');
            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: ['bystanders', 'no bystanders'],
                    datasets: [{
                        label: 'Percentage',
                        data: [fraction, 100],
                        backgroundColor: ["Lightgrey", "Darkgrey"],
                    }]
                },
            });
        },
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

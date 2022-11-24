"use strict";

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Charts page',
            incidentsReady: false,
            pieReady: false,
            barTypesReady: false,
            barBystandersReady: false,
        };
    },
    methods: {
        async allIncidentsThisYear(){
            const allIncidents = await getAllIncidents();

            const incidentsCurrentYear = allIncidents.filter(index => {
                return new Date().getFullYear() === new Date(index.datetime).getFullYear();
            });

            this.$refs.totalIncidents.innerHTML = incidentsCurrentYear.length;
        },

        async percentageOfBystanders(){
            const allIncidents = await getAllIncidents();
            const incidentsWithBystanders = [];
            const total = allIncidents.length;
            let amount = 0;

            for (let i = 1; i <= allIncidents.length; i++) {
                incidentsWithBystanders.push({"incident": await getAllBystandersFromIncident(i)});
            }

            incidentsWithBystanders.forEach(index => {
                if (index.incident.length !== 0) {
                    amount += 1;
                }
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
                        data: [fraction, 100-fraction],
                        backgroundColor: ["Lightgrey", "Darkgrey"],
                    }]
                },
            });
        },

        async frequencyOfTypes(){
            const allIncidents = await getAllIncidents();
            const countedTypes = {};
            allIncidents.map(index => {
                countedTypes[index.type] = (countedTypes[index.type] || 0) + 1 ;
            });
            this.displayBarChartTypes(Object.keys(countedTypes), Object.values(countedTypes));
        },

        displayBarChartTypes(types, amount){
            const ctx = document.querySelector("#bar-chart-types").getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: types,
                    datasets: [{
                        label: 'Amount: ',
                        data: amount,
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                },
            });
        },
        async bestBystanders(){
            const amountOfHelpedIncidents = [];
            const userIds = [];
            const listOfBystanders = [];
            const users = await getAllUsers();
            users.map(index => userIds.push(index.id));
            for (const user of userIds) {
                const helpedIncidents = await getAllHelpedIncidentsFromUser(user);
                amountOfHelpedIncidents.push(helpedIncidents.length);
                listOfBystanders.push(user);
            }
            this.displayBarChartBystanders(listOfBystanders, amountOfHelpedIncidents);
        },

        displayBarChartBystanders(listOfBystanders, amountOfHelpedIncidents) {
            const ctx = document.querySelector("#bar-chart-bystanders").getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: listOfBystanders,
                    datasets: [{
                        label: 'Amount: ',
                        data: amountOfHelpedIncidents,
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                },
            });
        }
    },
    async mounted() {
        await this.allIncidentsThisYear();
        this.incidentsReady = true;
        await this.percentageOfBystanders();
        this.pieReady = true;
        await this.frequencyOfTypes();
        this.barTypesReady = true;
        await this.bestBystanders();
        this.barBystandersReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

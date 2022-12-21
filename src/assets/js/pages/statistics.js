"use strict";

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';
import subscriptionComponent from '../components/subscription-lock.js';

createApp({
    data() {
        return {
            message: 'Charts page',
            pieReady: false,
            barTypesReady: false,
            barBystandersReady: false,
            doughnutValidationReady: false,
            allIncidentsLength: null,
        };
    },
    methods: {
        async frequencyOfTypes(){
            this.displayNoneLoadingStats();

            const allIncidents = await getAllIncidents();
            const countedTypes = {};
            allIncidents.map(index => {
                countedTypes[index.type] = (countedTypes[index.type] || 0) + 1 ;
            });
            this.displayBarChartTypes(Object.keys(countedTypes), Object.values(countedTypes));
            this.allIncidentsLength = allIncidents.length;
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
                        borderWidth: 2,
                        backgroundColor: '#5B37DB'
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
        async percentageOfBystanders(){
            this.displayNoneLoadingStats();

            const allIncidents = await getAllIncidents();
            const incidentsWithBystanders = [];
            const total = allIncidents.length;
            let amount = 0;
            for (let i = 0; i < total; i++) {
                incidentsWithBystanders.push({"incident": await getAllBystandersFromIncident(allIncidents[i].id)});
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
                        backgroundColor: ["#5B37DB", "#a599d0"],
                    }]
                },
            });
        },
        async bestBystanders(){
            this.displayNoneLoadingStats();
            let dataObject = {};
            const amountOfHelpedIncidents = [];
            const usersInOrder = [];
            const users = await getAllUsers();
            for (const user of users) {
                const helpedIncidents = await getAllHelpedIncidentsFromUser(user.id);
                dataObject[(`${user.firstname} ${user.lastname}`)] = helpedIncidents.length;
            }

            dataObject = this.sortObjectByValue(dataObject);

            for (const key in dataObject) {
                if (dataObject.hasOwnProperty(key)) {
                    usersInOrder.push(key);
                    amountOfHelpedIncidents.push(dataObject[key]);
                }
            }
            this.displayBarChartBystanders(usersInOrder, amountOfHelpedIncidents);
        },

        sortObjectByValue(obj){
            const entries = Object.entries(obj).sort(([, a], [, b]) => b - a);
            return Object.fromEntries(entries);
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
                        borderWidth: 2,
                        backgroundColor: '#5B37DB'
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

        async validationFrequency(){
            this.displayNoneLoadingStats();

            const allIncidents = await getAllIncidents();
            let totalConfirmedIncidents = 0;
            let totalDeclinedIncidents = 0;
            let totalActiveIncidents = 0;

            allIncidents.map(incident => { //sonar doesn't approve of one-liners (Common Sonar L 🤓 🤡 💀 )
                if (incident.state === "CONFIRMED"){
                    totalConfirmedIncidents += 1;
                }
                if (incident.state === "DECLINED"){
                    totalDeclinedIncidents += 1;
                }
                if (incident.state === "ACTIVE"){
                    totalActiveIncidents += 1;
                }
            });

            this.displayValidationDoughnutChart([totalConfirmedIncidents, totalDeclinedIncidents, totalActiveIncidents],["CONFIRMED", "DECLINED", "ACTIVE"]);
        },

        displayValidationDoughnutChart(listOfFrequency, listOfStates) {
            const ctx = document.querySelector("#doughnut-chart-validation").getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: listOfStates,
                    datasets: [{
                        label: 'Percentage',
                        data: listOfFrequency,
                        backgroundColor: ["#5B37DB", "#a599d0", "#F0E25D"],
                    }]
                },
            });
        },

        toggleTypes() {
            this.displayNoneLoadingStats();
            this.pieReady = false;
            this.barTypesReady = true;
            this.barBystandersReady = false;
            this.doughnutValidationReady = false;
        },
        togglePie() {
            this.displayNoneLoadingStats();
            this.pieReady = true;
            this.barTypesReady = false;
            this.barBystandersReady = false;
            this.doughnutValidationReady = false;
        },

        toggleBystanders() {
            this.displayNoneLoadingStats();
            this.pieReady = false;
            this.barTypesReady = false;
            this.barBystandersReady = true;
            this.doughnutValidationReady = false;
        },

        async toggleValidationDoughnut() {
            this.displayNoneLoadingStats();
            this.pieReady = false;
            this.barTypesReady = false;
            this.barBystandersReady = false;
            this.doughnutValidationReady = true;
        },

        displayNoneLoadingStats(){
            const element = document.querySelector(".loading-stats");
            element.style.display = "none";
        },

        canvasStyle() {
            const allCanvases = document.querySelectorAll('canvas');
            allCanvases.forEach(canvas => {
                canvas.style.display = 'inline-block';
            });
        },
    },
    async mounted() {
        const element = document.querySelector(".loading-stats");
        await applyLockedMechanism('div.statistics');
        await this.toggleTypes();
        await this.frequencyOfTypes();
        await this.percentageOfBystanders();
        await this.bestBystanders();
        await this.validationFrequency();
        this.canvasStyle();
        element.style.display = "none";
    },
    components: {
        headerComponent,
        navComponent,
        subscriptionComponent
    }
}).mount('#app');

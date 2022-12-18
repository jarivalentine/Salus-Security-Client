const {createApp} = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Home page',
            incidentsReady: false,
            allIncidents: [],
            showError: false,
            location: null,
        };
    },
    methods: {
        async postIncident(positions) {
            const user = localStorage.getItem("userId");
            const lat = positions[0];
            const long = positions[1];
            const incident = await createIncident(user, lat, long);
            localStorage.setItem("incident", JSON.stringify(incident));
            window.location.href = 'flag.html';
        },
        generateRandomLocation(location) {
            const tempLat = parseFloat(location.coords.latitude.toFixed(1));
            const tempLong = parseFloat(location.coords.longitude.toFixed(1));
            const operators = {
                '+': function (a, b) {
                    return a + b;
                },
                '-': function (a, b) {
                    return a - b;
                }
            };
            const lat = (operators[this.randomOperator()](tempLat, parseFloat((Math.random() / 10).toFixed(2)))).toString();
            const long = (operators[this.randomOperator()](tempLong, parseFloat((Math.random() / 10).toFixed(2)))).toString();
            this.postIncident([lat, long]);
        },
        randomOperator() {
            const operators = ["+", "-"];
            return operators[Math.floor(Math.random() * operators.length)];
        },
        checkPermissionForCreatingFlag() {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(this.generateRandomLocation);
            } else {
                this.showError = !this.showError;
            }
        },

        // notifications section

        async displayNotifications() {
            const allIncidents = await getAllIncidents();
            const hoursInDay = 24;
            const minutesInHour = 60;
            const secondsInMinute = 60;
            const incidentsOneDay = allIncidents.filter(incident => this.calculateDates(incident)["hours"] <= hoursInDay - 1 && this.calculateDates(incident)["minutes"] <= minutesInHour - 1 && this.calculateDates(incident)["seconds"] <= secondsInMinute);
            const incidentsOneDayActive = incidentsOneDay.filter(incident => incident.state === "ACTIVE");
            incidentsOneDayActive.filter(incident => new Date(incident["datetime"]).getDay() - new Date().getDay() === 0);
            incidentsOneDayActive.reverse();
            console.log(incidentsOneDayActive);
            this.allIncidents = incidentsOneDayActive;
        },

        calculateDates(incident) {
            const currentDate = new Date();
            const millisecondsToSeconds = 1000;
            const secondsInHour = 3600;
            const secondsInMinute = 60;
            const incidentDate = new Date(incident["datetime"]);

            const currentSeconds = currentDate.getTime() / millisecondsToSeconds;
            const incidentSeconds = incidentDate.getTime() / millisecondsToSeconds;
            const difference = currentSeconds - incidentSeconds;
            const hours = Math.floor(difference / secondsInHour);
            const minutes = Math.floor(difference % secondsInHour / secondsInMinute);
            const seconds = Math.floor(difference % secondsInHour % secondsInMinute);

            return {
                "hours": hours,
                "minutes": minutes,
                "seconds": seconds,
            };
        },

        calculateDistance(incident) {
            if (!this.location){
               return null;
            }
            const lat = incident["latitude"];
            const long = incident["longitude"];
            return (this.haversineCalculation(lat, long, this.location.coords.latitude, this.location.coords.longitude)).toFixed(2);
        },

        haversineCalculation(lat1, lon1, lat2, lon2) { // distance between two points on a sfeer. crd.: geeksforgeeks.org -> haversine
            const degreesHalfCircle = 180;
            const radiusEarth = 6371;
            const dLat = (lat2 - lat1) * Math.PI / degreesHalfCircle;
            const dLon = (lon2 - lon1) * Math.PI / degreesHalfCircle;
            lat1 = lat1 * Math.PI / degreesHalfCircle;
            lat2 = lat2 * Math.PI / degreesHalfCircle;
            const x = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
            return radiusEarth * 2 * Math.asin(Math.sqrt(x));
        },

        storeIncident(incident) {
            localStorage.setItem("incident", JSON.stringify(incident));
        }
    },
    async mounted() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(location => {
                this.location = location;
            });
        }
        await this.displayNotifications();
        this.incidentsReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

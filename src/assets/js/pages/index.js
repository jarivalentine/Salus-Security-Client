const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Home page',
            incidentsReady: false,
            allIncidents: [],
            showError: false
        };
    },
    methods: {
      async postIncident(positions){
          const user = localStorage.getItem("userId");
          const lat = positions[0];
          const long = positions[1];
          const incident = await createIncident(user, lat, long);
          localStorage.setItem("incident", JSON.stringify(incident));
          window.location.href = 'flag.html';
      },
        generateRandomLocation(location){
          const tempLat = parseFloat(location.coords.latitude.toFixed(1));
          const tempLong = parseFloat(location.coords.longitude.toFixed(1));
          const operators = {
              '+': function (a, b) {return a + b},
              '-': function (a, b) {return a - b}
          }
          const lat = (operators[this.randomOperator()](tempLat, parseFloat((Math.random()/10).toFixed(2)))).toString();
          const long = (operators[this.randomOperator()](tempLong, parseFloat((Math.random()/10).toFixed(2)))).toString();
          this.postIncident([lat, long]);
        },
        randomOperator(){
            const operators = ["+", "-"];
            return operators[Math.floor(Math.random() * operators.length)];
        },
        checkPermissionForCreatingFlag(){
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(this.generateRandomLocation);
            } else {
                this.showError = !this.showError;
            }
        },

        // notifications section

        async displayNotifications(){
          this.allIncidents = await getAllIncidents();
          this.allIncidents.reverse();
        },

        calculateDates(incident){
          const hours = new Date().getHours() - new Date(incident["datetime"]).getHours();
          const minutes = Math.abs(new Date().getMinutes() - new Date(incident["datetime"]).getMinutes());
          const seconds = Math.abs(new Date().getSeconds() - new Date(incident["datetime"]).getSeconds());
          return {
              "hours": hours,
              "minutes": minutes,
              "seconds": seconds,
          };
        },

        haversineCalculation(lat1, lon1, lat2, lon2){ // distance between two points on a sfeer. crd.: geeksforgeeks.org -> haversine
            const degreesHalfCircle = 180;
            const radiusEarth = 6371;
            let dLat = (lat2 - lat1) * Math.PI / degreesHalfCircle;
            let dLon = (lon2 - lon1) * Math.PI / degreesHalfCircle;
            lat1 = lat1 * Math.PI / degreesHalfCircle;
            lat2 = lat2 * Math.PI / degreesHalfCircle;
            const x = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) *
                Math.cos(lat1) *
                Math.cos(lat2);
            return radiusEarth * 2 * Math.asin(Math.sqrt(x));
        },

        storeIncident(incident){
          localStorage.setItem("incident-route", JSON.stringify(incident));
        }
    },
    async mounted(){
        await this.displayNotifications();
        this.incidentsReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

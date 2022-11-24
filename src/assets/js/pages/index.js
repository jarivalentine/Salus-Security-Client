const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Home page',
            incidentsReady: false,
            allIncidents: [],
            dates: [],
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
        checkLocationPermission(){
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
          const minutes = new Date().getMinutes() - new Date(incident["datetime"]).getMinutes();
          const seconds = Math.abs(new Date(incident["datetime"]).getSeconds() - new Date().getSeconds());
          return {
              "hours": hours,
              "minutes": minutes,
              "seconds": seconds,
          };
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

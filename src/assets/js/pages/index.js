const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Home page',
            showError: false
        };
    },
    methods: {
      async postIncident(positions){
          const user = localStorage.getItem("userId");
          const lat = positions[0];
          const long = positions[1];
          const incident = await createIncident(user, lat, long);
          console.log(incident);
      },
        generateRandomLocation(location){
          const tempLat = parseFloat(location.coords.latitude.toFixed(1));
          const tempLong = parseFloat(location.coords.longitude.toFixed(1));
          const lat = (tempLat + parseFloat((Math.random()/10).toFixed(2))).toString();
          const long = (tempLong + parseFloat((Math.random()/10).toFixed(2))).toString();
          this.postIncident([lat, long]);
        },
        checkLocationPermission(){
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(this.generateRandomLocation);
            } else {
                this.showError = !this.showError;
            }
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Maps page',
            showError: true
        };
    },
    methods: {
        loadMap() {
            this.showError = false;
            const map = new ol.Map({
                target: 'incidents-map',
                layers: [
                    new ol.layer.Tile({
                    source: new ol.source.OSM()
                    })                  
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat([3.2248, 51.2092]),
                    zoom: 13
                })
            });
        },
        locationDenied() {
            this.showError = true;
        }
    },
    mounted() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(this.loadMap, this.locationDenied);
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

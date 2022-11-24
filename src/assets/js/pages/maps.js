const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Maps page',
            showError: false
        };
    },
    methods: {
        loadMap(currentPosition) {
            this.showError = false;
            const lat = currentPosition.coords.latitude;
            const lon = currentPosition.coords.longitude;
            const center = ol.proj.fromLonLat([lon, lat]);
            const map = this.createMap(center);
            map.addOverlay(this.createMarker(center));
        },
        locationDenied() {
            this.showError = !this.showError;
        },
        createMap(center) {
            return new ol.Map({
                target: "incidents-map",
                layers : [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view : new ol.View({
                    center: center,
                    zoom: 13
                })
            });
        },
        createMarker(position) {
            return new ol.Overlay({
                position: position,
                element: document.getElementById("marker"),
                positioning: "bottom-center"
            });
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

const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Maps page',
            showError: false,
        };
    },
    methods: {
        loadMap(incidents, location) {
            const center = ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude]); 
            const map = new ol.Map({
                target: 'incidents-map',
                layers : [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view : new ol.View({
                    center: center,
                    zoom: 12
                })
            });
            map.addOverlay(this.createMarker(center));
            incidents.forEach(incident => {
                const location = ol.proj.fromLonLat([incident.latitude, incident.longitude]);
                map.addOverlay(this.createMarker(location, incident.id))
            });
            this.loaded = true;
        },
        createMarker(position, incidentId) {
            const $marker = document.createElement('div');
            if (incidentId) {
                $marker.classList.add('flag');
                $marker.addEventListener('click', this.clickFlag);
                $marker.dataset.id = incidentId;
            } 
            else $marker.classList.add('marker');
            document.querySelector('#container').appendChild($marker);
            return new ol.Overlay({
                position: position,
                element: $marker,
                positioning: "bottom-center"
            });
        } ,
        locationDenied() {
            this.showError = true;
        },
        clickFlag(e) {
            console.log(e.target.dataset.id);
        }
    },
    mounted() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((location) => getAllIncidents().then(incidents => this.loadMap(incidents, location)), this.locationDenied);
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

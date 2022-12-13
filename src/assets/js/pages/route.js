const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Route page',
            showError: false,
            map: null,
            loaded: false,
            myLocation: null,
            routeLayer: null
        };
    },
    methods: {
        async loadMap(location) {
            const incident = JSON.parse(localStorage.getItem('incident'));
            this.myLocation = location;
            const center = ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude]);
            const incidentLocation = ol.proj.fromLonLat([incident.latitude, incident.longitude]);
            this.map = new ol.Map({
                target: 'incidents-map',
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                ],
                view: new ol.View({
                    center: center,
                    zoom: 12
                })
            });
            this.map.addOverlay(this.createMarker(incidentLocation));
            this.loaded = true;
            await this.drawRoute(incident);
        },
        createMarker(position, incidentId) {
            const $marker = document.createElement('div');
            if (incidentId) {
                $marker.classList.add('flag');
                $marker.addEventListener('click', this.clickFlag);
                $marker.dataset.id = incidentId;
            } else {
                $marker.classList.add('marker');
            }
            document.querySelector('#container').appendChild($marker);
            return new ol.Overlay({
                position: position,
                element: $marker,
                positioning: "bottom-center"
            });
        },
        locationDenied() {
            this.showError = true;
        },
        async drawRoute(incident) {
            const startLong = this.myLocation.coords.longitude;
            const startLat = this.myLocation.coords.latitude;
            const endLong = incident.latitude;
            const endLat = incident.longitude;
            getRoute(startLong, startLat, endLong, endLat).then(route => {
                this.map.removeLayer(this.routeLayer);
                const polyline = route.geometry.coordinates.map(el => ol.proj.fromLonLat(el));
                this.routeLayer = new ol.layer.Vector({
                    source: new ol.source.Vector({
                        features: [new ol.Feature({
                            type: 'route',
                            geometry: new ol.geom.LineString(polyline)
                        })]
                    }),
                    style: new ol.style.Style({
                        stroke: new ol.style.Stroke({
                            width: 6,
                            color: [91, 55, 219, 0.5]
                        })
                    })
                });
                this.map.addLayer(this.routeLayer);
            });
        }
    },
    async mounted() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((location) => this.loadMap(location), this.locationDenied);
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

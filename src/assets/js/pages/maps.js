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
        loadMap(incidents, location) {
            this.showError = false;
            const lat = location.coords.latitude;
            const lon = location.coords.longitude;
            const center = ol.proj.fromLonLat([lon, lat]);
            const markers = incidents.map(incident => new ol.Feature({
                type: 'marker',
                geometry: new ol.geom.Point(ol.proj.fromLonLat([incident.latitude, incident.longitude]))
            }));
            const markerVectors = new ol.source.Vector({
                features: markers
            });        
            const markerLayer = new ol.layer.Vector({
                source: markerVectors,
                style: new ol.style.Style({
                    image: new ol.style.Icon({
                        src: "assets/img/svg-flag.svg",
                        anchor: [0.5, 1]
                    })
                }) 
            });        
            const map = new ol.Map({
                target: 'incidents-map',
                layers: [
                    new ol.layer.Tile({
                    source: new ol.source.OSM()
                    }),
                    markerLayer,                     
                ],
                view: new ol.View({
                    center: ol.proj.fromLonLat(center),
                    zoom: 10
                })
            });
            const bounds = markerVectors.getExtent();
            map.getView().fit(bounds, {padding: [10, 10, 10, 10]});
            map.addOverlay(this.createMarker(center));
        },
        createMarker(position) {
            return new ol.Overlay({
                position: position,
                element: document.getElementById("marker"),
                positioning: "bottom-center"
            });
        } ,
        locationDenied() {
            this.showError = true;
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

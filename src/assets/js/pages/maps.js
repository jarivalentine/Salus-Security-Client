const {createApp} = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Maps page',
            showError: false,
            map: null,
            loaded: false,
            myLocation: null,
            routeLayer: null
        };
    },
    methods: {
        loadMap(incidents, location) {
            this.myLocation = location;
            const center = ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude]);
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
            this.map.addOverlay(this.createMarker(center));
            incidents.forEach(incident => {
                const currentLocation = ol.proj.fromLonLat([incident.latitude, incident.longitude]);
                this.map.addOverlay(this.createMarker(currentLocation, incident.id));
            });
            this.loaded = true;
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
        async clickFlag(e) {
            document.querySelectorAll('.popup').forEach(box => {
                box.remove();
            });
            const incident = await getIncident(e.target.dataset.id);
            const $popup = document.createElement('div');
            $popup.classList.add('popup');
            console.log(incident);
            let labels = '';
            incident.labels.forEach(label => {
                labels += `<li>${label}</span>`;
            });
            $popup.innerHTML = `
                <p>${incident.type}</p>
                <ul>${labels}</ul>`;
            $popup.style.right = '0px';
            $popup.style.top = '0px';
            document.querySelector('#container').appendChild($popup);
            await this.drawRoute(incident);
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

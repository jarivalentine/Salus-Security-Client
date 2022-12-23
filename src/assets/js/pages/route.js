const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            showError: false,
            map: null,
            loaded: false,
            myLocation: null,
            routeLayer: null,
            aggressor: false,
            reporter: false,
        };
    },
    methods: {
        async loadMap(location) {
            const incident = JSON.parse(localStorage.getItem('incident'));
            this.myLocation = location;
            const center = ol.proj.fromLonLat([location.coords.longitude, location.coords.latitude]);
            const incidentLocation = ol.proj.fromLonLat([incident.longitude, incident.latitude]);
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
            this.map.addOverlay(this.createMarker(incidentLocation, true));
            this.map.addOverlay(this.createMarker(center, false));
            this.loaded = true;
            await this.drawRoute(incident);
        },
        createMarker(position, isFlag) {
            const $marker = document.createElement('div');
            if (isFlag) {
                $marker.classList.add('flag');
            }
            else {
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
            const endLong = incident.longitude;
            const endLat = incident.latitude;
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
        },
        async helpIncident() {
            localStorage.setItem("assists-user-amount", JSON.stringify(await getAllHelpedIncidentsFromUser(localStorage.getItem("userId"))));
            const incidentId = JSON.parse(localStorage.getItem('incident')).id;
            const userId = localStorage.getItem('userId');
            await helpIncident(userId, incidentId);
            window.location.href = 'flag.html';
        },

        async userIsAggressor(userId){
            const allAggressors = await getAllAggressorsFromIncident(JSON.parse(localStorage.getItem("incident")).id);
            console.log(allAggressors);
            for (const user of allAggressors) {
                if (user.id === userId) {
                    this.aggressor = !this.aggressor;
                }
            }
            return this.aggressor;
        },
        async activeIncident(){
            if (localStorage.getItem("active-incident")){
                this.reporter = !this.reporter;
            }
            return localStorage.getItem("active-incident");
        }
    },
    async mounted() {
        if (await this.activeIncident() || await this.userIsAggressor(localStorage.getItem("userId"))) {
            document.querySelector(".route button").setAttribute("disabled", "disabled");
        }
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((location) => this.loadMap(location), this.locationDenied);
        }
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

const {createApp} = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';
import subscriptionComponent from "../components/subscription-lock.js";

createApp({
    data() {
        return {
            showError: false,
            map: null,
            loaded: false,
            myLocation: null,
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
                const currentLocation = ol.proj.fromLonLat([incident.longitude, incident.latitude]);
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
            } else $marker.classList.add('marker');
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
            let labels = '';
            incident.labels.forEach(label => {
                labels += `<li>${label}</li>`;
            });
            $popup.innerHTML = `
                <p>${incident.type}</p>
                <ul>${labels}</ul>
                <a href="./route.html">View route</a>`;
            $popup.style.left = e.clientX - 95 + 'px';
            $popup.style.top = e.clientY - 130 - (incident.labels.length * 20) + 'px';
            localStorage.setItem('incident', JSON.stringify(incident));
            document.querySelector('#container').appendChild($popup);
        }
    },
    async mounted() {
        await applyOrRemoveLockedMechanism('div.maps');
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((location) => getAllIncidents().then(incidents => this.loadMap(incidents, location)), this.locationDenied);
        }
    },
    components: {
        headerComponent,
        navComponent,
        subscriptionComponent
    }
}).mount('#app');

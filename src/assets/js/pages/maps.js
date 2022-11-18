const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Maps page'
        };
    },
    mounted() {
        const map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                source: new ol.source.OSM()
                }),
                markerLayer,                     
            ],
            view: new ol.View({
                center: ol.proj.fromLonLat([4.34878, 50.85045]),
                zoom: 10
            })
        });
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

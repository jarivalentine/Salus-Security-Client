const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Charts page',
            lat: "",
            long: ""
        };
    },
    methods: {
        async allIncidentsThisYear(){
            const allIncidents = await getAllIncidents();
            console.log(allIncidents.length);
        },
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

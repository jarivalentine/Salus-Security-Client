const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Flag page'
        };
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

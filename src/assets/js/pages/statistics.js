const { createApp } = Vue
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Charts page'
        };
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');
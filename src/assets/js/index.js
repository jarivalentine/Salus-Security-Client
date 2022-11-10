const { createApp } = Vue
import headerComponent from './components/header.js';
import navComponent from './components/nav.js';

createApp({
    data() {
        return {
            message: 'Home page'
        };
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');
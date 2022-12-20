const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';
import subscriptionComponent from '../components/subscription-lock.js';

createApp({
    async mounted(){
        await applyOrRemoveLockedMechanism('div.doorlock');
    },
    components: {
        headerComponent,
        navComponent,
        subscriptionComponent
    }
}).mount('#app');

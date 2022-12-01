const { createApp } = Vue;
import headerComponent from '../components/header.js';
import navComponent from '../components/nav.js';

createApp({
    data() {
        return {
            message: 'Settings page',
            premium: false,
            basic: false,
            subscriptionCheckReady: false,
        };
    },
    methods: {
        async checkUserForSubscription() {
            const user = await getOneUser(localStorage.getItem("userId"));
            if (user["subscribed"]){
                this.premium = !this.premium;
            } else {
                this.basic = !this.basic;
            }
        },
        async subscribeUser(){
            await subscribeUser(localStorage.getItem("userId"));
            location.reload();
        },
        async unSubscribeUser(){
            await unSubscribeUser(localStorage.getItem("userId"));
            location.reload();
        }
    },
    async mounted() {
        await this.checkUserForSubscription();
        this.subscriptionCheckReady = true;
    },
    components: {
        headerComponent,
        navComponent
    }
}).mount('#app');

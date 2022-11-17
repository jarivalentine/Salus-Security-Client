export default {
    methods:{
        goTo(){
            console.log();
            location.href='./settings.html';
        }
    },
    template: `
        <div class="lock">
            <h2>Premium Feature</h2>
            <button @click="goTo">Get subscription</button>
        </div>
    `
}
export default {
    methods:{
        goToSettings(){
            location.href='./settings.html';
        }
    },
    template: `
        <div class="lock">
            <h2>Premium Feature</h2>
            <button @click="goToSettings">Get subscription</button>
        </div>
    `
}

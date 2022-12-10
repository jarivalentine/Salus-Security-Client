export default {
    data(){
      return {
          isActive: false,
      }
    },

    methods: {
      async userSubscribed(){
          const user = await getOneUser(localStorage.getItem("userId"));
          this.isActive = user.subscribed;
      }
    },
    async mounted(){
      await this.userSubscribed();
    },
    template: `
        <div class="lock" :class="{hidden: isActive}">
            <h2>Premium Feature</h2>
            <a href="./settings.html">Get subscription</a>
        </div>
    `
};

export default {
    data() {   
        return {
            firstname: null,
            tag: null,
            isActive: false,
        };
    },
    methods: {
        toggleMenu(e) {
            if (e.target.closest("#menu") !== null) {
                this.isActive = !this.isActive;
            }
        },
        async changeName() {
            const user = await getOneUser(localStorage.getItem("userId"));
            this.firstname = `${user.firstname} ${user.lastname}`;

        },
        changePicture() {
            const userId = localStorage.getItem("userId");
            const avatar = document.querySelector("#menu");
            avatar.style.backgroundImage = `url('assets/img/avatars/${userId}.jpg')`;
        },
        async getTagName(){
            const user = await getOneUser(localStorage.getItem("userId"));
            const assists = await getAllHelpedIncidentsFromUser(user.id);
            
            if(assists.length<1){
                this.tag = 'Bad Savior';
            }
            if(1<=assists.length&&assists.length<10){
                this.tag = 'Noob Savior';
            }
            if(10<=assists.length&&assists.length<50){
                this.tag = 'Great Savior';
            }
            if(50<=assists.length&&assists.length<100){
                this.tag = 'Heroic Savior';
            }
            if(assists.length>=100){
                this.tag = 'Legendary Savior';
            }
            
            return this.tag;
        }
    },
    async mounted() {
        document.querySelector('body').addEventListener('click', (e) => {
            if (this.isActive && e.target.id !== 'menu' && e.target.parentNode.id !== 'menu') {
                this.isActive = false;
            }
        });
        await this.changeName();
        await this.getTagName();
        this.changePicture();
        
    },
    template: `
      <header>
          <div>
                <div id="menu" @click="toggleMenu">
                  <p>{{ firstname }}</p>
                  <p class="tag">{{ tag }}</p>
                </div>
                <ul :class="{ hidden: !isActive }">
                  <li><a class="non-poc-menu" href="#">Profile</a></li>
                  <li><a class="poc-menu" href="./history.html">History</a></li>
                  <li><a class="non-poc-menu" href="#">Give feedback</a></li>
                  <li><a class="non-poc-menu" href="#">Report a bug</a></li>
                </ul>
              </div>
          <a href="./settings.html"></a>
      </header>
    `
};

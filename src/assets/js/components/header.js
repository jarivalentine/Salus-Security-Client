export default {
    data() {   
        return {
            firstname: null,
            tag: null,
            isActive: false,
            colors: ["purple", "red", "orange", "blue", "legendary"],
            currentColorClass: "purple",
            display: ["block", "none"],
            currentDisplayClass:"none"
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
            const tag = document.querySelector("#menu .tag");

            if(assists.length === 0){
                this.tag = 'Bad Savior';
                this.currentColorClass = "red";
            }
            if(1 <= assists.length && assists.length <= 2){
                this.tag = 'Noob Savior';
                this.currentColorClass = "orange";
            }
            if(3 <= assists.length && assists.length <= 6){
                this.tag = 'Great Savior';
                this.currentColorClass = "blue";
            }
            if(7 <= assists.length && assists.length <= 9){
                this.tag = 'Heroic Savior';
                this.currentColorClass = "purple";
            }
            if(assists.length >= 8){
                this.tag = 'Legendary Savior';
                this.currentColorClass = "legendary";
            }
            this.changeTagColor(tag);
        },
        changeTagColor(tag){
            this.colors.forEach(color => {
               tag.classList.remove(color);
            });
            tag.classList.add(this.currentColorClass);
        }
    },
    async mounted() {
        document.querySelector('body').addEventListener('click', (e) => {
            if (this.isActive && e.target.id !== 'menu' && e.target.parentNode.id !== 'menu') {
                this.isActive = false;
            }
        });
        //const loader1 = document.querySelector('.loading-profile')
        const loader2 = document.querySelector('.loading-tags')
        //loader1.style.display = 'block';
        loader2.style.display = 'block';        
        await this.changeName();
        await this.getTagName();
        this.changePicture();
        
        //loader1.style.display = 'none';
        loader2.style.display = 'none';
    },
    template: `
      <header>
            <div>
                <div id="menu" @click="toggleMenu">
                    <p>{{ firstname }}</p>
                    <p class="loading-tags"></p>
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

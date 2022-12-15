export default {
    data() {
        return {
            firstname: null,
            tag: 'Guardian Angel',
            isActive: false,
        };
    },
    methods: {
        toggleMenu(e) {
            if (e.target.closest("#menu") !== null || e.target.closest(".name-and-tag") !== null){
                this.isActive = !this.isActive;
            }
        },
        async changeName(){
            const user = await getOneUser(localStorage.getItem("userId"));
            this.firstname = `${user.firstname} ${user.lastname}`;
        },
        changePicture(){
            const userId = localStorage.getItem("userId");
            const avatar = document.querySelector("#menu img");
            avatar.src = `assets/img/avatars/${userId}.jpg`;
        }
    },
    async mounted() {
        document.querySelector('body').addEventListener('click', (e) => {
            if (this.isActive && e.target.id !== 'menu' && e.target.parentNode.id !== 'menu') {
                this.isActive = false;
            }
        });
        await this.changeName();
        this.changePicture();
    },
    template: `
        <header>
            <div>
                <div id="menu" @click="toggleMenu">
                    <img src="assets/img/avatars/1989-01-28_AL.jpg" alt="avatar" title="avatar">
                  <div class="name-and-tag">
                    <p>{{ firstname }}</p>
                    <p class="tag">{{ tag }}</p>
                  </div>
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

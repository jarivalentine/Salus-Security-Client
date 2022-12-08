export default {
    data() {
        return {
            firstname: null,
            tag: 'Gardian Angel',
            isActive: false
        };
    },
    methods: {
        toggleMenu() {
            this.isActive = !this.isActive;
        },
        async changeName(){
            const user = await getOneUser(localStorage.getItem("userId"));
            this.firstname = user.firstname + " " + user.lastname;
        }
    },
    async mounted() {
        document.querySelector('body').addEventListener('click', (e) => {
            if (this.isActive && e.target.id !== 'menu' && e.target.parentNode.id !== 'menu') {
                this.isActive = false;
            }
        });
        await this.changeName();
    },
    template: `
        <header>
            <div>
                <div id="menu" @click="toggleMenu">
                    <p>{{ firstname }}</p>
                    <p class="tag">{{ tag }}</p>
                </div>
                <ul :class="{ hidden: !isActive }">
                    <li><a href="#">Profile</a></li>
                    <li><a href="./history.html">History</a></li>
                    <li><a href="#">Give feedback</a></li>
                    <li><a href="#">Report a bug</a></li>
                </ul>
            </div>
            <a href="./settings.html"></a>
        </header>
    `
};

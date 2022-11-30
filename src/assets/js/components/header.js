export default {
    data() {
        return {
            firstname: 'Jarne Van Parys',
            tag: 'Gardian Angel',
            isActive: false
        };
    },
    methods: {
        toggleMenu() {
            this.isActive = !this.isActive;
        }
    },
    mounted() {
        document.querySelector('body').addEventListener('click', (e) => {
            if (this.isActive && e.target.id !== 'menu' && e.target.parentNode.id !== 'menu') {
                this.isActive = false;
            }
        });
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

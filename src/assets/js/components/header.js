export default {
    data() {
        return {
            firstname: null,
            tag: null,
            isActive: false,
            colors: ["purple", "red", "orange", "blue", "legendary"],
            currentColorClass: "purple",
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
            const getAssistUserAmount = localStorage.getItem("assists-user-amount");
            if (!getAssistUserAmount){
                localStorage.setItem("assists-user-amount", JSON.stringify(await getAllHelpedIncidentsFromUser(localStorage.getItem("userId"))));
            }

            const assists = JSON.parse(getAssistUserAmount);
            const tag = document.querySelector("#menu .tag");
            this.checkInBetweenInterval(assists);
            this.changeTagColor(tag);
        },
        checkInBetweenInterval(assists){
            if(assists.length === 0){
                this.tag = "Bad Savior";
                this.currentColorClass = "red";
            }
            if(1 <= assists.length && assists.length <= 2){
                this.tag = "Noob Savior";
                this.currentColorClass = "orange";
            }
            if(3 <= assists.length && assists.length <= 6){
                this.tag = "Great Savior";
                this.currentColorClass = "blue";
            }
            if(7 <= assists.length && assists.length <= 8){
                this.tag = "Heroic Savior";
                this.currentColorClass = "purple";
            }
            if(assists.length >= 9){
                this.tag = "Legendary Savior";
                this.currentColorClass = "legendary";
            }
        },
        changeTagColor(tag){
            this.colors.forEach(color => {
               tag.classList.remove(color);
            });
            tag.classList.add(this.currentColorClass);
        },
        viewStatus() {
            localStorage.setItem("incident",  localStorage.getItem("active-incident"));
            window.location.href = "./flag.html";
        },
        async showIfActive() {
            const incidentsByUser = await getAllIncidentsFromUser(localStorage.getItem("userId"));
            incidentsByUser.forEach(incident => {
                if (incident.state === "ACTIVE") {
                    document.querySelector("aside").classList.remove("hidden");
                    localStorage.setItem("active-incident", JSON.stringify(incident));
                }
            });
            if (window.location.href.includes("flag")) {
                document.querySelector("aside").classList.add("hidden");
            }
        },
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
        this.showIfActive();
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
        <aside class="hidden">
            <h2>Pending Incident currently being recorded</h2>
            <button @click="viewStatus">View Status</button>
        </aside>
        <a href="./settings.html"></a>
    </header>
    `
};

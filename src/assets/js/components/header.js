export default {
    data() {
        return {
            firstname: null,
            tag: null,
            isActive: false,
            colors: ["purple", "red", "orange", "blue", "legendary"],
            currentColorClass: "purple",
            badSavior: "Bad Savior",
            noobSavior: "Noob Savior",
            greatSavior: "Great Savior",
            heroicSavior: "Heroic Savior",
            legendarySavior: "Legendary Savior",
            activeIncident: "active-incident",
            tags: {
                0: { tag: this.badSavior, colorClass: "red" },
                1: { tag: this.noobSavior, colorClass: "orange" },
                2: { tag: this.noobSavior, colorClass: "orange" },
                3: { tag: this.greatSavior, colorClass: "blue" },
                4: { tag: this.greatSavior, colorClass: "blue" },
                5: { tag: this.greatSavior, colorClass: "blue" },
                6: { tag: this.greatSavior, colorClass: "blue" },
                7: { tag: this.heroicSavior, colorClass: "purple" },
                8: { tag: this.heroicSavior, colorClass: "purple" },
                9: { tag: this.legendarySavior, colorClass: "legendary" }
            }
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
            const tagData = this.tags[assists.length] || this.tags[9];
            this.tag = tagData.tag;
            this.currentColorClass = tagData.colorClass;
        },
        changeTagColor(tag){
            this.colors.forEach(color => {
               tag.classList.remove(color);
            });
            tag.classList.add(this.currentColorClass);
        },
        viewStatus() {
            localStorage.setItem("incident",  localStorage.getItem(this.activeIncident));
            window.location.href = "./flag.html";
        },
        async showIfActive() {
            const incidentsByUser = await getAllIncidentsFromUser(localStorage.getItem("userId"));
            incidentsByUser.forEach(incident => {
                if (incident.state === "ACTIVE") {
                    document.querySelector("aside").classList.remove("hidden");
                    localStorage.setItem(this.activeIncident, JSON.stringify(incident));
                }
            });
            if (window.location.href.includes("flag")) {
                document.querySelector("aside").classList.add("hidden");
            }
        },

        async stopRecording(){
            const incidentId = JSON.parse(localStorage.getItem(this.activeIncident)).id;
            await validateIncident(incidentId, localStorage.getItem("userId"));
            localStorage.removeItem(this.activeIncident);
            window.location.href = 'index.html';
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
        await this.showIfActive();
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
            <h2>Your last incident is still recording</h2>
            <button @click="viewStatus">View Status</button>
            <button @click="stopRecording">Stop Recording</button>
        </aside>
        <a href="./settings.html"></a>
    </header>
    `
};

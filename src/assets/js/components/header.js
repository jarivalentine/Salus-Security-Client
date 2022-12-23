export default {
    data() {
        return {
            firstname: null,
            tag: null,
            isActive: false,
            colors: ["purple", "red", "orange", "lightgreen", "blue", "legendary"],
            activeIncident: "active-incident",
            tags: {
                "Bad Savior": [0, 1, 2, 3],
                "Noob Savior": [4, 5, 6, 7],
                "Good Savior": [8, 9, 10, 11],
                "Great Savior": [12, 13, 14, 15],
                "Heroic Savior": [16, 17, 18, 19],
            },
            tagsColors: {
                "Bad Savior": "red",
                "Noob Savior": "orange",
                "Good Savior": "lightgreen",
                "Great Savior": "blue",
                "Heroic Savior": "purple",
                "Legendary Savior": "legendary"
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
            this.checkInBetweenInterval(assists);
        },
        checkInBetweenInterval(assists){
            if (assists.length >= 20) {
                this.tag = "Legendary Savior";
            }

            for (const key in this.tags) {
                if (this.tags[key].includes(assists.length)) {
                    this.tag = key;
                }
            }
            const tag = document.querySelector("#menu .tag");
            this.changeTagColor(tag);
        },
        changeTagColor(tag){
            this.colors.forEach(color => {
               tag.classList.remove(color);
            });
            tag.classList.add(this.tagsColors[this.tag]);
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
        const loader2 = document.querySelector('#menu .loading-tags');
        loader2.style.display = 'block';
        await this.changeName();
        await this.getTagName();
        this.changePicture();
        loader2.style.display = 'none';
        await this.showIfActive();
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
        <aside class="hidden">
            <h2>Your last incident is still recording</h2>
            <button @click="viewStatus">View Status</button>
            <button @click="stopRecording">Stop Recording</button>
        </aside>
        <a href="./settings.html"></a>
    </header>
    `
};

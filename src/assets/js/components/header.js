export default {
    data() {
        return {
            firstname: null,
            tag: null,
            isActive: false,
            colors: ["purple", "red", "orange", "lightgreen", "blue", "legendary"],
            currentColorClass: "red",
            activeIncident: "active-incident",
            tags: {
                0: { tag: "Bad Savior", colorClass: "red" },
                1: { tag: "Noob Savior", colorClass: "orange" },
                2: { tag: "Noob Savior", colorClass: "orange" },
                3: { tag: "Good Savior", colorClass: "lightgreen" },
                4: { tag: "Good Savior", colorClass: "lightgreen" },
                5: { tag: "Great Savior", colorClass: "blue" },
                6: { tag: "Great Savior", colorClass: "blue" },
                7: { tag: "Heroic Savior", colorClass: "purple" },
                8: { tag: "Heroic Savior", colorClass: "purple" },
                9: { tag: "Legendary Savior", colorClass: "legendary" }
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
            const tagData = this.tags[assists.length] || this.tags[9];
            this.tag = tagData.tag;
            this.currentColorClass = tagData.colorClass;

            const tag = document.querySelector("#menu .tag");
            this.changeTagColor(tag);
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
        //const loader1 = document.querySelector('.loading-profile')
        const loader2 = document.querySelector('.loading-tags')
        //loader1.style.display = 'block';
        loader2.style.display = 'block';        
        await this.changeName();
        await this.getTagName();
        this.changePicture();
<<<<<<< HEAD
        this.showIfActive();
        //loader1.style.display = 'none';
        loader2.style.display = 'none';
=======
        await this.showIfActive();
>>>>>>> f1e15599947c79d9bd1f302c8236804e2e7822a4
    },
    template: `
    <header>
        <div>
            <div class="loading-profile" style="width:63px; height:63px; display:none"></div>
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

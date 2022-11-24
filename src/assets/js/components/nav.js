export default {
    data() {
        return {
            homeActive: false,
            mapsActive: false,
            statisticsActive: false,
            doorlockActive: false,
        }
    },
    mounted() {
        const url = window.location.href;
        switch(true) {
            case url.includes('index'):
                this.homeActive = true;
                break;
            case url.includes('maps'):
                this.mapsActive = true;
                break;
            case url.includes('statistics'):
                this.statisticsActive = true;
                break;
            case url.includes('doorlock'):
                this.doorlockActive = true;
                break;
        }
    },
    template: `
        <nav>
            <ul>
                <li><a class="home" :class="{ active: homeActive }" href="./index.html">Home</a></li>
                <li><a class="map" :class="{ active: mapsActive }" href="./maps.html">Map</a></li>
                <li><a class="statistics" :class="{ active: statisticsActive }" href="./statistics.html">Statistics</a></li>
                <li><a class="doorlock" :class="{ active: doorlockActive }" href="./doorlock.html">Door Lock™</a></li>
            </ul>
        </nav>
    `
};

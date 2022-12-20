export default {
    data() {
        return {
            activeLink: {
                home: false,
                maps: false,
                statistics: false,
                doorlock: false,
            },
        };
    },
    mounted() {
        const url = window.location.href;
        this.activeLink = {
            home: url.includes("index"),
            maps: url.includes("maps"),
            statistics: url.includes("statistics"),
            doorlock: url.includes("doorlock"),
        };
    },
    template: `
      <nav>
      <ul>
        <li><a class="home-nav" :class="{ active: activeLink.home }" href="./index.html">Home</a></li>
        <li><a class="map-nav" :class="{ active: activeLink.maps }" href="./maps.html">Map</a></li>
        <li><a class="statistics-nav" :class="{ active: activeLink.statistics }" href="./statistics.html">Statistics</a></li>
        <li><a class="doorlock-nav" :class="{ active: activeLink.doorlock }" href="./doorlock.html">Door Lock™</a></li>
      </ul>
      </nav>`,
};

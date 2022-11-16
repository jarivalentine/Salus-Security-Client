export default {
    data() {
        return {
            firstname: 'Jarne Van Parys',
            tag: 'Gardian Angel'
        }
    },
    template: `
        <header>
            <div>
                <p>{{ firstname }}</p>
                <p class="tag">{{ tag }}</p>
            </div>
            <a href="./settings.html"></a>
        </header>
    `
}
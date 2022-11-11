export default {
    data() {
        return {
            firstname: 'Liam',
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
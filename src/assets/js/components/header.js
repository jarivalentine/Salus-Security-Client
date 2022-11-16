export default {
    data() {
        return {
            firstname: 'Jarne Van Parys',
            tag: 'Neemt mannen in poep'
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
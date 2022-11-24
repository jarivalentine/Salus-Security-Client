let api;

document.addEventListener("DOMContentLoaded", loadConfig);

function loadConfig() {
    fetch("config.json")
        .then(resp => resp.json())
        .then(config => {
            api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
        });
}

function login(id) {
    return 'look ma, no hands!';
}

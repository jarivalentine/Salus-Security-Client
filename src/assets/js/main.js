let api;

document.addEventListener("DOMContentLoaded", loadConfig);

function init() {
    if (!localStorage.getItem("userId")){
        localStorage.setItem("userId", "1989-01-28_AL");
    }
}

function loadConfig() {
    fetch("config.json")
        .then(resp => resp.json())
        .then(config => {
            api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
        });
    init();
}

async function login(userId){ // will be used in the console to change user
    const invalid = "userId not recognized";
    const valid = `logged is as user: ${userId}`;
    if (!await validUserId(userId)){
        console.log(invalid);
        return;
    }
    localStorage.setItem("userId", userId);
    console.log(valid);
}

async function validUserId(userId) {
    const userIds = [];
    const users = await getAllUsers();
    users.map(index => userIds.push(index.id));
    return userIds.includes(userId);
}

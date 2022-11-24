let api;

document.addEventListener("DOMContentLoaded", loadConfig);

// Entry point for the JS code.
function init() {
    if (!localStorage.getItem("userId")){
        localStorage.setItem("userId", "1989-01-28_AL");
    }
    // Very small proof of concept.
    //poc();
}

function loadConfig() {
    fetch("config.json")
        .then(resp => resp.json())
        .then(config => {
            api = `${config.host ? config.host + '/': ''}${config.group ? config.group + '/' : ''}api/`;
            init();
        });
}

function login(userId){
    const userIdLength = 13;
    const invalid = "invalid userId";
    if (userId.length !== userIdLength || !users.includes(userId)){
        console.log(invalid);
        return;
    }
    localStorage.setItem("userId", userId);
}

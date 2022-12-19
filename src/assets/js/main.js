import { subscribeToNotifications } from "./subscriptionHandler.js";

let api;

document.addEventListener("DOMContentLoaded", init);

function init() {
    if (!localStorage.getItem("userId")){
        localStorage.setItem("userId", "1989-01-28_AL");
    }
    Notification.requestPermission().then(function(result) {
        if (result === "granted") {
            console.log("Notifications are enabled");
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register("sw.js");
                console.log("Service worker registered");
                subscribeToNotifications();
            }
        }
    });
}

async function login(userId){ // console log function: change user
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

async function applyOrRemoveLockedMechanism(domElement){
    const user = await getOneUser(localStorage.getItem("userId"));
    const blurDomElement = document.querySelector(domElement);
    if (blurDomElement === null){
        return;
    }
    if (user.subscribed){
        blurDomElement.classList.remove("locked");
        return;
    }

    blurDomElement.classList.add("locked");
}

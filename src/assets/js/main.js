import { subscribeToNotifications } from "./subscriptionHandler.js";

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

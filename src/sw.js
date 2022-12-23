self.addEventListener('push', (event) => { //NOSONAR
    const title = "Salus Security";
    const options = {
        body: event.data.text(),
        icon: "assets/img/icon.png",
    };
    self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', event => { //NOSONAR
    clients.openWindow("https://project-ii.ti.howest.be/mars-11/index.html");
    event.notification.close();
});

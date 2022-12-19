self.addEventListener('push', (event) => { //NOSONAR
    const title = "Notification";
    const options = {
        body: event.data.text(),
    }
    self.registration.showNotification(title, options);
});
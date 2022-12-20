self.addEventListener('push', (event) => {
    const title = "Notification";
    const options = {
        body: event.data.text(),
    };
    self.registration.showNotification(title, options);
});

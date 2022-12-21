self.addEventListener('push', (event) => { //NOSONAR
    const title = "Salus Security";
    const options = {
        vibrate: [300,100,
            100,50,
            100,50,
            100,100,
            150,250,
            100,700,
            200,150,
            200],
        body: event.data.text(),
        icon: "assets/img/icon.png",
    }
    self.registration.showNotification(title, options);
});
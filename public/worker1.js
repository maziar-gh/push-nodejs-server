self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('This push event has data: ', event.data.text());
    self.registration.showNotification(data.title, {
        body:  data.time,
        requireInteraction: true,
        "image":"https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
    });
});

self.addEventListener('notificationclick', function(event) {
    const clickedNotification = event.notification;
    console.log("event")
    clickedNotification.close();

//        console.log("clicked the notification")
    // Do something as the result of the notification click
    // const promiseChain = doSomething();
    // event.waitUntil(promiseChain);
});
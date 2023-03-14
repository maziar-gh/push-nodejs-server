self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('This push event has data: ', event.data.text());


    let url ='http://localhost:5000/update_status?camp='+data.camp_id+"&user_id="+data.user_id+"&status=d";
    //const analyticsPromise = pushReceivedTracking();
    const pushInfoPromise = fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // const title = response.data.userName + ' says...';
            // const message = response.data.message;
            //
            // self.registration.showNotification(title, {
            //     body: message
            // });
            self.registration.showNotification(data.title, {
                body:  data.user_id,
                "data":data,
                requireInteraction: true,
                "image":"https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            });
        });

    const promiseChain = Promise.all([
      //  analyticsPromise,
        pushInfoPromise
    ]);

    event.waitUntil(promiseChain);
});

self.addEventListener('notificationclick', function(event) {
    const clickedNotification = event.notification;
    console.log("click event closed"+JSON.stringify(clickedNotification));
    clickedNotification.close();
    const data = event.notification.data;
    console.log('This click event has data: ', JSON.stringify(data));


    let url ='http://localhost:5000/update_status?camp='+data.camp_id+"&user_id="+data.user_id+"&status=c";
    //const analyticsPromise = pushReceivedTracking();
    const pushInfoPromise = fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(response) {
            // const title = response.data.userName + ' says...';
            // const message = response.data.message;
            //
            // self.registration.showNotification(title, {
            //     body: message
            // });
            self.registration.showNotification(data.title, {
                body:  data.user_id,

                requireInteraction: true,
                "image":"https://www.google.co.in/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png"
            });
        });

    const promiseChain = Promise.all([
        //  analyticsPromise,
        pushInfoPromise
    ]);

    event.waitUntil(promiseChain);


//        console.log("clicked the notification")
    // Do something as the result of the notification click
    // const promiseChain = doSomething();
    // event.waitUntil(promiseChain);
});
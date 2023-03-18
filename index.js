const webpush = require('web-push');
var moment = require('moment');
let date = moment();
date =moment(date).format("YYYY-MM-DD HH:mm:ss");
let rabbitmq_publisher  = require("./producer");
const knex = require('knex')({
    client: 'mysql',
    // debug: ['ComQueryPacket'],
    connection: {
        host: '127.0.0.1',
        user: 'web',
        password: '123456',
        database: 'webpush'
    }
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors());
// const vapidKeys = webpush.generateVAPIDKeys();
// console.log(vapidKeys);

app.get("/site1", async function (req, res) {
    let site = await knex('sites')
        .where('id', 1)
        .first(); // Resolves to any
    //console.log(site)
    res.render('index.ejs', {"site": site});
});

app.get("/update_status", async function (req, res) {

    console.log("data from worker", JSON.stringify(req.query))

    if (req.query.status == "d") {
        let site = await knex('camp_data').insert([{
            "created_at": date,
            camp_id: req.query.camp,
            user_id: req.query.user_id,
            status: req.query.status
        }]);
    } else {

        await knex("camp_data").where({
            "camp_id": req.query.camp,
            "user_id": req.query.user_id
        }).update({   "updated_at": date,status: req.query.status});
        console.log("awaited")
    }
    //console.log(site)
    res.send({"message": "sent successfully"});
});

app.get("/campaigns", async function(req, res) {
    let camp="";
    if(req.query.id) {
         camp = await knex('camp').where("id", req.query.id)
    } else{
         camp = await knex('camp');

    }
    // console.log(camp);
    // process.exit(1)
     for(let c of camp){
         let d =        await knex('camp_data')
             .count("id as count")
             .where("camp_id",c.id).where("status","d")
         let cc =        await knex('camp_data')
             .count("id as count")
             .where("camp_id",c.id).where("status","c")
          c.delivered = d[0].count;
         c.clicked = cc[0].count;
     }

    // Resolves to any
    // if(camp.length) {
    //     camp = camp[0];
    //     camp.delivered = d[0].count;
    //     camp.clicked = c[0].count;
    // }
    res.send(camp)

});

app.get("/send", async function (req, res) {
    let site = await knex("sites").where("id", req.query.site);
    // Resolves to any
    let camp = await knex("camp").insert({"title": req.query.title, "site_id":req.query.site,"created_at": date});
    let camp_id = camp[0];
    for (let s of site) {
        webpush.setVapidDetails('mailto:prasanna08cs@gmail.com', s.publicVapidKey, s.privateVapidKey);
        let user = await knex('user')
            .where('site_id', "=", s.id)
        for (let u of user) {
            let payload = JSON.stringify({
                "user_id": u.id,
                "title": req.query.title,
                "camp_id": camp_id,
                "desc": s.description
            });

            let publish_data= {"key":u.subscription_key,"data":payload};
            rabbitmq_publisher.publish(JSON.stringify(publish_data));
            // webpush.sendNotification(JSON.parse(u.subscription_key), payload);
            console.log("sending tto tolne")
        }
    }
    res.send(site);
});


app.post('/subscribe', async (req, res) => {
    webpush.setVapidDetails('mailto:prasanna08cs@gmail.com', req.body.site.publicVapidKey, req.body.site.privateVapidKey);
    const subscription = req.body.subscription;
    res.send(200);
    data = [{
        "url": subscription.endpoint,
        "site_id": req.body.site.id,
        "subscription_key": JSON.stringify(subscription),
        "created_at": date,
        "browser":req.body.browser
    }];
    console.log(data);
    try {

        let check_user = await knex('user')
            .where({'site_id': req.body.site.id, "url": subscription.endpoint})
            .first(); // Resolves to any
        //console.log(check_user);
        // process.exit(1);
        if (check_user == undefined) {
            let rf = await knex('user').insert(data);
        } else {
            knex.where("id", check_user.id).update({
                "url": subscription.endpoint,
                "site_id": req.body.site.id,
                "subscription_key": JSON.stringify(subscription)
            });
        }

    } catch (e) {
        console.log(e);
    }
    //     console.log(rf)
    let i = 0;
    //setInterval(() => {
    const payload = JSON.stringify({title: req.body.site.name, body: i++, "time": req.body.site.description});
    //  webpush.sendNotification(subscription, payload);
    //}, 500);
});

app.listen(5000);
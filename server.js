var https = require('https');
var fs = require('fs');
const webpush = require('web-push');
var moment = require('moment');
let date = moment();
date = moment(date).format("YYYY-MM-DD HH:mm:ss");
let rabbitmq_publisher = require("./producer");
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const config = require("./config.json");
const db = require("./library/db");
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://gilace.ir:8443'
}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
const port = config.server_port;
const knex = require('knex')({
    client: 'mysql',
    // debug: ['ComQueryPacket'],
    connection: {
        host: config.mysql_host,
        user: config.mysql_user,
        password: config.mysql_pass,
        database: config.mysql_db
    }
});

var pk  = fs.readFileSync('/etc/letsencrypt/live/gilace.ir/privkey.pem', 'utf8');
var cr = fs.readFileSync('/etc/letsencrypt/live/gilace.ir/fullchain.pem', 'utf8');
var credentials = {key: pk, cert: cr};

 //const vapidKeys = webpush.generateVAPIDKeys();
 //console.log(vapidKeys);

app.get("/site1", async function (req, res) {
    let site = await db.getSiteDetails(1);
    res.render('index.ejs', {"site": site[0]});
});


app.get("/update_status", async function (req, res) {
    rabbitmq_publisher.publish(JSON.stringify(req.query), config.status_update_queue, config.status_update_binding);
    res.send({"message": "updated successfully"});
});

app.get("/campaigns", async function (req, res) {
    let camp = await db.getCampData(req.query.id);
    if (camp.length) {
        for (let c of camp) {
            let d = await knex('camp_data')
                .count("id as count")
                .where("camp_id", c.id).where("status", "d")
            let cc = await knex('camp_data')
                .count("id as count")
                .where("camp_id", c.id).where("status", "c")
            c.delivered = d[0].count;
            c.clicked = cc[0].count;
        }
    } else {
        camp = [];
    }


    res.send(camp)

});

app.get("/send", async function (req, res) {

    let site = await db.getSiteDetails(req.query.site);
    let insert_data = {"title": req.query.title, "site_id": req.query.site, "created_at": date};
    let camp = await db.setCampData(insert_data);
    let camp_id = camp[0];

    for (let s of site) {
        publishToQueue(s.id, 1, 0, req.query, camp_id);
        console.log("Data sent queue")

    }
    res.send(site);
});


async function publishToQueue(site_id, limit, offset, pub_message, camp_id) {
    let user = await db.getUserDetails(site_id, limit, offset);
    let data_array = [];
    for (let u of user) {
        let payload = JSON.stringify({
                "user_id": u.id,
                "title": pub_message.title,
                "camp_id": camp_id,
                "desc": pub_message.desc
            }
        );
        let publish_data = {"key": u.subscription_key, "data": payload};
        data_array.push(publish_data);
    }
    rabbitmq_publisher.publish(JSON.stringify(data_array), config.publisher_queue, config.publisher_routing);
    if (user.length) {
        let newoffset = offset + limit;
        publishToQueue(site_id, limit, newoffset);
    } else {
        return
    }
}

app.post('/subscribe', async (req, res) => {
    //webpush.setVapidDetails('mailto:prasanna08cs@gmail.com', req.body.site.publicVapidKey, req.body.site.privateVapidKey);
    const subscription = req.body.subscription;
    res.send(200);
    data = [{
        "url": subscription.endpoint,
        "site_id": req.body.site.id,
        "subscription_key": JSON.stringify(subscription),
        "created_at": date,
        "browser": req.body.browser
    }];

    try {

        let check_user = await knex('user')
            .where({'site_id': req.body.site.id, "url": subscription.endpoint})
            .first(); // Resolves to any

        if (check_user == undefined) {
            let rf = await knex('user').insert(data);
        } else {
            await knex("user").where("id", check_user.id).update({
                "url": subscription.endpoint,
                "site_id": req.body.site.id,
                "subscription_key": JSON.stringify(subscription)
            });
        }

    } catch (e) {
        console.log(e);
    }

    // let i = 0;
    //setInterval(() => {
    // const payload = JSON.stringify({title: req.body.site.name, body: i++, "time": req.body.site.description});
    //  webpush.sendNotification(subscription, payload);
    //}, 500);
});

var httpsServer = https.createServer(credentials, app);

app.listen(port);
console.log("Server running " + port)

httpsServer.listen(8443, () => {
    console.log("httpsServer is runing at port 8443");
  });
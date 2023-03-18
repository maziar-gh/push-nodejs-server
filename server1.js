

const webpush = require('web-push');
//const vapidKeys =webpush.generateVAPIDKeys();
//console.log(vapidKeys.publicKey, vapidKeys.privateKey);
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host : '127.0.0.1',
        user : 'web',
        password : '123456',
        database : 'webpush'
    }
});
 //const publicVapidKey = "BAWVsWhutZCYzj0aTVc8_q_NdV_B3CwSYKdrS1Kvrm5WqmUa4rz6Yzun6WbtQn-Lr0SHyvKTE7bUyNof7bExzvA";
 //const privateVapidKey = "aY-CNhCXO1AVsVl6k7xaUEkoVy1f4PjMaHe5Cmw3PFg";


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const webpush = require('web-push');

const app = express();
app.use(express.static('public'))
app.use(bodyParser.json());
app.use(cors());

// app.get("/site1", async function(req, res) {
//    let site= await knex('sites')
//         .where('id',1)
//         .first(); // Resolves to any
//         console.log(site)
//     res.render('index.ejs',{"site":site});
// });
app.get("/site2", async function(req, res) {
    let site= await knex('sites')
        .where('id',2)
        .first(); // Resolves to any
    console.log(site)
    res.render('index.ejs',{"site":site});
});

app.post('/subscribe', (req, res) => {
    webpush.setVapidDetails('mailto:prasanna08cs@gmail.com', req.body.site.publicVapidKey, req.body.site.privateVapidKey);
    const subscription = req.body.subscription;
    res.send(200);
    knex.raw(knex('user').insert([{"site_id":req.body.site.id,"subscription_key":subscription,"created_at":Math.floor(new Date() / 1000)}]).toString().replace('insert', 'INSERT IGNORE'));
        console.log(req.body.site);
    let i = 0;
    //setInterval(() => {
        const payload = JSON.stringify({ title: req.body.site.name, body: i++,"time":req.body.site.description });
        webpush.sendNotification(subscription, payload);
    //}, 500);
});

app.listen(5001);
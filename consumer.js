const amqp = require('amqplib/callback_api');
let amqpConn = null;
const config = require("./config.json");
const url = config.rabbitmq_url;
const exchange = config.webpush_exchange;
const queue = config.publisher_queue;
const routing = config.publisher_routing;
const webpush = require('web-push');
const moment = require('moment');
let date = moment();
date = moment(date).format("YYYY-MM-DD HH:mm:ss");
const  db =require("./library/db");


function start() {
    amqp.connect(url + "?heartbeat=60", function (err, conn) {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }

        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;
        whenConnected();
    });
}

function whenConnected() {

    startWorker();
}

function startWorker() {
    amqpConn.createChannel(function (err, ch) {
        if (closeOnErr(err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });

        ch.prefetch(10);
        ch.assertQueue(routing, {durable: true}, function (err, _ok) {
            if (closeOnErr(err)) return;
            ch.consume(queue, processMsg, {noAck: false});
            console.log("Worker is started");
        });

        function processMsg(msg) {
            work(msg, function (ok) {
                try {
                    if (ok)
                        ch.ack(msg);
                    else
                        ch.reject(msg, true);
                } catch (e) {
                    closeOnErr(e);
                }
            });
        }

        async function work(msg, cb) {
            let queue_data = JSON.parse(msg.content.toString());

            if (!queue_data.length) {
                return;
            }

            for (let d of queue_data) {
                let data = JSON.parse(d.data);

                let quer = await db.getCampData(data.camp_id);
                quer =quer[0];

                let site = await db.getSiteDetails(quer.site_id);
                site =site[0];
                let insert = await  db.setCampaginData([{
                    "created_at": date,
                    camp_id: data.camp_id,
                    user_id: data.user_id,
                    status: "s"
                }]);

                webpush.setVapidDetails('mailto:prasanna08cs@gmail.com', site.publicVapidKey, site.privateVapidKey);
                webpush.sendNotification(JSON.parse(d.key), d.data);
                console.log("sent the notification", insert)

            }
            cb(true);
        }
    });
}

function closeOnErr(err) {
    if (!err) return false;
    console.error("[AMQP] error", err);
    amqpConn.close();
    return true;
}

function current_time() {
    now = new Date();
    hour = "" + now.getHours();
    if (hour.length == 1) {
        hour = "0" + hour;
    }
    minute = "" + now.getMinutes();
    if (minute.length == 1) {
        minute = "0" + minute;
    }
    second = "" + now.getSeconds();
    if (second.length == 1) {
        second = "0" + second;
    }
    return hour + ":" + minute + ":" + second;
}

start();
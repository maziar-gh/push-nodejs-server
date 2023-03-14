const amqp = require('amqplib/callback_api');
let amqpConn = null;
const config = require("./config.json");
const url = config.rabbitmq_url;
const exchange = config.webpush_exchange;

function start(data, queue, routing) {
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
        whenConnected(data, queue, routing);
    });
}

function whenConnected(data, queue, routing) {
    console.log("Publisher running");
    startPublisher(data, queue, routing);

}

function startPublisher(data, queue, routing) {
    amqpConn.createConfirmChannel(function (err, ch) {
        if ((err)) return;
        ch.on("error", function (err) {
            console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
            console.log("[AMQP] channel closed");
        });
        pubChannel = ch;

        pubChannel.assertExchange(exchange, "topic", {autoDelete: false, durable: true, passive: true})

        pubChannel.bindQueue(queue, exchange, '');
        try {
            pubChannel.publish(exchange, routing, Buffer.from(data), {},
                function (err, ok) {
                    if (err) {
                        console.error("[AMQP] publish", err);

                        //pubChannel.connection.close();
                    } else {
                        console.log("published to queue")
                    }
                });
        } catch (e) {
            console.error("[AMQP] failed", e.message);

        }


    });
}

module.exports.publish = start;
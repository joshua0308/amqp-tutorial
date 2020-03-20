const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    let queue = 'hello'; // declare the queue from which we are going to consume

    // we declare the queue here as well bc we might start the consumer before the publisher
    // we want to make sure the queue exists before we try to consume messages from it
    channel.assertQueue(queue, {
      durable: false
    })

    console.log(" [*] Waiting for messages in %s. To exist press CTRL+C", queue);

    // declare a callback that will be executed when RabbitMQ pushes messages to our conumer
    channel.consume(queue, function(msg) {
      console.log(" [x] Received %s", msg.content.toString())
    }, {
      noAck: true
    })

  })
})
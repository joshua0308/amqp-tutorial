const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  // create channel using the connection
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    // declare a queue for us to send to
    let queue = 'hello';
    let msg = 'Hello world!'

    channel.assertQueue(queue, {
      durable: false
    })

    // send message to queue
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] sent %s", msg)
  })

  // close connection and exit after sending the message
  setTimeout(function() {
    connection.close();
    process.exit(0)
  })
})


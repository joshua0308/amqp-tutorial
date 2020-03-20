const amqp = require('amqplib/callback_api')

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = 'task_queue';

    // we declare the queue here as well bc we might start the consumer before the publisher
    // we want to make sure the queue exists before we try to consume messages from it
    channel.assertQueue(queue, {
      durable: true
    })

    // fair dispatch: this tells rabbitmq not to dispatch a new message to a worker until
    // it has processed and acknowledged the previous one. It will dispatch it to the
    // next worker that is not busy.
    channel.prefetch(1);

    // declare a callback that will be executed when RabbitMQ pushes messages to our conumer
    channel.consume(queue, function(msg) {
      let secs = msg.content.toString().split('.').length - 1;

      console.log(" [x] Received %s", msg.content.toString())
      setTimeout(function() {
        console.log(" [x] Done");
        // need to acknowledge messages if noAck is false
        // forgetting to acknowledge will lead to memory leak in rabbitmq server
        channel.ack(msg);
      }, secs * 1000)
    }, {
      // turn on manual consumer acknowledgement
      // send a proper acknowledgement from the worker once we're done with a task
      noAck: false
    })

  })
})
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
    const msg = process.argv.slice(2).join(' ') || 'Hello World!';

    channel.assertQueue(queue, {
      // to make sure that messages aren't lost: we need to do two things
      // 1. mark queue as durable
      // 2. mark message as persistent
      durable: true
    })

    channel.sendToQueue(queue, Buffer.from(msg), {
      // need to mark a message as persistent
      persistent: true
    });

    console.log(" [x] sent as %s", msg)

    setTimeout(function() {
      connection.close();
      process.exit(0)
    })
  })

})


const kafka = require('kafka-node');
const uuid = require('uuid');

let lastImpressionId = uuid.v4()

const userIds = [uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4()]

function produceImpression() {
	console.log('impression')
	lastImpressionId = uuid.v4()
	let payloads = [{
		topic: 'impressions',
		messages: JSON.stringify({
			impressionId: lastImpressionId,
			userId: userIds[Math.floor(Math.random() * 4)],
			date: new Date(),
		})
	}]

    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('We fucked up secind the payload');
		console.log(err);
      } else {
        console.log('Data sent');
        console.log(data);
      }
    });
}

// Add time to event
function produceEvent() {
	
	if (Math.random() > 0.2) {
		return 
	}
	console.log('impression')
	lastImpressionId = uuid.v4()
	let payloads = [{
		topic: 'events',
		messages: JSON.stringify({
			impressionId: lastImpressionId,
			event: 'click'
		})
	}]

    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('We fucked up secind the payload');
		console.log(err);
      } else {
        console.log('Data sent');
        console.log(data);
      }
    });
}

const HighLevelProducer = kafka.HighLevelProducer;
const client = new kafka.KafkaClient({
	kafkaHost: 'kafka:9092'
});
const producer = new HighLevelProducer(client);

producer.on('ready', async function() {
	setInterval(produceImpression, 9000);
	setInterval(produceEvent, 1500)
});

producer.on('error', function(err) {
	console.log(err);
	console.log('we done errored');
	throw err;
});
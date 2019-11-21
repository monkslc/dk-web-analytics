const kafka = require('kafka-node');
const uuid = require('uuid');

console.log('\n\n\n\n\n\n\n\n\n')
console.log('STARTING SERVICE AT TIME:' , new Date())
console.log('\n\n\n\n\n\n\n\n\n')

let lastImpressionId = uuid.v4()

const userIds = [uuid.v4(), uuid.v4(), uuid.v4(), uuid.v4()]

function produceImpression() {
	lastImpressionId = uuid.v4()
	let payloads = [{
		topic: 'impressions',
		messages: JSON.stringify({
			impressionId: lastImpressionId,
			userId: userIds[Math.floor(Math.random() * 4)],
			impressionDate: new Date(),
		})
	}]

    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('We fucked up secind the payload');
		console.log(err);
      } else {
        //console.log('Data sent');
        //console.log(data);
      }
    });
}

// Add time to event
function produceEvent() {
	
	if (Math.random() > 0.2) {
		return 
	}
	//console.log('impression')
	lastImpressionId = lastImpressionId
	let payloads = [{
		topic: 'click-events',
		messages: JSON.stringify({
			impressionId: lastImpressionId,
			event: 'click',
			clickDate: new Date()
		})
	}]

    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('We fucked up secind the payload');
		console.log(err);
      } else {
        //console.log('Data sent');
        //console.log(data);
      }
    });
}

const HighLevelProducer = kafka.HighLevelProducer;
const Consumer = kafka.Consumer;
const client = new kafka.KafkaClient({
	kafkaHost: 'kafka:9092'
});
const producer = new HighLevelProducer(client);

producer.on('ready', async function() {
	producer.createTopics(['impressions','click-events', 'populated-click-events'], true, function (err, data) {
		//console.log(err)
   		//console.log(data);
		const consumer = new Consumer(
			client,
			[{topic: 'click-events'}, {topic: 'impressions'}, {topic: 'populated-click-events'}]
		);

		consumer.on('message', (msg) => {
			//console.log('Hey, we received a message from kafka')
			//console.log(msg)
			
			const event = JSON.parse(msg.value)	
			if (msg.topic === 'click-events') {
				handleClickEvent(event)
			} else if (msg.topic === 'impressions') {
				handleImpressionEvent(event)
			} else if (msg.topic === 'populated-click-events') {
				console.log('hey, populated click event is working')
				console.log(msg)
			}
		})

		consumer.on('error', (err) => {
			console.log('Hey, we received an error from kafka')
			console.log(err)
		})
	});
	setInterval(produceImpression, 9000);
	setInterval(produceEvent, 1500)
});

producer.on('error', function(err) {
	console.log(err);
	console.log('we done errored');
	throw err;
});

function handleImpressionEvent(impression) {
	const impressionId = impression.impressionId
	delete impression.impressionId
	const keyValues = Object.keys(impression).reduce( (accum, key) => {
		accum.push(key)	
		accum.push(impression[key])
		return accum
	}, [])
	const hmsetValues = [impressionId, ...keyValues]
	redisClient.hmset(hmsetValues, () => {
		redisClient.hgetall(impressionId, redis.print) 
	})
}

function handleClickEvent(clickEvent) {
	redisClient.hgetall(clickEvent.impressionId, (err, resp) => {
		const populatedClickEvent = {
			...clickEvent,
			...resp			
		}
		lastImpressionId = uuid.v4()
		let payloads = [{
			topic: 'populated-click-events',
			messages: JSON.stringify(populatedClickEvent)
		}]

    producer.send(payloads, (err, data) => {
      if (err) {
        console.log('We fucked up secind the payload');
		console.log(err);
      } else {
        //console.log('Data sent');
        //console.log(data);
      }
    });
	})
}

// REDIS
const redis = require("redis")

const redisClient = redis.createClient({
	host: 'redis',
	port: '6379'
})

redisClient.on('error', (err) => {
	console.log('\n\n\n\n\n')
	console.log('REDIS ERROR')
	console.log(err)
	console.log('\n\n\n\n\n')
})

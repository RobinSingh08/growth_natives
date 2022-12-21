const mqtt = require('mqtt');
const redis = require('redis');

const client = mqtt.connect('mqtt://server:1883');
const redisClient = redis.createClient();

client.on('connect', () => {
  console.log('MQTT client connected');
  client.subscribe('student/typing');
});

client.on('message', (topic, message) => {
  if (topic === 'student/typing') {
    // extract the roll no from the topic
    const rollNo = topic.split('/')[1];
    // update the student's data in Redis
    redisClient.hincrby(rollNo, 'words', 1);
    redisClient.hincrby(rollNo, 'characters', message.length);
  }
});

// initialize a timer to calculate the words/minute and characters/minute for each student
setInterval(() => {
  redisClient.keys('*', (err, keys) => {
    keys.forEach((key) => {
      redisClient.hgetall(key, (err, data) => {
        const wordsPerMinute = data.words / (data.elapsedTime / 60000);
        const charactersPerMinute = data.characters / (data.elapsedTime / 60000);
        // update the student's data in Redis with the words/minute and characters/minute
        redisClient.hmset(key, {
          wordsPerMinute,
          charactersPerMinute,
        });
      });
    });
  });
}, 60000);
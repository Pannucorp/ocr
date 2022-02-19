// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename:"./APIKey.json"
})

async function setEndpoint() {
  const [result] = await client.textDetection('./7.png');
  const labels = result.textAnnotations;
  console.log('Text:');
  console.log(labels[0]['description']);
}
setEndpoint();


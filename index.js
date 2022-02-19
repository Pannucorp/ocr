
const cors = require('cors');
const express = require('express');
var bodyParser = require('body-parser');
// set some server variables
const http = require('http');
const app = express();
const port = (process.env.npm_config_PORT || 3000);

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename:"./APIKey.json"
})
function setupServer() {
    const server = http.createServer(app);
    server.listen(port, () => {
        console.log('Running server on port %s', port);
    });
    app.use(cors());
    app.post('/api/ocr', async function (req, res) {
        const [result] = await client.textDetection(req.body.fileUrl);
        const labels = result.textAnnotations;
        console.log('Text:');
        console.log(labels[0]['description']);
        // console.log("##translate input data##", req.body); //text: body:'This is jason', targetLanguage: zh?
        res.send(labels[0]['description']);
    });
}

setupServer();
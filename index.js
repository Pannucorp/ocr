
const cors = require('cors');
const express = require('express');
var bodyParser = require('body-parser');
// set some server variables
const http = require('http');
const app = express();
const port = (process.env.npm_config_PORT || 8080);

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
  keyFilename:"./APIKey.json"
})

// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Imports the Google Cloud client library
const vision = require('@google-cloud/vision');

// Creates a client
const client1 = new language.LanguageServiceClient({
    keyFilename: "./APIKey.json"
});

var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/';
var dbo;
MongoClient.connect(url, async function (err, db) {
    console.log("DB connected");
    dbo = db.db("OCR");
})


// const text = 'Google, headquartered in Mountain View (1600 Amphitheatre Pkwy, Mountain View, CA 940430), unveiled the new Android phone for $799 at the Consumer Electronic Show. Sundar Pichai said in his keynote that users love their new Android phones. He goes to Humboldt Park Health and then go to IBM. He was born 01/09/1997. And his ssn is 746-05-7416 and tax number is 12-3241544 and he back to home and get Paracetamol. He wore FILA sports T-shirt. and then he meet paracetamol. his phone number is 14159004073';

async function doNLP(text) {
    /**
     * TODO(developer): Uncomment the following line to run this code.
     */
    
    // Prepares a document, representing the provided text
    const document = {
        content: text,
        type: 'PLAIN_TEXT',
    };

    // Detects entities in the document
    const [result] = await client.analyzeEntities({ document });

    const entities = result.entities;

    console.log('Entities:');
    entities.forEach(entity => {
        console.log(entity.name);
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
        }
    });
    console.log(entities);
}

function updatedPaymentcard(req) {
    let returnValue = {
        status: 200,
        data: []
    }
    let myquery = {
        type: req.body['type'],
    };
    let newvalues = { $set: { category: req.body['category'] } };
    dbo.collection("reviews").updateOne(myquery, newvalues, function (err, res) {
        if (err){
            returnValue.status=500
            returnValue.data=err
            return returnValue;
        }
        console.log("1 paymentcard updated");
        return returnValue;
    });
}

function updatedInsuranceCard(req) {
    let returnValue = {
        status: 200,
        data: []
    }
    let myquery = {
        type: req.body['type'],
    };
    let newvalues = { $set: { category: req.body['category'] } };
    dbo.collection("insurancecard").updateOne(myquery, newvalues, function (err, res) {
        if (err){
            returnValue.status=500
            returnValue.data=err
            return returnValue;
        }
        console.log("1 insuranceCard updated");
        return returnValue;
    });
}

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
    
    app.post('/api/ocr/paymentCard', async function (req, res) {
        const [result] = await client.textDetection(req.body.fileUrl);

        const labels = result.textAnnotations;
        console.log('Text:');
        console.log(labels[0]['description']);
        
        // console.log("##translate input data##", req.body); //text: body:'This is jason', targetLanguage: zh?
        //Do NLP
        
        const nlpResult = doNLP(labels[0]['description']);

        console.log(nlpResult);
        let existed=false;

        //connect dabase
        let myquery = {
            type: labels[0]['description']  //get out first ocr data, need to check
        };

        dbo.collection("paymentcard").find(myquery).toArray(function (err, result) {
            if(result.length>=1){
                existed=true;
                //get out category type

            }else{
                existed=false;
                //
                res.send(nlpResult);
            }
        });
    });

    app.get('/api/ocr/paymencard/response', async function(req, res){ 
        let returnValue = {
            status: 200,
            data: []
        }
        dbo.collection("paymentcard").find(myquery).toArray(function (err, result) {
            if(result>=1){
                res.send(updatedPaymentcard(req));
            }else{
                dbo.collection("paymentcard").insertOne(req.body, function (err, res) {
                    if (err) {
                        returnValue.status=500
                        returnValue.data=err
                        res.send(returnValue);
                        // throw err;
                    }
                    console.log("1 user document inserted");
                    res.send.status(200);
                });
            }
        })
    });

    app.post('/api/ocr/insuranceCard', async function (req, res) {
        const [result] = await client.textDetection(req.body.fileUrl);

        const labels = result.textAnnotations;
        console.log('Text:');
        console.log(labels[0]['description']);
        
        // console.log("##translate input data##", req.body); //text: body:'This is jason', targetLanguage: zh?
        //Do NLP
        
        const nlpResult = doNLP(labels[0]['description']);

        console.log(nlpResult);
        let existed=false;
        //connect dabase

        if(existed){    //First commit
            res.send(nlpResult);
        }else{          //existed commit
            res.send(nlpResult);
        }
    });

    app.get('/api/ocr/insuranceCard/response', async function(req, res){ 
        let returnValue = {
            status: 200,
            data: []
        }
        dbo.collection("insuranceCard").find(myquery).toArray(function (err, result) {
            if(result>=1){
                res.send(updatedInsuranceCard(req));
            }else{
                dbo.collection("insuranceCard").insertOne(req.body, function (err, res) {
                    if (err) {
                        returnValue.status=500
                        returnValue.data=err
                        res.send(returnValue);
                        // throw err;
                    }
                    console.log("1 user document inserted");
                    res.send.status(200);
                });
            }
        })
    });
    
}

setupServer();
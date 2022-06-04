
// Imports the Google Cloud client library
const language = require('@google-cloud/language');

// Creates a client
const client = new language.LanguageServiceClient({
    keyFilename: "./APIKey.json"
});

async function setEndpoint() { //This is only for test.
    /**
     * TODO(developer): Uncomment the following line to run this code.
     */
    const text = 'Google, headquartered in Mountain View (1600 Amphitheatre Pkwy, Mountain View, CA 940430), unveiled the new Android phone for $799 at the Consumer Electronic Show. Sundar Pichai said in his keynote that users love their new Android phones. He goes to Humboldt Park Health and then go to IBM. He was born 01/09/1997. And his ssn is 746-05-7416 and tax number is 12-3241544 and he back to home and get Paracetamol. He wore FILA sports T-shirt. and then he meet paracetamol. his phone number is 14159004073';

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
}
setEndpoint();
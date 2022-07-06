
* Use Server Key
```JavaScript
const vision = require('node-cloud-vision-api')
vision.init({auth: 'YOUR_API_KEY'})
```

* Use OAuth
```JavaScript
const vision = require('node-cloud-vision-api')
const google = require('googleapis')
const oauth2Client = new google.auth.OAuth2('YOUR_GOOGLE_OAUTH_CLIENT_ID', 'YOUR_GOOGLE_OAUTH_SECRET', 'YOUR_GOOGLE_OAUTH_CALLBACK_URL')
oauth2Client.setCredentials({refresh_token: 'YOUR_GOOGLE_OAUTH_REFRESH_TOKEN'})
vision.init({auth: oauth2Client})
```

* For others, see references.
[google-api-nodejs-client](https://github.com/google/google-api-nodejs-client/)

## Sample

```JavaScript
'use strict'
const vision = require('node-cloud-vision-api')

// init with auth
vision.init({auth: 'YOUR_API_KEY'})

// construct parameters
const req = new vision.Request({
  image: new vision.Image('/Users/tejitak/temp/test1.jpg'),
  features: [
    new vision.Feature('FACE_DETECTION', 4),
    new vision.Feature('LABEL_DETECTION', 10),
  ]
})

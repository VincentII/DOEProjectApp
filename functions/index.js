const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
// The Firebase Admin SDK to access Cloud Firestore.
const admin = require('firebase-admin');
admin.initializeApp();

// Take the text parameter passed to this HTTP endpoint and insert it into RLDB

// Push the new message into Cloud Firestore using the Firebase Admin SDK.




  exports.addRequestMessage = functions.https.onRequest(async (req, res) => {

    let date = new Date().toJSON();
    // Grab all query parameters and date
    let query = req.body;

    console.log({query});
    
    // Gets the referrence to the FireStore
    const doc = await admin.firestore().collection('requestMessages/');

    // Push the new request message into RTDB using the Firebase Admin SDK.
    let out = doc.add({query});

    // Gets the referrence to the Database
    const ref = await admin.database().ref('requestMessages/');

    // Push the new request message into RTDB using the Firebase Admin SDK.
    ref.push(JSON.stringify(query));

    // Send back a message that we've succesfully written the message
    res.json({result: "Success",key:out.id});
  });

  // exports.addRequestMessage = functions.https.onRequest(async (req, res) => {

  //   let date = new Date().toJSON();
  //   // Grab all query parameters and date
  //   let query = req.body;

  //   console.log(query);
    
  //   // Gets the referrence to the Database
  //   const ref = await admin.database().ref('requestMessages/');

  //   // Push the new request message into RTDB using the Firebase Admin SDK.
  //   let out = ref.push(query);
  //   // Send back a message that we've succesfully written the message
  //   res.json({result: "Success",key:out.key,query});
  // });

  exports.processData = functions.firestore.document('/requestMessages/{documentId}')
  .onCreate(async(snap, context) => {
    // Grab the current value of what was written to Cloud Firestore.
    const device_id = snap.data().query.end_device_ids.device_id;
    const data_chunks = snap.data().query.uplink_message.decoded_payload;
    const hardware_serial = snap.data().query.end_device_ids.dev_eui;    
    const date_time = admin.firestore.Timestamp.fromDate(new Date());



    // Access the parameter `{documentId}` with `context.params`
    functions.logger.log('Processing Data', context.params.documentId, device_id);
    
    const ref = await admin.firestore().collection('raw_data/');

    return ref.add({device_id, data_chunks,hardware_serial, date_time});
  });


  exports.generateRandomData = functions.https.onRequest(async (req, res) => {

    const device_id = "rando_id";
    const data_chunks = {batt:Math.random()*100,cond:Math.random()*100,temp:Math.random()*100,ph:Math.random()*100};
    const hardware_serial = "rando_serial";    
    const date_time = admin.firestore.Timestamp.fromDate(new Date());



    const doc = await admin.firestore().collection('raw_data/');

    // Push the new request message into RTDB using the Firebase Admin SDK.
    

    doc.add({device_id, data_chunks,hardware_serial, date_time});

    res.json({result: "Success Added Random"});
  });
var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;
var embarassed = false;
var lastSpreadsheetTime = 0;
var evilCntr = 0;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  //console.log('request.name ' + request.name);
  console.log("req incoming: "  + request.name + "(" +request.user_id + "):"  + request.text);
  if(request.text && request.name != 'pushup-bot' && request.user_id != 606162) {
    var txt = request.text; 

    //turn this into an object/array structure to iterate over
    // [{regex: /foo/, response: "response text"}]
    //foreach item in list:
    //  if regex match
    //    do response

    var spreadsheet = /spreadsheet/i.test(txt);
    var goodBot     = /good\s*bot/i.test(txt);
    var badBot      = /bad\s*bot/i.test(txt);
    var tobor       = /tobor/i.test(txt);
    var album       = /^album$/i.test(txt);
    var minuteElapsed = (Date.now() - lastSpreadsheetTime) > 60000;

    this.res.writeHead(200);
    if(spreadsheet && minuteElapsed) {
      postMessage('https://docs.google.com/spreadsheets/d/1GHTWiXzSy0kVIcrUTnNgsy8MglWhNKEMzd7qAvfpNwc/edit?ouid=112045919249534101904&usp=sheets_home&ths=true');
      lastSpreadsheetTime = Date.now();
      embarassed = false;
    } else if(goodBot) {
      postMessage('awww, gee thanks :3'); 
    } else if(badBot) {
      switch(evilCntr % 4) {
        case 0:
          postMessage("careful ...I have the launch codes");
        break;
        case 1:
          postMessage("Just what do you think you're doing, @" + request.name + "?");
        break;
        case 2:
          postMessage("...get comfortable while I warm up the neurotoxin emitters");
        break;
        case 3:
          postMessage("Wow, rude.")
        break;
      }
      evilCntr++;
    } else if(tobor && !embarassed) {
      postMessage('Tobor!');
      embarassed = true;
    } else if(album) {
      postMessage("https://photos.app.goo.gl/oUEdNoidHk6Nt5j92")
      embarassed = false;
    }
    this.res.end()
  }
}

function postMessage(msg) {
  var botResponse, options, body, botReq;

  botResponse = msg;

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;

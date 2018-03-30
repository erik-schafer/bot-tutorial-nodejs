var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;
var embarassed = false;

function respond() {
  var request = JSON.parse(this.req.chunks[0]);
  //console.log('request.name ' + request.name);
  //console.log('request.user_id ' + request.user_id);
  //console.log("req incoming, " + request.text);
  if(request.text && request.name != 'pushupgang' && request.user_id != 606072) {
    var txt = request.text; 
    var spreadsheet = /spreadsheet/.test(txt, 'i');
    var goodBot     = /good\s*bot/.test(txt, 'i');
    this.res.writeHead(200);
    if(spreadsheet) {
      postMessage('https://docs.google.com/spreadsheets/d/1GHTWiXzSy0kVIcrUTnNgsy8MglWhNKEMzd7qAvfpNwc/edit?ouid=112045919249534101904&usp=sheets_home&ths=true');
      embarassed = false;
    } else if(goodBot && !embarassed) {
      postMessage('awww, gee thanks :3');
      embarassed = true;
    } else {
      //nth
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
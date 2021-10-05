//require('newrelic');

var express = require('express') //llamamos a Express
var app = express()
var port = process.env.PORT || 3001 // establecemos nuestro puerto

app.get('/consultacpu', function(req, res) {
    const request = require('request');
    var options = {
    url: 'http://localhost:3000/api/cpu',
    };
    var violations = null;
    // Get open violations
    request.get(options,
    function(err, response, body) {
        if (response.statusCode == 200) {
            var data = JSON.parse(body);
            violations = data;
            insertViolationEvent(violations);
          
        }
    }
    );
    function insertViolationEvent(violation) {
   

    var headers = {
        'Content-Type': 'json/application',
        'X-Insert-Key': '812744935a47996068ade6ccab1bb6858084NRAL'
    };
    var options = {
        url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',
        headers: headers
    }
    options['body'] = JSON.stringify(
    {

        'eventType': 'ManoloPrueba1',
        'usr': Number(violation.usr),
        'sys': Number(violation.sys),
        'idle': Number(violation.idle),
       
    });

    console.log('DATOS ENVIADOS A NEWRELIC:'+options);
    request.post(options);



    }
})
// iniciamos nuestro servidor
app.listen(port)
console.log('Front escuchando en el puerto ' + port)
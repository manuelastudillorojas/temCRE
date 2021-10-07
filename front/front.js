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
    const host = 'ec2-3-138-101-218.us-east-2.compute.amazonaws.com';
    options['body'] = JSON.stringify(
    {

        'eventType': 'ManoloPrueba1',
        'usr': Number(violation.usr),
        'host': host,
        'sys': Number(violation.sys),
        'idle': Number(violation.idle),
       
    });

    console.log('DATOS ENVIADOS A NEWRELIC:'+options);
    request.post(options);



    }
})


app.get('/consultadf', function(req, res) {
    const request = require('request');
    var options = {
        url: 'http://localhost:3000/api/df',
    };
    var violations = null;
    // Get open violations
    request.get(options,
        function(err, response, body) {
            if (response.statusCode == 200) {
            var data = JSON.parse(body);
            violations = data;

                for (var i = 0; i < violations.length; i++) {
                    //console.log(violations[i]);
                    if(violations[i]!== null){
                        insertViolationEvent(violations[i]);
                    }
                
                }


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
        const host = 'ec2-52-15-76-219.us-east-2.compute.amazonaws.com';
        options['body'] = JSON.stringify(

            {
                'eventType': 'JoseDF',
                'host': host,
                'mount': violation.mount,
                'tamano': Number(violation.tamano),
                'usado': Number(violation.usado),
                'disp': Number(violation.disp),
                'usadoperc': Number(violation.usadoperc),
                'fs': violation.fs,
            }
        );
        console.log('DATOS ENVIADOS A NEWRELIC:'+options);
        request.post(options);
    } 

})

app.get('/consultamemoria', function(req, res) {

    const request = require('request');
    var options = {
        url: 'http://localhost:3000/api/memoria',
    };
    var violations = null;
    request.get(options,
    function(err, response, body) {
    
        if (response.statusCode == 200) {
        
        var data = JSON.parse(body);
        violations = data;
         insertViolationEvent(violations);
        }
    
    });
    
    function insertViolationEvent(violation) {
    
        var headers = {
        
        'Content-Type': 'json/application',
        
        'X-Insert-Key': '812744935a47996068ade6ccab1bb6858084NRAL'
        
        };
        var options = {
            
            url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',
            
            headers: headers
        
        }
        const host = 'ec2-18-223-187-141.us-east-2.compute.amazonaws.com';
        options['body'] = JSON.stringify(
        
            {
            
            'eventType': 'ReinierMem',
            'host': host,
            'total': Number(violation.total),
            'used': Number(violation.used),
            'free': Number(violation.free),
            'shared': Number(violation.shared),
            'buffcache': Number(violation.buffercache),
            'available': Number(violation.available),
            
            }
            
        );
        
       console.log('DATOS ENVIADOS A NEWRELIC:'+options);
       request.post(options);
        
        
    
    }
    
 })



 app.get('/consultaup', function(req, res) {    const request = require('request');    
var options = {    url: 'http://localhost:3000/api/up',    };    
var violations = null;    // Get open violations    
request.get(options,    
    function(err, response, body) {        
        if (response.statusCode == 200) {            
            var data = JSON.parse(body);            
violations = data;            

insertViolationEvent(violations);     
             }  
  }  
  ); 
function insertViolationEvent(violation) {       
    var headers = {
         'Content-Type': 'json/application', 
         'X-Insert-Key': '812744935a47996068ade6ccab1bb6858084NRAL' 
       };
    var options = {       
     url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',       
     headers: headers    }  
     options['body'] = JSON.stringify(    {   
             'eventType': 'PruebaIvan',
    	     'hora':violation.hora,
             'updown':violation.updown,
             'uptime':violation.uptime,
             'usuarios':violation.usuarios,
             'unmin': violation.unmin,     
             'cinmin': violation.cinmin,      
             'quinmin': violation.quinmin,
	            
        });  

        console.log('DATOS ENVIADOS A NEWRELIC:'+options);   
        request.post(options);    }})
// iniciamos nuestro servidor
app.listen(port)
console.log('Front escuchando en el puerto ' + port)
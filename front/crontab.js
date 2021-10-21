require('dotenv').config()
var CronJob = require('cron').CronJob;
const request = require('request');

const hostJose = process.env.HOST_JOSE;
const hostManuel = process.env.HOST_MANUEL;
const hostReinier = process.env.HOST_REINIER;
const hostIvan = process.env.HOST_IVAN;
const insertKey = process.env.INSERT_KEY;

//var job = new CronJob('* * * * *', function() {

var job = new CronJob('* * * * *', function() {

    console.log('INICIANDO SECUENCIA DE DATOS');

    getCpu();
    getConsultaDF();
    consultaMemoria();
    consultaUP();

}, null, true, 'America/Santiago');

job.start();



function getCpu() {
    
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
   
        console.log('key '+insertKey)
    var headers = {
        'Content-Type': 'json/application',
        'X-Insert-Key': insertKey
    };
    var options = {
        url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',
        headers: headers
    }
    
    options['body'] = JSON.stringify(
    {
        'eventType': 'AgentCPU',
        'usr': Number(violation.usr),
        'host': hostManuel,
        'sys': Number(violation.sys),
        'idle': Number(violation.idle),
       
    });
   
    console.log('DATOS ENVIADOS A NEWRELIC Manuel:'+options);
    request.post(options);
    


    }
}
function getConsultaDF() {

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
            'X-Insert-Key': insertKey
        };
        var options = {
            url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',
            headers: headers
        }
       
        options['body'] = JSON.stringify(

            {
                'eventType': 'AgentDisco',
                'host': hostManuel,
                'mount': violation.mount,
                'tamano': Number(violation.tamano),
                'usado': Number(violation.usado),
                'disp': Number(violation.disp),
                'usadoperc': Number(violation.usadoperc),
                'fs': violation.fs,
            }
        );
        console.log('DATOS ENVIADOS A NEWRELIC Jose:'+options);
        request.post(options);
    } 

}

function consultaMemoria(){

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
        
        'X-Insert-Key': insertKey
        
        };
        var options = {
            
            url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',
            
            headers: headers
        
        }
        options['body'] = JSON.stringify(
        
            {
                'eventType': 'AgentMemoria',
                'host': hostManuel,
                'total': Number(violation.total),
                'used': Number(violation.used),
                'free': Number(violation.free),
                'shared': Number(violation.shared),
                'buffcache': Number(violation.buffercache),
                'available': Number(violation.available),
            }
            
        );
        
       console.log('DATOS ENVIADOS A NEWRELIC Reinier:'+options);
       request.post(options);
        
        
    
    }
    
 }


 function consultaUP(){ 
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
      'X-Insert-Key': insertKey 
    };
    var options = {       
         url: 'https://insights-collector.newrelic.com/v1/accounts/3270870/events',       
         headers: headers    }  
         options['body'] = JSON.stringify(    {   
                'eventType': 'AgentUpTime',
                'host':hostManuel,
            	'hora':violation.hora,
                'updown':violation.updown,
                'uptime':violation.uptime,
                'usuarios':violation.usuarios,
                'unmin': violation.unmin,     
                'cinmin': violation.cinmin,      
                'quinmin': violation.quinmin,
                    
            });  

     console.log('DATOS ENVIADOS A NEWRELIC Ivan:'+options);   
     request.post(options);    
    }
}

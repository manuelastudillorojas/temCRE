const { Console } = require('console');
var express = require('express') //llamamos a Express
var app = express()
const fs = require('fs')
const SSH = require('simple-ssh');
var port = process.env.PORT || 3000 // establecemos nuestro puerto


app.get('/api/cpu', function(req, res) {
      const pemfile = 'mastudillo.pem';
      const user = 'ubuntu';
      const host = 'ec2-3-138-101-218.us-east-2.compute.amazonaws.com';
      const p = '%{NUMBER:usr}%{SPACE}%{NUMBER:sys}%{SPACE}%{NUMBER:idle}';

  const ssh = new SSH({
  host: host,
  user: user,
  key: fs.readFileSync(pemfile)
  });
  let ourout = "";
  ssh.exec("mpstat | tail -n 2 ", {
    exit: function() {
    console.log('3:', ourout);
    require('grok-js').loadDefault((err, patterns) => {
      if (err) {
      console.error(err);
      return;
      }
    const pattern = patterns.createPattern(p);
    pattern.parse(ourout, (err, obj) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('PARSEO', obj);
      res.json(
      obj
      );
    });
    });
    },
    out: function(stdout) {
    ourout += stdout;
  }
  }).start({
    success: function() {
    },
    fail: function(e) {
      console.log("failed connection, boo");
      console.log(e);
    }
  });
})



app.get('/api/df', function(req, res) {
  const pemfile = 'mastudillo.pem';
  const user = 'ubuntu';
  const host = 'ec2-3-138-101-218.us-east-2.compute.amazonaws.com';
  const p = '%{DATA:mount}%{SPACE}%{NUMBER:tamano}%{SPACE}%{NUMBER:usado}%{SPACE}%{NUMBER:disp}%{SPACE}%{NUMBER:usadoperc}%{NOTSPACE}%{SPACE}%{UNIXPATH:fs}';

  const ssh = new SSH({
  host: host,
  user: user,
key: fs.readFileSync(pemfile)
});

let ourout = "";
ssh.exec("df | tail +2", {
exit: function() {

require('grok-js').loadDefault((err, patterns) => {
  if (err) {
  console.error(err);
  return;

  }
  const pattern = patterns.createPattern(p);

  let indice = ourout
  const todaslaslineas = indice.split(/\n/g);
  let obj1 = [];

  let c=0;

  todaslaslineas.forEach((unalinea) =>
    {
      let indice = unalinea.split(/,/);
      obj1 = indice;

      pattern.parse(indice, (err, obj) => {
        if (err) {
        console.error(err);
        return;
        }
        
        detalle.push(obj);
    //console.log('detalle', detalle);
  
  });


  });


  res.json(detalle);

});
},


out: function(stdout) {
ourout += stdout;

}
}).start({
success: function() {
 
},
fail: function(e) {
console.log("failed connection, boo");
console.log(e);
}
});
})


app.get('/api/memoria', function(req, res) {

  const pemfile = 'mastudillo.pem';
  const user = 'ubuntu';
  const host = 'ec2-3-138-101-218.us-east-2.compute.amazonaws.com';
  const p = '%{BASE16NUM:total} %{BASE16NUM:used} %{BASE16NUM:free} %{BASE16NUM:shared} %{BASE16NUM:buffcache}';
  const ssh = new SSH({
  
    host: host,
    user: user,
    key: fs.readFileSync(pemfile)
  
  });
  
  let ourout = "";
  
  ssh.exec("free -m | tail -n 3 | awk '{ print $1 "+ ' " "'+ " $2 "+ ' " "'+ " $3 "+ ' " "'+ " $4 "+ ' " "'+ " $5 "+ ' " "'+ " $6 }'", {
  
  exit: function() {
  
    console.log('3:', ourout);
    require('grok-js').loadDefault((err, patterns) => {
  
  if (err) {
  
    console.error(err);
  
  return;
  
  }
  
    const pattern = patterns.createPattern(p);
    
    pattern.parse(ourout, (err, obj) => {
    
    if (err) {
    
    console.error(err);
    
    return;
    
    }
    
    console.log('PARSEO', obj);
    
    res.json(obj);
    
    });
  
  });
  
  },
  
  out: function(stdout) {
  
  ourout += stdout;
  
  }
  
  }).start({
  
  success: function() {
  
  },
  
  fail: function(e) {
  
  console.log("failed connection, boo");
  
  console.log(e);
  
  }
  
  });
  
  })

  app.get('/api/up', function(req, res) {
    const pemfile = 'mastudillo.pem';
    const user = 'ubuntu';
    const host = 'ec2-3-138-101-218.us-east-2.compute.amazonaws.com';
    //const p = '%{TIME:hora}%{SPACE}%{WORD:estado}%{SPACE}%{NUMBER:idle}:%{NUMBER:idle}%{GREEDYDATA:metricas}';
    const p ='%{TIME:hora}%{SPACE}%{WORD:updown}%{SPACE}%{DATA:uptime},%{SPACE}%{DATA:usuarios},%{SPACE}%{DATA}:%{SPACE}%{NOTSPACE:unmin},%{SPACE}%{NOTSPACE:cinmin},%{SPACE}%{NOTSPACE:quinmin}';
    const ssh = new SSH({
    host: host,
    user: user,
    key: fs.readFileSync(pemfile)
    });
    
    let ourout = "";
    ssh.exec("uptime" , {
    exit: function() {
    console.log('3:', ourout);
    require('grok-js').loadDefault((err, patterns) => {
    if (err) {
    console.error(err);
    return;
    }
    const pattern = patterns.createPattern(p);
    pattern.parse(ourout, (err, obj) => {
    if (err) {
    console.error(err);
    return;
    }
    console.log('PARSEO', obj);
    res.json(
    obj
    );
    });
    });
    },
    out: function(stdout) {
    ourout += stdout;
    }
    }).start({
    success: function() {
    },
    fail: function(e) {
    console.log("failed connection, boo");
    console.log(e);
    }
    });
    })


// iniciamos nuestro servidor
app.listen(port)
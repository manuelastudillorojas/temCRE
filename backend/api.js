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
// iniciamos nuestro servidor
app.listen(port)
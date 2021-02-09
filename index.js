const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

const fs = require('fs');
const credsFile = fs.readFileSync('creds.json');
const creds = JSON.parse(credsFile);

const { Client } = require('pg');

const client = new Client(creds.redshift);

client.connect(function(err) {
  if(err) {
    return console.error('could not connect to postgres', err);
  }
});

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/src/html/index.html'));
});

app.get('/test', async (req,res) => {
    const query = "SELECT * FROM es_articles_test LIMIT 5";
    client.query(query, function(err, result) {
      if(err) {
        res.json({error : `error running query : ${err}`});
      }
      res.json({result : result});
    });    
})



//add the router
app.use('/', router);
app.use(express.static(path.join(__dirname, 'src')));
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
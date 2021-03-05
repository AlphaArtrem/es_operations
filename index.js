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

app.get('/articles', async (req,res) => {
  let query = "SELECT * FROM es_articles_test ORDER BY timestamp_unix DESC LIMIT 100";

  if(Object.keys(req.query).length > 0){
    query = "SELECT * FROM es_articles_test WHERE ";
    if("sport" in req.query){
      if(req.query.sport !== "All Sports"){
        query += `'${req.query.sport.replace(/_/g, " ")}' LIKE '%' || sports || '%' AND `;
      }
    }
  
    if("entity" in req.query){
      if(req.query.entity !== "All Entities"){
        query += `'${req.query.entity.replace(/_/g, " ")}' LIKE '%' || entities || '%' AND `;
      }
    }
  
    if("writer" in req.query){
      if(req.query.writer !== "All Writers"){
        query += `author = '${req.query.writer.replace(/_/g, " ")}' AND `;
      }  
    }
  
    if("startTime" in req.query && "endTime" in req.query){
      const start = new Date(req.query.startTime);
      const end = new Date(req.query.endTime);
      start.setHours(start.getHours() + 5);
      start.setMinutes(start.getMinutes() + 30);
      end.setHours(start.getHours() + 23);
      end.setMinutes(start.getMinutes() + 59);
      query += `timestamp_ist BETWEEN '${start.toISOString()}' AND '${end.toISOString()}' `;
    }

    if(query.substring(query.length - 4) === "AND "){
      query = query.substring(0, query.length - 4);
    }

    query += "ORDER BY timestamp_unix DESC";
  }

  console.log(query);
  client.query(query, function(err, result) {
    if(err) {
      res.json({error : err });
    }
    res.json({result : result});
  });    
});

app.get('/sports', async (req,res) => {
  const query = "SELECT sports FROM es_articles_test GROUP BY sports";
  client.query(query, function(err, result) {
    if(err) {
      res.json({error : err });
    }
    res.json({result : result});
  });    
});

app.get('/entities', async (req,res) => {
  const query = `SELECT entities FROM es_articles_test WHERE sports = '${req.query.sport}' GROUP BY entities`;
  client.query(query, function(err, result) {
    if(err) {
      res.json({error : err });
    }
    res.json({result : result});
  });    
});

app.get('/writers', async (req,res) => {
  const query = `SELECT author FROM es_articles_test GROUP BY author`;
  client.query(query, function(err, result) {
    if(err) {
      res.json({error : err });
    }
    res.json({result : result});
  });    
});

//add the router
app.use('/', router);
app.use(express.static(path.join(__dirname, 'src')));
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
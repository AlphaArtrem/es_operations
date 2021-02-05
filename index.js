const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();

router.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/src/html/index.html'));
  //__dirname : It will resolve to your project folder.
});

app.get('/test',(req,res)=>{
    //res.sendFile(__dirname +"/views/test.html",);
    res.json({title:"api",message:"root"});
})

//add the router
app.use('/', router);
app.use(express.static(path.join(__dirname, 'src')));
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');
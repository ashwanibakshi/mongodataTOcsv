var express     = require('express');
var mongoose    = require('mongoose');
var faker       = require('faker');
var bodyParser  = require('body-parser');
var csvModel    = require('./models/csv');
var fs          = require('fs');

//connect to db
mongoose.connect('mongodb://localhost:27017/csvdemoo',{useNewUrlParser:true})
.then(()=>console.log('connected to db'))
.catch((err)=>console.log(err))

//init app
var app = express();

//set the template engine
app.set('view engine','ejs');

//fetch data from the request
app.use(bodyParser.urlencoded({extended:false}));

//default pageload
app.get('/',(req,res)=>{
  
     var x =[];
     for(var i=0;i<10;i++){
         x.push({
             'firstName':faker.name.firstName(),
             'lastName':faker.name.lastName(),
             'phoneNumber':faker.phone.phoneNumber()
         });
     }
     //save data in collection
     csvModel.insertMany(x,(err,savedData)=>{
         if(err){
             console.log(err);
         }else{
             //fetch data from collection
             csvModel.find((err,data)=>{
                 if(err){
                     console.log(err);
                 }else{
                     res.render('demo',{data:data});
                 }
             });
         }
     });
});

//download
app.post('/',(req,res)=>{
 csvModel.find((err,data)=>{
     if(err){
         console.log(err);
     }else{
        const { parse } = require('json2csv');
        const fields = ['firstName', 'lastName', 'phoneNumber'];
        const opts = { fields,delimiter:'\t'};
         
        try {
          const csv = parse(data, opts);
        //   console.log(csv);
        //write data to csv.txt file
          fs.writeFileSync('csv.txt',csv);
          var path  = __dirname+'/csv.txt';
          res.download(path);
        } catch (err) {
          console.error(err);
        }
     }
 });
});

//assign port
var port = process.env.PORT||3000;
app.listen(port,()=>console.log('server run at port '+port));
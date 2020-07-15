//install serve-static a middleware to bypass expresss default look for index.html file in folders that are served ex:public
const express= require('express');
const serveStatic = require('serve-static');
require('dotenv').config();
const datastore=  require('nedb');
//const bodyparser= require('body-parser');
const fetch= require('node-fetch');
const app= express();
app.listen(3005,()=>{console.log("listening on :http://localhost:3005")});
app.use(serveStatic('public',{'index':['client.html']}));
const database=new datastore('database.db');
database.loadDatabase();
app.use(express.json());
app.get('/learn',(req,res)=>{
  database.find({},(err,data)=>{
      res.json(data);
  })
});
app.post('/word',(req,res)=>{
    let date=new Date();
    let currentdate= new Date();
    date = date.setDate(date.getDate() + req.body.totalcount);
    //let fd=new Date(Number(d));
   const data={
       word:req.body.word,
       pronounciation:req.body.pronounciation,
       meaning:req.body.meaning,
       examples:req.body.examples,
       description:req.body.description,
       audio:req.body.audio,
       date:date,
       created:currentdate.toString(),
   };
   database.insert(data);
   res.json(data);
});
app.post('/change',(req,res)=>{
    let date= new Date();
    date = date.setDate(date.getDate()+req.body.count);
    //let fd= new Date(d);
    let currentdate=new Date();
    database.remove({word:req.body.w},{});
    const data={
       word:req.body.w,
       meaning:req.body.m,
       description:req.body.d,
       date:date,
       created:currentdate.toString()
    }
    database.insert(data);
    res.json(data);
});
app.post('/delete',(req,res)=>{
database.remove({word:req.body},{});
});
app.get('/test/:word',async (req,res)=>{
   const word=req.params.word;
   const apikey=process.env.API_KEY;
   const wordnik='https://api.wordnik.com/v4/word.json/';
   const a_url=wordnik+word+'/audio?useCanonical=true&limit=50&api_key='+apikey;
   const m_url=wordnik+word+'/definitions?&limit=3&includeRelated=false&useCanonical=true&includeTags=false&api_key='+apikey;
   const e_url=wordnik+word+'/examples?includeDuplicates=false&useCanonical=true&limit=2&api_key='+apikey;
   const p_url=wordnik+word+'/pronunciations?useCanonical=true&limit=1&api_key='+apikey;
   const audio=await fetch(a_url);
   const aresponse=await audio.json();
   const meaning=await fetch(m_url);
   const mresponse=await meaning.json();
   const examples=await fetch(e_url);
   const eresponse=await examples.json();
   const pronounciation=await fetch(p_url);
   const presponse=await pronounciation.json();
   const sent={
       m:mresponse,
       p:presponse,
       e:eresponse,
       a:aresponse
   };
   
res.json(sent);
});
// app.get('/atest/:word',async (req,res)=>{
//    const word=req.params.word;
//    const apikey=process.env.API_KEY;
//    const wordnik='https://api.wordnik.com/v4/word.json/';
//    const a_url=
//    const audio= await fetch(a_url);
//    const reponse = audio.blob();
//    res.blob(reponse);

// });
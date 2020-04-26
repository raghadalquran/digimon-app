'use strict';
// requires
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const methodOverride = require('method-override');
const pg = require('pg');

//main variables
const app = express();
const PORT = process.env.PORT || 4000;
const client = new pg.Client(process.env.DATABASE_URL);

//uses
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('./public')); 
app.set('view engine', 'ejs');

//listening
client.connect()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`RAGHAD server running on port ${PORT}`);
    })
})
//rout
app.get('/',indexHandler);
app.get('/add',addToFavorite);
app.get('/favourite',getFromDataBase);
app.put('/update/:update_id',updateFunc);
app.delete('/delete/:delete_id',deleteFunc);


//functionHandler
function indexHandler(req,res){
    // let name = req.body.name;
    // let level = req.body.level;
    let url = `https://digimon-api.herokuapp.com/api/digimon`;
    superagent.get(url)
    .then((result)=>{
       let resultArray = result.body.map(val =>{
           return new Digimon (val);
       })
       res.render('./index',{data: resultArray });
    })
}
////
function addToFavorite(req,res){
    //collect
    let {name,img,level}=req.query;
    //insert
    let SQL = 'INSERT INTO digimon_table (name,img,level) VALUES ($1,$2,$3);';
    let safeValues =[name,img,level];
    //redirect
    client.query(SQL,safeValues)
    .then((result)=>{
        res.redirect('/favourite');
    })
}
////
function getFromDataBase(req,res){
let SQL = 'SELECT * FROM digimon_table WHERE id=$1;';
client.query(SQL)
.then((result)=>{
    res.render('./pages/favourite',{data: result.rows})
})
}
////
function detailFunc(req,res){
    //get the params
    let param = req.params.id;
    //select where
    let SQL = 'SELECT * FROM digimon_table WHERE id=$1;';
    let safeValues = [param];
    //redirect
    client.query(SQL,safeValues)
    .then((result)=>{
        res.redirect('.pages/detail',{data: result.rows[0]});
    })
}
/////
function updateFunc (req,re){
    //get param
    let param = req.params.update_id;
    //collect
    let {name,img,level}=req.body;
    //update
    let SQL = 'UPDATE FROM digimon_table name=$1,img=$2,level=$3 WHERE id=$4;';
    let safeValues = [name,img,level,param];
    //redirect
    client.query(SQL,safeValues)
    .then((result)=>{
        res.redirect(`./pages/detail/${param}`);
    })
}
/////
function deleteFunc(req,res){
    let param = req.params.delete_id;
    let SQL ='DELETE FROM digimon_table WHERE id=$1;';
    client.query(SQL)
    .then((result)=>{
        res.redirect('./pages/favourite');
    })
}
//constructor
function Digimon (val){
    this.name = val.name;
    this.img = val.img;
    this.level = val.level;
}



//errors function
function errorHandler(err,req,res){
    res.status(500).send(err);
}
function notFoundHandler(req,res){
    res.status(404).send('NOT FOUND!')
}
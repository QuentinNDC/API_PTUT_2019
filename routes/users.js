const express = require('express');
const router = express.Router();
const queryRunner = require('./../public/tools/queryRunner');
const errToJSON = require('error-to-json');
const cassandra = require('cassandra-driver');
const Uuid = cassandra.types.Uuid;

router.get('/:id', async function(req, res, next) {
    const query = "select * from kspace3.users where userid="+req.params.id+";";
    await queryRunner.executeQuery(query)
    .then(result =>{
        console.log('result: ', result);
        if (result.rows[0]) {
            res.send(result.rows[0]);
            res.end(); 
        } else {
            res.send(errToJSON(new Error("L'utilisateur n'existe pas.")));
        }
    }, err =>{
        res.send(errToJSON(err));
        res.end();
    });
});


router.put('/', function(req, res, next) {
    const age = req.body.age;
    const gender = req.body.gender;
    const occupation = req.body.occupation;
    const occupationname = req.body.occupationname;
    const zipcode = req.body.zipcode;

    if(age == undefined){
        res.send(errToJSON(new Error("Age non renseigné")));
        res.end();
        return;
    }
    if(gender == undefined){
        res.send(errToJSON(new Error("gender non renseigné")));
        res.end();
        return;
    }
    if(occupation == undefined){
        res.send(errToJSON(new Error("occupation non renseigné")));
        res.end();
        return;
    }
    if(occupationname == undefined){
        res.send(errToJSON(new Error("occupationname non renseigné")));
        res.end();
        return;
    }
    if(zipcode == undefined){
        res.send(errToJSON(new Error("zipcode non renseigné")));
        res.end();
        return;
    }

    // const uuidRandom = Uuid.random();
    const uuidRandom = Uuid.random();
    const query = 'insert into kspace3.users (userid,age,gender,occupation,occupationname,zipcode) values (?,?,?,?,?,?);';
    const params = [uuidRandom, age, gender,occupation,occupationname,zipcode];
    const returnString = JSON.stringify({
        userid : uuidRandom, 
        age : age, 
        gender: gender, 
        occupation: occupation, 
        occupationname : occupationname, 
        zipcode : zipcode
     });
    queryRunner.executeQueryWithParam(query,params).then
    (result => {
        res.send(returnString);
        res.end();
    }, err => {
        res.send(errToJSON(err));
        res.end();
    });});

router.patch('/', function(req, res, next){
    const userid = req.body.userid;
    const age = req.body.age;
    const gender = req.body.gender;
    const occupation = req.body.occupation;
    const occupationname = req.body.occupationname;
    const zipcode = req.body.zipcode;

    if(userid == undefined){
        res.send(errToJSON(new Error("Userid non renseigné")));
        res.end();
        return;
    }
    if(age == undefined){
        res.send(errToJSON(new Error("Age non renseigné")));
        res.end();
        return;
    }
    if(gender == undefined){
        res.send(errToJSON(new Error("gender non renseigné")));
        res.end();
        return;
    }
    if(occupation == undefined){
        res.send(errToJSON(new Error("occupation non renseigné")));
        res.end();
        return;
    }
    if(occupationname == undefined){
        res.send(errToJSON(new Error("occupationname non renseigné")));
        res.end();
        return;
    }
    if(zipcode == undefined){
        res.send(errToJSON(new Error("zipcode non renseigné")));
        res.end();
        return;
    }

    const query = 'Update kspace3.users set age=?,gender=?,occupation=?,occupationname=?,zipcode=? where userid=?;';
    const params = [age, gender,occupation,occupationname,zipcode,userid];
    const returnString = JSON.stringify({ query: query, param: {userid : userid, age : age, gender: gender, occupation: occupation, occupationname : occupationname, zipcode : zipcode } });
    queryRunner.executeQueryWithParam(query,params).then
    ( () => {
        res.send(returnString);
        res.end();
    }, err => {
        res.send(errToJSON(err));
        res.end();
    });});

router.delete('/', function(req, res, next){
    const userid = req.body.userid;

    if(userid == undefined){
        res.send(errToJSON(new Error("Userid non renseigné")));
        res.end();
        return;
    }

    const query = 'delete from kspace3.users where userid=?;';
    const params = [userid];
    queryRunner.executeQueryWithParam(query,params).then
    (() => {
        res.send({
            success: true, 
            message: "L'utilisateur a bien été supprimé."
        });
        res.end();
    }, err => {
        res.send(errToJSON(err));
        res.end();
    });});


module.exports = router;

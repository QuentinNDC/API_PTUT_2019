const express = require('express');
const router = express.Router();
const queryRunner = require('./../public/tools/queryRunner');
const errToJSON = require('error-to-json');
const cassandra = require('cassandra-driver');
const Uuid = cassandra.types.Uuid;

router.get('/:id', function(req, res, next) {
    const mode = req.query.mode;
    const data = req.query.data;
    //On récupert seulement les futurs noteds
    if(mode == "later"){
        const query = "select * from kspace.ratings where user_id=? and rating = -1;";
        const params = [req.params.id];
        if(data == "all"){
            queryRunner.executeQueryWithPage(query, req.query.page, params).then
            (result => {
                if(result.length==0){
                    res.send(result);
                    res.end();
                    return;
                }
                getFilmsByID(result).then
                ( result =>{
                    res.send(result);
                    res.end();
                },err =>{
                    res.send(errToJSON(err));
                    res.end();
                });
            }, err => {
                res.send(errToJSON(err));
                res.end();
            });
        }else{
            queryRunner.executeQueryWithPage(query,req.query.page,params).then
            ( result =>{
                res.send(result);
                res.end();
            },err =>{
                res.send(errToJSON(err));
                res.end();
            });
        }
    }
    //On récupert ceux déja noté
    else if(mode == "noted"){
        const query = "select * from kspace.ratings where user_id=? and rating > 0 ALLOW FILTERING;";
        const params = [req.params.id];
        if(data == "all"){
            queryRunner.executeQueryWithPage(query, req.query.page, params).then
            (result => {
                if(result.length==0){
                    res.send(result);
                    res.end();
                    return;
                }
                getFilmsByID(result).then
                ( result =>{
                    res.send(result);
                    res.end();
                },err =>{
                    res.send(errToJSON(err));
                    res.end();
                });
            }, err => {
                res.send(errToJSON(err));
                res.end();
            });
        }else {
            queryRunner.executeQueryWithPage(query, req.query.page, params).then
            (result => {
                res.send(result);
                res.end();
            }, err => {
                res.send(errToJSON(err));
                res.end();
            });
        }
    }
    //On récupert tout
    else{
        const query = "select * from kspace.ratings where user_id=?;";
        const params = [req.params.id];
        if(data == "all"){
            queryRunner.executeQueryWithPage(query, req.query.page, params).then
            (result => {
                if(result.length==0){
                    res.send(result);
                    res.end();
                    return;
                }
                getFilmsByID(result).then
                ( result =>{
                    res.send(result);
                    res.end();
                },err =>{
                    res.send(errToJSON(err));
                    res.end();
                });
            }, err => {
                res.send(errToJSON(err));
                res.end();
            });
        }else {
            queryRunner.executeQueryWithPage(query, req.query.page, params).then
            (result => {
                res.send(result);
                res.end();
            }, err => {
                res.send(errToJSON(err));
                res.end();
            });
        }
    }
});

router.put('/', function(req, res, next) {
    const user_id = req.body.user_id;
    const movie_id = req.body.movie_id;
    const rating = req.body.rating;
    const update = req.query.update;

    if(user_id == undefined){
        res.send(errToJSON(new Error("User_id non renseigné")));
        res.end();
        return;
    }

    if(movie_id == undefined){
        res.send(errToJSON(new Error("Movie_id non renseigné")));
        res.end();
        return;
    }

    if(rating == undefined){
        res.send(errToJSON(new Error("Rating non renseigné")));
        res.end();
        return;
    }
    const query = 'insert into kspace.ratings (user_id,movie_id,rating,timestamp) values (?,?,?,?);';
    const timestampNow = Date.now();
    const params = [user_id, movie_id, rating,timestampNow];
    if(update == "Y"){
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id, rating: rating, timestamp:timestampNow}, update:true });
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            queryRunner.ActualiseFilm(movie_id).then
            ( result =>{
                res.send(returnString);
                res.end();
            },err =>{
                res.send(errToJSON(err));
                res.end();
            });
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });
    }else{
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id, rating: rating, timestamp:timestampNow}, update:false });
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            res.send(returnString);
            res.end();
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });
    }
});

router.patch('/', function(req, res, next) {
    const user_id = req.body.user_id;
    const movie_id = req.body.movie_id;
    const rating = req.body.rating;
    const update = req.query.update;


    if(user_id == undefined){
        res.send(errToJSON(new Error("User_id non renseigné")));
        res.end();
        return;
    }

    if(movie_id == undefined){
        res.send(errToJSON(new Error("Movie_id non renseigné")));
        res.end();
        return;
    }

    if(rating == undefined){
        res.send(errToJSON(new Error("Rating non renseigné")));
        res.end();
        return;
    }
    const query = 'Update kspace.ratings set rating=?,timestamp=? where user_id=? and movie_id=?;';
    const timestampNow = Date.now();
    const params = [rating,timestampNow, user_id, movie_id];
    if(update == "Y"){
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id, rating: rating, timestamp:timestampNow}, update:true });
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            queryRunner.ActualiseFilm(movie_id).then
            ( result =>{
                res.send(returnString);
                res.end();
            },err =>{
                res.send(errToJSON(err));
                res.end();
            });
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });
    }else {
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id, rating: rating, timestamp:timestampNow}, update:false });
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            res.send(returnString);
            res.end();
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });
    }
});

router.delete('/', function(req, res, next){
    const user_id = req.body.user_id;
    const movie_id = req.body.movie_id;
    const update = req.query.update;


    if(user_id == undefined){
        res.send(errToJSON(new Error("User_id non renseigné")));
        res.end();
        return;
    }

    if(movie_id == undefined){
        res.send(errToJSON(new Error("Movie_id non renseigné")));
        res.end();
        return;
    }

    const query = 'delete from kspace.ratings where user_id=? and movie_id=?;';
    const params = [user_id,movie_id];
    if(update == "Y"){
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id}, update:true});
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            queryRunner.ActualiseFilm(movie_id).then
            ( result =>{
                res.send(returnString);
                res.end();
            },err =>{
                res.send(errToJSON(err));
                res.end();
            });
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });
    }else {
        const returnString = JSON.stringify({ query: query, param: {user_id : user_id, movie_id : movie_id}, update:false});
        queryRunner.executeQueryWithParam(query,params).then
        ( result =>{
            res.send(returnString);
            res.end();
        },err =>{
            res.send(errToJSON(err));
            res.end();
        });    }
});

async function getFilmsByID(result){
    return new Promise(async(resolve, reject) => {
        try {
            let movies = [];
            result.forEach(Row => movies.push((Row['movie_id'])));
            let params = [];
            params.push(movies);
            const query = "select * from kspace.movies where movie_id in ?;";
            queryRunner.executeQueryWithParam(query, params).then
            (resultMovies => {
                resultMovies["rows"].forEach(
                    movie => result.forEach(
                        rating => {
                            if (rating['movie_id'] == movie['movie_id']) {
                                rating['movie'] = movie;
                            }
                        })
                )
                resolve(result);
            }, err => {
                reject(err);
            });
        } catch (error) {
            reject(error);
            return;
        }
    });
}

module.exports = router;

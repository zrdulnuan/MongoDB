const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .populate('dishes')
    .populate('user')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites'); 
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    var userId = mongoose.Types.ObjectId(req.user._id);
    Favorites.findOne({user: userId})
    .then((favorite) => {
        if(favorite == null) {
            console.log("User doesn't have a favorite list yet")
            Favorites.create({user: userId})
            .then((favorite) => {
                for(var dish = 0; dish < req.body.length; dish++) {
                    favorite.dishes.addToSet(req.body[dish]._id)
                 }
                favorite.save()
                .then((favorite) => {
                    console.log(favorite, ' added to your Favorites');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
        else {
            console.log("User does have a favorite list")
            favorite.save()
            .then((favorite) => {
                for(var dish = 0; dish < req.body.length; dish++) {
                    favorite.dishes.addToSet(req.body[dish]._id)
                 }
                favorite.save()
                .then((favorite) => {
                    console.log(favorite, ' added to your Favorites');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    var userId = mongoose.Types.ObjectId(req.user._id);
    Favorites.remove({user: userId})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp); 
    }, (err) => next(err))
    .catch((err) => next(err))
})

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/dishId'); 
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/dishId'); 
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    var userId = mongoose.Types.ObjectId(req.user._id);
    Favorites.findOne({user: userId})
    .then((favorite) => {
        if(favorite == null) {
            console.log("User doesn't have a favorite list yet")
            Favorites.create({user: userId})
            .then((favorite) => {
                favorite.dishes.addToSet(req.params.dishId)
                favorite.save()
                .then((favorite) => {
                    console.log(favorite, ' added to your Favorites');
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
                .catch((err) => next(err));
            })
            .catch((err) => next(err));
        }
        else {
            console.log("User does have a favorite list")
            favorite.dishes.addToSet(req.params.dishId)
            favorite.save()
            .then((favorite) => {
                console.log(favorite, ' added to your Favorites');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id})
    .then((favorite) => {
        if(favorite.dishes.indexOf(req.params.dishId) > 0) {
            favorite.dishes.pull(req.params.dishId)
            favorite.save()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite); 
            }, (err) => next(err))
        }
        else {
            err = new Error ('Dish is not in your Favorites list');
            err.status = 404;
            return next(err)
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = favoriteRouter;


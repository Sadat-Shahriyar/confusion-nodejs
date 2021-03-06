const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

const Dishes = require('../models/dishes');

//console.log('inside dish router 1');

dishRouter.route('/')
    .options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.find(req.query)
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish)
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("put operation not supported on dishes ");
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.remove({})
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });

//console.log('inside dish router 2');

dishRouter.route('/:dishId')
    .options(cors.corsWithOption, (req, res) => { res.sendStatus(200) })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation not supported on dishes/" + req.params.dishId);
    })
    .put(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, {
            $set: req.body
        }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOption, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((response) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(response);
            }, (err) => next(err))
            .catch((err) => next(err));
    });


module.exports = dishRouter;

//console.log('inside dish router 3');
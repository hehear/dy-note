const express = require('express');
const logger = require('../../config/log4js');
const router = express.Router();

router.use(function (req, res, next) {

    next();
});

router.get('/', function (req, res) {
    logger.info('首页');

    res.render('index',req.resRendCallBack);

});


//必须
module.exports = router;
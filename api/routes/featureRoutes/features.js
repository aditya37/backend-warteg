const express = require('express');
const router  = express.router();

const ControllerFeature = require('../../controller/ControllerFeature');

router.get('/news',ControllerFeature.get_news);
router.get('/news/:newsId',ControllerFeature.detail_news);
router.post('/news',ControllerFeature.add_news);

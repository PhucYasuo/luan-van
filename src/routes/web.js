const express =require('express');
const {
    getHomepage,
    getDashboard,
    getSignIn,
    postSignIn
} = require('../controllers/homeController');

const {
    getLeave,
    postClass,
    getSubject,
    getTeacher,
    postResultLP
} = require('../controllers/leaveController');

const router = express.Router();

router.get('/', getHomepage);
router.get('/dashboard', getDashboard);
router.get('/sign-in', getSignIn);
router.post('/sign-in', postSignIn);

router.get('/leave-permission', getLeave);
router.post('/get-classes', postClass);
router.get('/get-teachers', getTeacher);
router.get('/get-subject', getSubject);
router.post('/result-leave-permission', postResultLP);


module.exports = router; 
const express =require('express');
const {
    getHomepage,
    getDashboard,
    getSignIn,
    postSignIn,
    getLogout
} = require('../controllers/homeController');

const {
    getLeave,
    postClass,
    getSubject,
    getTeacher,
    postResultLP,
    createWordMultiple,
    saveLeaveData
} = require('../controllers/leaveController');

const router = express.Router();

// homeController
router.get('/', getHomepage);
router.get('/dashboard', getDashboard);
router.get('/sign-in', getSignIn);
router.post('/sign-in', postSignIn);
router.get('/logout', getLogout);

// leaveController
router.get('/leave-permission', getLeave);
router.post('/get-classes', postClass);
router.get('/get-teachers', getTeacher);
router.get('/get-subject', getSubject);
router.post('/result-leave-permission', postResultLP);
router.post('/create-word-multiple', createWordMultiple);
router.post('/save-leave-data', saveLeaveData);


module.exports = router; 
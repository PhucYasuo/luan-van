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

const {
    getApproveLP,
    getApproveLPDetail,
    updateStatus,
    sendResMail
} = require('../controllers/approveController');

const {
    getStatisticByDepartmentLp,
    postCreateStatisticByDepartmentLp
} = require('../controllers/statisticController');

const {
    index,
    getOne,
    create,
    update,
    remove,
    getNewId
} = require('../controllers/giaoVienController');

const {
    getSchedule
} = require('../controllers/scheduleController');

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

// approveController
router.get('/approve-lp', getApproveLP);
router.get('/approve-lp-detail/:PNP_STT', getApproveLPDetail);
router.post('/approve-lp-update', updateStatus);
router.post('/send-res-mail', sendResMail);

// statisticController
router.get('/statistical-department-lp', getStatisticByDepartmentLp);
router.post('/create-statistic-department-lp', postCreateStatisticByDepartmentLp);

// giaoVienController
router.get('/giao-vien', index);
router.get('/giao-vien/:GV_Ma', getOne);
router.post('/giao-vien', create);
router.put('/giao-vien/:GV_Ma', update);
router.delete('/giao-vien/:GV_Ma', remove);
router.get('/giao-vien-new-id', getNewId);

// scheduleController
router.get('/schedule', getSchedule);

module.exports = router; 
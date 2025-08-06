const express =require('express');
const {
    getHomepage,
    getDashboard,
    getSignIn,
    postSignIn,
    getLogout,
    getHocKys,
    getNamHocs
} = require('../controllers/homeController');

const {
    getLeaveReport,
    getLeaveCheckRange,
    postLeaveData,
    postUploadFile
} = require('../controllers/leaveController');

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

const {
    getDeclare,
    getMonth,
    getDataDeclare
} = require('../controllers/declareController');

const router = express.Router();

// homeController
router.get('/', getHomepage);
router.get('/dashboard', getDashboard);
router.get('/sign-in', getSignIn);
router.post('/sign-in', postSignIn);
router.get('/logout', getLogout);
router.get('/hoc-kys', getHocKys);
router.get('/nam-hocs', getNamHocs);


// leaveController
router.get('/leave-report', getLeaveReport);
router.get('/leave-check-range', getLeaveCheckRange);
router.post('/save-leave-data', postLeaveData);
router.post('/upload-file', postUploadFile);


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

// declareController
router.get('/declare', getDeclare);
router.get('/declare-month', getMonth);
router.get('/declare-data', getDataDeclare);


module.exports = router; 
const connection = require('../config/database');

const getDeclare = async (req, res) => {
    const timeTableData = await getTimeTable(req);
    const timeTableSum = getTimeTableSum(timeTableData);

    const approvedLeaveData = await getApprovedLeave(req);
    const approvedLeaveSum = getApprovedLeaveSum(approvedLeaveData);

    const personelAbsenceData = await getPersonelAbsence(req);
    const personelAbsenceSum = getPersonelAbsenceSum(personelAbsenceData);

    const makeUpData = await getMakeUp(req);
    const makeUpSum = getMakeUpSum(makeUpData);

    const substituteData = await getSubstitute(req);
    const substituteSum = getSubstituteSum(substituteData);

    res.render('declare.ejs', {
        user: req.session.user,
        timeTable: timeTableData,
        timeTableSum: timeTableSum,
        approvedLeave: approvedLeaveData,
        approvedLeaveSum: approvedLeaveSum,
        personelAbsence: personelAbsenceData,
        personelAbsenceSum: personelAbsenceSum,
        makeUp: makeUpData,
        makeUpSum: makeUpSum,
        substitute: substituteData,
        substituteSum: substituteSum
    });
}

const getTimeTable = async (req) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.HK_HocKy = ?
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [req.session.user.hocKy, req.session.user.namHoc, req.session.user.maGV, '2024-09-30', '2024-11-03']
    );
    return results;
}

function getTimeTableSum(timeTableData) {
    let timeTableSum = 0;
    if (timeTableData && timeTableData.length > 0) {
        timeTableData.forEach(item => {
            timeTableSum += parseInt(item.SoTiet);
        });
    }
    return timeTableSum;
}

const getApprovedLeave = async (req) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m, dinhkem dk
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.TKB_ID = dk.TKB_ID
        AND tkb.HK_HocKy = ?
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [req.session.user.hocKy, req.session.user.namHoc, req.session.user.maGV, '2024-09-30', '2024-11-03']
    );
    return results;
}

function getApprovedLeaveSum(approvedLeaveData) {
    let approvedLeaveSum = 0;
    if (approvedLeaveData && approvedLeaveData.length > 0) {
        approvedLeaveData.forEach(item => {
            approvedLeaveSum += parseInt(item.SoTiet);
        });
    }
    return approvedLeaveSum;
}

const getPersonelAbsence = async (req) => {
    const [results] = await connection.promise().query(`
        SELECT 
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop, 
            m.M_Ten AS TenLop, 
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.HK_HocKy = '1'
        AND tkb.NH_NamHoc = '2024-2025'
        AND tkb.GV_Ma = 'GV001'
        AND tkb.TT_Ma = 'TT002'
        AND tkb.TKB_Ngay BETWEEN '2024-09-30' AND '2024-11-03'
        AND NOT EXISTS (
            SELECT 1 
            FROM dinhkem dk 
            WHERE dk.TKB_ID = tkb.TKB_ID
        )
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [req.session.user.hocKy, req.session.user.namHoc, req.session.user.maGV, '2024-09-30', '2024-11-03']
    );
    return results;
}

function getPersonelAbsenceSum(personelAbsenceData) {
    let personelAbsenceSum = 0;
    if (personelAbsenceData && personelAbsenceData.length > 0) {
        personelAbsenceData.forEach(item => {
            personelAbsenceSum += parseInt(item.SoTiet);
        });
    }
    return personelAbsenceSum;
}

const getMakeUp = async (req) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.HK_HocKy = ?
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TT_Ma = 'TT003'
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [req.session.user.hocKy, req.session.user.namHoc, req.session.user.maGV, '2024-09-30', '2024-11-03']
    );
    return results;
}

function getMakeUpSum(makeUpData) {
    let makeUpSum = 0;
    if (makeUpData && makeUpData.length > 0) {
        makeUpData.forEach(item => {
            makeUpSum += parseInt(item.SoTiet);
        });
    }
    return makeUpSum;
}

const getSubstitute = async (req) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.HK_HocKy = ?
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TT_Ma = 'TT004'
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [req.session.user.hocKy, req.session.user.namHoc, req.session.user.maGV, '2024-09-30', '2024-11-03']
    );
    return results;
}

function getSubstituteSum(substituteData) {
    let substituteSum = 0;
    if (substituteData && substituteData.length > 0) {
        substituteData.forEach(item => {
            substituteSum += parseInt(item.SoTiet);
        });
    }
    return substituteSum;
}

function getWeeksInMonth(year, month) {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    let dayOfWeekFirst = firstDay.getDay();
    if( dayOfWeekFirst === 0) {
        dayOfWeekFirst = 7;
    }

    let dayOfWeekLast = lastDay.getDay();
    if( dayOfWeekLast === 0) {
        dayOfWeekLast = 7;
    }

    let weekcount = 3;
    if (dayOfWeekFirst <= 4) {
        weekcount++;
    }
    if (dayOfWeekLast >= 4) {
        weekcount++;
    }
    return weekcount;
}

module.exports = {
    getDeclare
};
const connection = require('../config/database');

const getDeclare = async (req, res) => {
    res.render('declare.ejs', {
        user: req.session.user
    });
}

const getTimeTable = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getApprovedLeave = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m, dinhkem dk
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.TKB_ID = dk.TKB_ID
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getPersonelAbsence = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT 
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop, 
            m.M_Ten AS TenMon, 
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TT_Ma = 'TT002'
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND NOT EXISTS (
            SELECT 1 
            FROM dinhkem dk 
            WHERE dk.TKB_ID = tkb.TKB_ID
        )
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getMakeUp = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TT_Ma = 'TT003'
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getSubstitute = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT
            CONCAT(tkb.K_Khoi, tkb.KH_KyHieu, tkb.L_STTLop) AS Lop,
            m.M_Ten AS TenMon,
            SUM(tkb.TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_DayThay = ?
        AND tkb.TT_Ma = 'TT004'
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        GROUP BY tkb.GV_Ma, m.M_Ma, tkb.L_STTLop, tkb.K_Khoi, tkb.KH_KyHieu`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getMonth = async (req, res) => {
    try {
        const { namHoc } = req.query;
        if (!namHoc) {
            return res.status(400).json({ error: 'Thiếu tham số namHoc' });
        }

        const firstStr = await getFirstDayOfSchoolYear(namHoc);
        const lastStr = await getLastDayOfSchoolYear(namHoc);

        if (!firstStr || !lastStr) {
            return res.status(404).json({ error: 'Không tìm thấy năm học' });
        }

        const firstDay = new Date(firstStr);
        const lastDay  = new Date(lastStr);
        const today    = new Date(req.today || new Date());

        // Tính ngày kết thúc thực tế (nếu là năm học hiện tại → không quá hôm nay)
        const endDay = today < lastDay ? today : lastDay;

        const months = [];
        const d = new Date(firstDay.getFullYear(), firstDay.getMonth(), 1); // ngày đầu tháng đầu tiên

        while (d <= endDay) {
            months.push({ month: d.getMonth() + 1, year: d.getFullYear() });
            d.setMonth(d.getMonth() + 1);
        }
        res.json(months);
    } catch (err) {
        console.error("Lỗi khi lấy danh sách tháng:", err);
        res.status(500).json({ error: 'Lỗi server' });
    }
};

const getDataDeclare = async (req, res) => {
    const { month, year, namHoc } = req.query;
    const { weeks, firstDay, lastDay, firstWeekNumber, lastWeekNumber } = await getWeeksInMonth(year, month);
    const timeTableData = await getTimeTable(req, namHoc, firstDay, lastDay);
    const approvedLeaveData = await getApprovedLeave(req, namHoc, firstDay, lastDay);
    const personelAbsenceData = await getPersonelAbsence(req, namHoc, firstDay, lastDay);
    const makeUpData = await getMakeUp(req, namHoc, firstDay, lastDay);
    const substituteData = await getSubstitute(req, namHoc, firstDay, lastDay);
    const {positions, missions} = await checkWeekSemester(req, res, firstWeekNumber, lastWeekNumber, namHoc);

    res.json({
        weeks,
        firstDay,
        lastDay,
        firstWeekNumber,
        lastWeekNumber,
        timeTableData,
        approvedLeaveData,
        personelAbsenceData,
        makeUpData,
        substituteData,
        positions,
        missions
    });
}

const checkWeekSemester = async (req, res, firstWeekNumber, lastWeekNumber, namHoc) => {
    const [result] = await connection.promise().query(`
        SELECT * FROM hocky`
    );
    const firstBetween = firstWeekNumber - result[0].HK_SoTuan;
    const lastBetween = lastWeekNumber - result[0].HK_SoTuan;
    const weekNum = lastWeekNumber - firstWeekNumber + 1;
    var positions;
    var missions;
    if (firstBetween*lastBetween >= 0 && firstBetween!= 0) {
        // Cùng học kỳ
        let hocKy;
        if(firstBetween<0)
            hocKy = 1;
        else
            hocKy = 2;
        
        positions = await getPosition(req, res, hocKy, namHoc, weekNum);
        missions = await getMission(req, res, hocKy, namHoc, weekNum);
    }
    else {
        // Khác học kỳ
        const fistSW = result[0].HK_SoTuan-firstWeekNumber+1;
        const lastSW = lastWeekNumber-result[0].HK_SoTuan;
        positions = await getPosition1(req, res, namHoc, fistSW, lastSW);
        missions = await getMission1(req, res, namHoc, fistSW, lastSW);
        
    }
    return {
        positions: positions,
        missions: missions
    }
}

const getPosition = async (req, res, hocKy, namHoc, weekNum) => {
    const result = await connection.promise().query(`
        SELECT cv.CV_Ten AS Ten, gcv.HK_HocKy AS HocKy, CV_SoTietMien*? AS SoTietMien
        FROM giuchucvu gcv, chucvu cv
        WHERE gcv.CV_Ma = cv.CV_Ma
        AND gcv.GV_Ma = ?
        AND gcv.HK_HocKy = ?
        AND gcv.NH_NamHoc = ?`,
        [weekNum,req.session.user.maGV,hocKy,namHoc]
    );
    if (result.length > 0) {
        return result[0];
    } else {
        return null; // Không tìm thấy chức vụ
    }
}

const getPosition1 = async (req, res, namHoc, fistSW, lastSW) => {
    const result = await connection.promise().query(`
        SELECT cv.CV_Ten AS Ten, gcv.HK_HocKy AS HocKy, CV_SoTietMien*? AS SoTietMien
        FROM giuchucvu gcv, chucvu cv
        WHERE gcv.CV_Ma = cv.CV_Ma
        AND gcv.GV_Ma = ?
        AND gcv.HK_HocKy = 1
        AND gcv.NH_NamHoc = ?
        UNION
        SELECT cv.CV_Ten AS Ten, gcv.HK_HocKy AS HocKy, CV_SoTietMien*? AS SoTietMien
        FROM giuchucvu gcv, chucvu cv
        WHERE gcv.CV_Ma = cv.CV_Ma
        AND gcv.GV_Ma = ?
        AND gcv.HK_HocKy = 2
        AND gcv.NH_NamHoc = ?`,
        [fistSW, req.session.user.maGV, namHoc, lastSW, req.session.user.maGV, namHoc]
    );
    if (result.length > 0) {
        return result[0];
    } else {
        return null; // Không tìm thấy chức vụ
    }
}

const getMission = async (req, res, hocKy, namHoc, weekNum) => {
    const result = await connection.promise().query(`
        SELECT nv.NV_Ten AS Ten, kn.HK_HocKy AS HocKy, nv.NV_SoTietMien*? AS SoTietMien
        FROM kiemnhiem kn, nhiemvu nv
        WHERE kn.NV_Ma = nv.NV_Ma
        AND kn.GV_Ma = ?
        AND kn.HK_HocKy = ?
        AND kn.NH_NamHoc = ?`,
        [weekNum,req.session.user.maGV,hocKy,namHoc]
    );
    if (result.length > 0) {
        return result[0];
    } else {
        return null; // Không tìm thấy nhiệm vụ
    }
}

const getMission1 = async (req, res, namHoc, fistSW, lastSW) => {
    const result = await connection.promise().query(`
        SELECT nv.NV_Ten AS Ten, kn.HK_HocKy AS HocKy, NV_SoTietMien*? AS SoTietMien
        FROM kiemnhiem kn, nhiemvu nv
        WHERE kn.NV_Ma = nv.NV_Ma
        AND kn.GV_Ma = ?
        AND kn.HK_HocKy = 1
        AND kn.NH_NamHoc = ?
        UNION
        SELECT nv.NV_Ten AS TenNhiemVu, kn.HK_HocKy AS HocKy, NV_SoTietMien*? AS SoTietMien
        FROM kiemnhiem kn, nhiemvu nv
        WHERE kn.NV_Ma = nv.NV_Ma
        AND kn.GV_Ma = ?
        AND kn.HK_HocKy = 2
        AND kn.NH_NamHoc = ?`,
        [fistSW, req.session.user.maGV, namHoc, lastSW, req.session.user.maGV, namHoc]
    );
    if (result.length > 0) {
        return result[0];
    } else {
        return null; // Không tìm thấy nhiệm vụ
    }
}

async function getWeeksInMonth(year, month) {
    let firstDay = new Date(year, month - 1, 1);
    let lastDay = new Date(year, month, 0);
    const schoolYear = month >= 8 ? `${year}-${parseInt(year) + 1}` : `${parseInt(year) - 1}-${year}`;
    
    let dayOfWeekFirst = firstDay.getDay();
    if( dayOfWeekFirst === 0)   dayOfWeekFirst = 7;
    
    let dayOfWeekLast = lastDay.getDay();
    if( dayOfWeekLast === 0)    dayOfWeekLast = 7;

    if( dayOfWeekFirst <= 4)    
        firstDay.setDate(firstDay.getDate() + (1-dayOfWeekFirst));
    else
        firstDay.setDate(firstDay.getDate() + (8-dayOfWeekFirst));


    const firstDayOfSchoolYear = await getFirstDayOfSchoolYear(schoolYear);
    if (firstDay < new Date(firstDayOfSchoolYear)) {
        firstDay = new Date(firstDayOfSchoolYear);
    }

    const firstWeekNumber = await getWeekNumber(firstDay);
    

    if( dayOfWeekLast >= 4)
        lastDay.setDate(lastDay.getDate() + (7-dayOfWeekLast));
    else
        lastDay.setDate(lastDay.getDate() - dayOfWeekLast);

    const lastDayOfSchoolYear = await getLastDayOfSchoolYear(schoolYear);
    if (lastDay > new Date(lastDayOfSchoolYear)) {
        lastDay = new Date(lastDayOfSchoolYear);
    }
    const lastWeekNumber = await getWeekNumber(lastDay);
    let lastDay1 = new Date(lastDay.getFullYear(), lastDay.getMonth(), lastDay.getDate() + 1);
    const weeks = countDaysBetween(firstDay, lastDay1) / 7;

    return {
        weeks: weeks,
        firstDay: getFormattedDay(firstDay),
        lastDay: getFormattedDay(lastDay),
        firstWeekNumber: firstWeekNumber,
        lastWeekNumber: lastWeekNumber
    };
}

function countDaysBetween(date1, date2) {
	const d1 = new Date(date1);
	const d2 = new Date(date2);
	const diffInMs = Math.abs(d2 - d1);
	return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

const getFirstDayOfSchoolYear = async (year) => {
    const [results] = await connection.promise().query(`
        SELECT NH_NgayDauNam
        FROM namhoc
        WHERE NH_NamHoc = ?`,
        [year]
    );
    return results.length ? results[0].NH_NgayDauNam : null;
}

const getLastDayOfSchoolYear = async (year) => {
    const shortYear = year.slice(2, 4) + year.slice(7, 9);
    const [results] = await connection.promise().query(`
        SELECT T_NgayKT
        FROM tuan
        WHERE RIGHT(T_Ma,4) = ?
        ORDER BY T_NgayKT DESC
        LIMIT 1`,
        [shortYear]
    );
    return results.length ? results[0].T_NgayKT : null;
}

function getFormattedDay(date) {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const formattedDate = `${yyyy}-${mm}-${dd}`;
	return formattedDate;
}

const getWeekNumber = async (date) => {
    const [results] = await connection.promise().query(`
        SELECT T_Ma
        FROM tuan
        WHERE ? BETWEEN T_NgayDT AND T_NgayKT`,
        [date]
    );
    const weekCode = results[0].T_Ma; // ví dụ: "T15"

    return weekCode.length >= 3 ? weekCode.slice(1, 3) : null;
}

module.exports = {
    getDeclare,
    getMonth,
    getDataDeclare
};
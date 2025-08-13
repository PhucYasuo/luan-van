const { sectionMarginDefaults } = require('docx');
const connection = require('../config/database');

const getDeclare = async (req, res) => {
    res.render('declare.ejs', {
        user: req.session.user
    });
}

const getTimeTableByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND (tkb.TT_Ma = 'TT001' OR tkb.TT_Ma = 'TT002')`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getTimeTableByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND (tkb.TT_Ma = 'TT001' OR tkb.TT_Ma = 'TT002')
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getOnTeachByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT001'`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getOnTeachByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb, monhoc m
        WHERE tkb.M_Ma = m.M_Ma
        AND tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT001'
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;    
}

const getApprovedLeaveByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        AND dk.TKB_ID is not null`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getApprovedLeaveByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        AND dk.TKB_ID is not null
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getPersonelAbsenceByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        AND dk.TKB_ID is null`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getPersonelAbsenceByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT002'
        AND dk.TKB_ID is null
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getMakeUpByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT003'`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getMakeUpByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_Ma = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT003'
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getSubstituteByMonth = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_DayThay = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT004'`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getSubstituteByWeek = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT SUBSTRING(T_Ma,2,2) AS Tuan, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE tkb.NH_NamHoc = ?
        AND tkb.GV_DayThay = ?
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        AND tkb.TT_Ma = 'TT004'
        GROUP BY T_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getDetailTimeTable = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, M_Ten AS TenMon, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE NH_NamHoc = ?
        AND GV_Ma = ?
        AND TKB_Ngay BETWEEN ? AND ?
        AND (TT_Ma = 'TT001' OR TT_Ma = 'TT002')
        GROUP BY L_STTLop, K_Khoi, KH_KyHieu, tkb.M_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    );
    return results;
}

const getDetailApprovedLeave = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, M_Ten AS TenMon, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE NH_NamHoc = ?
        AND GV_Ma = ?
        AND TKB_Ngay BETWEEN ? AND ?
        AND TT_Ma = 'TT002'
        AND dk.TKB_ID is not null
        GROUP BY L_STTLop, K_Khoi, KH_KyHieu, tkb.M_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    )
    return results;
}

const getDetailPersonelAbsence = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, M_Ten AS TenMon, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE NH_NamHoc = ?
        AND GV_Ma = ?
        AND TKB_Ngay BETWEEN ? AND ?
        AND TT_Ma = 'TT002'
        AND dk.TKB_ID is null
        GROUP BY L_STTLop, K_Khoi, KH_KyHieu, tkb.M_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    )
    return results;
}

const getDetailMakeUp = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, M_Ten AS TenMon, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE NH_NamHoc = ?
        AND GV_Ma = ?
        AND TKB_Ngay BETWEEN ? AND ?
        AND TT_Ma = 'TT003'
        GROUP BY L_STTLop, K_Khoi, KH_KyHieu, tkb.M_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    )
    return results;
}

const getDetailSubstitute = async (req, namHoc, firstDay, lastDay) => {
    const [results] = await connection.promise().query(`
        SELECT CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, M_Ten AS TenMon, SUM(TKB_SoTiet) AS SoTiet
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        WHERE NH_NamHoc = ?
        AND GV_DayThay= ?
        AND TKB_Ngay BETWEEN ? AND ?
        AND TT_Ma = 'TT004'
        GROUP BY L_STTLop, K_Khoi, KH_KyHieu, tkb.M_Ma`,
        [namHoc, req.session.user.maGV, firstDay, lastDay]
    )
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
    const timeTableData = await getTimeTableByMonth(req, namHoc, firstDay, lastDay);
    const timeTableWeekData = await getTimeTableByWeek(req, namHoc, firstDay, lastDay);
    const detailTimeTableData = await getDetailTimeTable(req, namHoc, firstDay, lastDay);
    const onTeachData = await getOnTeachByMonth(req, namHoc, firstDay, lastDay);
    const onTeachWeekData = await getOnTeachByWeek(req, namHoc, firstDay, lastDay);
    const approvedLeaveData = await getApprovedLeaveByMonth(req, namHoc, firstDay, lastDay);
    const approvedLeaveWeekData = await getApprovedLeaveByWeek(req, namHoc, firstDay, lastDay);
    const detailApprovedLeaveData = await getDetailApprovedLeave(req, namHoc, firstDay, lastDay);
    const personelAbsenceData = await getPersonelAbsenceByMonth(req, namHoc, firstDay, lastDay);
    const personelAbsenceWeekData = await getPersonelAbsenceByWeek(req, namHoc, firstDay, lastDay);
    const detailPersonelAbsenceData = await getDetailPersonelAbsence(req, namHoc, firstDay, lastDay);
    const makeUpData = await getMakeUpByMonth(req, namHoc, firstDay, lastDay);
    const makeUpWeekData = await getMakeUpByWeek(req, namHoc, firstDay, lastDay);
    const detailMakeUpData = await getDetailMakeUp(req, namHoc, firstDay, lastDay);
    const substituteData = await getSubstituteByMonth(req, namHoc, firstDay, lastDay);
    const substituteWeekData = await getSubstituteByWeek(req, namHoc, firstDay, lastDay);
    const detailSubstituteData = await getDetailSubstitute(req, namHoc, firstDay, lastDay);
    const {positions, missions} = await checkWeekSemester(req, res, firstWeekNumber, lastWeekNumber, namHoc);
    res.json({
        weeks,
        firstDay,
        lastDay,
        firstWeekNumber,
        lastWeekNumber,
        timeTableData,
        timeTableWeekData,
        detailTimeTableData,
        onTeachData,
        onTeachWeekData,
        approvedLeaveData,
        approvedLeaveWeekData,
        detailApprovedLeaveData,
        personelAbsenceData,
        personelAbsenceWeekData,
        detailPersonelAbsenceData,
        makeUpData,
        makeUpWeekData,
        detailMakeUpData,
        substituteData,
        substituteWeekData,
        detailSubstituteData,
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
        SELECT cv.CV_Ten AS Ten, CV_SoTietMien AS SoTietMien, CV_SoTietMien*? AS TongSoTietMien
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
        SELECT nv.NV_Ten AS Ten, NV_SoTietMien AS SoTietMien, nv.NV_SoTietMien*? AS TongSoTietMien
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

const getTimeTable = async (req, res) => {
    const { firstDay, lastDay, namHoc } = req.query;

    try {
        const [results] = await connection.promise().query(`
            SELECT *, SUBSTRING(T_Ma,2,2) AS Tuan, m.M_Ten, CONCAT(K_Khoi,KH_KyHieu,L_STTLop) AS Lop, dk.TKB_ID AS DK_ID
            FROM thoikhoabieu tkb
            JOIN monhoc m ON tkb.M_Ma = m.M_Ma
            LEFT JOIN dinhkem dk on tkb.TKB_ID = dk.TKB_ID
            WHERE ((GV_Ma = ? AND TT_Ma <> 'TT004')OR (GV_DayThay = ? AND TT_Ma = 'TT004'))
            AND TKB_Ngay BETWEEN ? AND ?
            AND NH_NamHoc = ?
            ORDER BY TKB_TietBD, TKB_Ngay`,
            [req.session.user.maGV, req.session.user.maGV, firstDay, lastDay, namHoc]
        );
        if (results.length === 0) {
            return res.status(404).json({ error: 'Không tìm thấy thời khóa biểu' });
        }
        return res.json(results);
        
    } catch (err) {
        console.error("Lỗi khi lấy thời khóa biểu:", err);
        res.status(500).json({ error: 'Lỗi server' });
    }
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

const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType, TabStopType, TabStopPosition} = require('docx');

const createWordDocument = async (req, res) => {
    const {
        month,
        week,
        dinhMuc,
        phanCong,
        chiTietPhanCong,
        nghiCoQuyetDinh,
        chiTietNghiCoQuyetDinh,
        nghiCaNhan,
        chiTietNghiCaNhan,
        dayBu,
        chiTietDayBu,
        dayThay,
        chiTietDayThay,
        thucDay,
        mienGiam,
        chiTietGiuChucVu,
        chiTietKiemNhiem,
        thucHien,
        duGio} = req.body;

    const dinhMucFirst = dinhMuc.substring(0, dinhMuc.lastIndexOf(' '));
    const dinhMucLast = dinhMuc.substring(dinhMuc.lastIndexOf(' ') + 1);

    const today = new Date();
    const daySign = today.getDate();
    const monthSign = today.getMonth()+1;
    const yearSign = today.getFullYear();

    try{
        const chiTietPhanCongs = chiTietPhanCong.map(item =>
            new Paragraph({
                indent: {
                    firstLine: 567 // 1 cm
                },
                children: [
                    new TextRun({ text: `${item.Lop} - ${item.TenMon}: `,size: 26}),
                    new TextRun("\t"),
                    new TextRun({ text: `${item.SoTiet} tiết`, size: 26 }),
                ],
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 3000,
                    }
                ]

            })
        );

        const chiTietNghiCaNhans = chiTietNghiCaNhan.map(item =>
            new Paragraph({
                indent: {
                    firstLine: 567 // 1 cm
                },
                children: [
                    new TextRun({ text: `${item.Lop} - ${item.TenMon}: `,size: 26}),
                    new TextRun("\t"),
                    new TextRun({ text: `${item.SoTiet} tiết`, size: 26 }),
                ],
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 3000,
                    }
                ]

            })
        );

        const chiTietNghiCoQuyetDinhs = chiTietNghiCoQuyetDinh.map(item =>
            new Paragraph({
                indent: {
                    firstLine: 567 // 1 cm
                },
                children: [
                    new TextRun({ text: `${item.Lop} - ${item.TenMon}: `,size: 26}),
                    new TextRun("\t"),
                    new TextRun({ text: `${item.SoTiet} tiết`, size: 26 }),
                ],
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 3000,
                    }
                ]

            })
        );

        const chiTietDayBus = chiTietDayBu.map(item =>
            new Paragraph({
                indent: {
                    firstLine: 567 // 1 cm
                },
                children: [
                    new TextRun({ text: `${item.Lop} - ${item.TenMon}: `,size: 26}),
                    new TextRun("\t"),
                    new TextRun({ text: `${item.SoTiet} tiết`, size: 26 }),
                ],
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 3000,
                    }
                ]

            })
        );

        const chiTietDayThays = chiTietDayThay.map(item =>
            new Paragraph({
                indent: {
                    firstLine: 567 // 1 cm
                },
                children: [
                    new TextRun({ text: `${item.Lop} - ${item.TenMon}: `,size: 26}),
                    new TextRun("\t"),
                    new TextRun({ text: `${item.SoTiet} tiết`, size: 26 }),
                ],
                tabStops: [
                    {
                        type: TabStopType.LEFT,
                        position: 3000,
                    }
                ]

            })
        );

        const chucvus = [];
        if(chiTietGiuChucVu?.length){
            chucvus.push(
                new Paragraph({
                    indent: {
                        firstLine: 567 // 1 cm
                    },
                    children: [
                        new TextRun({ text: `Chức vụ: `,size: 26, bold: true}),
                    ]
                })
            );

            chucvus.push(
                ...chiTietGiuChucVu.map(item =>
                    new Paragraph({
                        indent: {
                            firstLine: 567 // 1 cm
                        },
                        children: [
                            new TextRun({ text: `${item.Ten}: `,size: 26}),
                            new TextRun("\t"),
                            new TextRun({ text: `${item.SoTietMien} x ${week} tuần = ${item.TongSoTietMien} tiết`, size: 26 }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.LEFT,
                                position: 6000,
                            }
                        ]
        
                    })
                )
            );
        };

        const kiemnhiems = [];
        if(chiTietKiemNhiem?.length){
            kiemnhiems.push(
                new Paragraph({
                    indent: {
                        firstLine: 567 // 1 cm
                    },
                    children: [
                        new TextRun({ text: `Kiêm nhiệm: `,size: 26, bold: true}),
                    ]
                })
            );

            kiemnhiems.push(
                ...chiTietKiemNhiem.map(item =>
                    new Paragraph({
                        indent: {
                            firstLine: 567 // 1 cm
                        },
                        children: [
                            new TextRun({ text: `${item.Ten}: `,size: 26}),
                            new TextRun("\t"),
                            new TextRun({ text: `${item.SoTietMien} x ${week} tuần = ${item.TongSoTietMien} tiết`, size: 26 }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.LEFT,
                                position: 6000,
                            }
                        ]
        
                    })
                )
            );
        };

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            line: 360, 
                            after: 200, 
                        },
                        children: [
                            new TextRun({ text: "KÊ KHAI QUY MÔ GIẢNG DẠY THÁNG " + month, bold: true, size: 28, allCaps: true })
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: `Tên giáo viên: `, size: 26, bold: true }),
                            new TextRun({ text: `${req.session.user.tenGV}`, size: 26 }),
                            new TextRun("\t"),
                            new TextRun({ text: `Thuộc bộ môn: `, size: 26, bold: true }),
                            new TextRun({ text: `${req.session.user.tenBM}`, size: 26 }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        children: [
                            new TextRun({ text: `Chức vụ: `, size: 26, bold: true }),
                            new TextRun({ text: `${req.session.user.tenCV}`, size: 26 }),
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "1. Định mức tiết dạy theo thông tư 05/2025/TT-BGDĐT", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: dinhMucFirst + " ", size: 26}),
                            new TextRun({ text: dinhMucLast + " tiết (1)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "2. Số tiết được phân công theo thời khoá biểu", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: phanCong + " tiết (2)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chiTietPhanCongs,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200, 
                        },
                        children: [
                            new TextRun({ text: "3. Quá trình thay đổi so với thời khoá biểu: ", size: 26, bold: true }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "3.1. Số tiết nghỉ có quyết định: ", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: nghiCoQuyetDinh + " tiết (3)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chiTietNghiCoQuyetDinhs,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "3.2. Số tiết nghỉ việc riêng: ", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: nghiCaNhan + " tiết (4)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chiTietNghiCaNhans,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "3.3. Số tiết dạy bù: ", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: dayBu + " tiết (5)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chiTietDayBus,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "3.4. Số tiết dạy thay: ", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: dayThay + " tiết (6)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chiTietDayThays,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "5. Số tiết thực dạy: (2)-(3)-(4)+(5)+(6)", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: thucDay + " tiết (7)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "6. Số tiết giảm giờ định mức đối với giáo viên giữ chức vụ, kiêm nhiệm: ", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: mienGiam + " tiết (8)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    ...chucvus,
                    ...kiemnhiems,
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "7. Tổng số tiết thực hiện: (7)+(8)", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: thucHien + " tiết (9)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    new Paragraph({
                        alignment: AlignmentType.LEFT,
                        spacing: {
                            before: 200,
                        },
                        children: [
                            new TextRun({ text: "8. Số tiết dư giờ: (9)-(1)", size: 26, bold: true }),
                            new TextRun("\t"),
                            new TextRun({ text: duGio + " tiết (10)", size: 26, bold: true }),
                        ],
                        tabStops: [
                            {
                                type: TabStopType.RIGHT,
                                position: TabStopPosition.MAX, // tab stop ở cuối dòng
                            }
                        ]
                    }),
                    new Paragraph("\n"),
                    new Paragraph("\n"),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({ text: `Cần Thơ, ngày ${daySign} tháng ${monthSign} năm ${yearSign}`, size: 26 }),
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun("\t"),
                            new TextRun({ text: "Tổ trưởng", size: 26, bold: true}),
                            new TextRun("\t"),
                            new TextRun({ text: "Người kê khai", size: 26, bold: true})
                        ],
                        tabStops: [
                            {
                                type: TabStopType.LEFT,
                                position: 1200
                            },
                            {
                                type: TabStopType.LEFT,
                                position: 6300
                            }
                        ]
                    })
                    

                ],
            }]
        });
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=ke_khai_quy_mo.docx');
        res.send(buffer);
    } catch (error) {
        console.error('Lỗi tạo file Word:', error);
        res.status(500).send('Lỗi tạo file Word');
    }
    
    
}

module.exports = {
    getDeclare,
    getMonth,
    getDataDeclare,
    getTimeTable,
    createWordDocument
};
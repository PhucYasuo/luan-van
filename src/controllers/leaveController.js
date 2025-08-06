const connection = require('../config/database');

const getLeaveReport = async (req, res) => {
    const teachers = await getTeacherInDepartment(req, res);

    res.render('leave-report.ejs', {
        user: req.session.user,
        teachers: teachers
    });
}

const getLeaveCheckRange = async (req, res) => {
    const { fromDate, toDate } = req.query;
    const fFromDate = getFormattedDay(new Date(fromDate));
    const fToDate = getFormattedDay(new Date(toDate));
    const [results] = await connection.promise().query(`
        SELECT tkb.*, m.M_Ten, tt.TT_Ten, ldb.TKB_ID AS LDB_ID, ldb.TKB_ID_DayBu, ldb.HTDB_ID, dk.VBMC_ID, vbmc.VBMC_File
        FROM thoikhoabieu tkb
        JOIN monhoc m ON tkb.M_Ma = m.M_Ma
        JOIN trangthai tt ON tkb.TT_Ma = tt.TT_Ma
        LEFT JOIN lichdaybu ldb ON tkb.TKB_ID = ldb.TKB_ID
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        LEFT JOIN vanbanmc vbmc on dk.VBMC_ID = vbmc.VBMC_ID
        WHERE ((tkb.GV_Ma = ? AND tkb.TT_Ma <> 'TT004') or (tkb.GV_DayThay = ? AND tkb.TT_Ma = 'TT004'))
        AND tkb.TKB_Ngay BETWEEN ? AND ?
        ORDER BY tkb.TKB_Ngay`,
        [req.session.user.maGV,req.session.user.maGV,fFromDate, fToDate]
    );
    return res.json({ dates: results });
}

function getFormattedDay(date) {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	const formattedDate = `${yyyy}-${mm}-${dd}`;
	return formattedDate;
}

const getTeacherInDepartment = async (req, res) => {
    const [results] = await connection.promise().query(`
        SELECT *
        FROM giaovien
        WHERE TBM_Ma = ?
        AND GV_Ma != ?`, [req.session.user.maBM, req.session.user.maGV,]);
    return results;
}

const postLeaveData = async (req, res) => {
    const localStorageData = req.body;
    const groupedData = {};

    for (const [key, value] of Object.entries(localStorageData)) {
        // Tách phần prefix và field
        const lastUnderscore = key.lastIndexOf('_');
        const prefix = key.substring(0, lastUnderscore);
        const field = key.substring(lastUnderscore + 1);

        // Khởi tạo nếu chưa có
        if (!groupedData[prefix]) {
            groupedData[prefix] = {};
        }

        // Gán giá trị vào nhóm
        groupedData[prefix][field] = value;

    }

    console.log(groupedData);

    for (const key in groupedData) {
        const detail = groupedData[key];
    
        if(detail.trangthai && detail.trangthai === 'TT001') {
            await checkIsChangeTT001(req, res, key);
        }

        if(detail.trangthai && detail.trangthai === 'TT002') {
            await checkIsChangeTT002(req, res, key, detail);
        }
    }

};

const checkIsChangeTT001 = async (req, res, key) => {
    const [ngay, lop, mon, tietBD] = key.split('_');
    const khoi = lop.substring(0, 2);
    const kyHieu = lop.substring(2, 3);
    const sttLop = lop.substring(3);
    const [results] = await connection.promise().query(`
        SELECT tkb.*, ldb.TKB_ID_DayBu, dk.TKB_ID AS TKB_ID_DK
        FROM thoikhoabieu tkb
        LEFT JOIN lichdaybu ldb ON tkb.TKB_ID = ldb.TKB_ID
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE TKB_Ngay = ?
        AND K_Khoi = ?
        AND KH_KyHieu = ?
        AND L_STTLop = ?
        AND M_Ma = ?
        AND TKB_TietBD = ?
        AND GV_Ma = ?
        ORDER BY TKB_ID`,
        [ngay, khoi, kyHieu, sttLop, mon, tietBD, req.session.user.maGV]
    );

    if (results.length <=2) {
        if(results[0].TT_Ma === 'TT001'){
            return;
        }
        else if( results[0].TT_Ma === 'TT002') {
            if(results[0].TKB_ID_DK){
                await updateTT_Ma(req, res, results[0].TKB_ID, 'TT001');
                await deleteDK(req, res, results[0].TKB_ID);
                if(results[1]) {
                    await deleteTKB(req, res, results[1].TKB_ID);
                }
            } else if(results[0].GV_DayThay){
                await updateTT_Ma(req, res, results[0].TKB_ID, 'TT001');
                await updateGV_DayThay(req, res, results[0].TKB_ID, null);
                if(results[1]) {
                    await deleteTKB(req, res, results[1].TKB_ID);
                }
            } else if(results[0].TKB_ID_DayBu){
                await updateTT_Ma(req, res, results[0].TKB_ID, 'TT001');
                await deleteLDB(req, res, results[0].TKB_ID);
                await deleteTKB(req, res, results[0].TKB_ID_DayBu);
            }
        }
            
        
    }
}

const checkIsChangeTT002 = async (req, res, key, data) => {
    const [ngay, lop, mon, tietBD] = key.split('_');
    const khoi = lop.substring(0, 2);
    const kyHieu = lop.substring(2, 3);
    const sttLop = lop.substring(3);
    const [results] = await connection.promise().query(`
        SELECT tkb.*, ldb.TKB_ID_DayBu, dk.TKB_ID AS TKB_ID_DK
        FROM thoikhoabieu tkb
        LEFT JOIN lichdaybu ldb ON tkb.TKB_ID = ldb.TKB_ID
        LEFT JOIN dinhkem dk ON tkb.TKB_ID = dk.TKB_ID
        WHERE TKB_Ngay = ?
        AND K_Khoi = ?
        AND KH_KyHieu = ?
        AND L_STTLop = ?
        AND M_Ma = ?
        AND TKB_TietBD = ?
        AND (GV_Ma = ? OR GV_DayThay = ?)
        ORDER BY TKB_ID`,
        [ngay, khoi, kyHieu, sttLop, mon, tietBD, req.session.user.maGV, req.session.user.maGV]
    );

    if (results.length <= 2) {
        if (results[0].TT_Ma === 'TT001') {
            if(data.replaceMethod && data.replaceMethod === 'DayBu') {
                if(data.makeupDate && data.makeupTime && data.makeupMethod){
                    await updateTT_Ma(req, res, results[0].TKB_ID, 'TT002');
                    const newID =  await insertTKB(req, res, khoi, kyHieu, sttLop, mon, data.makeupDate, data.makeupTime, results[0].TKB_SoTiet, results[0].T_Ma, 'TT003');
                    await insertLDB(req, res, results[0].TKB_ID, newID, data.makeupMethod);
                }
            } else if(data.replaceMethod && data.replaceMethod === 'DayThay') {
                if(data.substituteTeacher) {
                    await updateTT_Ma(req, res, results[0].TKB_ID, 'TT002');
                    await updateGV_DayThay(req, res, results[0].TKB_ID, data.substituteTeacher);
                    const newID =  await insertTKB(req, res, khoi, kyHieu, sttLop, mon, ngay, tietBD, results[0].TKB_SoTiet, results[0].T_Ma, 'TT004');
                    await updateGV_DayThay(req, res, newID, data.substituteTeacher);
                }
            } else if(data.replaceMethod && data.replaceMethod === 'NghiMC') {
                if (data.fileName && Array.isArray(data.fileName)) {
                    await updateTT_Ma(req, res, results[0].TKB_ID, 'TT002');
                
                    for (const file of data.fileName) {
                        const timestamp = new Date();
                        const sanitized = file
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, '')
                            .replace(/\s+/g, '_')
                            .replace(/[^\w.-]/g, '');
                
                        const uniqueName = `${timestamp.getDate()}-${timestamp.getMonth() + 1}-${timestamp.getFullYear()}-${req.session.user.maGV}-${sanitized}`;
                
                        const vbmcID = await insertVBMC(req, res, uniqueName);
                        await insertDK(req, res, results[0].TKB_ID, vbmcID);
                    }
                }
                
            }
                

            
        }
    }
}

const updateTT_Ma = async (req, res, TKB_ID, TT_Ma) => {
    await connection.promise().query(`
        UPDATE thoikhoabieu
        SET TT_Ma = ?
        WHERE TKB_ID = ?`,
        [TT_Ma, TKB_ID]
    );
}

const updateGV_DayThay = async (req, res, TKB_ID, GV_DayThay) => {
    await connection.promise().query(`
        UPDATE thoikhoabieu
        SET GV_DayThay = ?
        WHERE TKB_ID = ?`,
        [GV_DayThay, TKB_ID]
    );
}

const deleteTKB = async (req, res, TKB_ID) => {
    await connection.promise().query(`
        DELETE FROM thoikhoabieu
        WHERE TKB_ID = ?`,
        [TKB_ID]
    );
}

const insertTKB = async (req, res, khoi, kyHieu, sttLop, maMon, ngay, tietBD, soTiet, tuan, trangthai) => {
    const [results] = await connection.promise().query(`
        INSERT INTO thoikhoabieu (GV_Ma, M_Ma, K_Khoi, KH_KyHieu, L_STTLop, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma, TT_Ma)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.session.user.maGV, maMon, khoi, kyHieu, sttLop, req.session.user.namHoc, req.session.user.hocKy, ngay, tietBD, soTiet, tuan, trangthai]
    );
    return results.insertId;
}

const deleteLDB = async (req, res, TKB_ID) => {
    await connection.promise().query(`
        DELETE FROM lichdaybu
        WHERE TKB_ID = ?`,
        [TKB_ID]
    );
}

const insertLDB = async (req, res, TKB_ID, TKB_ID_DayBu, HTDB_ID) => {
    await connection.promise().query(`
        INSERT INTO lichdaybu (TKB_ID, TKB_ID_DayBu, HTDB_ID)
        VALUES (?, ?, ?)`,
        [TKB_ID, TKB_ID_DayBu, HTDB_ID]
    );
}

const deleteDK = async (req, res, TKB_ID) => {
    await connection.promise().query(`
        DELETE FROM dinhkem
        WHERE TKB_ID = ?`,
        [TKB_ID]
    );
}

const insertDK = async (req, res, TKB_ID, VBMC_ID) => {
    await connection.promise().query(`
        INSERT INTO dinhkem (TKB_ID, VBMC_ID)
        VALUES (?, ?)`,
        [TKB_ID, VBMC_ID]
    );
}

const insertVBMC = async (req, res, fileName) => {
    const [results] = await connection.promise().query(`
        INSERT INTO vanbanmc (VBMC_File)
        VALUES (?)`,
        [fileName]
    );
    return results.insertId;
}

const postUploadFile = () => {

}


module.exports = {
    getLeaveReport,
    getLeaveCheckRange,
    postLeaveData,
    postUploadFile
};
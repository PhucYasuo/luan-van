const connection = require('../config/database');

const getLeave = (req, res) => {
    return res.render('leave-permission.ejs', {
        user: req.session.user
    });
}
//Note: dù chỉ là select nhưng nên dùng post vì có body và nhiều tham số đầu vào
const postClass = (req, res) => {
    const { date, weekday } = req.body; // date dạng YYYY-MM-DD
    
    
    const query = `
      SELECT M_Ma, L_STTLop, K_Khoi, KH_KyHieu, TKB_TietBD, TKB_SoTiet
      FROM thoikhoabieu
      WHERE GV_Ma = ? AND TKB_Thu = ? AND TKB_NgayHieuLuc <= ? AND NH_NamHoc = ? AND HK_HocKy = ?
    `;
    
    connection.query(query, [req.session.user.maGV, weekday, date, req.session.user.namHoc, req.session.user.hocKy], (err, results) => {
        if (err) {
            console.error("Lỗi truy vấn:", err);
            return res.status(500).json({ error: "Lỗi truy vấn CSDL" });
        }
        
        // Xử lý dữ liệu trả về: tính tên lớp và chỉ lấy các dòng duy nhất theo lớp và môn
        const classes = results.map(row => ({
            subject: row.M_Ma,
            className: row.K_Khoi + row.KH_KyHieu + row.L_STTLop, 
            tietBD: row.TKB_TietBD,
            soTiet: row.TKB_SoTiet
        }));
        
        // Lọc các lớp duy nhất
        
        const uniqueClasses = [];
        const seen = new Set();
        classes.forEach(item => {
            const key = item.className + "_" + item.subject;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueClasses.push(item);
            }
        });
        
        res.json({ classes: uniqueClasses });
    });
};

const getTeacher = (req, res) => {
    const sql = "SELECT GV_Ma, GV_HoTen, TBM_Ma FROM giaovien";
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}


const postResultLP = async (req, res) => {
    try {
        let { leaveData, fromDate, toDate, reason } = req.body;

        // Parse leaveData nếu là chuỗi
        if (typeof leaveData === 'string') {
            leaveData = JSON.parse(leaveData);
        }

        // Kiểm tra dữ liệu đầu vào
        if (!leaveData || !fromDate || !toDate || !reason) {
            return res.status(400).send('Dữ liệu đầu vào không hợp lệ');
        }

        res.render('result-leave-permission.ejs', {
            leaveData,
            fromDate,
            toDate,
            reason
        });
    } catch (error) {
        console.error('Lỗi khi xử lý yêu cầu xin nghỉ:', error);
        res.status(500).send('Lỗi server, vui lòng thử lại');
    }
}

const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = require('docx');

const createWordMultiple = async  (req, res) => {
    try {
        
        const {selfData, sameData, difData, fromDate, toDate, reason} = req.body;
        let toDay = new Date();
        let day = toDay.getDate();
        let month = toDay.getMonth() + 1;
        let year = toDay.getFullYear();
        const tenGV = req.session.user.tenGV;
        const tenCV = req.session.user.tenCV;

        const sameTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            rows: [
                // Dòng tiêu đề
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Ngày")] }),
                        new TableCell({ children: [new Paragraph("Lớp")] }),
                        new TableCell({ children: [new Paragraph("Môn")] }),
                        new TableCell({ children: [new Paragraph("Tiết nghỉ")] }),
                        new TableCell({ children: [new Paragraph("Bài dạy")] }),
                        new TableCell({ children: [new Paragraph("GV thay")] }),
                    ]
                }),
                // Dữ liệu từng dòng
                ...sameData.map(item =>
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(item.date)] }),
                            new TableCell({ children: [new Paragraph(item.className)] }),
                            new TableCell({ children: [new Paragraph(item.subjectName)] }),
                            new TableCell({ children: [new Paragraph(item.periodsStr)] }),
                            new TableCell({ children: [new Paragraph(item.lessonName)] }),
                            new TableCell({ children: [new Paragraph(item.subTeacher)] }),
                        ]
                    })
                )
            ]
        });

        const difTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            rows: [
                // Dòng tiêu đề
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Ngày")] }),
                        new TableCell({ children: [new Paragraph("Lớp")] }),
                        new TableCell({ children: [new Paragraph("Môn")] }),
                        new TableCell({ children: [new Paragraph("Tiết nghỉ")] }),
                        new TableCell({ children: [new Paragraph("Bài dạy")] }),
                        new TableCell({ children: [new Paragraph("GV thay")] }),
                        new TableCell({ children: [new Paragraph("Ngày bù")] }),
                        new TableCell({ children: [new Paragraph("Tiết bù")] }),
                    ]
                }),
                // Dữ liệu từng dòng
                ...difData.map(item =>
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(item.date)] }),
                            new TableCell({ children: [new Paragraph(item.className)] }),
                            new TableCell({ children: [new Paragraph(item.subjectName)] }),
                            new TableCell({ children: [new Paragraph(item.periodsStr)] }),
                            new TableCell({ children: [new Paragraph(item.lessonName)] }),
                            new TableCell({ children: [new Paragraph(item.subTeacher)] }),
                            new TableCell({ children: [new Paragraph(item.subDate)] }),
                            new TableCell({ children: [new Paragraph(item.subPeriod)] }),
                        ]
                    })
                )
            ]
        });

        const selfTable = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            rows: [
                // Dòng tiêu đề
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("Ngày")] }),
                        new TableCell({ children: [new Paragraph("Lớp")] }),
                        new TableCell({ children: [new Paragraph("Môn")] }),
                        new TableCell({ children: [new Paragraph("Tiết nghỉ")] }),
                        new TableCell({ children: [new Paragraph("Bài dạy")] }),
                        new TableCell({ children: [new Paragraph("Ngày bù")] }),
                        new TableCell({ children: [new Paragraph("Tiết bù")] }),
                    ]
                }),
                // Dữ liệu từng dòng
                ...selfData.map(item =>
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(item.date)] }),
                            new TableCell({ children: [new Paragraph(item.className)] }),
                            new TableCell({ children: [new Paragraph(item.subjectName)] }),
                            new TableCell({ children: [new Paragraph(item.periodsStr)] }),
                            new TableCell({ children: [new Paragraph(item.lessonName)] }),
                            new TableCell({ children: [new Paragraph(item.subDate)] }),
                            new TableCell({ children: [new Paragraph(item.subPeriod)] }),
                        ]
                    })
                )
            ]
        });

        // Tạo tài liệu Word
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM", bold: true, size: 26, allCaps: true }),
                            new TextRun({ text: "Độc lập - Tự do - Hạnh phúc", bold: true, size: 26, allCaps: true, break: 1 })
                        ]
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [new TextRun({ text: "ĐƠN XIN PHÉP", bold: true, size: 28, allCaps: true })]
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [new TextRun({ text: "Kính gửi: Ban Giám Hiệu Trường THPT Nguyễn Việt Hồng", size: 26 })]
                    }),
                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        tabStops: [{type: "left", position: 4500}],
                        children: [
                            new TextRun({ text: "Tên tôi là: " + tenGV, size: 26 }),
                            new TextRun({ text: "\tChức vụ: " + tenCV, size: 26 })
                        ]
                    }),
                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [
                            new TextRun({
                                text: `Hiện là giáo viên của trường THPT Nguyễn Việt Hồng. Nay tôi làm đơn này xin phép cho tôi được nghỉ dạy từ ngày ${convertDateFormat(fromDate)} đến ngày ${convertDateFormat(toDate)}`,
                                size: 26
                            })
                        ]
                    }),
                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [new TextRun({ text: "Lý do: " + reason, size: 26 })]
                    }),
                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [new TextRun({ text: "Tôi đã liên hệ đồng nghiệp dạy thế theo lịch sau: ", size: 26 })]
                    }),
                    sameTable,

                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [new TextRun({ text: "Tôi đã đổi giờ dạy với đồng nghiệp bộ môn khác theo lịch sau: ", size: 26 })]
                    }),
                    difTable,

                    new Paragraph({
                        indent: { firstLine: 567 },
                        spacing: { before: 100, after: 100 },
                        children: [new TextRun({ text: "Các tiết dạy không có người thế, tôi dự kiến dạy bù theo lịch sau: ", size: 26 })]
                    }),
                    selfTable,

                    new Paragraph({ text: "" }),
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        spacing: { before: 100, after: 100 },
                        children: [
                            new TextRun({ text: "Cần Thơ, ngày " + day + " tháng " + month + " năm " + year, italics: true, size: 26 }),
                        ]
                    }),

                    new Paragraph({ text: "" }),
                    new Paragraph({
                        tabStops: [{type: "left", position: 2800}, { type: "left", position: 6800 }],
                        spacing: { before: 100, after: 100 },
                        children: [
                            new TextRun({ text: "BAN LÃNH ĐẠO", bold: true, size: 26, allCaps: true }),
                            new TextRun({ text: "\tÝ KIẾN CỦA TỔ TRƯỞNG", bold: true, size: 26, allCaps: true }),
                            new TextRun({ text: "\tNGƯỜI LÀM ĐƠN", bold: true, size: 26, allCaps: true }),
                        ]
                    }),
                ]
            }]
        });

        // Tạo buffer cho file Word
        const buffer = await Packer.toBuffer(doc);

        // Thiết lập header để trả về file
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=danh_sach_xin_nghi.docx');
        res.send(buffer);
    } catch (error) {
        console.error('Lỗi tạo file Word:', error);
        res.status(500).send('Lỗi tạo file Word');
    }
}

function convertDateFormat(dateString) {
    let [yyyy, mm, dd] = dateString.split('-');
    return `${dd}/${mm}/${yyyy}`;
}

function convertDateFormatToData(dateString) {
    if (!dateString) return null;
    let [dd, mm, yyyy] = dateString.split('/');
    if (!dd || !mm || !yyyy) return null;
    return `${yyyy}-${mm}-${dd}`;
}


const getSubject = async (req, res) => {
    const sql = "SELECT M_Ma, M_Ten FROM monhoc";
    
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
}



const saveLeaveData = async (req, res) => {
    const { fromDate, toDate, reason, allData } = req.body;
    const maGV = req.session.user.maGV;
    const hocKy = req.session.user.hocKy;
    const namHoc = req.session.user.namHoc;
    try {
        // Tạo mã phiếu nghỉ phép
        const [maxPNP] = await connection.promise().query(`SELECT MAX(PNP_STT) AS max FROM phieunghiphep`);
        let newPNP = 'PNP000001';
        if (maxPNP[0].max) {
            const num = parseInt(maxPNP[0].max.slice(3)) + 1;
            newPNP = 'PNP' + num.toString().padStart(6, '0'); 
        }

        // Thêm vào phieunghiphep
        await connection.promise().query(`
            INSERT INTO phieunghiphep 
            (PNP_STT, PNP_TuNgay, PNP_DenNgay, PNP_LyDo, GV_Ma, HK_HocKy, NH_NamHoc, TT_Ma)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [newPNP, fromDate, toDate, reason, maGV, hocKy, namHoc, 'TT001']
        );

        
        for (let item of allData) {
            let khoi = item.className.slice(0, 2);
            let kyHieu = item.className.slice(2, 3);
            let sttLop = item.className.slice(3);
            item.date = convertDateFormatToData(item.date);
            item.subDate = convertDateFormatToData(item.subDate);
            await connection.promise().query(`
                INSERT INTO chitietnghiphep
                (PNP_STT, CTNP_NgayNghi, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, M_Ma, 
                CTNP_TietBDNghi, CTNP_SoTietNghi, CTNP_TenBai, GV_Ma, CTNP_NgayDayBu, CTNP_TietBDDayBu)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [newPNP, item.date, sttLop, khoi, kyHieu, namHoc, item.subjectCode, 
                item.periodsStr.charAt(0), item.periodsStr.length, item.lessonName,
                (item.subTeacherName === 'Tự dạy bù' ? null : item.subTeacherCode),
                item.subDate || null, item.subPeriod || null]
            );
        }
        
        res.json({ success: true, message: 'Đã lưu thành công!' });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi lưu dữ liệu.' });
    }
}

module.exports = {
    getLeave,
    postClass,
    getSubject,
    getTeacher,
    postResultLP,
    createWordMultiple,
    saveLeaveData
};
const connection = require('../config/database');

const getStatisticByDepartmentLp = (req, res) => {
    const maBM = req.session.user.maBM;
    const getGVQuery = `SELECT GV_Ma, GV_HoTen FROM giaovien WHERE TBM_Ma = ?`;

    connection.query(getGVQuery, [maBM], async (err, results) => {
        if (err) return res.status(500).send('Lỗi lấy giáo viên');

        let thongke = [];

        for (let i = 0; i < results.length; i++) {
            const gv = results[i];

            // Số tiết nghỉ
            const tietNghi = await new Promise(resolve => {
                const query = `SELECT SUM(ct.CTNP_SoTietNghi) AS soTietNghi
                    FROM chitietnghiphep ct
                    JOIN phieunghiphep pnp ON pnp.PNP_STT = ct.PNP_STT
                    JOIN giaovien gv ON pnp.GV_Ma = gv.GV_Ma
                    WHERE gv.GV_Ma = ?
                    AND pnp.TT_Ma = 'TT002'`;
                connection.query(query, [gv.GV_Ma], (err, rows) => resolve(rows[0].soTietNghi || 0));
            });

            // Số tiết dạy bù
            const tietDayBu = await new Promise(resolve => {
                const query = `SELECT SUM(ct.CTNP_SoTietNghi) AS soTietDayBu
                    FROM chitietnghiphep ct
                    JOIN phieunghiphep pnp ON pnp.PNP_STT = ct.PNP_STT
                    JOIN giaovien gv ON pnp.GV_Ma = gv.GV_Ma
                    WHERE ct.GV_Ma IS NULL
                    AND gv.GV_Ma = ?
                    AND pnp.TT_Ma = 'TT002'`;
                connection.query(query, [gv.GV_Ma], (err, rows) => resolve(rows[0].soTietDayBu || 0));
            });

            // Số tiết dạy thay
            const tietDayThay = await new Promise(resolve => {
                const query = `SELECT SUM(ct.CTNP_SoTietNghi) AS soTietDayThay
                    FROM chitietnghiphep ct
                    JOIN phieunghiphep pnp ON pnp.PNP_STT = ct.PNP_STT
                    JOIN giaovien gv ON ct.GV_Ma = gv.GV_Ma
                    WHERE gv.GV_Ma = ?
                    AND pnp.TT_Ma = 'TT002'`;
                connection.query(query, [gv.GV_Ma], (err, rows) => resolve(rows[0].soTietDayThay || 0));
            });

            thongke.push({
                STT: i + 1,
                GV_Ma: gv.GV_Ma,
                GV_HoTen: gv.GV_HoTen,
                tietNghi,
                tietDayBu,
                tietDayThay
            });
        }

        res.render('statistical-department-lp', { user: req.session.user, thongke });
    });
}

const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = require('docx');

const postCreateStatisticByDepartmentLp = async (req, res) => {
    try {
        const { thongke } = req.body;
        const maBM = req.session.user.maBM;
        const tenBM = req.session.user.tenBM;

        // Tạo bảng thống kê
        const table = new Table({
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            rows: [
                new TableRow({
                    children: [
                        new TableCell({ children: [new Paragraph("STT")] }),
                        new TableCell({ children: [new Paragraph("Mã GV")] }),
                        new TableCell({ children: [new Paragraph("Họ Tên GV")] }),
                        new TableCell({ children: [new Paragraph("Số Tiết Nghỉ")] }),
                        new TableCell({ children: [new Paragraph("Số Tiết Dạy Bù")] }),
                        new TableCell({ children: [new Paragraph("Số Tiết Dạy Thay")] })
                    ]
                }),
                ...thongke.map(item =>
                    new TableRow({
                        children: [
                            new TableCell({ children: [new Paragraph(item.STT.toString())] }),
                            new TableCell({ children: [new Paragraph(item.GV_Ma)] }),
                            new TableCell({ children: [new Paragraph(item.GV_HoTen)] }),
                            new TableCell({ children: [new Paragraph(item.tietNghi.toString())] }),
                            new TableCell({ children: [new Paragraph(item.tietDayBu.toString())] }),
                            new TableCell({ children: [new Paragraph(item.tietDayThay.toString())] })
                        ]
                    })
                )
            ]
        });

        // Tạo tài liệu Word
        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                            new TextRun({ text: "THỐNG KÊ TỔ BỘ MÔN", bold: true, size: 28, allCaps: true })
                        ]
                    }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: `Mã tổ bộ môn: ${maBM}`, size: 26 }),
                    new Paragraph({ text: `Tên tổ bộ môn: ${tenBM}`, size: 26 }),
                    new Paragraph({ text: "" }),
                    table
                ]
            }]
        });

        // Xuất file
        const buffer = await Packer.toBuffer(doc);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=thong_ke_to_bo_mon.docx');
        res.send(buffer);
    } catch (error) {
        console.error('Lỗi tạo file Word:', error);
        res.status(500).send('Lỗi tạo file Word');
    }
}

module.exports = {
    getStatisticByDepartmentLp,
    postCreateStatisticByDepartmentLp,
}
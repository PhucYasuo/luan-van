ALTER DATABASE qlkhoiluongcongtacthpt 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

DROP TABLE IF EXISTS lichdaybu;
DROP TABLE IF EXISTS hinhthucdaybu;
DROP TABLE IF EXISTS dinhkem;
DROP TABLE IF EXISTS vanbanmc;
DROP TABLE IF EXISTS thoikhoabieu;
DROP TABLE IF EXISTS chuongtrinhgiangday;
DROP TABLE IF EXISTS trangthai;
DROP TABLE IF EXISTS tuan;
DROP TABLE IF EXISTS giangday;
DROP TABLE IF EXISTS nhommonhoc;
DROP TABLE IF EXISTS lop;
DROP TABLE IF EXISTS kyhieu;
DROP TABLE IF EXISTS khoi;
DROP TABLE IF EXISTS kiemnhiem;
DROP TABLE IF EXISTS nhiemvu;
DROP TABLE IF EXISTS giuchucvu;
DROP TABLE IF EXISTS chucvu;
DROP TABLE IF EXISTS sohuuquyen;
DROP TABLE IF EXISTS quyen;
DROP TABLE IF EXISTS vaitro;
DROP TABLE IF EXISTS taikhoan;
DROP TABLE IF EXISTS giaovien;
DROP TABLE IF EXISTS monhoc;
DROP TABLE IF EXISTS tobomon;
DROP TABLE IF EXISTS ngaynghichung;
DROP TABLE IF EXISTS namhoc;
DROP TABLE IF EXISTS hocky;

CREATE TABLE hocky (
  HK_HocKy char(1) NOT NULL,
  HK_SoTuan int NOT NULL,
  PRIMARY KEY (HK_HocKy)
)ENGINE=InnoDB;

INSERT INTO hocky (HK_HocKy, HK_SoTuan) VALUES 
('1', 18),  -- Học kỳ 1 có 18 tuần
('2', 17);  -- Học kỳ 2 có 17 tuần


CREATE TABLE namhoc (
  NH_NamHoc char(9) NOT NULL,
  NH_SoTietChuan int NOT NULL,
  NH_NgayDauNam date NOT NULL,
  PRIMARY KEY (NH_NamHoc)
)ENGINE=InnoDB;

INSERT INTO namhoc (NH_NamHoc, NH_SoTietChuan, NH_NgayDauNam) VALUES
('2023-2024', 1000, '2023-08-28'),
('2024-2025', 1000, '2024-08-26');

CREATE TABLE ngaynghichung (
  NNC_Ngay char(5) NOT NULL,
  NNC_LiDo varchar(100) NOT NULL,
  HK_HocKy char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  PRIMARY KEY (NNC_Ngay),
  FOREIGN KEY (HK_HocKy) REFERENCES hocky (HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (NH_NamHoc) REFERENCES namhoc (NH_NamHoc) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE tobomon (
  TBM_Ma char(5) NOT NULL,
  TBM_Ten varchar(50) NOT NULL,
  PRIMARY KEY (TBM_Ma)
)ENGINE=InnoDB;

INSERT INTO tobomon (TBM_Ma, TBM_Ten) VALUES 
('BM001', 'Toán Học - Tin Học'),
('BM002', 'Ngữ Văn - Giáo Dục Công Dân'),
('BM003', 'Ngoại Ngữ'),
('BM004', 'Lịch Sử - Địa Lý'),
('BM005', 'Vật Lí - Hoá Học'),
('BM006', 'Sinh Học - Công Nghệ'),
('BM007', 'Thể Dục - Giáo Dục Quốc Phòng');

CREATE TABLE monhoc (
  M_Ma char(5) NOT NULL,
  M_Ten varchar(20) NOT NULL,
  TBM_Ma char(5),
  PRIMARY KEY (M_Ma),
  FOREIGN KEY (TBM_Ma) REFERENCES tobomon (TBM_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

-- Dữ liệu cho bảng môn học
INSERT INTO monhoc (M_Ma, M_Ten, TBM_Ma) VALUES
('MON01', 'Toán Học', 'BM001'),
('MON02', 'Ngữ Văn', 'BM002'),
('MON03', 'Anh Văn', 'BM003'),
('MON04', 'Sinh Học', 'BM006'),
('MON05', 'Vật Lí', 'BM005'),
('MON06', 'Hoá Học', 'BM005'),
('MON07', 'Địa Lí', 'BM004'),
('MON08', 'Lịch Sử', 'BM004'),
('MON09', 'Giáo Dục Công Dân', 'BM002'),
('MON10', 'Thể Dục', 'BM007'),
('MON11', 'Giáo Dục Quốc Phòng', 'BM007'),
('MON12', 'Công Nghệ', 'BM006'),
('MON13', 'Tin Học', 'BM001');

CREATE TABLE giaovien (
  GV_Ma char(5) NOT NULL,
  GV_HoTen varchar(30) NOT NULL,
  GV_NgaySinh date NOT NULL,
  GV_GioiTinh tinyint NOT NULL,
  GV_SoDT varchar(11) UNIQUE NOT NULL,
  GV_Mail varchar(50) UNIQUE NOT NULL,
  GV_DiaChi varchar(100) NOT NULL,
  TBM_Ma char(5) NOT NULL,
  PRIMARY KEY (GV_Ma),
  FOREIGN KEY (TBM_Ma) REFERENCES tobomon (TBM_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

ALTER TABLE giaovien ADD CONSTRAINT check_gioitinh CHECK (GV_GioiTinh IN (0,1));

INSERT INTO giaovien (GV_Ma, GV_HoTen, GV_NgaySinh, GV_GioiTinh, GV_SoDT, GV_Mail, GV_DiaChi, TBM_Ma) VALUES
-- Toán Học - Tin Học
('GV001', 'Dương Huỳnh Anh Thư', '2005-05-04', 1, '0912345670', 'anhthuduonghuynh455@gmail.com', '123 Đường A', 'BM001'),
('GV002', 'Ngô Văn Sơn', '1986-07-20', 1, '0912345671', 'congson976@gmail.com', '234 Đường B', 'BM001'),
('GV003', 'Trần Văn C', '1987-08-25', 0, '0912345672', 'vanc3@example.com', '345 Đường C', 'BM001'),
('GV004', 'Lê Thị D', '1988-09-30', 1, '0912345673', 'vand4@example.com', '456 Đường D', 'BM001'),
('GV005', 'Phạm Văn E', '1989-10-05', 0, '0912345674', 'vane5@example.com', '567 Đường E', 'BM001'),

-- Ngữ Văn - Giáo Dục Công Dân
('GV006', 'Cao Hồng Phúc', '1980-01-15', 0, '0912345675', 'phucc0386@gmail.com', '678 Đường F', 'BM002'),
('GV007', 'Vũ Thị G', '1981-02-20', 1, '0912345676', 'vang7@example.com', '789 Đường G', 'BM002'),
('GV008', 'Hoàng Văn H', '1982-03-25', 0, '0912345677', 'vanh8@example.com', '890 Đường H', 'BM002'),
('GV009', 'Đặng Thị I', '1983-04-30', 1, '0912345678', 'vani9@example.com', '901 Đường I', 'BM002'),
('GV010', 'Đỗ Văn J', '1984-05-05', 0, '0912345679', 'vanj10@example.com', '012 Đường J', 'BM002'),

-- Ngoại Ngữ
('GV011', 'Phan Văn K', '1980-06-10', 0, '0912345680', 'vank11@example.com', '123 Đường K', 'BM003'),
('GV012', 'Ngô Thị L', '1981-07-15', 1, '0912345681', 'vanl12@example.com', '234 Đường L', 'BM003'),
('GV013', 'Đoàn Văn M', '1982-08-20', 0, '0912345682', 'vanm13@example.com', '345 Đường M', 'BM003'),
('GV014', 'Mai Thị N', '1983-09-25', 1, '0912345683', 'vann14@example.com', '456 Đường N', 'BM003'),

-- Lịch Sử - Địa Lý
('GV015', 'Trịnh Văn O', '1980-10-10', 0, '0912345684', 'vano15@example.com', '567 Đường O', 'BM004'),
('GV016', 'Nguyễn Thị P', '1981-11-15', 1, '0912345685', 'vanp16@example.com', '678 Đường P', 'BM004'),
('GV017', 'Nguyễn Văn Q', '1982-12-20', 0, '0912345686', 'vanq17@example.com', '789 Đường Q', 'BM004'),
('GV018', 'Lê Thị R', '1983-01-25', 1, '0912345687', 'vanr18@example.com', '890 Đường R', 'BM004'),

-- Vật Lí - Hoá Học
('GV019', 'Trần Văn S', '1984-02-10', 0, '0912345688', 'vans19@example.com', '901 Đường S', 'BM005'),
('GV020', 'Nguyễn Văn A', '1985-06-15', 0, '0912345689', 'vana1@example.com', '012 Đường T', 'BM005'),
('GV021', 'Hoàng Văn U', '1986-04-20', 0, '0912345690', 'vanu21@example.com', '123 Đường U', 'BM005'),
('GV022', 'Phạm Thị V', '1987-05-25', 1, '0912345691', 'vanv22@example.com', '234 Đường V', 'BM005'),

-- Sinh Học - Công Nghệ
('GV023', 'Đặng Văn W', '1980-06-10', 0, '0912345692', 'vanw23@example.com', '345 Đường W', 'BM006'),
('GV024', 'Đỗ Thị X', '1981-07-15', 1, '0912345693', 'vanx24@example.com', '456 Đường X', 'BM006'),
('GV025', 'Mai Văn Y', '1982-08-20', 0, '0912345694', 'vany25@example.com', '567 Đường Y', 'BM006'),

-- Thể Dục - Giáo Dục Quốc Phòng
('GV026', 'Ngô Văn Z', '1983-09-10', 0, '0912345695', 'vanz26@example.com', '678 Đường Z', 'BM007'),
('GV027', 'Trịnh Thị A1', '1984-10-15', 1, '0912345696', 'vana27@example.com', '789 Đường A1', 'BM007'),
('GV028', 'Đoàn Văn B2', '1985-11-20', 0, '0912345697', 'vanb28@example.com', '890 Đường B2', 'BM007');


CREATE TABLE taikhoan (
  TK_Ma char(5) NOT NULL,
  TK_Ten varchar(50) NOT NULL,
  TK_MatKhau varchar(16) NOT NULL,
  GV_Ma char(5) NOT NULL,
  PRIMARY KEY (TK_Ma),
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO taikhoan (TK_Ma, TK_Ten, TK_MatKhau, GV_Ma) VALUES
-- Toán Học - Tin Học
('TK001', 'giaovien01', 'matkhau001', 'GV001'),
('TK002', 'giaovien02', 'matkhau002', 'GV002'),
('TK003', 'giaovien03', 'matkhau003', 'GV003'),
('TK004', 'giaovien04', 'matkhau004', 'GV004'),
('TK005', 'giaovien05', 'matkhau005', 'GV005'),

-- Ngữ Văn - Giáo Dục Công Dân
('TK006', 'giaovien06', 'matkhau006', 'GV006'),
('TK007', 'giaovien07', 'matkhau007', 'GV007'),
('TK008', 'giaovien08', 'matkhau008', 'GV008'),
('TK009', 'giaovien09', 'matkhau009', 'GV009'),
('TK010', 'giaovien10', 'matkhau010', 'GV010'),

-- Ngoại Ngữ
('TK011', 'giaovien11', 'matkhau011', 'GV011'),
('TK012', 'giaovien12', 'matkhau012', 'GV012'),
('TK013', 'giaovien13', 'matkhau013', 'GV013'),
('TK014', 'giaovien14', 'matkhau014', 'GV014'),

-- Lịch Sử - Địa Lý
('TK015', 'giaovien15', 'matkhau015', 'GV015'),
('TK016', 'giaovien16', 'matkhau016', 'GV016'),
('TK017', 'giaovien17', 'matkhau017', 'GV017'),
('TK018', 'giaovien18', 'matkhau018', 'GV018'),

-- Vật Lí - Hoá Học
('TK019', 'giaovien19', 'matkhau019', 'GV019'),
('TK020', 'giaovien20', 'matkhau020', 'GV020'),
('TK021', 'giaovien21', 'matkhau021', 'GV021'),
('TK022', 'giaovien22', 'matkhau022', 'GV022'),

-- Sinh Học - Công Nghệ
('TK023', 'giaovien23', 'matkhau023', 'GV023'),
('TK024', 'giaovien24', 'matkhau024', 'GV024'),
('TK025', 'giaovien25', 'matkhau025', 'GV025'),

-- Thể Dục - Giáo Dục Quốc Phòng
('TK026', 'giaovien26', 'matkhau026', 'GV026'),
('TK027', 'giaovien27', 'matkhau027', 'GV027'),
('TK028', 'giaovien28', 'matkhau028', 'GV028');

CREATE TABLE vaitro (
  VT_Ma char(5) NOT NULL,
  VT_Ten varchar(50) NOT NULL,
  PRIMARY KEY (VT_Ma)
)ENGINE=InnoDB;

INSERT INTO vaitro (VT_Ma, VT_Ten) VALUES 
('VT001', 'Quản Trị Viên'),
('VT002', 'Hiệu Trưởng'),
('VT003', 'Phó Hiệu Trưởng Chuyên Môn'),
('VT004', 'Tổ Trưởng Bộ Môn'),
('VT005', 'Giáo Viên');

CREATE TABLE quyen (
  Q_Ma char(5) NOT NULL,
  Q_Ten varchar(50) NOT NULL,
  PRIMARY KEY (Q_Ma)
)ENGINE=InnoDB;

INSERT INTO quyen (Q_Ma, Q_Ten) VALUES 
('Q0001', 'Phân quyền'),
('Q0002', 'Cập nhật giáo viên'),
('Q0003', 'Xin nghỉ'),
('Q0004', 'Kê khai'),
('Q0005', 'Lập thời khoá biểu');

CREATE TABLE sohuuquyen (
  TK_Ma char(5) NOT NULL,
  VT_Ma char(5) NOT NULL,
  Q_Ma char(5) NOT NULL,
  PRIMARY KEY (Q_Ma, VT_Ma, TK_Ma),
  FOREIGN KEY (Q_Ma) REFERENCES quyen (Q_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (TK_Ma) REFERENCES taikhoan (TK_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (VT_Ma) REFERENCES vaitro (VT_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO sohuuquyen (TK_Ma, VT_Ma, Q_Ma) VALUES
('TK001', 'VT001', 'Q0001'),
('TK001', 'VT005', 'Q0003'),
('TK001', 'VT005', 'Q0004'),

('TK002', 'VT005', 'Q0003'),
('TK002', 'VT005', 'Q0004'),

('TK003', 'VT005', 'Q0003'),
('TK003', 'VT005', 'Q0004'),

('TK004', 'VT005', 'Q0003'),
('TK004', 'VT005', 'Q0004'),

('TK005', 'VT005', 'Q0003'),
('TK005', 'VT005', 'Q0004'),

('TK006', 'VT005', 'Q0003'),
('TK006', 'VT005', 'Q0004');

CREATE TABLE chucvu (
  CV_Ma char(5) NOT NULL,
  CV_Ten varchar(50) NOT NULL,
  CV_SoTietMien int NOT NULL,
  PRIMARY KEY (CV_Ma)
)ENGINE=InnoDB;

INSERT INTO chucvu (CV_Ma, CV_Ten, CV_SoTietMien) VALUES 
('CV001', 'Hiệu Trưởng', 17),
('CV002', 'Phó Hiệu Trưởng', 13),
('CV003', 'Tổ Trưởng Tổ Bộ Môn', 3),
('CV004', 'Quản Trị Hệ Thống', 5);


CREATE TABLE giuchucvu (
  GV_Ma char(5) NOT NULL,
  CV_Ma char(5) NOT NULL,
  HK_HocKy char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  PRIMARY KEY (GV_Ma, CV_Ma, HK_HocKy, NH_NamHoc),
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (CV_Ma) REFERENCES chucvu (CV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (NH_NamHoc) REFERENCES namhoc (NH_NamHoc) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (HK_HocKy) REFERENCES hocky (HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO giuchucvu (GV_Ma, CV_Ma, HK_HocKy, NH_NamHoc) VALUES 
('GV001', 'CV001', '1', '2023-2024'),
('GV006', 'CV002', '1', '2023-2024'),
('GV002', 'CV003', '1', '2023-2024'),
('GV007', 'CV003', '1', '2023-2024'),
('GV012', 'CV003', '1', '2023-2024'),
('GV016', 'CV003', '1', '2023-2024'),
('GV020', 'CV003', '1', '2023-2024'),
('GV024', 'CV003', '1', '2023-2024'),
('GV026', 'CV003', '1', '2023-2024'),

('GV001', 'CV001', '2', '2023-2024'),
('GV006', 'CV002', '2', '2023-2024'),
('GV002', 'CV003', '2', '2023-2024'),
('GV007', 'CV003', '2', '2023-2024'),
('GV012', 'CV003', '2', '2023-2024'),
('GV016', 'CV003', '2', '2023-2024'),
('GV020', 'CV003', '2', '2023-2024'),
('GV024', 'CV003', '2', '2023-2024'),
('GV026', 'CV003', '2', '2023-2024'),

('GV001', 'CV001', '1', '2024-2025'),
('GV006', 'CV002', '1', '2024-2025'),
('GV002', 'CV003', '1', '2024-2025'),
('GV007', 'CV003', '1', '2024-2025'),
('GV012', 'CV003', '1', '2024-2025'),
('GV016', 'CV003', '1', '2024-2025'),
('GV020', 'CV003', '1', '2024-2025'),
('GV024', 'CV003', '1', '2024-2025'),
('GV026', 'CV003', '1', '2024-2025'),

('GV001', 'CV001', '2', '2024-2025'),
('GV006', 'CV002', '2', '2024-2025'),
('GV002', 'CV003', '2', '2024-2025'),
('GV007', 'CV003', '2', '2024-2025'),
('GV012', 'CV003', '2', '2024-2025'),
('GV016', 'CV003', '2', '2024-2025'),
('GV020', 'CV003', '2', '2024-2025'),
('GV024', 'CV003', '2', '2024-2025'),
('GV026', 'CV003', '2', '2024-2025');


CREATE TABLE nhiemvu (
  NV_Ma char(5) NOT NULL,
  NV_Ten varchar(50) NOT NULL,
  NV_SoTietMien int NOT NULL,
  PRIMARY KEY (NV_Ma)
)ENGINE=InnoDB;

INSERT INTO nhiemvu (NV_Ma, NV_Ten, NV_SoTietMien) VALUES 
('NV001', 'Huấn luyện đội tuyển học sinh giỏi', 8),
('NV002', 'Hướng nghiệp', 2),
('NV003', 'Dạy nghề', 4),
('NV004', 'Hoạt động ngoại khóa', 2),
('NV005', 'Mở lớp cảm tình đoàn', 1),
('NV006', 'Chủ nhiệm', 6);


CREATE TABLE kiemnhiem (
  GV_Ma char(5) NOT NULL,
  NV_Ma char(5) NOT NULL,
  HK_HocKy char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  PRIMARY KEY (GV_Ma, NV_Ma, HK_HocKy, NH_NamHoc),
  FOREIGN KEY (NV_Ma) REFERENCES nhiemvu (NV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (HK_HocKy) REFERENCES hocky (HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (NH_NamHoc) REFERENCES namhoc (NH_NamHoc) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO kiemnhiem(GV_Ma, NV_Ma, HK_HocKy, NH_NamHoc) VALUES
('GV002', 'NV001', '1', '2023-2024'),
('GV007', 'NV001', '1', '2023-2024'),
('GV012', 'NV001', '1', '2023-2024'),
('GV016', 'NV001', '1', '2023-2024'),
('GV020', 'NV001', '1', '2023-2024'),
('GV024', 'NV001', '1', '2023-2024'),
('GV026', 'NV001', '1', '2023-2024'),

('GV025', 'NV003', '1', '2023-2024'),

('GV021', 'NV004', '1', '2023-2024'),
('GV022', 'NV004', '1', '2023-2024'),
('GV025', 'NV004', '1', '2023-2024'),
('GV027', 'NV004', '1', '2023-2024'),
('GV028', 'NV004', '1', '2023-2024'),

('GV015', 'NV005', '1', '2023-2024'),
('GV019', 'NV005', '1', '2023-2024'),
('GV023', 'NV005', '1', '2023-2024'),

('GV003', 'NV006', '1', '2023-2024'),
('GV004', 'NV006', '1', '2023-2024'),
('GV005', 'NV006', '1', '2023-2024'),
('GV008', 'NV006', '1', '2023-2024'),
('GV009', 'NV006', '1', '2023-2024'),
('GV010', 'NV006', '1', '2023-2024'),
('GV013', 'NV006', '1', '2023-2024'),
('GV014', 'NV006', '1', '2023-2024'),
('GV017', 'NV006', '1', '2023-2024'),
('GV018', 'NV006', '1', '2023-2024'),
('GV021', 'NV006', '1', '2023-2024'),
('GV022', 'NV006', '1', '2023-2024'),
('GV025', 'NV006', '1', '2023-2024'),
('GV027', 'NV006', '1', '2023-2024'),
('GV028', 'NV006', '1', '2023-2024'),

('GV002', 'NV001', '2', '2023-2024'),
('GV007', 'NV001', '2', '2023-2024'),
('GV012', 'NV001', '2', '2023-2024'),
('GV016', 'NV001', '2', '2023-2024'),
('GV020', 'NV001', '2', '2023-2024'),
('GV024', 'NV001', '2', '2023-2024'),
('GV026', 'NV001', '2', '2023-2024'),

('GV025', 'NV003', '2', '2023-2024'),

('GV021', 'NV004', '2', '2023-2024'),
('GV022', 'NV004', '2', '2023-2024'),
('GV025', 'NV004', '2', '2023-2024'),
('GV027', 'NV004', '2', '2023-2024'),
('GV028', 'NV004', '2', '2023-2024'),

('GV015', 'NV005', '2', '2023-2024'),
('GV019', 'NV005', '2', '2023-2024'),
('GV023', 'NV005', '2', '2023-2024'),

('GV003', 'NV006', '2', '2023-2024'),
('GV004', 'NV006', '2', '2023-2024'),
('GV005', 'NV006', '2', '2023-2024'),
('GV008', 'NV006', '2', '2023-2024'),
('GV009', 'NV006', '2', '2023-2024'),
('GV010', 'NV006', '2', '2023-2024'),
('GV013', 'NV006', '2', '2023-2024'),
('GV014', 'NV006', '2', '2023-2024'),
('GV017', 'NV006', '2', '2023-2024'),
('GV018', 'NV006', '2', '2023-2024'),
('GV021', 'NV006', '2', '2023-2024'),
('GV022', 'NV006', '2', '2023-2024'),
('GV025', 'NV006', '2', '2023-2024'),
('GV027', 'NV006', '2', '2023-2024'),
('GV028', 'NV006', '2', '2023-2024');



CREATE TABLE khoi (
  K_Khoi char(2) NOT NULL,
  PRIMARY KEY (K_Khoi)
)ENGINE=InnoDB;

INSERT INTO khoi (K_Khoi) VALUES 
('10'), 
('11'), 
('12');


CREATE TABLE kyhieu (
  KH_KyHieu char(1) NOT NULL,
  PRIMARY KEY (KH_KyHieu)
)ENGINE=InnoDB;

INSERT INTO kyhieu (KH_KyHieu) VALUES 
('A'), 
('P');


CREATE TABLE lop (
  L_STTLop varchar(2) NOT NULL,
  K_Khoi char(2) NOT NULL,
  KH_KyHieu char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  GV_Ma char(5) NOT NULL,
  PRIMARY KEY (L_STTLop,K_Khoi,KH_KyHieu,NH_NamHoc),
  FOREIGN KEY (K_Khoi) REFERENCES khoi (K_Khoi) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (KH_KyHieu) REFERENCES kyhieu (KH_KyHieu) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (NH_NamHoc) REFERENCES namhoc (NH_NamHoc) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

-- Khối 10
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '10', 'A', '2023-2024', 'GV003'),
('2', '10', 'A', '2023-2024', 'GV004'),
('3', '10', 'A', '2023-2024', 'GV005'),
('1', '10', 'P', '2023-2024', 'GV008');

-- Khối 11
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '11', 'A', '2023-2024', 'GV009'),
('2', '11', 'A', '2023-2024', 'GV010'),
('3', '11', 'A', '2023-2024', 'GV013'),
('4', '11', 'A', '2023-2024', 'GV014'),
('1', '11', 'P', '2023-2024', 'GV017'),
('2', '11', 'P', '2023-2024', 'GV018');

-- Khối 12
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '12', 'A', '2023-2024', 'GV021'),
('2', '12', 'A', '2023-2024', 'GV022'),
('3', '12', 'A', '2023-2024', 'GV025'),
('1', '12', 'P', '2023-2024', 'GV027'),
('2', '12', 'P', '2023-2024', 'GV028');

-- Khối 11 (từ khối 10 năm 2023-2024)
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '11', 'A', '2024-2025', 'GV003'),
('2', '11', 'A', '2024-2025', 'GV004'),
('3', '11', 'A', '2024-2025', 'GV005'),
('1', '11', 'P', '2024-2025', 'GV008');

-- Khối 12 (từ khối 11 năm 2023-2024)
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '12', 'A', '2024-2025', 'GV009'),
('2', '12', 'A', '2024-2025', 'GV010'),
('3', '12', 'A', '2024-2025', 'GV013'),
('4', '12', 'A', '2024-2025', 'GV014'),
('1', '12', 'P', '2024-2025', 'GV017'),
('2', '12', 'P', '2024-2025', 'GV018');

-- Khối 10 năm 2024-2025
INSERT INTO lop (L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, GV_Ma) VALUES
('1', '10', 'A', '2024-2025', 'GV021'),
('2', '10', 'A', '2024-2025', 'GV022'),
('3', '10', 'A', '2024-2025', 'GV025'),
('1', '10', 'P', '2024-2025', 'GV027'),
('2', '10', 'P', '2024-2025', 'GV028');

CREATE TABLE nhommonhoc (
  NMH_Ma char(5) NOT NULL,
  NMH_Ten varchar(50) NOT NULL,
  PRIMARY KEY (NMH_Ma)
)ENGINE=InnoDB;

INSERT INTO nhommonhoc (NMH_Ma, NMH_Ten) VALUES 
('NMH01', 'Môn học bắt buộc'),
('NMH02', 'Môn học tự chọn'),
('NMH03', 'Môn học tự chọn nâng cao'),
('NMH04', 'Môn học chuyên đề');


CREATE TABLE giangday (
  GV_Ma char(5) NOT NULL,
  M_Ma char(5) NOT NULL,
  L_STTLop varchar(2) NOT NULL,
  K_Khoi char(2) NOT NULL,
  KH_KyHieu char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  HK_HocKy char(1) NOT NULL,

  PRIMARY KEY (M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy),
  FOREIGN KEY (M_Ma) REFERENCES monhoc (M_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (L_STTLop,K_Khoi,KH_KyHieu,NH_NamHoc) REFERENCES lop (L_STTLop,K_Khoi,KH_KyHieu,NH_NamHoc) ON DELETE NO ACTION ON UPDATE NO ACTION,
  FOREIGN KEY (HK_HocKy) REFERENCES hocky (HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO giangday (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy) VALUES
('GV001', 'MON01', '1', '10', 'A', '2023-2024', '1'), -- Mon Toan
('GV004', 'MON01', '2', '10', 'A', '2023-2024', '1'),
('GV005', 'MON01', '3', '10', 'A', '2023-2024', '1'),
('GV002', 'MON01', '1', '10', 'P', '2023-2024', '1'),
('GV002', 'MON01', '1', '11', 'A', '2023-2024', '1'),
('GV003', 'MON01', '2', '11', 'A', '2023-2024', '1'),
('GV003', 'MON01', '3', '11', 'A', '2023-2024', '1'),
('GV003', 'MON01', '4', '11', 'A', '2023-2024', '1'),
('GV003', 'MON01', '1', '11', 'P', '2023-2024', '1'),
('GV004', 'MON01', '2', '11', 'P', '2023-2024', '1'),
('GV004', 'MON01', '1', '12', 'A', '2023-2024', '1'),
('GV004', 'MON01', '2', '12', 'A', '2023-2024', '1'),
('GV005', 'MON01', '3', '12', 'A', '2023-2024', '1'),
('GV005', 'MON01', '1', '12', 'P', '2023-2024', '1'),
('GV005', 'MON01', '2', '12', 'P', '2023-2024', '1'),

('GV001', 'MON13', '1', '10', 'A', '2023-2024', '1'), -- Mon Tin
('GV004', 'MON13', '2', '10', 'A', '2023-2024', '1'),
('GV005', 'MON13', '3', '10', 'A', '2023-2024', '1'),
('GV002', 'MON13', '1', '10', 'P', '2023-2024', '1'),
('GV002', 'MON13', '1', '11', 'A', '2023-2024', '1'),
('GV003', 'MON13', '2', '11', 'A', '2023-2024', '1'),
('GV003', 'MON13', '3', '11', 'A', '2023-2024', '1'),
('GV003', 'MON13', '4', '11', 'A', '2023-2024', '1'),
('GV003', 'MON13', '1', '11', 'P', '2023-2024', '1'),
('GV004', 'MON13', '2', '11', 'P', '2023-2024', '1'),
('GV004', 'MON13', '1', '12', 'A', '2023-2024', '1'),
('GV004', 'MON13', '2', '12', 'A', '2023-2024', '1'),
('GV005', 'MON13', '3', '12', 'A', '2023-2024', '1'),
('GV005', 'MON13', '1', '12', 'P', '2023-2024', '1'),
('GV005', 'MON13', '2', '12', 'P', '2023-2024', '1'),

('GV006', 'MON02', '1', '10', 'A', '2023-2024', '1'), -- Mon Van
('GV009', 'MON02', '2', '10', 'A', '2023-2024', '1'),
('GV010', 'MON02', '3', '10', 'A', '2023-2024', '1'),
('GV007', 'MON02', '1', '10', 'P', '2023-2024', '1'),
('GV007', 'MON02', '1', '11', 'A', '2023-2024', '1'),
('GV008', 'MON02', '2', '11', 'A', '2023-2024', '1'),
('GV008', 'MON02', '3', '11', 'A', '2023-2024', '1'),
('GV008', 'MON02', '4', '11', 'A', '2023-2024', '1'),
('GV008', 'MON02', '1', '11', 'P', '2023-2024', '1'),
('GV009', 'MON02', '2', '11', 'P', '2023-2024', '1'),
('GV009', 'MON02', '1', '12', 'A', '2023-2024', '1'),
('GV009', 'MON02', '2', '12', 'A', '2023-2024', '1'),
('GV010', 'MON02', '3', '12', 'A', '2023-2024', '1'),
('GV010', 'MON02', '1', '12', 'P', '2023-2024', '1'),
('GV010', 'MON02', '2', '12', 'P', '2023-2024', '1'),

('GV006', 'MON09', '1', '10', 'A', '2023-2024', '1'), -- Mon GDCD
('GV009', 'MON09', '2', '10', 'A', '2023-2024', '1'),
('GV010', 'MON09', '3', '10', 'A', '2023-2024', '1'),
('GV007', 'MON09', '1', '10', 'P', '2023-2024', '1'),
('GV007', 'MON09', '1', '11', 'A', '2023-2024', '1'),
('GV008', 'MON09', '2', '11', 'A', '2023-2024', '1'),
('GV008', 'MON09', '3', '11', 'A', '2023-2024', '1'),
('GV008', 'MON09', '4', '11', 'A', '2023-2024', '1'),
('GV008', 'MON09', '1', '11', 'P', '2023-2024', '1'),
('GV009', 'MON09', '2', '11', 'P', '2023-2024', '1'),
('GV009', 'MON09', '1', '12', 'A', '2023-2024', '1'),
('GV009', 'MON09', '2', '12', 'A', '2023-2024', '1'),
('GV010', 'MON09', '3', '12', 'A', '2023-2024', '1'),
('GV010', 'MON09', '1', '12', 'P', '2023-2024', '1'),
('GV010', 'MON09', '2', '12', 'P', '2023-2024', '1'),

('GV011', 'MON03', '1', '10', 'A', '2023-2024', '1'), -- Mon Anh Van
('GV011', 'MON03', '2', '10', 'A', '2023-2024', '1'),
('GV011', 'MON03', '3', '10', 'A', '2023-2024', '1'),
('GV012', 'MON03', '1', '10', 'P', '2023-2024', '1'),
('GV012', 'MON03', '1', '11', 'A', '2023-2024', '1'),
('GV012', 'MON03', '2', '11', 'A', '2023-2024', '1'),
('GV012', 'MON03', '3', '11', 'A', '2023-2024', '1'),
('GV013', 'MON03', '4', '11', 'A', '2023-2024', '1'),
('GV013', 'MON03', '1', '11', 'P', '2023-2024', '1'),
('GV013', 'MON03', '2', '11', 'P', '2023-2024', '1'),
('GV013', 'MON03', '1', '12', 'A', '2023-2024', '1'),
('GV014', 'MON03', '2', '12', 'A', '2023-2024', '1'),
('GV014', 'MON03', '3', '12', 'A', '2023-2024', '1'),
('GV014', 'MON03', '1', '12', 'P', '2023-2024', '1'),
('GV014', 'MON03', '2', '12', 'P', '2023-2024', '1'),

('GV023', 'MON04', '1', '10', 'A', '2023-2024', '1'), -- Mon Sinh hoc
('GV023', 'MON04', '2', '10', 'A', '2023-2024', '1'),
('GV023', 'MON04', '3', '10', 'A', '2023-2024', '1'),
('GV023', 'MON04', '1', '10', 'P', '2023-2024', '1'),
('GV024', 'MON04', '1', '11', 'A', '2023-2024', '1'),
('GV024', 'MON04', '2', '11', 'A', '2023-2024', '1'),
('GV024', 'MON04', '3', '11', 'A', '2023-2024', '1'),
('GV024', 'MON04', '4', '11', 'A', '2023-2024', '1'),
('GV024', 'MON04', '1', '11', 'P', '2023-2024', '1'),
('GV025', 'MON04', '2', '11', 'P', '2023-2024', '1'),
('GV025', 'MON04', '1', '12', 'A', '2023-2024', '1'),
('GV025', 'MON04', '2', '12', 'A', '2023-2024', '1'),
('GV025', 'MON04', '3', '12', 'A', '2023-2024', '1'),
('GV025', 'MON04', '1', '12', 'P', '2023-2024', '1'),
('GV025', 'MON04', '2', '12', 'P', '2023-2024', '1'),

('GV023', 'MON12', '1', '10', 'A', '2023-2024', '1'), -- Mon Cong nghe
('GV023', 'MON12', '2', '10', 'A', '2023-2024', '1'),
('GV023', 'MON12', '3', '10', 'A', '2023-2024', '1'),
('GV023', 'MON12', '1', '10', 'P', '2023-2024', '1'),
('GV024', 'MON12', '1', '11', 'A', '2023-2024', '1'),
('GV024', 'MON12', '2', '11', 'A', '2023-2024', '1'),
('GV024', 'MON12', '3', '11', 'A', '2023-2024', '1'),
('GV024', 'MON12', '4', '11', 'A', '2023-2024', '1'),
('GV024', 'MON12', '1', '11', 'P', '2023-2024', '1'),
('GV025', 'MON12', '2', '11', 'P', '2023-2024', '1'),
('GV025', 'MON12', '1', '12', 'A', '2023-2024', '1'),
('GV025', 'MON12', '2', '12', 'A', '2023-2024', '1'),
('GV025', 'MON12', '3', '12', 'A', '2023-2024', '1'),
('GV025', 'MON12', '1', '12', 'P', '2023-2024', '1'),
('GV025', 'MON12', '2', '12', 'P', '2023-2024', '1'),

('GV019', 'MON05', '1', '10', 'A', '2023-2024', '1'), -- Mon Vat ly
('GV019', 'MON05', '2', '10', 'A', '2023-2024', '1'),
('GV020', 'MON05', '3', '10', 'A', '2023-2024', '1'),
('GV020', 'MON05', '1', '10', 'P', '2023-2024', '1'),
('GV020', 'MON05', '1', '11', 'A', '2023-2024', '1'),
('GV021', 'MON05', '2', '11', 'A', '2023-2024', '1'),
('GV021', 'MON05', '3', '11', 'A', '2023-2024', '1'),
('GV021', 'MON05', '4', '11', 'A', '2023-2024', '1'),
('GV021', 'MON05', '1', '11', 'P', '2023-2024', '1'),
('GV021', 'MON05', '2', '11', 'P', '2023-2024', '1'),
('GV022', 'MON05', '1', '12', 'A', '2023-2024', '1'),
('GV022', 'MON05', '2', '12', 'A', '2023-2024', '1'),
('GV022', 'MON05', '3', '12', 'A', '2023-2024', '1'),
('GV022', 'MON05', '1', '12', 'P', '2023-2024', '1'),
('GV022', 'MON05', '2', '12', 'P', '2023-2024', '1'),

('GV019', 'MON06', '1', '10', 'A', '2023-2024', '1'), -- Mon Hoa hoc
('GV019', 'MON06', '2', '10', 'A', '2023-2024', '1'),
('GV020', 'MON06', '3', '10', 'A', '2023-2024', '1'),
('GV020', 'MON06', '1', '10', 'P', '2023-2024', '1'),
('GV020', 'MON06', '1', '11', 'A', '2023-2024', '1'),
('GV021', 'MON06', '2', '11', 'A', '2023-2024', '1'),
('GV021', 'MON06', '3', '11', 'A', '2023-2024', '1'),
('GV021', 'MON06', '4', '11', 'A', '2023-2024', '1'),
('GV021', 'MON06', '1', '11', 'P', '2023-2024', '1'),
('GV021', 'MON06', '2', '11', 'P', '2023-2024', '1'),
('GV022', 'MON06', '1', '12', 'A', '2023-2024', '1'),
('GV022', 'MON06', '2', '12', 'A', '2023-2024', '1'),
('GV022', 'MON06', '3', '12', 'A', '2023-2024', '1'),
('GV022', 'MON06', '1', '12', 'P', '2023-2024', '1'),
('GV022', 'MON06', '2', '12', 'P', '2023-2024', '1'),

('GV015', 'MON07', '1', '10', 'A', '2023-2024', '1'), -- Mon Dia ly
('GV015', 'MON07', '2', '10', 'A', '2023-2024', '1'),
('GV016', 'MON07', '3', '10', 'A', '2023-2024', '1'),
('GV016', 'MON07', '1', '10', 'P', '2023-2024', '1'),
('GV016', 'MON07', '1', '11', 'A', '2023-2024', '1'),
('GV017', 'MON07', '2', '11', 'A', '2023-2024', '1'),
('GV017', 'MON07', '3', '11', 'A', '2023-2024', '1'),
('GV017', 'MON07', '4', '11', 'A', '2023-2024', '1'),
('GV017', 'MON07', '1', '11', 'P', '2023-2024', '1'),
('GV017', 'MON07', '2', '11', 'P', '2023-2024', '1'),
('GV018', 'MON07', '1', '12', 'A', '2023-2024', '1'),
('GV018', 'MON07', '2', '12', 'A', '2023-2024', '1'),
('GV018', 'MON07', '3', '12', 'A', '2023-2024', '1'),
('GV018', 'MON07', '1', '12', 'P', '2023-2024', '1'),
('GV018', 'MON07', '2', '12', 'P', '2023-2024', '1'),

('GV015', 'MON08', '1', '10', 'A', '2023-2024', '1'), -- Mon Lich su
('GV015', 'MON08', '2', '10', 'A', '2023-2024', '1'),
('GV016', 'MON08', '3', '10', 'A', '2023-2024', '1'),
('GV016', 'MON08', '1', '10', 'P', '2023-2024', '1'),
('GV016', 'MON08', '1', '11', 'A', '2023-2024', '1'),
('GV017', 'MON08', '2', '11', 'A', '2023-2024', '1'),
('GV017', 'MON08', '3', '11', 'A', '2023-2024', '1'),
('GV017', 'MON08', '4', '11', 'A', '2023-2024', '1'),
('GV017', 'MON08', '1', '11', 'P', '2023-2024', '1'),
('GV017', 'MON08', '2', '11', 'P', '2023-2024', '1'),
('GV018', 'MON08', '1', '12', 'A', '2023-2024', '1'),
('GV018', 'MON08', '2', '12', 'A', '2023-2024', '1'),
('GV018', 'MON08', '3', '12', 'A', '2023-2024', '1'),
('GV018', 'MON08', '1', '12', 'P', '2023-2024', '1'),
('GV018', 'MON08', '2', '12', 'P', '2023-2024', '1'),

('GV026', 'MON10', '1', '10', 'A', '2023-2024', '1'), -- Mon The duc
('GV026', 'MON10', '2', '10', 'A', '2023-2024', '1'),
('GV026', 'MON10', '3', '10', 'A', '2023-2024', '1'),
('GV026', 'MON10', '1', '10', 'P', '2023-2024', '1'),
('GV026', 'MON10', '1', '11', 'A', '2023-2024', '1'),
('GV027', 'MON10', '2', '11', 'A', '2023-2024', '1'),
('GV027', 'MON10', '3', '11', 'A', '2023-2024', '1'),
('GV027', 'MON10', '4', '11', 'A', '2023-2024', '1'),
('GV027', 'MON10', '1', '11', 'P', '2023-2024', '1'),
('GV027', 'MON10', '2', '11', 'P', '2023-2024', '1'),
('GV028', 'MON10', '1', '12', 'A', '2023-2024', '1'),
('GV028', 'MON10', '2', '12', 'A', '2023-2024', '1'),
('GV028', 'MON10', '3', '12', 'A', '2023-2024', '1'),
('GV028', 'MON10', '1', '12', 'P', '2023-2024', '1'),
('GV028', 'MON10', '2', '12', 'P', '2023-2024', '1'),

('GV026', 'MON11', '1', '10', 'A', '2023-2024', '1'), -- Mon GDQP
('GV026', 'MON11', '2', '10', 'A', '2023-2024', '1'),
('GV026', 'MON11', '3', '10', 'A', '2023-2024', '1'),
('GV026', 'MON11', '1', '10', 'P', '2023-2024', '1'),
('GV026', 'MON11', '1', '11', 'A', '2023-2024', '1'),
('GV027', 'MON11', '2', '11', 'A', '2023-2024', '1'),
('GV027', 'MON11', '3', '11', 'A', '2023-2024', '1'),
('GV027', 'MON11', '4', '11', 'A', '2023-2024', '1'),
('GV027', 'MON11', '1', '11', 'P', '2023-2024', '1'),
('GV027', 'MON11', '2', '11', 'P', '2023-2024', '1'),
('GV028', 'MON11', '1', '12', 'A', '2023-2024', '1'),
('GV028', 'MON11', '2', '12', 'A', '2023-2024', '1'),
('GV028', 'MON11', '3', '12', 'A', '2023-2024', '1'),
('GV028', 'MON11', '1', '12', 'P', '2023-2024', '1'),
('GV028', 'MON11', '2', '12', 'P', '2023-2024', '1'),
--
('GV001', 'MON01', '1', '11', 'A', '2024-2025', '1'), -- Mon Toan
('GV004', 'MON01', '2', '11', 'A', '2024-2025', '1'),
('GV005', 'MON01', '3', '11', 'A', '2024-2025', '1'),
('GV002', 'MON01', '1', '11', 'P', '2024-2025', '1'),
('GV002', 'MON01', '1', '12', 'A', '2024-2025', '1'),
('GV003', 'MON01', '2', '12', 'A', '2024-2025', '1'),
('GV003', 'MON01', '3', '12', 'A', '2024-2025', '1'),
('GV003', 'MON01', '4', '12', 'A', '2024-2025', '1'),
('GV003', 'MON01', '1', '12', 'P', '2024-2025', '1'),
('GV004', 'MON01', '2', '12', 'P', '2024-2025', '1'),
('GV004', 'MON01', '1', '10', 'A', '2024-2025', '1'),
('GV004', 'MON01', '2', '10', 'A', '2024-2025', '1'),
('GV005', 'MON01', '3', '10', 'A', '2024-2025', '1'),
('GV005', 'MON01', '1', '10', 'P', '2024-2025', '1'),
('GV005', 'MON01', '2', '10', 'P', '2024-2025', '1'),

('GV001', 'MON13', '1', '11', 'A', '2024-2025', '1'), -- Mon Tin
('GV004', 'MON13', '2', '11', 'A', '2024-2025', '1'),
('GV005', 'MON13', '3', '11', 'A', '2024-2025', '1'),
('GV002', 'MON13', '1', '11', 'P', '2024-2025', '1'),
('GV002', 'MON13', '1', '12', 'A', '2024-2025', '1'),
('GV003', 'MON13', '2', '12', 'A', '2024-2025', '1'),
('GV003', 'MON13', '3', '12', 'A', '2024-2025', '1'),
('GV003', 'MON13', '4', '12', 'A', '2024-2025', '1'),
('GV003', 'MON13', '1', '12', 'P', '2024-2025', '1'),
('GV004', 'MON13', '2', '12', 'P', '2024-2025', '1'),
('GV004', 'MON13', '1', '10', 'A', '2024-2025', '1'),
('GV004', 'MON13', '2', '10', 'A', '2024-2025', '1'),
('GV005', 'MON13', '3', '10', 'A', '2024-2025', '1'),
('GV005', 'MON13', '1', '10', 'P', '2024-2025', '1'),
('GV005', 'MON13', '2', '10', 'P', '2024-2025', '1'),

('GV006', 'MON02', '1', '11', 'A', '2024-2025', '1'), -- Mon Van
('GV009', 'MON02', '2', '11', 'A', '2024-2025', '1'),
('GV010', 'MON02', '3', '11', 'A', '2024-2025', '1'),
('GV007', 'MON02', '1', '11', 'P', '2024-2025', '1'),
('GV007', 'MON02', '1', '12', 'A', '2024-2025', '1'),
('GV008', 'MON02', '2', '12', 'A', '2024-2025', '1'),
('GV008', 'MON02', '3', '12', 'A', '2024-2025', '1'),
('GV008', 'MON02', '4', '12', 'A', '2024-2025', '1'),
('GV008', 'MON02', '1', '12', 'P', '2024-2025', '1'),
('GV009', 'MON02', '2', '12', 'P', '2024-2025', '1'),
('GV009', 'MON02', '1', '10', 'A', '2024-2025', '1'),
('GV009', 'MON02', '2', '10', 'A', '2024-2025', '1'),
('GV010', 'MON02', '3', '10', 'A', '2024-2025', '1'),
('GV010', 'MON02', '1', '10', 'P', '2024-2025', '1'),
('GV010', 'MON02', '2', '10', 'P', '2024-2025', '1'),

('GV006', 'MON09', '1', '11', 'A', '2024-2025', '1'), -- Mon GDCD
('GV009', 'MON09', '2', '11', 'A', '2024-2025', '1'),
('GV010', 'MON09', '3', '11', 'A', '2024-2025', '1'),
('GV007', 'MON09', '1', '11', 'P', '2024-2025', '1'),
('GV007', 'MON09', '1', '12', 'A', '2024-2025', '1'),
('GV008', 'MON09', '2', '12', 'A', '2024-2025', '1'),
('GV008', 'MON09', '3', '12', 'A', '2024-2025', '1'),
('GV008', 'MON09', '4', '12', 'A', '2024-2025', '1'),
('GV008', 'MON09', '1', '12', 'P', '2024-2025', '1'),
('GV009', 'MON09', '2', '12', 'P', '2024-2025', '1'),
('GV009', 'MON09', '1', '10', 'A', '2024-2025', '1'),
('GV009', 'MON09', '2', '10', 'A', '2024-2025', '1'),
('GV010', 'MON09', '3', '10', 'A', '2024-2025', '1'),
('GV010', 'MON09', '1', '10', 'P', '2024-2025', '1'),
('GV010', 'MON09', '2', '10', 'P', '2024-2025', '1'),

('GV011', 'MON03', '1', '11', 'A', '2024-2025', '1'), -- Mon Anh Van
('GV011', 'MON03', '2', '11', 'A', '2024-2025', '1'),
('GV011', 'MON03', '3', '11', 'A', '2024-2025', '1'),
('GV012', 'MON03', '1', '11', 'P', '2024-2025', '1'),
('GV012', 'MON03', '1', '12', 'A', '2024-2025', '1'),
('GV012', 'MON03', '2', '12', 'A', '2024-2025', '1'),
('GV012', 'MON03', '3', '12', 'A', '2024-2025', '1'),
('GV013', 'MON03', '4', '12', 'A', '2024-2025', '1'),
('GV013', 'MON03', '1', '12', 'P', '2024-2025', '1'),
('GV013', 'MON03', '2', '12', 'P', '2024-2025', '1'),
('GV013', 'MON03', '1', '10', 'A', '2024-2025', '1'),
('GV014', 'MON03', '2', '10', 'A', '2024-2025', '1'),
('GV014', 'MON03', '3', '10', 'A', '2024-2025', '1'),
('GV014', 'MON03', '1', '10', 'P', '2024-2025', '1'),
('GV014', 'MON03', '2', '10', 'P', '2024-2025', '1'),

('GV023', 'MON04', '1', '11', 'A', '2024-2025', '1'), -- Mon Sinh hoc
('GV023', 'MON04', '2', '11', 'A', '2024-2025', '1'),
('GV023', 'MON04', '3', '11', 'A', '2024-2025', '1'),
('GV023', 'MON04', '1', '11', 'P', '2024-2025', '1'),
('GV024', 'MON04', '1', '12', 'A', '2024-2025', '1'),
('GV024', 'MON04', '2', '12', 'A', '2024-2025', '1'),
('GV024', 'MON04', '3', '12', 'A', '2024-2025', '1'),
('GV024', 'MON04', '4', '12', 'A', '2024-2025', '1'),
('GV024', 'MON04', '1', '12', 'P', '2024-2025', '1'),
('GV025', 'MON04', '2', '12', 'P', '2024-2025', '1'),
('GV025', 'MON04', '1', '10', 'A', '2024-2025', '1'),
('GV025', 'MON04', '2', '10', 'A', '2024-2025', '1'),
('GV025', 'MON04', '3', '10', 'A', '2024-2025', '1'),
('GV025', 'MON04', '1', '10', 'P', '2024-2025', '1'),
('GV025', 'MON04', '2', '10', 'P', '2024-2025', '1'),

('GV023', 'MON12', '1', '11', 'A', '2024-2025', '1'), -- Mon Cong nghe
('GV023', 'MON12', '2', '11', 'A', '2024-2025', '1'),
('GV023', 'MON12', '3', '11', 'A', '2024-2025', '1'),
('GV023', 'MON12', '1', '11', 'P', '2024-2025', '1'),
('GV024', 'MON12', '1', '12', 'A', '2024-2025', '1'),
('GV024', 'MON12', '2', '12', 'A', '2024-2025', '1'),
('GV024', 'MON12', '3', '12', 'A', '2024-2025', '1'),
('GV024', 'MON12', '4', '12', 'A', '2024-2025', '1'),
('GV024', 'MON12', '1', '12', 'P', '2024-2025', '1'),
('GV025', 'MON12', '2', '12', 'P', '2024-2025', '1'),
('GV025', 'MON12', '1', '10', 'A', '2024-2025', '1'),
('GV025', 'MON12', '2', '10', 'A', '2024-2025', '1'),
('GV025', 'MON12', '3', '10', 'A', '2024-2025', '1'),
('GV025', 'MON12', '1', '10', 'P', '2024-2025', '1'),
('GV025', 'MON12', '2', '10', 'P', '2024-2025', '1'),

('GV019', 'MON05', '1', '11', 'A', '2024-2025', '1'), -- Mon Vat ly
('GV019', 'MON05', '2', '11', 'A', '2024-2025', '1'),
('GV020', 'MON05', '3', '11', 'A', '2024-2025', '1'),
('GV020', 'MON05', '1', '11', 'P', '2024-2025', '1'),
('GV020', 'MON05', '1', '12', 'A', '2024-2025', '1'),
('GV021', 'MON05', '2', '12', 'A', '2024-2025', '1'),
('GV021', 'MON05', '3', '12', 'A', '2024-2025', '1'),
('GV021', 'MON05', '4', '12', 'A', '2024-2025', '1'),
('GV021', 'MON05', '1', '12', 'P', '2024-2025', '1'),
('GV021', 'MON05', '2', '12', 'P', '2024-2025', '1'),
('GV022', 'MON05', '1', '10', 'A', '2024-2025', '1'),
('GV022', 'MON05', '2', '10', 'A', '2024-2025', '1'),
('GV022', 'MON05', '3', '10', 'A', '2024-2025', '1'),
('GV022', 'MON05', '1', '10', 'P', '2024-2025', '1'),
('GV022', 'MON05', '2', '10', 'P', '2024-2025', '1'),

('GV019', 'MON06', '1', '11', 'A', '2024-2025', '1'), -- Mon Hoa hoc
('GV019', 'MON06', '2', '11', 'A', '2024-2025', '1'),
('GV020', 'MON06', '3', '11', 'A', '2024-2025', '1'),
('GV020', 'MON06', '1', '11', 'P', '2024-2025', '1'),
('GV020', 'MON06', '1', '12', 'A', '2024-2025', '1'),
('GV021', 'MON06', '2', '12', 'A', '2024-2025', '1'),
('GV021', 'MON06', '3', '12', 'A', '2024-2025', '1'),
('GV021', 'MON06', '4', '12', 'A', '2024-2025', '1'),
('GV021', 'MON06', '1', '12', 'P', '2024-2025', '1'),
('GV021', 'MON06', '2', '12', 'P', '2024-2025', '1'),
('GV022', 'MON06', '1', '10', 'A', '2024-2025', '1'),
('GV022', 'MON06', '2', '10', 'A', '2024-2025', '1'),
('GV022', 'MON06', '3', '10', 'A', '2024-2025', '1'),
('GV022', 'MON06', '1', '10', 'P', '2024-2025', '1'),
('GV022', 'MON06', '2', '10', 'P', '2024-2025', '1'),

('GV015', 'MON07', '1', '11', 'A', '2024-2025', '1'), -- Mon Dia ly
('GV015', 'MON07', '2', '11', 'A', '2024-2025', '1'),
('GV016', 'MON07', '3', '11', 'A', '2024-2025', '1'),
('GV016', 'MON07', '1', '11', 'P', '2024-2025', '1'),
('GV016', 'MON07', '1', '12', 'A', '2024-2025', '1'),
('GV017', 'MON07', '2', '12', 'A', '2024-2025', '1'),
('GV017', 'MON07', '3', '12', 'A', '2024-2025', '1'),
('GV017', 'MON07', '4', '12', 'A', '2024-2025', '1'),
('GV017', 'MON07', '1', '12', 'P', '2024-2025', '1'),
('GV017', 'MON07', '2', '12', 'P', '2024-2025', '1'),
('GV018', 'MON07', '1', '10', 'A', '2024-2025', '1'),
('GV018', 'MON07', '2', '10', 'A', '2024-2025', '1'),
('GV018', 'MON07', '3', '10', 'A', '2024-2025', '1'),
('GV018', 'MON07', '1', '10', 'P', '2024-2025', '1'),
('GV018', 'MON07', '2', '10', 'P', '2024-2025', '1'),

('GV015', 'MON08', '1', '11', 'A', '2024-2025', '1'), -- Mon Lich su
('GV015', 'MON08', '2', '11', 'A', '2024-2025', '1'),
('GV016', 'MON08', '3', '11', 'A', '2024-2025', '1'),
('GV016', 'MON08', '1', '11', 'P', '2024-2025', '1'),
('GV016', 'MON08', '1', '12', 'A', '2024-2025', '1'),
('GV017', 'MON08', '2', '12', 'A', '2024-2025', '1'),
('GV017', 'MON08', '3', '12', 'A', '2024-2025', '1'),
('GV017', 'MON08', '4', '12', 'A', '2024-2025', '1'),
('GV017', 'MON08', '1', '12', 'P', '2024-2025', '1'),
('GV017', 'MON08', '2', '12', 'P', '2024-2025', '1'),
('GV018', 'MON08', '1', '10', 'A', '2024-2025', '1'),
('GV018', 'MON08', '2', '10', 'A', '2024-2025', '1'),
('GV018', 'MON08', '3', '10', 'A', '2024-2025', '1'),
('GV018', 'MON08', '1', '10', 'P', '2024-2025', '1'),
('GV018', 'MON08', '2', '10', 'P', '2024-2025', '1'),

('GV026', 'MON10', '1', '11', 'A', '2024-2025', '1'), -- Mon The duc
('GV026', 'MON10', '2', '11', 'A', '2024-2025', '1'),
('GV026', 'MON10', '3', '11', 'A', '2024-2025', '1'),
('GV026', 'MON10', '1', '11', 'P', '2024-2025', '1'),
('GV026', 'MON10', '1', '12', 'A', '2024-2025', '1'),
('GV027', 'MON10', '2', '12', 'A', '2024-2025', '1'),
('GV027', 'MON10', '3', '12', 'A', '2024-2025', '1'),
('GV027', 'MON10', '4', '12', 'A', '2024-2025', '1'),
('GV027', 'MON10', '1', '12', 'P', '2024-2025', '1'),
('GV027', 'MON10', '2', '12', 'P', '2024-2025', '1'),
('GV028', 'MON10', '1', '10', 'A', '2024-2025', '1'),
('GV028', 'MON10', '2', '10', 'A', '2024-2025', '1'),
('GV028', 'MON10', '3', '10', 'A', '2024-2025', '1'),
('GV028', 'MON10', '1', '10', 'P', '2024-2025', '1'),
('GV028', 'MON10', '2', '10', 'P', '2024-2025', '1'),

('GV026', 'MON11', '1', '11', 'A', '2024-2025', '1'), -- Mon GDQP
('GV026', 'MON11', '2', '11', 'A', '2024-2025', '1'),
('GV026', 'MON11', '3', '11', 'A', '2024-2025', '1'),
('GV026', 'MON11', '1', '11', 'P', '2024-2025', '1'),
('GV026', 'MON11', '1', '12', 'A', '2024-2025', '1'),
('GV027', 'MON11', '2', '12', 'A', '2024-2025', '1'),
('GV027', 'MON11', '3', '12', 'A', '2024-2025', '1'),
('GV027', 'MON11', '4', '12', 'A', '2024-2025', '1'),
('GV027', 'MON11', '1', '12', 'P', '2024-2025', '1'),
('GV027', 'MON11', '2', '12', 'P', '2024-2025', '1'),
('GV028', 'MON11', '1', '10', 'A', '2024-2025', '1'),
('GV028', 'MON11', '2', '10', 'A', '2024-2025', '1'),
('GV028', 'MON11', '3', '10', 'A', '2024-2025', '1'),
('GV028', 'MON11', '1', '10', 'P', '2024-2025', '1'),
('GV028', 'MON11', '2', '10', 'P', '2024-2025', '1'),

('GV001', 'MON01', '1', '10', 'A', '2023-2024', '2'), -- Mon Toan
('GV004', 'MON01', '2', '10', 'A', '2023-2024', '2'),
('GV005', 'MON01', '3', '10', 'A', '2023-2024', '2'),
('GV002', 'MON01', '1', '10', 'P', '2023-2024', '2'),
('GV002', 'MON01', '1', '11', 'A', '2023-2024', '2'),
('GV003', 'MON01', '2', '11', 'A', '2023-2024', '2'),
('GV003', 'MON01', '3', '11', 'A', '2023-2024', '2'),
('GV003', 'MON01', '4', '11', 'A', '2023-2024', '2'),
('GV003', 'MON01', '1', '11', 'P', '2023-2024', '2'),
('GV004', 'MON01', '2', '11', 'P', '2023-2024', '2'),
('GV004', 'MON01', '1', '12', 'A', '2023-2024', '2'),
('GV004', 'MON01', '2', '12', 'A', '2023-2024', '2'),
('GV005', 'MON01', '3', '12', 'A', '2023-2024', '2'),
('GV005', 'MON01', '1', '12', 'P', '2023-2024', '2'),
('GV005', 'MON01', '2', '12', 'P', '2023-2024', '2'),

('GV001', 'MON13', '1', '10', 'A', '2023-2024', '2'), -- Mon Tin
('GV004', 'MON13', '2', '10', 'A', '2023-2024', '2'),
('GV005', 'MON13', '3', '10', 'A', '2023-2024', '2'),
('GV002', 'MON13', '1', '10', 'P', '2023-2024', '2'),
('GV002', 'MON13', '1', '11', 'A', '2023-2024', '2'),
('GV003', 'MON13', '2', '11', 'A', '2023-2024', '2'),
('GV003', 'MON13', '3', '11', 'A', '2023-2024', '2'),
('GV003', 'MON13', '4', '11', 'A', '2023-2024', '2'),
('GV003', 'MON13', '1', '11', 'P', '2023-2024', '2'),
('GV004', 'MON13', '2', '11', 'P', '2023-2024', '2'),
('GV004', 'MON13', '1', '12', 'A', '2023-2024', '2'),
('GV004', 'MON13', '2', '12', 'A', '2023-2024', '2'),
('GV005', 'MON13', '3', '12', 'A', '2023-2024', '2'),
('GV005', 'MON13', '1', '12', 'P', '2023-2024', '2'),
('GV005', 'MON13', '2', '12', 'P', '2023-2024', '2'),

('GV006', 'MON02', '1', '10', 'A', '2023-2024', '2'), -- Mon Van
('GV009', 'MON02', '2', '10', 'A', '2023-2024', '2'),
('GV010', 'MON02', '3', '10', 'A', '2023-2024', '2'),
('GV007', 'MON02', '1', '10', 'P', '2023-2024', '2'),
('GV007', 'MON02', '1', '11', 'A', '2023-2024', '2'),
('GV008', 'MON02', '2', '11', 'A', '2023-2024', '2'),
('GV008', 'MON02', '3', '11', 'A', '2023-2024', '2'),
('GV008', 'MON02', '4', '11', 'A', '2023-2024', '2'),
('GV008', 'MON02', '1', '11', 'P', '2023-2024', '2'),
('GV009', 'MON02', '2', '11', 'P', '2023-2024', '2'),
('GV009', 'MON02', '1', '12', 'A', '2023-2024', '2'),
('GV009', 'MON02', '2', '12', 'A', '2023-2024', '2'),
('GV010', 'MON02', '3', '12', 'A', '2023-2024', '2'),
('GV010', 'MON02', '1', '12', 'P', '2023-2024', '2'),
('GV010', 'MON02', '2', '12', 'P', '2023-2024', '2'),

('GV006', 'MON09', '1', '10', 'A', '2023-2024', '2'), -- Mon GDCD
('GV009', 'MON09', '2', '10', 'A', '2023-2024', '2'),
('GV010', 'MON09', '3', '10', 'A', '2023-2024', '2'),
('GV007', 'MON09', '1', '10', 'P', '2023-2024', '2'),
('GV007', 'MON09', '1', '11', 'A', '2023-2024', '2'),
('GV008', 'MON09', '2', '11', 'A', '2023-2024', '2'),
('GV008', 'MON09', '3', '11', 'A', '2023-2024', '2'),
('GV008', 'MON09', '4', '11', 'A', '2023-2024', '2'),
('GV008', 'MON09', '1', '11', 'P', '2023-2024', '2'),
('GV009', 'MON09', '2', '11', 'P', '2023-2024', '2'),
('GV009', 'MON09', '1', '12', 'A', '2023-2024', '2'),
('GV009', 'MON09', '2', '12', 'A', '2023-2024', '2'),
('GV010', 'MON09', '3', '12', 'A', '2023-2024', '2'),
('GV010', 'MON09', '1', '12', 'P', '2023-2024', '2'),
('GV010', 'MON09', '2', '12', 'P', '2023-2024', '2'),

('GV011', 'MON03', '1', '10', 'A', '2023-2024', '2'), -- Mon Anh Van
('GV011', 'MON03', '2', '10', 'A', '2023-2024', '2'),
('GV011', 'MON03', '3', '10', 'A', '2023-2024', '2'),
('GV012', 'MON03', '1', '10', 'P', '2023-2024', '2'),
('GV012', 'MON03', '1', '11', 'A', '2023-2024', '2'),
('GV012', 'MON03', '2', '11', 'A', '2023-2024', '2'),
('GV012', 'MON03', '3', '11', 'A', '2023-2024', '2'),
('GV013', 'MON03', '4', '11', 'A', '2023-2024', '2'),
('GV013', 'MON03', '1', '11', 'P', '2023-2024', '2'),
('GV013', 'MON03', '2', '11', 'P', '2023-2024', '2'),
('GV013', 'MON03', '1', '12', 'A', '2023-2024', '2'),
('GV014', 'MON03', '2', '12', 'A', '2023-2024', '2'),
('GV014', 'MON03', '3', '12', 'A', '2023-2024', '2'),
('GV014', 'MON03', '1', '12', 'P', '2023-2024', '2'),
('GV014', 'MON03', '2', '12', 'P', '2023-2024', '2'),

('GV023', 'MON04', '1', '10', 'A', '2023-2024', '2'), -- Mon Sinh hoc
('GV023', 'MON04', '2', '10', 'A', '2023-2024', '2'),
('GV023', 'MON04', '3', '10', 'A', '2023-2024', '2'),
('GV023', 'MON04', '1', '10', 'P', '2023-2024', '2'),
('GV024', 'MON04', '1', '11', 'A', '2023-2024', '2'),
('GV024', 'MON04', '2', '11', 'A', '2023-2024', '2'),
('GV024', 'MON04', '3', '11', 'A', '2023-2024', '2'),
('GV024', 'MON04', '4', '11', 'A', '2023-2024', '2'),
('GV024', 'MON04', '1', '11', 'P', '2023-2024', '2'),
('GV025', 'MON04', '2', '11', 'P', '2023-2024', '2'),
('GV025', 'MON04', '1', '12', 'A', '2023-2024', '2'),
('GV025', 'MON04', '2', '12', 'A', '2023-2024', '2'),
('GV025', 'MON04', '3', '12', 'A', '2023-2024', '2'),
('GV025', 'MON04', '1', '12', 'P', '2023-2024', '2'),
('GV025', 'MON04', '2', '12', 'P', '2023-2024', '2'),

('GV023', 'MON12', '1', '10', 'A', '2023-2024', '2'), -- Mon Cong nghe
('GV023', 'MON12', '2', '10', 'A', '2023-2024', '2'),
('GV023', 'MON12', '3', '10', 'A', '2023-2024', '2'),
('GV023', 'MON12', '1', '10', 'P', '2023-2024', '2'),
('GV024', 'MON12', '1', '11', 'A', '2023-2024', '2'),
('GV024', 'MON12', '2', '11', 'A', '2023-2024', '2'),
('GV024', 'MON12', '3', '11', 'A', '2023-2024', '2'),
('GV024', 'MON12', '4', '11', 'A', '2023-2024', '2'),
('GV024', 'MON12', '1', '11', 'P', '2023-2024', '2'),
('GV025', 'MON12', '2', '11', 'P', '2023-2024', '2'),
('GV025', 'MON12', '1', '12', 'A', '2023-2024', '2'),
('GV025', 'MON12', '2', '12', 'A', '2023-2024', '2'),
('GV025', 'MON12', '3', '12', 'A', '2023-2024', '2'),
('GV025', 'MON12', '1', '12', 'P', '2023-2024', '2'),
('GV025', 'MON12', '2', '12', 'P', '2023-2024', '2'),

('GV019', 'MON05', '1', '10', 'A', '2023-2024', '2'), -- Mon Vat ly
('GV019', 'MON05', '2', '10', 'A', '2023-2024', '2'),
('GV020', 'MON05', '3', '10', 'A', '2023-2024', '2'),
('GV020', 'MON05', '1', '10', 'P', '2023-2024', '2'),
('GV020', 'MON05', '1', '11', 'A', '2023-2024', '2'),
('GV021', 'MON05', '2', '11', 'A', '2023-2024', '2'),
('GV021', 'MON05', '3', '11', 'A', '2023-2024', '2'),
('GV021', 'MON05', '4', '11', 'A', '2023-2024', '2'),
('GV021', 'MON05', '1', '11', 'P', '2023-2024', '2'),
('GV021', 'MON05', '2', '11', 'P', '2023-2024', '2'),
('GV022', 'MON05', '1', '12', 'A', '2023-2024', '2'),
('GV022', 'MON05', '2', '12', 'A', '2023-2024', '2'),
('GV022', 'MON05', '3', '12', 'A', '2023-2024', '2'),
('GV022', 'MON05', '1', '12', 'P', '2023-2024', '2'),
('GV022', 'MON05', '2', '12', 'P', '2023-2024', '2'),

('GV019', 'MON06', '1', '10', 'A', '2023-2024', '2'), -- Mon Hoa hoc
('GV019', 'MON06', '2', '10', 'A', '2023-2024', '2'),
('GV020', 'MON06', '3', '10', 'A', '2023-2024', '2'),
('GV020', 'MON06', '1', '10', 'P', '2023-2024', '2'),
('GV020', 'MON06', '1', '11', 'A', '2023-2024', '2'),
('GV021', 'MON06', '2', '11', 'A', '2023-2024', '2'),
('GV021', 'MON06', '3', '11', 'A', '2023-2024', '2'),
('GV021', 'MON06', '4', '11', 'A', '2023-2024', '2'),
('GV021', 'MON06', '1', '11', 'P', '2023-2024', '2'),
('GV021', 'MON06', '2', '11', 'P', '2023-2024', '2'),
('GV022', 'MON06', '1', '12', 'A', '2023-2024', '2'),
('GV022', 'MON06', '2', '12', 'A', '2023-2024', '2'),
('GV022', 'MON06', '3', '12', 'A', '2023-2024', '2'),
('GV022', 'MON06', '1', '12', 'P', '2023-2024', '2'),
('GV022', 'MON06', '2', '12', 'P', '2023-2024', '2'),

('GV015', 'MON07', '1', '10', 'A', '2023-2024', '2'), -- Mon Dia ly
('GV015', 'MON07', '2', '10', 'A', '2023-2024', '2'),
('GV016', 'MON07', '3', '10', 'A', '2023-2024', '2'),
('GV016', 'MON07', '1', '10', 'P', '2023-2024', '2'),
('GV016', 'MON07', '1', '11', 'A', '2023-2024', '2'),
('GV017', 'MON07', '2', '11', 'A', '2023-2024', '2'),
('GV017', 'MON07', '3', '11', 'A', '2023-2024', '2'),
('GV017', 'MON07', '4', '11', 'A', '2023-2024', '2'),
('GV017', 'MON07', '1', '11', 'P', '2023-2024', '2'),
('GV017', 'MON07', '2', '11', 'P', '2023-2024', '2'),
('GV018', 'MON07', '1', '12', 'A', '2023-2024', '2'),
('GV018', 'MON07', '2', '12', 'A', '2023-2024', '2'),
('GV018', 'MON07', '3', '12', 'A', '2023-2024', '2'),
('GV018', 'MON07', '1', '12', 'P', '2023-2024', '2'),
('GV018', 'MON07', '2', '12', 'P', '2023-2024', '2'),

('GV015', 'MON08', '1', '10', 'A', '2023-2024', '2'), -- Mon Lich su
('GV015', 'MON08', '2', '10', 'A', '2023-2024', '2'),
('GV016', 'MON08', '3', '10', 'A', '2023-2024', '2'),
('GV016', 'MON08', '1', '10', 'P', '2023-2024', '2'),
('GV016', 'MON08', '1', '11', 'A', '2023-2024', '2'),
('GV017', 'MON08', '2', '11', 'A', '2023-2024', '2'),
('GV017', 'MON08', '3', '11', 'A', '2023-2024', '2'),
('GV017', 'MON08', '4', '11', 'A', '2023-2024', '2'),
('GV017', 'MON08', '1', '11', 'P', '2023-2024', '2'),
('GV017', 'MON08', '2', '11', 'P', '2023-2024', '2'),
('GV018', 'MON08', '1', '12', 'A', '2023-2024', '2'),
('GV018', 'MON08', '2', '12', 'A', '2023-2024', '2'),
('GV018', 'MON08', '3', '12', 'A', '2023-2024', '2'),
('GV018', 'MON08', '1', '12', 'P', '2023-2024', '2'),
('GV018', 'MON08', '2', '12', 'P', '2023-2024', '2'),

('GV026', 'MON10', '1', '10', 'A', '2023-2024', '2'), -- Mon The duc
('GV026', 'MON10', '2', '10', 'A', '2023-2024', '2'),
('GV026', 'MON10', '3', '10', 'A', '2023-2024', '2'),
('GV026', 'MON10', '1', '10', 'P', '2023-2024', '2'),
('GV026', 'MON10', '1', '11', 'A', '2023-2024', '2'),
('GV027', 'MON10', '2', '11', 'A', '2023-2024', '2'),
('GV027', 'MON10', '3', '11', 'A', '2023-2024', '2'),
('GV027', 'MON10', '4', '11', 'A', '2023-2024', '2'),
('GV027', 'MON10', '1', '11', 'P', '2023-2024', '2'),
('GV027', 'MON10', '2', '11', 'P', '2023-2024', '2'),
('GV028', 'MON10', '1', '12', 'A', '2023-2024', '2'),
('GV028', 'MON10', '2', '12', 'A', '2023-2024', '2'),
('GV028', 'MON10', '3', '12', 'A', '2023-2024', '2'),
('GV028', 'MON10', '1', '12', 'P', '2023-2024', '2'),
('GV028', 'MON10', '2', '12', 'P', '2023-2024', '2'),

('GV026', 'MON11', '1', '10', 'A', '2023-2024', '2'), -- Mon GDQP
('GV026', 'MON11', '2', '10', 'A', '2023-2024', '2'),
('GV026', 'MON11', '3', '10', 'A', '2023-2024', '2'),
('GV026', 'MON11', '1', '10', 'P', '2023-2024', '2'),
('GV026', 'MON11', '1', '11', 'A', '2023-2024', '2'),
('GV027', 'MON11', '2', '11', 'A', '2023-2024', '2'),
('GV027', 'MON11', '3', '11', 'A', '2023-2024', '2'),
('GV027', 'MON11', '4', '11', 'A', '2023-2024', '2'),
('GV027', 'MON11', '1', '11', 'P', '2023-2024', '2'),
('GV027', 'MON11', '2', '11', 'P', '2023-2024', '2'),
('GV028', 'MON11', '1', '12', 'A', '2023-2024', '2'),
('GV028', 'MON11', '2', '12', 'A', '2023-2024', '2'),
('GV028', 'MON11', '3', '12', 'A', '2023-2024', '2'),
('GV028', 'MON11', '1', '12', 'P', '2023-2024', '2'),
('GV028', 'MON11', '2', '12', 'P', '2023-2024', '2'),
--
('GV001', 'MON01', '1', '11', 'A', '2024-2025', '2'), -- Mon Toan
('GV004', 'MON01', '2', '11', 'A', '2024-2025', '2'),
('GV005', 'MON01', '3', '11', 'A', '2024-2025', '2'),
('GV002', 'MON01', '1', '11', 'P', '2024-2025', '2'),
('GV002', 'MON01', '1', '12', 'A', '2024-2025', '2'),
('GV003', 'MON01', '2', '12', 'A', '2024-2025', '2'),
('GV003', 'MON01', '3', '12', 'A', '2024-2025', '2'),
('GV003', 'MON01', '4', '12', 'A', '2024-2025', '2'),
('GV003', 'MON01', '1', '12', 'P', '2024-2025', '2'),
('GV004', 'MON01', '2', '12', 'P', '2024-2025', '2'),
('GV004', 'MON01', '1', '10', 'A', '2024-2025', '2'),
('GV004', 'MON01', '2', '10', 'A', '2024-2025', '2'),
('GV005', 'MON01', '3', '10', 'A', '2024-2025', '2'),
('GV005', 'MON01', '1', '10', 'P', '2024-2025', '2'),
('GV005', 'MON01', '2', '10', 'P', '2024-2025', '2'),

('GV001', 'MON13', '1', '11', 'A', '2024-2025', '2'), -- Mon Tin
('GV004', 'MON13', '2', '11', 'A', '2024-2025', '2'),
('GV005', 'MON13', '3', '11', 'A', '2024-2025', '2'),
('GV002', 'MON13', '1', '11', 'P', '2024-2025', '2'),
('GV002', 'MON13', '1', '12', 'A', '2024-2025', '2'),
('GV003', 'MON13', '2', '12', 'A', '2024-2025', '2'),
('GV003', 'MON13', '3', '12', 'A', '2024-2025', '2'),
('GV003', 'MON13', '4', '12', 'A', '2024-2025', '2'),
('GV003', 'MON13', '1', '12', 'P', '2024-2025', '2'),
('GV004', 'MON13', '2', '12', 'P', '2024-2025', '2'),
('GV004', 'MON13', '1', '10', 'A', '2024-2025', '2'),
('GV004', 'MON13', '2', '10', 'A', '2024-2025', '2'),
('GV005', 'MON13', '3', '10', 'A', '2024-2025', '2'),
('GV005', 'MON13', '1', '10', 'P', '2024-2025', '2'),
('GV005', 'MON13', '2', '10', 'P', '2024-2025', '2'),

('GV006', 'MON02', '1', '11', 'A', '2024-2025', '2'), -- Mon Van
('GV009', 'MON02', '2', '11', 'A', '2024-2025', '2'),
('GV010', 'MON02', '3', '11', 'A', '2024-2025', '2'),
('GV007', 'MON02', '1', '11', 'P', '2024-2025', '2'),
('GV007', 'MON02', '1', '12', 'A', '2024-2025', '2'),
('GV008', 'MON02', '2', '12', 'A', '2024-2025', '2'),
('GV008', 'MON02', '3', '12', 'A', '2024-2025', '2'),
('GV008', 'MON02', '4', '12', 'A', '2024-2025', '2'),
('GV008', 'MON02', '1', '12', 'P', '2024-2025', '2'),
('GV009', 'MON02', '2', '12', 'P', '2024-2025', '2'),
('GV009', 'MON02', '1', '10', 'A', '2024-2025', '2'),
('GV009', 'MON02', '2', '10', 'A', '2024-2025', '2'),
('GV010', 'MON02', '3', '10', 'A', '2024-2025', '2'),
('GV010', 'MON02', '1', '10', 'P', '2024-2025', '2'),
('GV010', 'MON02', '2', '10', 'P', '2024-2025', '2'),

('GV006', 'MON09', '1', '11', 'A', '2024-2025', '2'), -- Mon GDCD
('GV009', 'MON09', '2', '11', 'A', '2024-2025', '2'),
('GV010', 'MON09', '3', '11', 'A', '2024-2025', '2'),
('GV007', 'MON09', '1', '11', 'P', '2024-2025', '2'),
('GV007', 'MON09', '1', '12', 'A', '2024-2025', '2'),
('GV008', 'MON09', '2', '12', 'A', '2024-2025', '2'),
('GV008', 'MON09', '3', '12', 'A', '2024-2025', '2'),
('GV008', 'MON09', '4', '12', 'A', '2024-2025', '2'),
('GV008', 'MON09', '1', '12', 'P', '2024-2025', '2'),
('GV009', 'MON09', '2', '12', 'P', '2024-2025', '2'),
('GV009', 'MON09', '1', '10', 'A', '2024-2025', '2'),
('GV009', 'MON09', '2', '10', 'A', '2024-2025', '2'),
('GV010', 'MON09', '3', '10', 'A', '2024-2025', '2'),
('GV010', 'MON09', '1', '10', 'P', '2024-2025', '2'),
('GV010', 'MON09', '2', '10', 'P', '2024-2025', '2'),

('GV011', 'MON03', '1', '11', 'A', '2024-2025', '2'), -- Mon Anh Van
('GV011', 'MON03', '2', '11', 'A', '2024-2025', '2'),
('GV011', 'MON03', '3', '11', 'A', '2024-2025', '2'),
('GV012', 'MON03', '1', '11', 'P', '2024-2025', '2'),
('GV012', 'MON03', '1', '12', 'A', '2024-2025', '2'),
('GV012', 'MON03', '2', '12', 'A', '2024-2025', '2'),
('GV012', 'MON03', '3', '12', 'A', '2024-2025', '2'),
('GV013', 'MON03', '4', '12', 'A', '2024-2025', '2'),
('GV013', 'MON03', '1', '12', 'P', '2024-2025', '2'),
('GV013', 'MON03', '2', '12', 'P', '2024-2025', '2'),
('GV013', 'MON03', '1', '10', 'A', '2024-2025', '2'),
('GV014', 'MON03', '2', '10', 'A', '2024-2025', '2'),
('GV014', 'MON03', '3', '10', 'A', '2024-2025', '2'),
('GV014', 'MON03', '1', '10', 'P', '2024-2025', '2'),
('GV014', 'MON03', '2', '10', 'P', '2024-2025', '2'),

('GV023', 'MON04', '1', '11', 'A', '2024-2025', '2'), -- Mon Sinh hoc
('GV023', 'MON04', '2', '11', 'A', '2024-2025', '2'),
('GV023', 'MON04', '3', '11', 'A', '2024-2025', '2'),
('GV023', 'MON04', '1', '11', 'P', '2024-2025', '2'),
('GV024', 'MON04', '1', '12', 'A', '2024-2025', '2'),
('GV024', 'MON04', '2', '12', 'A', '2024-2025', '2'),
('GV024', 'MON04', '3', '12', 'A', '2024-2025', '2'),
('GV024', 'MON04', '4', '12', 'A', '2024-2025', '2'),
('GV024', 'MON04', '1', '12', 'P', '2024-2025', '2'),
('GV025', 'MON04', '2', '12', 'P', '2024-2025', '2'),
('GV025', 'MON04', '1', '10', 'A', '2024-2025', '2'),
('GV025', 'MON04', '2', '10', 'A', '2024-2025', '2'),
('GV025', 'MON04', '3', '10', 'A', '2024-2025', '2'),
('GV025', 'MON04', '1', '10', 'P', '2024-2025', '2'),
('GV025', 'MON04', '2', '10', 'P', '2024-2025', '2'),

('GV023', 'MON12', '1', '11', 'A', '2024-2025', '2'), -- Mon Cong nghe
('GV023', 'MON12', '2', '11', 'A', '2024-2025', '2'),
('GV023', 'MON12', '3', '11', 'A', '2024-2025', '2'),
('GV023', 'MON12', '1', '11', 'P', '2024-2025', '2'),
('GV024', 'MON12', '1', '12', 'A', '2024-2025', '2'),
('GV024', 'MON12', '2', '12', 'A', '2024-2025', '2'),
('GV024', 'MON12', '3', '12', 'A', '2024-2025', '2'),
('GV024', 'MON12', '4', '12', 'A', '2024-2025', '2'),
('GV024', 'MON12', '1', '12', 'P', '2024-2025', '2'),
('GV025', 'MON12', '2', '12', 'P', '2024-2025', '2'),
('GV025', 'MON12', '1', '10', 'A', '2024-2025', '2'),
('GV025', 'MON12', '2', '10', 'A', '2024-2025', '2'),
('GV025', 'MON12', '3', '10', 'A', '2024-2025', '2'),
('GV025', 'MON12', '1', '10', 'P', '2024-2025', '2'),
('GV025', 'MON12', '2', '10', 'P', '2024-2025', '2'),

('GV019', 'MON05', '1', '11', 'A', '2024-2025', '2'), -- Mon Vat ly
('GV019', 'MON05', '2', '11', 'A', '2024-2025', '2'),
('GV020', 'MON05', '3', '11', 'A', '2024-2025', '2'),
('GV020', 'MON05', '1', '11', 'P', '2024-2025', '2'),
('GV020', 'MON05', '1', '12', 'A', '2024-2025', '2'),
('GV021', 'MON05', '2', '12', 'A', '2024-2025', '2'),
('GV021', 'MON05', '3', '12', 'A', '2024-2025', '2'),
('GV021', 'MON05', '4', '12', 'A', '2024-2025', '2'),
('GV021', 'MON05', '1', '12', 'P', '2024-2025', '2'),
('GV021', 'MON05', '2', '12', 'P', '2024-2025', '2'),
('GV022', 'MON05', '1', '10', 'A', '2024-2025', '2'),
('GV022', 'MON05', '2', '10', 'A', '2024-2025', '2'),
('GV022', 'MON05', '3', '10', 'A', '2024-2025', '2'),
('GV022', 'MON05', '1', '10', 'P', '2024-2025', '2'),
('GV022', 'MON05', '2', '10', 'P', '2024-2025', '2'),

('GV019', 'MON06', '1', '11', 'A', '2024-2025', '2'), -- Mon Hoa hoc
('GV019', 'MON06', '2', '11', 'A', '2024-2025', '2'),
('GV020', 'MON06', '3', '11', 'A', '2024-2025', '2'),
('GV020', 'MON06', '1', '11', 'P', '2024-2025', '2'),
('GV020', 'MON06', '1', '12', 'A', '2024-2025', '2'),
('GV021', 'MON06', '2', '12', 'A', '2024-2025', '2'),
('GV021', 'MON06', '3', '12', 'A', '2024-2025', '2'),
('GV021', 'MON06', '4', '12', 'A', '2024-2025', '2'),
('GV021', 'MON06', '1', '12', 'P', '2024-2025', '2'),
('GV021', 'MON06', '2', '12', 'P', '2024-2025', '2'),
('GV022', 'MON06', '1', '10', 'A', '2024-2025', '2'),
('GV022', 'MON06', '2', '10', 'A', '2024-2025', '2'),
('GV022', 'MON06', '3', '10', 'A', '2024-2025', '2'),
('GV022', 'MON06', '1', '10', 'P', '2024-2025', '2'),
('GV022', 'MON06', '2', '10', 'P', '2024-2025', '2'),

('GV015', 'MON07', '1', '11', 'A', '2024-2025', '2'), -- Mon Dia ly
('GV015', 'MON07', '2', '11', 'A', '2024-2025', '2'),
('GV016', 'MON07', '3', '11', 'A', '2024-2025', '2'),
('GV016', 'MON07', '1', '11', 'P', '2024-2025', '2'),
('GV016', 'MON07', '1', '12', 'A', '2024-2025', '2'),
('GV017', 'MON07', '2', '12', 'A', '2024-2025', '2'),
('GV017', 'MON07', '3', '12', 'A', '2024-2025', '2'),
('GV017', 'MON07', '4', '12', 'A', '2024-2025', '2'),
('GV017', 'MON07', '1', '12', 'P', '2024-2025', '2'),
('GV017', 'MON07', '2', '12', 'P', '2024-2025', '2'),
('GV018', 'MON07', '1', '10', 'A', '2024-2025', '2'),
('GV018', 'MON07', '2', '10', 'A', '2024-2025', '2'),
('GV018', 'MON07', '3', '10', 'A', '2024-2025', '2'),
('GV018', 'MON07', '1', '10', 'P', '2024-2025', '2'),
('GV018', 'MON07', '2', '10', 'P', '2024-2025', '2'),

('GV015', 'MON08', '1', '11', 'A', '2024-2025', '2'), -- Mon Lich su
('GV015', 'MON08', '2', '11', 'A', '2024-2025', '2'),
('GV016', 'MON08', '3', '11', 'A', '2024-2025', '2'),
('GV016', 'MON08', '1', '11', 'P', '2024-2025', '2'),
('GV016', 'MON08', '1', '12', 'A', '2024-2025', '2'),
('GV017', 'MON08', '2', '12', 'A', '2024-2025', '2'),
('GV017', 'MON08', '3', '12', 'A', '2024-2025', '2'),
('GV017', 'MON08', '4', '12', 'A', '2024-2025', '2'),
('GV017', 'MON08', '1', '12', 'P', '2024-2025', '2'),
('GV017', 'MON08', '2', '12', 'P', '2024-2025', '2'),
('GV018', 'MON08', '1', '10', 'A', '2024-2025', '2'),
('GV018', 'MON08', '2', '10', 'A', '2024-2025', '2'),
('GV018', 'MON08', '3', '10', 'A', '2024-2025', '2'),
('GV018', 'MON08', '1', '10', 'P', '2024-2025', '2'),
('GV018', 'MON08', '2', '10', 'P', '2024-2025', '2'),

('GV026', 'MON10', '1', '11', 'A', '2024-2025', '2'), -- Mon The duc
('GV026', 'MON10', '2', '11', 'A', '2024-2025', '2'),
('GV026', 'MON10', '3', '11', 'A', '2024-2025', '2'),
('GV026', 'MON10', '1', '11', 'P', '2024-2025', '2'),
('GV026', 'MON10', '1', '12', 'A', '2024-2025', '2'),
('GV027', 'MON10', '2', '12', 'A', '2024-2025', '2'),
('GV027', 'MON10', '3', '12', 'A', '2024-2025', '2'),
('GV027', 'MON10', '4', '12', 'A', '2024-2025', '2'),
('GV027', 'MON10', '1', '12', 'P', '2024-2025', '2'),
('GV027', 'MON10', '2', '12', 'P', '2024-2025', '2'),
('GV028', 'MON10', '1', '10', 'A', '2024-2025', '2'),
('GV028', 'MON10', '2', '10', 'A', '2024-2025', '2'),
('GV028', 'MON10', '3', '10', 'A', '2024-2025', '2'),
('GV028', 'MON10', '1', '10', 'P', '2024-2025', '2'),
('GV028', 'MON10', '2', '10', 'P', '2024-2025', '2'),

('GV026', 'MON11', '1', '11', 'A', '2024-2025', '2'), -- Mon GDQP
('GV026', 'MON11', '2', '11', 'A', '2024-2025', '2'),
('GV026', 'MON11', '3', '11', 'A', '2024-2025', '2'),
('GV026', 'MON11', '1', '11', 'P', '2024-2025', '2'),
('GV026', 'MON11', '1', '12', 'A', '2024-2025', '2'),
('GV027', 'MON11', '2', '12', 'A', '2024-2025', '2'),
('GV027', 'MON11', '3', '12', 'A', '2024-2025', '2'),
('GV027', 'MON11', '4', '12', 'A', '2024-2025', '2'),
('GV027', 'MON11', '1', '12', 'P', '2024-2025', '2'),
('GV027', 'MON11', '2', '12', 'P', '2024-2025', '2'),
('GV028', 'MON11', '1', '10', 'A', '2024-2025', '2'),
('GV028', 'MON11', '2', '10', 'A', '2024-2025', '2'),
('GV028', 'MON11', '3', '10', 'A', '2024-2025', '2'),
('GV028', 'MON11', '1', '10', 'P', '2024-2025', '2'),
('GV028', 'MON11', '2', '10', 'P', '2024-2025', '2');

CREATE TABLE trangthai (
  TT_Ma char(5) NOT NULL,
  TT_Ten varchar(50) NOT NULL,
  PRIMARY KEY (TT_Ma)
)ENGINE=InnoDB;

INSERT INTO trangthai (TT_Ma, TT_Ten) VALUES
('TT001', 'Dạy'),
('TT002', 'Nghỉ'),
('TT003', 'Dạy bù'),
('TT004', 'Dạy thay');

CREATE TABLE tuan (
  T_Ma char(7) NOT NULL,
  T_NgayDT date NOT NULL,
  T_NgayKT date NOT NULL,
  PRIMARY KEY (T_Ma)
)ENGINE=InnoDB;

INSERT INTO tuan(T_Ma, T_NgayDT, T_NgayKT) VALUES
('T012425', '2024-08-26', '2024-09-01'),
('T022425', '2024-09-02', '2024-09-08'),
('T032425', '2024-09-09', '2024-09-15'),
('T042425', '2024-09-16', '2024-09-22'),
('T052425', '2024-09-23', '2024-09-29'),
('T062425', '2024-09-30', '2024-10-06'),
('T072425', '2024-10-07', '2024-10-13'),
('T082425', '2024-10-14', '2024-10-20'),
('T092425', '2024-10-21', '2024-10-27'),
('T102425', '2024-10-28', '2024-11-03'),
('T112425', '2024-11-04', '2024-11-10'),
('T122425', '2024-11-11', '2024-11-17'),
('T132425', '2024-11-18', '2024-11-24'),
('T142425', '2024-11-25', '2024-12-01'),
('T152425', '2024-12-02', '2024-12-08'),
('T162425', '2024-12-09', '2024-12-15'),
('T172425', '2024-12-16', '2024-12-22'),
('T182425', '2024-12-23', '2024-12-29'),
('T192425', '2024-12-30', '2025-01-05'),
('T202425', '2025-01-06', '2025-01-12'),
('T212425', '2025-01-13', '2025-01-19'),
('T222425', '2025-01-20', '2025-01-26'),
('T232425', '2025-01-27', '2025-02-02'),
('T242425', '2025-02-03', '2025-02-09'),
('T252425', '2025-02-10', '2025-02-16'),
('T262425', '2025-02-17', '2025-02-23'),
('T272425', '2025-02-24', '2025-03-02'),
('T282425', '2025-03-03', '2025-03-09'),
('T292425', '2025-03-10', '2025-03-16'),
('T302425', '2025-03-17', '2025-03-23'),
('T312425', '2025-03-24', '2025-03-30'),
('T322425', '2025-03-31', '2025-04-06'),
('T332425', '2025-04-07', '2025-04-13'),
('T342425', '2025-04-14', '2025-04-20'),
('T352425', '2025-04-21', '2025-04-27');

CREATE TABLE chuongtrinhgiangday(
  NMH_Ma char(5) NOT NULL,
  M_Ma char(5) NOT NULL,
  K_Khoi char(2) NOT NULL,
  HK_HocKy char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  CTGD_SoTietTuan int NOT NULL,
  PRIMARY KEY (NMH_Ma, M_Ma, K_Khoi, HK_HocKy, NH_NamHoc),
  FOREIGN KEY (NMH_Ma) REFERENCES nhommonhoc (NMH_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (M_Ma) REFERENCES monhoc (M_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (K_Khoi) REFERENCES khoi (K_Khoi) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (HK_HocKy) REFERENCES hocky (HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (NH_NamHoc) REFERENCES namhoc (NH_NamHoc) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO chuongtrinhgiangday(NMH_Ma, M_Ma, K_Khoi, HK_HocKy, NH_NamHoc, CTGD_SoTietTuan) VALUES
('NMH01', 'MON01', '10', '1', '2023-2024', 4),
('NMH01', 'MON02', '10', '1', '2023-2024', 4),
('NMH01', 'MON03', '10', '1', '2023-2024', 3),
('NMH01', 'MON04', '10', '1', '2023-2024', 2),
('NMH01', 'MON05', '10', '1', '2023-2024', 2),
('NMH01', 'MON06', '10', '1', '2023-2024', 2),
('NMH01', 'MON07', '10', '1', '2023-2024', 2),
('NMH01', 'MON08', '10', '1', '2023-2024', 2),
('NMH01', 'MON09', '10', '1', '2023-2024', 1),
('NMH01', 'MON10', '10', '1', '2023-2024', 1),
('NMH01', 'MON11', '10', '1', '2023-2024', 1),
('NMH01', 'MON12', '10', '1', '2023-2024', 1),
('NMH01', 'MON13', '10', '1', '2023-2024', 1),

('NMH01', 'MON01', '11', '1', '2023-2024', 4),
('NMH01', 'MON02', '11', '1', '2023-2024', 4),
('NMH01', 'MON03', '11', '1', '2023-2024', 3),
('NMH01', 'MON04', '11', '1', '2023-2024', 2),
('NMH01', 'MON05', '11', '1', '2023-2024', 2),
('NMH01', 'MON06', '11', '1', '2023-2024', 2),
('NMH01', 'MON07', '11', '1', '2023-2024', 2),
('NMH01', 'MON08', '11', '1', '2023-2024', 2),
('NMH01', 'MON09', '11', '1', '2023-2024', 1),
('NMH01', 'MON10', '11', '1', '2023-2024', 1),
('NMH01', 'MON11', '11', '1', '2023-2024', 1),
('NMH01', 'MON12', '11', '1', '2023-2024', 1),
('NMH01', 'MON13', '11', '1', '2023-2024', 1),

('NMH01', 'MON01', '12', '1', '2023-2024', 4),
('NMH01', 'MON02', '12', '1', '2023-2024', 4),
('NMH01', 'MON03', '12', '1', '2023-2024', 3),
('NMH01', 'MON04', '12', '1', '2023-2024', 2),
('NMH01', 'MON05', '12', '1', '2023-2024', 2),
('NMH01', 'MON06', '12', '1', '2023-2024', 2),
('NMH01', 'MON07', '12', '1', '2023-2024', 2),
('NMH01', 'MON08', '12', '1', '2023-2024', 2),
('NMH01', 'MON09', '12', '1', '2023-2024', 1),
('NMH01', 'MON10', '12', '1', '2023-2024', 1),
('NMH01', 'MON11', '12', '1', '2023-2024', 1),
('NMH01', 'MON12', '12', '1', '2023-2024', 1),
('NMH01', 'MON13', '12', '1', '2023-2024', 1),

('NMH01', 'MON01', '10', '2', '2023-2024', 4),
('NMH01', 'MON02', '10', '2', '2023-2024', 4),
('NMH01', 'MON03', '10', '2', '2023-2024', 3),
('NMH01', 'MON04', '10', '2', '2023-2024', 2),
('NMH01', 'MON05', '10', '2', '2023-2024', 2),
('NMH01', 'MON06', '10', '2', '2023-2024', 2),
('NMH01', 'MON07', '10', '2', '2023-2024', 2),
('NMH01', 'MON08', '10', '2', '2023-2024', 2),
('NMH01', 'MON09', '10', '2', '2023-2024', 1),
('NMH01', 'MON10', '10', '2', '2023-2024', 1),
('NMH01', 'MON11', '10', '2', '2023-2024', 1),
('NMH01', 'MON12', '10', '2', '2023-2024', 1),
('NMH01', 'MON13', '10', '2', '2023-2024', 1),

('NMH01', 'MON01', '11', '2', '2023-2024', 4),
('NMH01', 'MON02', '11', '2', '2023-2024', 4),
('NMH01', 'MON03', '11', '2', '2023-2024', 3),
('NMH01', 'MON04', '11', '2', '2023-2024', 2),
('NMH01', 'MON05', '11', '2', '2023-2024', 2),
('NMH01', 'MON06', '11', '2', '2023-2024', 2),
('NMH01', 'MON07', '11', '2', '2023-2024', 2),
('NMH01', 'MON08', '11', '2', '2023-2024', 2),
('NMH01', 'MON09', '11', '2', '2023-2024', 1),
('NMH01', 'MON10', '11', '2', '2023-2024', 1),
('NMH01', 'MON11', '11', '2', '2023-2024', 1),
('NMH01', 'MON12', '11', '2', '2023-2024', 1),
('NMH01', 'MON13', '11', '2', '2023-2024', 1),

('NMH01', 'MON01', '12', '2', '2023-2024', 4),
('NMH01', 'MON02', '12', '2', '2023-2024', 4),
('NMH01', 'MON03', '12', '2', '2023-2024', 3),
('NMH01', 'MON04', '12', '2', '2023-2024', 2),
('NMH01', 'MON05', '12', '2', '2023-2024', 2),
('NMH01', 'MON06', '12', '2', '2023-2024', 2),
('NMH01', 'MON07', '12', '2', '2023-2024', 2),
('NMH01', 'MON08', '12', '2', '2023-2024', 2),
('NMH01', 'MON09', '12', '2', '2023-2024', 1),
('NMH01', 'MON10', '12', '2', '2023-2024', 1),
('NMH01', 'MON11', '12', '2', '2023-2024', 1),
('NMH01', 'MON12', '12', '2', '2023-2024', 1),
('NMH01', 'MON13', '12', '2', '2023-2024', 1),

('NMH01', 'MON01', '10', '1', '2024-2025', 4),
('NMH01', 'MON02', '10', '1', '2024-2025', 4),
('NMH01', 'MON03', '10', '1', '2024-2025', 3),
('NMH01', 'MON04', '10', '1', '2024-2025', 2),
('NMH01', 'MON05', '10', '1', '2024-2025', 2),
('NMH01', 'MON06', '10', '1', '2024-2025', 2),
('NMH01', 'MON07', '10', '1', '2024-2025', 2),
('NMH01', 'MON08', '10', '1', '2024-2025', 2),
('NMH01', 'MON09', '10', '1', '2024-2025', 1),
('NMH01', 'MON10', '10', '1', '2024-2025', 1),
('NMH01', 'MON11', '10', '1', '2024-2025', 1),
('NMH01', 'MON12', '10', '1', '2024-2025', 1),
('NMH01', 'MON13', '10', '1', '2024-2025', 1),

('NMH01', 'MON01', '11', '1', '2024-2025', 4),
('NMH01', 'MON02', '11', '1', '2024-2025', 4),
('NMH01', 'MON03', '11', '1', '2024-2025', 3),
('NMH01', 'MON04', '11', '1', '2024-2025', 2),
('NMH01', 'MON05', '11', '1', '2024-2025', 2),
('NMH01', 'MON06', '11', '1', '2024-2025', 2),
('NMH01', 'MON07', '11', '1', '2024-2025', 2),
('NMH01', 'MON08', '11', '1', '2024-2025', 2),
('NMH01', 'MON09', '11', '1', '2024-2025', 1),
('NMH01', 'MON10', '11', '1', '2024-2025', 1),
('NMH01', 'MON11', '11', '1', '2024-2025', 1),
('NMH01', 'MON12', '11', '1', '2024-2025', 1),
('NMH01', 'MON13', '11', '1', '2024-2025', 1),

('NMH01', 'MON01', '12', '1', '2024-2025', 4),
('NMH01', 'MON02', '12', '1', '2024-2025', 4),
('NMH01', 'MON03', '12', '1', '2024-2025', 3),
('NMH01', 'MON04', '12', '1', '2024-2025', 2),
('NMH01', 'MON05', '12', '1', '2024-2025', 2),
('NMH01', 'MON06', '12', '1', '2024-2025', 2),
('NMH01', 'MON07', '12', '1', '2024-2025', 2),
('NMH01', 'MON08', '12', '1', '2024-2025', 2),
('NMH01', 'MON09', '12', '1', '2024-2025', 1),
('NMH01', 'MON10', '12', '1', '2024-2025', 1),
('NMH01', 'MON11', '12', '1', '2024-2025', 1),
('NMH01', 'MON12', '12', '1', '2024-2025', 1),
('NMH01', 'MON13', '12', '1', '2024-2025', 1),

('NMH01', 'MON01', '10', '2', '2024-2025', 4),
('NMH01', 'MON02', '10', '2', '2024-2025', 4),
('NMH01', 'MON03', '10', '2', '2024-2025', 3),
('NMH01', 'MON04', '10', '2', '2024-2025', 2),
('NMH01', 'MON05', '10', '2', '2024-2025', 2),
('NMH01', 'MON06', '10', '2', '2024-2025', 2),
('NMH01', 'MON07', '10', '2', '2024-2025', 2),
('NMH01', 'MON08', '10', '2', '2024-2025', 2),
('NMH01', 'MON09', '10', '2', '2024-2025', 1),
('NMH01', 'MON10', '10', '2', '2024-2025', 1),
('NMH01', 'MON11', '10', '2', '2024-2025', 1),
('NMH01', 'MON12', '10', '2', '2024-2025', 1),
('NMH01', 'MON13', '10', '2', '2024-2025', 1),

('NMH01', 'MON01', '11', '2', '2024-2025', 4),
('NMH01', 'MON02', '11', '2', '2024-2025', 4),
('NMH01', 'MON03', '11', '2', '2024-2025', 3),
('NMH01', 'MON04', '11', '2', '2024-2025', 2),
('NMH01', 'MON05', '11', '2', '2024-2025', 2),
('NMH01', 'MON06', '11', '2', '2024-2025', 2),
('NMH01', 'MON07', '11', '2', '2024-2025', 2),
('NMH01', 'MON08', '11', '2', '2024-2025', 2),
('NMH01', 'MON09', '11', '2', '2024-2025', 1),
('NMH01', 'MON10', '11', '2', '2024-2025', 1),
('NMH01', 'MON11', '11', '2', '2024-2025', 1),
('NMH01', 'MON12', '11', '2', '2024-2025', 1),
('NMH01', 'MON13', '11', '2', '2024-2025', 1),

('NMH01', 'MON01', '12', '2', '2024-2025', 4),
('NMH01', 'MON02', '12', '2', '2024-2025', 4),
('NMH01', 'MON03', '12', '2', '2024-2025', 3),
('NMH01', 'MON04', '12', '2', '2024-2025', 2),
('NMH01', 'MON05', '12', '2', '2024-2025', 2),
('NMH01', 'MON06', '12', '2', '2024-2025', 2),
('NMH01', 'MON07', '12', '2', '2024-2025', 2),
('NMH01', 'MON08', '12', '2', '2024-2025', 2),
('NMH01', 'MON09', '12', '2', '2024-2025', 1),
('NMH01', 'MON10', '12', '2', '2024-2025', 1),
('NMH01', 'MON11', '12', '2', '2024-2025', 1),
('NMH01', 'MON12', '12', '2', '2024-2025', 1),
('NMH01', 'MON13', '12', '2', '2024-2025', 1);

CREATE TABLE thoikhoabieu (
  TKB_ID int NOT NULL AUTO_INCREMENT,
  GV_Ma char(5) NOT NULL,
  GV_DayThay char(5) DEFAULT NULL,
  M_Ma char(5) NOT NULL,
  L_STTLop varchar(2) NOT NULL,
  K_Khoi char(2) NOT NULL,
  KH_KyHieu char(1) NOT NULL,
  NH_NamHoc char(9) NOT NULL,
  HK_HocKy char(1) NOT NULL,
  TKB_Ngay date NOT NULL,
  TKB_TietBD int NOT NULL,
  TKB_SoTiet int NOT NULL,
  T_Ma char(7) NOT NULL,
  TT_Ma char(5) NOT NULL DEFAULT 'TT001',

  PRIMARY KEY (TKB_ID),
  FOREIGN KEY (GV_Ma) REFERENCES giaovien (GV_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (GV_DayThay) REFERENCES giaovien (GV_Ma) ON DELETE SET NULL ON UPDATE NO ACTION,
  FOREIGN KEY (M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy) REFERENCES giangday (M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (T_Ma) REFERENCES tuan (T_Ma) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

INSERT INTO thoikhoabieu (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma) VALUES
('GV001', 'MON01', '1', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'), -- Mon Toan
('GV004', 'MON01', '2', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'), -- HK1 - 2024-2025
('GV005', 'MON01', '3', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
('GV002', 'MON01', '1', '11', 'P', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
('GV002', 'MON01', '1', '12', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
('GV003', 'MON01', '2', '12', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
('GV003', 'MON01', '3', '12', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
('GV003', 'MON01', '4', '12', 'A', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
('GV003', 'MON01', '1', '12', 'P', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),
('GV004', 'MON01', '2', '12', 'P', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
('GV004', 'MON01', '1', '10', 'A', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
('GV004', 'MON01', '2', '10', 'A', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),
('GV005', 'MON01', '3', '10', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
('GV005', 'MON01', '1', '10', 'P', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
('GV005', 'MON01', '2', '10', 'P', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),

('GV001', 'MON13', '1', '11', 'A', '2024-2025', '1', '2024-08-30', 1, 1, 'T012425'), -- Mon Tin
('GV004', 'MON13', '2', '11', 'A', '2024-2025', '1', '2024-08-30', 2, 1, 'T012425'), -- HK1 - 2024-2025
('GV005', 'MON13', '3', '11', 'A', '2024-2025', '1', '2024-08-30', 3, 1, 'T012425'),
('GV002', 'MON13', '1', '11', 'P', '2024-2025', '1', '2024-08-30', 4, 1, 'T012425'),
('GV002', 'MON13', '1', '12', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
('GV003', 'MON13', '2', '12', 'A', '2024-2025', '1', '2024-08-30', 5, 1, 'T012425'),
('GV003', 'MON13', '3', '12', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
('GV003', 'MON13', '4', '12', 'A', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
('GV003', 'MON13', '1', '12', 'P', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425'),
('GV004', 'MON13', '2', '12', 'P', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
('GV004', 'MON13', '1', '10', 'A', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
('GV004', 'MON13', '2', '10', 'A', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425'),
('GV005', 'MON13', '3', '10', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
('GV005', 'MON13', '1', '10', 'P', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
('GV005', 'MON13', '2', '10', 'P', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425'),

('GV001', 'MON01', '1', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'), -- Mon Toan
('GV004', 'MON01', '2', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'), -- HK2 - 2024-2025
('GV005', 'MON01', '3', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
('GV002', 'MON01', '1', '11', 'P', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
('GV002', 'MON01', '1', '12', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
('GV003', 'MON01', '2', '12', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
('GV003', 'MON01', '3', '12', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
('GV003', 'MON01', '4', '12', 'A', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
('GV003', 'MON01', '1', '12', 'P', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),
('GV004', 'MON01', '2', '12', 'P', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
('GV004', 'MON01', '1', '10', 'A', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
('GV004', 'MON01', '2', '10', 'A', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),
('GV005', 'MON01', '3', '10', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
('GV005', 'MON01', '1', '10', 'P', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
('GV005', 'MON01', '2', '10', 'P', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),

('GV001', 'MON13', '1', '11', 'A', '2024-2025', '2', '2025-01-02', 1, 1, 'T192425'), -- Mon Tin
('GV004', 'MON13', '2', '11', 'A', '2024-2025', '2', '2025-01-02', 2, 1, 'T192425'), -- HK2 - 2024-2025
('GV005', 'MON13', '3', '11', 'A', '2024-2025', '2', '2025-01-02', 3, 1, 'T192425'),
('GV002', 'MON13', '1', '11', 'P', '2024-2025', '2', '2025-01-02', 4, 1, 'T192425'),
('GV002', 'MON13', '1', '12', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
('GV003', 'MON13', '2', '12', 'A', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
('GV003', 'MON13', '3', '12', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
('GV003', 'MON13', '4', '12', 'A', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
('GV003', 'MON13', '1', '12', 'P', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
('GV004', 'MON13', '2', '12', 'P', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
('GV004', 'MON13', '1', '10', 'A', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
('GV004', 'MON13', '2', '10', 'A', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
('GV005', 'MON13', '3', '10', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
('GV005', 'MON13', '1', '10', 'P', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
('GV005', 'MON13', '2', '10', 'P', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425');

CREATE TABLE vanbanmc (
  VBMC_ID int NOT NULL AUTO_INCREMENT,
  VBMC_File varchar(255) NOT NULL,
  VBMC_GhiChu varchar(255) DEFAULT NULL,
  PRIMARY KEY (VBMC_ID)
)ENGINE=InnoDB;

CREATE TABLE dinhkem (
  VBMC_ID int NOT NULL,
  TKB_ID int NOT NULL,
  PRIMARY KEY (VBMC_ID, TKB_ID),
  FOREIGN KEY (VBMC_ID) REFERENCES vanbanmc (VBMC_ID) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (TKB_ID) REFERENCES thoikhoabieu (TKB_ID) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

CREATE TABLE hinhthucdaybu (
  HTDB_Ma char(5) NOT NULL,
  HTDB_Ten varchar(50) NOT NULL,
  PRIMARY KEY (HTDB_Ma)
)ENGINE=InnoDB;

CREATE TABLE lichdaybu (
  LDB_ID int NOT NULL AUTO_INCREMENT,
  LDB_TietBD int NOT NULL,
  LDB_SoTiet int NOT NULL,
  LDB_Ngay date NOT NULL,
  HTDB_ID char(5) NOT NULL,
  TKB_ID int NOT NULL,
  PRIMARY KEY (LDB_ID),
  FOREIGN KEY (HTDB_ID) REFERENCES hinhthucdaybu (HTDB_Ma) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (TKB_ID) REFERENCES thoikhoabieu (TKB_ID) ON DELETE CASCADE ON UPDATE CASCADE
)ENGINE=InnoDB;

DELIMITER //

CREATE PROCEDURE GenerateSchedule()
BEGIN
    DECLARE week_num INT DEFAULT 2;
    DECLARE week_code VARCHAR(7);
    DECLARE new_date DATE;

    -- Tạo bảng tạm để lưu dữ liệu mẫu
    CREATE TEMPORARY TABLE temp_thoikhoabieu (
        GV_Ma CHAR(5),
        M_Ma CHAR(5),
        L_STTLop VARCHAR(2),
        K_Khoi CHAR(2),
        KH_KyHieu CHAR(1),
        NH_NamHoc CHAR(9),
        HK_HocKy CHAR(1),
        TKB_Ngay DATE,
        TKB_TietBD INT,
        TKB_SoTiet INT,
        T_Ma CHAR(7)
    );

    -- Chèn dữ liệu mẫu cho tuần T012425
    INSERT INTO temp_thoikhoabieu (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma) VALUES
    ('GV001', 'MON01', '1', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
    ('GV004', 'MON01', '2', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
    ('GV005', 'MON01', '3', '11', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
    ('GV002', 'MON01', '1', '11', 'P', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
    ('GV002', 'MON01', '1', '12', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
    ('GV003', 'MON01', '2', '12', 'A', '2024-2025', '1', '2024-08-26', 2, 4, 'T012425'),
    ('GV003', 'MON01', '3', '12', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
    ('GV003', 'MON01', '4', '12', 'A', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
    ('GV003', 'MON01', '1', '12', 'P', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),
    ('GV004', 'MON01', '2', '12', 'P', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
    ('GV004', 'MON01', '1', '10', 'A', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
    ('GV004', 'MON01', '2', '10', 'A', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),
    ('GV005', 'MON01', '3', '10', 'A', '2024-2025', '1', '2024-08-27', 1, 4, 'T012425'),
    ('GV005', 'MON01', '1', '10', 'P', '2024-2025', '1', '2024-08-28', 1, 4, 'T012425'),
    ('GV005', 'MON01', '2', '10', 'P', '2024-2025', '1', '2024-08-29', 1, 4, 'T012425'),
    ('GV001', 'MON13', '1', '11', 'A', '2024-2025', '1', '2024-08-30', 1, 1, 'T012425'),
    ('GV004', 'MON13', '2', '11', 'A', '2024-2025', '1', '2024-08-30', 2, 1, 'T012425'),
    ('GV005', 'MON13', '3', '11', 'A', '2024-2025', '1', '2024-08-30', 3, 1, 'T012425'),
    ('GV002', 'MON13', '1', '11', 'P', '2024-2025', '1', '2024-08-30', 4, 1, 'T012425'),
    ('GV002', 'MON13', '1', '12', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
    ('GV003', 'MON13', '2', '12', 'A', '2024-2025', '1', '2024-08-30', 5, 1, 'T012425'),
    ('GV003', 'MON13', '3', '12', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
    ('GV003', 'MON13', '4', '12', 'A', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
    ('GV003', 'MON13', '1', '12', 'P', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425'),
    ('GV004', 'MON13', '2', '12', 'P', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
    ('GV004', 'MON13', '1', '10', 'A', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
    ('GV004', 'MON13', '2', '10', 'A', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425'),
    ('GV005', 'MON13', '3', '10', 'A', '2024-2025', '1', '2024-08-27', 5, 1, 'T012425'),
    ('GV005', 'MON13', '1', '10', 'P', '2024-2025', '1', '2024-08-28', 5, 1, 'T012425'),
    ('GV005', 'MON13', '2', '10', 'P', '2024-2025', '1', '2024-08-29', 5, 1, 'T012425');

    -- Lặp qua các tuần từ 2 đến 18
    WHILE week_num <= 18 DO
        -- Tạo mã tuần (ví dụ: T022425)
        SET week_code = CONCAT('T', LPAD(week_num, 2, '0'), '2425');

        -- Sử dụng cursor để lặp qua các bản ghi trong bảng tạm
        BEGIN
            DECLARE done INT DEFAULT FALSE;
            DECLARE cur_GV_Ma CHAR(5);
            DECLARE cur_M_Ma CHAR(5);
            DECLARE cur_L_STTLop VARCHAR(2);
            DECLARE cur_K_Khoi CHAR(2);
            DECLARE cur_KH_KyHieu CHAR(1);
            DECLARE cur_NH_NamHoc CHAR(9);
            DECLARE cur_HK_HocKy CHAR(1);
            DECLARE cur_TKB_Ngay DATE;
            DECLARE cur_TKB_TietBD INT;
            DECLARE cur_TKB_SoTiet INT;
            DECLARE cur_T_Ma CHAR(7);

            DECLARE cur CURSOR FOR SELECT * FROM temp_thoikhoabieu;
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

            OPEN cur;

            read_loop: LOOP
                FETCH cur INTO cur_GV_Ma, cur_M_Ma, cur_L_STTLop, cur_K_Khoi, cur_KH_KyHieu, cur_NH_NamHoc, cur_HK_HocKy, cur_TKB_Ngay, cur_TKB_TietBD, cur_TKB_SoTiet, cur_T_Ma;
                IF done THEN
                    LEAVE read_loop;
                END IF;

                -- Tính ngày mới
                SET new_date = DATE_ADD(cur_TKB_Ngay, INTERVAL (week_num - 1) * 7 DAY);

                -- Chèn bản ghi mới vào bảng thoikhoabieu
                INSERT INTO thoikhoabieu (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma)
                VALUES (cur_GV_Ma, cur_M_Ma, cur_L_STTLop, cur_K_Khoi, cur_KH_KyHieu, cur_NH_NamHoc, cur_HK_HocKy, new_date, cur_TKB_TietBD, cur_TKB_SoTiet, week_code);
            END LOOP;

            CLOSE cur;
        END;

        -- Tăng tuần
        SET week_num = week_num + 1;
    END WHILE;

    -- Xóa bảng tạm
    DROP TEMPORARY TABLE temp_thoikhoabieu;
END //

CREATE PROCEDURE GenerateSchedule2()
BEGIN
    DECLARE week_num INT DEFAULT 20;
    DECLARE week_code VARCHAR(7);
    DECLARE new_date DATE;

    -- Tạo bảng tạm để lưu dữ liệu mẫu
    CREATE TEMPORARY TABLE temp_thoikhoabieu2 (
        GV_Ma CHAR(5),
        M_Ma CHAR(5),
        L_STTLop VARCHAR(2),
        K_Khoi CHAR(2),
        KH_KyHieu CHAR(1),
        NH_NamHoc CHAR(9),
        HK_HocKy CHAR(1),
        TKB_Ngay DATE,
        TKB_TietBD INT,
        TKB_SoTiet INT,
        T_Ma CHAR(7)
    );

    -- Chèn dữ liệu mẫu cho tuần T012425
    INSERT INTO temp_thoikhoabieu2 (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma) VALUES
    ('GV001', 'MON01', '1', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'), -- Mon Toan
    ('GV004', 'MON01', '2', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'), -- HK2 - 2024-2025
    ('GV005', 'MON01', '3', '11', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
    ('GV002', 'MON01', '1', '11', 'P', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
    ('GV002', 'MON01', '1', '12', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
    ('GV003', 'MON01', '2', '12', 'A', '2024-2025', '2', '2024-12-30', 2, 4, 'T192425'),
    ('GV003', 'MON01', '3', '12', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
    ('GV003', 'MON01', '4', '12', 'A', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
    ('GV003', 'MON01', '1', '12', 'P', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),
    ('GV004', 'MON01', '2', '12', 'P', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
    ('GV004', 'MON01', '1', '10', 'A', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
    ('GV004', 'MON01', '2', '10', 'A', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),
    ('GV005', 'MON01', '3', '10', 'A', '2024-2025', '2', '2024-12-31', 1, 4, 'T192425'),
    ('GV005', 'MON01', '1', '10', 'P', '2024-2025', '2', '2025-01-01', 1, 4, 'T192425'),
    ('GV005', 'MON01', '2', '10', 'P', '2024-2025', '2', '2025-01-02', 1, 4, 'T192425'),
    ('GV001', 'MON13', '1', '11', 'A', '2024-2025', '2', '2025-01-02', 1, 1, 'T192425'), -- Mon Tin
    ('GV004', 'MON13', '2', '11', 'A', '2024-2025', '2', '2025-01-02', 2, 1, 'T192425'), -- HK2 - 2024-2025
    ('GV005', 'MON13', '3', '11', 'A', '2024-2025', '2', '2025-01-02', 3, 1, 'T192425'),
    ('GV002', 'MON13', '1', '11', 'P', '2024-2025', '2', '2025-01-02', 4, 1, 'T192425'),
    ('GV002', 'MON13', '1', '12', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
    ('GV003', 'MON13', '2', '12', 'A', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
    ('GV003', 'MON13', '3', '12', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
    ('GV003', 'MON13', '4', '12', 'A', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
    ('GV003', 'MON13', '1', '12', 'P', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
    ('GV004', 'MON13', '2', '12', 'P', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
    ('GV004', 'MON13', '1', '10', 'A', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
    ('GV004', 'MON13', '2', '10', 'A', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425'),
    ('GV005', 'MON13', '3', '10', 'A', '2024-2025', '2', '2024-12-31', 5, 1, 'T192425'),
    ('GV005', 'MON13', '1', '10', 'P', '2024-2025', '2', '2025-01-01', 5, 1, 'T192425'),
    ('GV005', 'MON13', '2', '10', 'P', '2024-2025', '2', '2025-01-02', 5, 1, 'T192425');

    -- Lặp qua các tuần từ 20 đến 35
    WHILE week_num <= 35 DO
        -- Tạo mã tuần (ví dụ: T022425)
        SET week_code = CONCAT('T', LPAD(week_num, 2, '0'), '2425');

        -- Sử dụng cursor để lặp qua các bản ghi trong bảng tạm
        BEGIN
            DECLARE done INT DEFAULT FALSE;
            DECLARE cur_GV_Ma CHAR(5);
            DECLARE cur_M_Ma CHAR(5);
            DECLARE cur_L_STTLop VARCHAR(2);
            DECLARE cur_K_Khoi CHAR(2);
            DECLARE cur_KH_KyHieu CHAR(1);
            DECLARE cur_NH_NamHoc CHAR(9);
            DECLARE cur_HK_HocKy CHAR(1);
            DECLARE cur_TKB_Ngay DATE;
            DECLARE cur_TKB_TietBD INT;
            DECLARE cur_TKB_SoTiet INT;
            DECLARE cur_T_Ma CHAR(7);

            DECLARE cur CURSOR FOR SELECT * FROM temp_thoikhoabieu2;
            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

            OPEN cur;

            read_loop: LOOP
                FETCH cur INTO cur_GV_Ma, cur_M_Ma, cur_L_STTLop, cur_K_Khoi, cur_KH_KyHieu, cur_NH_NamHoc, cur_HK_HocKy, cur_TKB_Ngay, cur_TKB_TietBD, cur_TKB_SoTiet, cur_T_Ma;
                IF done THEN
                    LEAVE read_loop;
                END IF;

                -- Tính ngày mới
                SET new_date = DATE_ADD(cur_TKB_Ngay, INTERVAL (week_num - 1) * 7 DAY);

                -- Chèn bản ghi mới vào bảng thoikhoabieu
                INSERT INTO thoikhoabieu (GV_Ma, M_Ma, L_STTLop, K_Khoi, KH_KyHieu, NH_NamHoc, HK_HocKy, TKB_Ngay, TKB_TietBD, TKB_SoTiet, T_Ma)
                VALUES (cur_GV_Ma, cur_M_Ma, cur_L_STTLop, cur_K_Khoi, cur_KH_KyHieu, cur_NH_NamHoc, cur_HK_HocKy, new_date, cur_TKB_TietBD, cur_TKB_SoTiet, week_code);
            END LOOP;

            CLOSE cur;
        END;

        -- Tăng tuần
        SET week_num = week_num + 1;
    END WHILE;

    -- Xóa bảng tạm
    DROP TEMPORARY TABLE temp_thoikhoabieu2;
END //

DELIMITER ;
CALL GenerateSchedule();
CALL GenerateSchedule2();
DROP PROCEDURE IF EXISTS GenerateSchedule;
DROP PROCEDURE IF EXISTS GenerateSchedule2;

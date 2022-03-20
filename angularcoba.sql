/*
 Navicat Premium Data Transfer

 Source Server         : xampp
 Source Server Type    : MySQL
 Source Server Version : 100422
 Source Host           : localhost:3306
 Source Schema         : angularcoba

 Target Server Type    : MySQL
 Target Server Version : 100422
 File Encoding         : 65001

 Date: 02/03/2022 19:01:09
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for m_barang
-- ----------------------------
DROP TABLE IF EXISTS `m_barang`;
CREATE TABLE `m_barang`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `m_kategori_id` int NULL DEFAULT NULL,
  `stock` int NOT NULL DEFAULT 0,
  `harga_jual` int NULL DEFAULT NULL,
  `harga_beli` int NULL DEFAULT NULL,
  `keterangan` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `tanggal` date NULL DEFAULT NULL,
  `is_deleted` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_barang
-- ----------------------------
INSERT INTO `m_barang` VALUES (5, 'A', 3, 14, 1000, 4000, 'asdasd', NULL, '2021-04-23', 0);
INSERT INTO `m_barang` VALUES (6, 'B', 2, 54, 2000, 3000, 'asdasdas', '<p><span class=\"marker\"><em><strong>tes deksripsi</strong></em></span></p>\n', '2021-04-01', 0);
INSERT INTO `m_barang` VALUES (7, 'C', 1, 85, 2000, 5000, 'asdasd', '<p><strong>asdasdasd</strong></p>\n', '2021-04-01', 0);
INSERT INTO `m_barang` VALUES (8, 'ZEPRI ADI RAFI\'I', 2, 17, 3000, 2500, 'asdasdsad', '<p>asdasdasd</p>\n', '2021-04-01', 0);

-- ----------------------------
-- Table structure for m_customer
-- ----------------------------
DROP TABLE IF EXISTS `m_customer`;
CREATE TABLE `m_customer`  (
  `id_status` int NOT NULL AUTO_INCREMENT,
  `status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_status`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_customer
-- ----------------------------
INSERT INTO `m_customer` VALUES (1, 'Member');
INSERT INTO `m_customer` VALUES (2, 'Non-Member');

-- ----------------------------
-- Table structure for m_karyawan
-- ----------------------------
DROP TABLE IF EXISTS `m_karyawan`;
CREATE TABLE `m_karyawan`  (
  `id_karyawan` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `s_ngaji` int NULL DEFAULT 0,
  `s_kehadiran` int NULL DEFAULT 0,
  `s_rekruit` int NULL DEFAULT 0,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id_karyawan`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_karyawan
-- ----------------------------
INSERT INTO `m_karyawan` VALUES (1, 'Yokevin Febrian', 1, 0, 1, 0);
INSERT INTO `m_karyawan` VALUES (2, 'Budi', 1, 1, 1, 0);

-- ----------------------------
-- Table structure for m_kategori
-- ----------------------------
DROP TABLE IF EXISTS `m_kategori`;
CREATE TABLE `m_kategori`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_kategori` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_kategori
-- ----------------------------
INSERT INTO `m_kategori` VALUES (1, 'Makanan');
INSERT INTO `m_kategori` VALUES (2, 'Minuman');
INSERT INTO `m_kategori` VALUES (3, 'Snack');

-- ----------------------------
-- Table structure for m_konsumen
-- ----------------------------
DROP TABLE IF EXISTS `m_konsumen`;
CREATE TABLE `m_konsumen`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `foto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `alamat` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `no_telp` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_deleted` int NOT NULL DEFAULT 0,
  `status` int NULL DEFAULT 0,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_konsumen
-- ----------------------------
INSERT INTO `m_konsumen` VALUES (5, 'Megawati', NULL, 'Jl. Ki Ageng Gribig', '087982719738', 0, 1, 'megawatiku90@gmail.com');
INSERT INTO `m_konsumen` VALUES (6, 'Nur Hidayat', NULL, 'Jl. Kayu Tangan', '087983792818', 0, 0, 'nuhidayatul21@gmail.com');

-- ----------------------------
-- Table structure for m_pembayaran
-- ----------------------------
DROP TABLE IF EXISTS `m_pembayaran`;
CREATE TABLE `m_pembayaran`  (
  `id_pembayaran` int NOT NULL AUTO_INCREMENT,
  `jenis_pembayaran` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_pembayaran`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_pembayaran
-- ----------------------------
INSERT INTO `m_pembayaran` VALUES (1, 'Tunai');
INSERT INTO `m_pembayaran` VALUES (2, 'Non-Tunai');

-- ----------------------------
-- Table structure for m_produk
-- ----------------------------
DROP TABLE IF EXISTS `m_produk`;
CREATE TABLE `m_produk`  (
  `id_produk` int NOT NULL AUTO_INCREMENT,
  `id_outlet` int NOT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `harga` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `id_kategori` int NOT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `toping` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `foto` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `deskripsi` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `status` int NULL DEFAULT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id_produk`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 112 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_produk
-- ----------------------------
INSERT INTO `m_produk` VALUES (1, 1, 'Nasi Goreng', '11000', 1, 0, 'Telor,2000', 'assets/img/upload_produk/61d7ec6d9277c.png', 'Sego', 0, '1,200');
INSERT INTO `m_produk` VALUES (2, 1, 'Ice Kopi Susu', '15000', 2, 0, 'Boba,1000|Coffee Jelly,1000', 'assets/img/upload_produk/61d7eb02a2331.png', '<p>Kopi Susu Nih Boss</p>\n', 0, NULL);
INSERT INTO `m_produk` VALUES (3, 1, 'Nasi Ayam Katsuku', '17000', 1, 0, 'Mayo,2000', 'assets/img/upload_produk/61d7ecece9ea8.png', '<p>Katsu Nih Boss</p>\n', 0, '1,200');
INSERT INTO `m_produk` VALUES (4, 1, 'Mie Goreng', '10000', 1, 1, 'Telur', NULL, NULL, 0, '0');
INSERT INTO `m_produk` VALUES (111, 1, 'mie goreng21', '11000', 3, 1, 'telor,20000', 'assets/img/upload_produk/61f36b26655e9.png', 'sego', 1, '1,200');

-- ----------------------------
-- Table structure for m_promo
-- ----------------------------
DROP TABLE IF EXISTS `m_promo`;
CREATE TABLE `m_promo`  (
  `id_promo` int NOT NULL AUTO_INCREMENT,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tipe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `diskon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `harga` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `kadaluarsa` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `gambar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_deleted` int NULL DEFAULT 0,
  PRIMARY KEY (`id_promo`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_promo
-- ----------------------------
INSERT INTO `m_promo` VALUES (1, 'Hari Kemerdekaan', '2', '', '12000', '2', 'assets/img/upload_produk/61f287e61d300.png', 0);
INSERT INTO `m_promo` VALUES (2, 'Hari Sumpah Pemuda', '1', '10', '', '1', 'assets/img/upload_produk/61f1cfb156c28.png', 1);
INSERT INTO `m_promo` VALUES (3, 'Makan Gratis', '2', NULL, '20000', '1', 'assets/img/upload_produk/61f21fa472fce.png', 0);
INSERT INTO `m_promo` VALUES (4, 'idul fitri', '2', '', '13000', '2', 'assets/img/upload_produk/61f36bd848fdc.png', 0);

-- ----------------------------
-- Table structure for m_supplier
-- ----------------------------
DROP TABLE IF EXISTS `m_supplier`;
CREATE TABLE `m_supplier`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `nama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `alamat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `no_telp` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_deleted` tinyint NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_supplier
-- ----------------------------
INSERT INTO `m_supplier` VALUES (1, 'Sup01', 'Supplir01', 'Malang', '09373733', 1);
INSERT INTO `m_supplier` VALUES (2, 'Sup02', 'Supplier02', 'Malang', '0875373637833', 0);
INSERT INTO `m_supplier` VALUES (4, 'ahmad01', 'ahmad', 'malang', '937336383', 1);
INSERT INTO `m_supplier` VALUES (5, 'ahmad01', 'ahmad', 'malang', '937336383', 1);
INSERT INTO `m_supplier` VALUES (6, 'ahmad01', 'ahmad', 'malang', '937336383', 1);
INSERT INTO `m_supplier` VALUES (7, 'ahmad01', 'ahmad', 'malang', '937336383', 0);
INSERT INTO `m_supplier` VALUES (8, 'ahmad01', 'ahmad', 'malang', '937336383', 0);

-- ----------------------------
-- Table structure for m_user
-- ----------------------------
DROP TABLE IF EXISTS `m_user`;
CREATE TABLE `m_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `nama` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `jenis_kelamin` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `tempat_lahir` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `tanggal_lahir` date NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `alamat` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `telepon` varchar(25) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `username` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `provinsi_id` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `kabupaten_id` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `kecamatan_id` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `desa_id` varchar(45) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `akses` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `akses_wilayah` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `m_jabatan_id` int NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  `created_at` int NULL DEFAULT NULL,
  `created_by` int NULL DEFAULT NULL,
  `modified_at` int NULL DEFAULT NULL,
  `modified_by` int NULL DEFAULT NULL,
  `foto` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 102 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = COMPACT;

-- ----------------------------
-- Records of m_user
-- ----------------------------
INSERT INTO `m_user` VALUES (34, 'u2', 'admin', NULL, NULL, NULL, 'zepri@gmail.com', 'malang', '0858503', 'admin', 'd033e22ae348aeb5660fc2140aec35850c4da997', NULL, NULL, NULL, NULL, '{\"laporan\":true,\"transaksi\":true,\"pengguna\":true,\"jabatan\":true,\"petani\":true,\"supplier\":true,\"bahan_penunjang\":true,\"pandega\":true,\"hatchery\":true,\"is_admin\":false,\"harga\":true,\"size\":true,\"spesies\":true,\"pembenihan\":true,\"budidaya\":false,\"tambak\":true,\"pernyataan\":true,\"kode_form\":true,\"kesepakatan\":true,\"tes_rasa\":true,\"setting_aplikasi\":true,\"grade\":true,\"rm\":true,\"status\":true,\"pengiriman_link\":true,\"plan_order\":true,\"jadwal_kerja_pegawai\":true,\"list_jadwal_kerja_pegawai\":true,\"audit_approval\":true,\"form1\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form2\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form3\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form4\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form5\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form6\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form7\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form8\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form10\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"master_list_tambak\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"daftar_tambak_panen\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pengajuan_tes_rasa\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"kunjungan_ics\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_pembenihan\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_tambak_echoshrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"profile_tambak_echosrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_petani_echoshrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"biodata_petani\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"biodata_penjaga_tambak\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"rekap_data_benur\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pembelian_insentif\":{\"copy\":true,\"print\":false,\"lihat\":true,\"approval\":false},\"rekap_pengiriman_udang\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"produktifitas_budidaya\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"komparansi_penlu\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pengajuan_raw_material\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"realisasi_raw_material\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"balance_report\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"balance_report_monthly\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"nota_pembelian\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"nota_penerimaan\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"hasil_panen\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"hakakses\":true}', '3515', 1, 0, 1601984938, 0, 1617109461, 34, NULL);
INSERT INTO `m_user` VALUES (92, NULL, 'tes', NULL, NULL, NULL, 'tes@gmail.com', 'Rt/Rw 02 desa pinggirsari kecamatan ngantru ka.Tulungagung', '87637353', 'tes', 'd1c056a983786a38ca76a05cda240c7b86d77136', NULL, NULL, NULL, NULL, '{\"laporan\":true,\"transaksi\":true,\"pengguna\":true,\"jabatan\":true,\"petani\":true,\"supplier\":true,\"bahan_penunjang\":true,\"pandega\":true,\"hatchery\":true,\"is_admin\":true,\"harga\":true,\"size\":true,\"spesies\":true,\"pembenihan\":true,\"budidaya\":false,\"tambak\":true,\"pernyataan\":true,\"kode_form\":true,\"kesepakatan\":true,\"tes_rasa\":true,\"setting_aplikasi\":true,\"grade\":true,\"rm\":true,\"status\":true,\"pengiriman_link\":true,\"plan_order\":true,\"jadwal_kerja_pegawai\":true,\"list_jadwal_kerja_pegawai\":true,\"audit_approval\":true,\"form1\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form2\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form3\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form4\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form5\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form6\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form7\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form8\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"form10\":{\"copy\":true,\"print\":true,\"input\":true,\"lihat\":true,\"approval\":true},\"master_list_tambak\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"daftar_tambak_panen\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pengajuan_tes_rasa\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"kunjungan_ics\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_pembenihan\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_tambak_echoshrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"profile_tambak_echosrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"list_petani_echoshrimps\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"biodata_petani\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"biodata_penjaga_tambak\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"rekap_data_benur\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pembelian_insentif\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"rekap_pengiriman_udang\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"produktifitas_budidaya\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"komparansi_penlu\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"pengajuan_raw_material\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"realisasi_raw_material\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"balance_report\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"balance_report_monthly\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"nota_pembelian\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"nota_penerimaan\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"hasil_panen\":{\"copy\":true,\"print\":true,\"lihat\":true,\"approval\":true},\"hakakses\":true}', '3515', 2, 0, 1615175999, 34, 1641086576, 99, NULL);
INSERT INTO `m_user` VALUES (93, NULL, 'zepri', NULL, NULL, NULL, NULL, NULL, NULL, 'zepri', '60caba9bbe8a0a271ec15377b70674a270a96a91', NULL, NULL, NULL, NULL, '{\"barang\":true,\"pengguna\":true}', NULL, NULL, 1, 1617766520, 34, 1617766554, 34, NULL);
INSERT INTO `m_user` VALUES (94, NULL, 'zepri', NULL, NULL, NULL, NULL, NULL, NULL, 'zepri', '60caba9bbe8a0a271ec15377b70674a270a96a91', NULL, NULL, NULL, NULL, '{\"barang\":true,\"pengguna\":true}', NULL, NULL, 0, 1617766544, 34, 1617766544, 34, NULL);
INSERT INTO `m_user` VALUES (95, NULL, 'as', NULL, NULL, NULL, NULL, NULL, NULL, 'as', 'df211ccdd94a63e0bcb9e6ae427a249484a49d60', NULL, NULL, NULL, NULL, '{\"barang\":true,\"pengguna\":true}', NULL, NULL, 1, 1618910992, 34, 1640867655, 0, NULL);
INSERT INTO `m_user` VALUES (97, NULL, 'Belaku', '1', NULL, NULL, 'bela12@yahoo.com', 'kdiri', '087546', 'bela', '50eb453581f9126f30d21821445c2cd75d2b4165', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1640866971, 0, 1640867513, 0, NULL);
INSERT INTO `m_user` VALUES (98, NULL, 'yoke', NULL, NULL, NULL, 'yoke@gmail.com', NULL, NULL, 'yoke', '77b3a2b07f4805405b8e4ab71a9c738236ae7d24', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1640919768, 0, 1641174317, 0, NULL);
INSERT INTO `m_user` VALUES (99, NULL, 'kuntat', '1', 'kediri', NULL, 'kun@gmail.co', 'nbutu', '0987', 'kun', 'da39a3ee5e6b4b0d3255bfef95601890afd80709', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1641084885, 0, 1641096631, 99, NULL);
INSERT INTO `m_user` VALUES (100, NULL, 'meyer ganteng', '1', NULL, NULL, 'vanmeyerku@gmail.com', 'BTU', '087818412104', 'vanmeyer21', '1dcd4a8bef12f99f263dc0b5e120a720d5ec6d76', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1641128432, 34, 1641166697, 34, NULL);
INSERT INTO `m_user` VALUES (101, NULL, 'Yokevin Febrian Van', '1', NULL, NULL, 'kevinmeyer@yahoo.co.id', 'Perumahan', '0896713263', 'kevinmeyer', '1501c8bb743cb71eb38c26b68194f23d76e76bf0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1641174561, 0, 1641214301, 34, NULL);

-- ----------------------------
-- Table structure for m_voucher
-- ----------------------------
DROP TABLE IF EXISTS `m_voucher`;
CREATE TABLE `m_voucher`  (
  `id_voucher` int NOT NULL AUTO_INCREMENT,
  `id_customer` int NULL DEFAULT NULL,
  `tgl_awal` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tgl_akhir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `jumlah` int NULL DEFAULT NULL,
  `catatan` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `v_promo_id` int NULL DEFAULT NULL,
  `is_deleted` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id_voucher`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of m_voucher
-- ----------------------------
INSERT INTO `m_voucher` VALUES (10, 6, '2022-01-27', '2022-01-29', 2, 'Coba', 1, 1);
INSERT INTO `m_voucher` VALUES (11, 6, '2022-01-27', '2022-01-29', 1, 'Gratis', 1, 0);
INSERT INTO `m_voucher` VALUES (12, 5, '2022-01-28', '2022-01-30', 1, 'voucher', 4, 0);

-- ----------------------------
-- Table structure for t_pembelian
-- ----------------------------
DROP TABLE IF EXISTS `t_pembelian`;
CREATE TABLE `t_pembelian`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `m_supplier_id` int NULL DEFAULT NULL,
  `tanggal` date NOT NULL,
  `total` double NOT NULL,
  `is_deleted` int NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_pembelian
-- ----------------------------
INSERT INTO `t_pembelian` VALUES (3, 'PEM210400003', 1, '2021-06-01', 124000, 0);
INSERT INTO `t_pembelian` VALUES (4, 'PEM210400004', 1, '2021-06-02', 50000, 0);
INSERT INTO `t_pembelian` VALUES (5, 'PEM210700005', 8, '2021-07-30', 16200, 0);
INSERT INTO `t_pembelian` VALUES (6, 'PEM210800006', 2, '2021-08-03', 2700, 0);
INSERT INTO `t_pembelian` VALUES (7, 'PEM210800007', 2, '2021-08-03', 59500, 0);
INSERT INTO `t_pembelian` VALUES (8, 'PEM210800008', 2, '2021-08-04', 120500, 0);

-- ----------------------------
-- Table structure for t_pembelian_det
-- ----------------------------
DROP TABLE IF EXISTS `t_pembelian_det`;
CREATE TABLE `t_pembelian_det`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `t_pembelian_id` int NULL DEFAULT NULL,
  `jumlah_barang` int NULL DEFAULT NULL,
  `m_barang_id` int NULL DEFAULT NULL,
  `harga` int NOT NULL,
  `diskon` int NOT NULL,
  `jumlah_diskon` int NOT NULL,
  `total_item` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_pembelian_det
-- ----------------------------
INSERT INTO `t_pembelian_det` VALUES (1, 3, 10, 7, 5000, 0, 0, 50000);
INSERT INTO `t_pembelian_det` VALUES (2, 3, 10, 6, 3000, 0, 0, 30000);
INSERT INTO `t_pembelian_det` VALUES (3, 4, 10, 7, 5000, 0, 0, 50000);
INSERT INTO `t_pembelian_det` VALUES (4, 5, 3, 7, 5000, 10, 1500, 13500);
INSERT INTO `t_pembelian_det` VALUES (5, 5, 1, 6, 3000, 10, 300, 2700);
INSERT INTO `t_pembelian_det` VALUES (6, 7, 10, 7, 5000, 0, 0, 50000);
INSERT INTO `t_pembelian_det` VALUES (7, 7, 1, 8, 2500, 0, 0, 2500);
INSERT INTO `t_pembelian_det` VALUES (8, 7, 1, 6, 3000, 0, 0, 3000);
INSERT INTO `t_pembelian_det` VALUES (9, 7, 1, 5, 4000, 0, 0, 4000);
INSERT INTO `t_pembelian_det` VALUES (10, 3, 11, 5, 4000, 0, 0, 44000);
INSERT INTO `t_pembelian_det` VALUES (11, 8, 13, 8, 2500, 0, 0, 32500);
INSERT INTO `t_pembelian_det` VALUES (12, 8, 10, 7, 5000, 0, 0, 50000);
INSERT INTO `t_pembelian_det` VALUES (13, 8, 6, 6, 3000, 0, 0, 18000);
INSERT INTO `t_pembelian_det` VALUES (14, 8, 5, 5, 4000, 0, 0, 20000);
INSERT INTO `t_pembelian_det` VALUES (15, 6, 1, 6, 3000, 10, 300, 2700);

-- ----------------------------
-- Table structure for t_transaksi
-- ----------------------------
DROP TABLE IF EXISTS `t_transaksi`;
CREATE TABLE `t_transaksi`  (
  `id_transaksi` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `tanggal` date NULL DEFAULT NULL,
  `id_customer` int NULL DEFAULT NULL,
  `jenis_pembayaran` int NULL DEFAULT NULL,
  `is_deleted` tinyint NULL DEFAULT 0,
  `total` int NULL DEFAULT NULL,
  `status` int NULL DEFAULT NULL,
  `diskon` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_transaksi`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_transaksi
-- ----------------------------
INSERT INTO `t_transaksi` VALUES (1, 'PEM210400003', '2022-01-04', 5, 1, 0, 43000, 2, 10);
INSERT INTO `t_transaksi` VALUES (2, 'PEM210400004', '2022-01-04', 5, 1, 0, 51000, 2, 0);
INSERT INTO `t_transaksi` VALUES (9, 'PEM210400005', '2022-01-06', 5, 2, 0, 149000, 2, 0);
INSERT INTO `t_transaksi` VALUES (10, 'PEM2104000010', '2021-12-01', 5, 1, 0, 170000, 2, 0);
INSERT INTO `t_transaksi` VALUES (11, 'PEM2104000011', '2022-01-06', 6, 1, 0, 17000, 2, 0);
INSERT INTO `t_transaksi` VALUES (13, 'PEM2104000012', '2021-11-01', 5, 1, 0, 43000, 2, 10);
INSERT INTO `t_transaksi` VALUES (14, 'PEM2104000013', '2021-12-10', 5, 1, 0, 43000, 2, 10);
INSERT INTO `t_transaksi` VALUES (15, 'PEM2104000014', '2021-12-17', 5, 1, 0, 43000, 2, 10);
INSERT INTO `t_transaksi` VALUES (18, 'PEM2104000015', '2021-10-15', 5, 1, 0, 170000, 2, 0);

-- ----------------------------
-- Table structure for t_transaksi_det
-- ----------------------------
DROP TABLE IF EXISTS `t_transaksi_det`;
CREATE TABLE `t_transaksi_det`  (
  `id_detail` int NOT NULL AUTO_INCREMENT,
  `kode` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `id_produk` int NULL DEFAULT NULL,
  `qty` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_detail`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of t_transaksi_det
-- ----------------------------
INSERT INTO `t_transaksi_det` VALUES (18, 'PEM210400003', 1, 1);
INSERT INTO `t_transaksi_det` VALUES (19, 'PEM210400003', 3, 1);
INSERT INTO `t_transaksi_det` VALUES (20, 'PEM210400003', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (21, 'PEM210400004', 3, 3);
INSERT INTO `t_transaksi_det` VALUES (22, 'PEM210400005', 3, 4);
INSERT INTO `t_transaksi_det` VALUES (23, 'PEM210400005', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (24, 'PEM210400005', 1, 6);
INSERT INTO `t_transaksi_det` VALUES (25, 'PEM2104000010', 3, 10);
INSERT INTO `t_transaksi_det` VALUES (26, 'PEM2104000010', 1, 5);
INSERT INTO `t_transaksi_det` VALUES (27, 'PEM2104000010', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (29, 'PEM2104000011', 3, 1);
INSERT INTO `t_transaksi_det` VALUES (31, 'PEM2104000012', 1, 1);
INSERT INTO `t_transaksi_det` VALUES (32, 'PEM2104000012', 3, 1);
INSERT INTO `t_transaksi_det` VALUES (33, 'PEM2104000012', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (34, 'PEM2104000013', 1, 1);
INSERT INTO `t_transaksi_det` VALUES (35, 'PEM2104000013', 3, 1);
INSERT INTO `t_transaksi_det` VALUES (36, 'PEM2104000013', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (37, 'PEM2104000014', 1, 1);
INSERT INTO `t_transaksi_det` VALUES (38, 'PEM2104000014', 3, 1);
INSERT INTO `t_transaksi_det` VALUES (39, 'PEM2104000014', 2, 1);
INSERT INTO `t_transaksi_det` VALUES (40, 'PEM2104000015', 3, 10);
INSERT INTO `t_transaksi_det` VALUES (41, 'PEM2104000015', 1, 5);
INSERT INTO `t_transaksi_det` VALUES (42, 'PEM2104000015', 2, 1);

SET FOREIGN_KEY_CHECKS = 1;

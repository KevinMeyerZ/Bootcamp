<?php
use Service\Db;
use Service\Landa;

$app->post('/dashboard/hari_ini',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d');

    $data = $db->select('sum(total) as total_hari')
    ->from('t_transaksi')
    ->where('tanggal','=',$date);

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/dashboard/bulan_ini',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d');

    $data = $db->select('MONTHNAME(tanggal),sum(total) as bulan_ini')
    ->from('t_transaksi')
    ->groupBy('YEAR(tanggal), MONTH(tanggal)');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/dashboard/item_terjual',function ($request,$response){
    $db = Db::db();

    $data = $db->select('sum(t_transaksi_det.qty) as total_terjual')
    ->from('t_transaksi')
    ->leftJoin('t_transaksi_det','t_transaksi.kode = t_transaksi_det.kode');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/dashboard/best_seller',function ($request,$response){
    $db = Db::db();

    $data = $db->select('m_produk.nama,sum(t_transaksi_det.qty) as best_seller')
    ->from('t_transaksi')
    ->leftJoin('t_transaksi_det','t_transaksi.kode = t_transaksi_det.kode')
    ->leftJoin('m_produk','t_transaksi_det.id_produk = m_produk.id_produk')
    ->groupBy('t_transaksi_det.id_produk')
    ->orderBy('best_seller DESC')
    ->limit(2);

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/dashboard/pie_chart',function ($request,$response){
    $db = Db::db();

    $data = $db->select('m_kategori.nama_kategori,count(m_produk.id_kategori) as jumlah')
    ->from('m_produk')
    ->leftJoin('m_kategori','m_produk.id_kategori = m_kategori.id')
    ->groupBy('m_produk.id_kategori');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/dashboard/bar_chart',function ($request,$response){
    $db = Db::db();

    $data = $db->select('DAYNAME(t_transaksi.tanggal) as hari,sum(t_transaksi_det.qty) as jumlah')
    ->from('t_transaksi')
    ->leftJoin('t_transaksi_det','t_transaksi_det.kode = t_transaksi.kode')
    ->leftJoin('m_produk','t_transaksi_det.id_produk = m_produk.id_produk')
    ->leftJoin('m_kategori','m_produk.id_kategori = m_kategori.id')
    ->groupBy('YEAR(t_transaksi.tanggal), MONTH(t_transaksi.tanggal), DAY(t_transaksi.tanggal)');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});
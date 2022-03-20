<?php
use Service\Db;
use Service\Landa;


$app->post('/laporan_penjualan/kasir',function ($request,$response){
    $db = Db::db();

    $data = $db->select('*')
    ->from('m_user');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/laporan_penjualan/jenis_pembayaran',function ($request,$response){
    $db = Db::db();

    $data = $db->select('*')
    ->from('m_pembayaran');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});
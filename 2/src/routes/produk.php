<?php
use Service\Db;
use Service\Landa;

$app->post('/produk/data_produk',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    if(empty($params['id_produk'])){
        $data = $db->select('*')
        ->from('m_produk');
    }else{
        $data = $db->select('*')
        ->from('m_produk')
        ->where('m_produk.id_produk','=', $params['id_produk']);
    }

    $model = $data->findAll();


    return successResponse($response, [
        'user' => $model,
        'massage' => 'Data!'
    ]);
});
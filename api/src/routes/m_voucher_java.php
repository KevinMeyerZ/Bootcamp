<?php
use Service\Db;
use Service\Landa;

$app->get('/m_voucher_java/list_promo',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_promo')
    ->where('is_deleted','=', 0)
    ->andwhere('tipe','=', 'Voucher');

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'nama') {
                $data->where('m_promo.nama','LIKE',$value);
            }
            if ($key == 'tipe') {
                $data->where('m_promo.tipe','LIKE',$value);
            }
        }
    }

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model,
        'massage' => 'Berhasil !!'
    ]);
});

$app->get('/m_voucher_java/list_voucher',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('m_customer.id as id_customer,m_customer.nama as nama_customer, m_promo.id as id_promo, m_promo.nama as nama_promo, m_promo.harga, m_promo.kadaluarsa, m_promo.deskripsi, m_promo.foto, m_voucher.id as id_voucher, m_voucher.tgl_awal, m_voucher.tgl_akhir, m_voucher.jumlah, m_voucher.catatan')
    ->from('m_voucher')
    ->leftJoin('m_customer','m_voucher.m_customer_id = m_customer.id')
    ->leftJoin('m_promo','m_voucher.m_promo_id = m_promo.id')
    ->where('m_voucher.is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'customer') {
                $data->where('m_customer.nama','LIKE',$value);
            }
            if ($key == 'voucher') {
                $data->where('m_voucher.m_promo_id','LIKE',$value);
            }
        }
    }

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    $model = $data->findAll();
    $totalItems = $data->count(); 


    return successResponse($response, [
        'list' => $model,
        'totalItems' => $totalItems
    ]);
});

$app->post('/m_voucher_java/hapus_voucher',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_voucher');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id_hapus =$input['id'];

    for($x=0; $x<count($model); $x++){
        if($model[$x]->id == $id_hapus){
            $h_hapus = $model[$x];
        }else{
            $h_hapus2 = '';
        }
    }

    if($h_hapus == null){
        $output = 'Data tidak ditemukan !!';
    }else{
        $hapus = $db->update('m_voucher',['is_deleted' => 1],['id' => $h_hapus->id]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->get('/m_voucher_java/customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_customer')
    ->where('m_customer.is_deleted','=', 0);

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model,
        'massage' => 'Berhasil !!'
    ]);
});

$app->post('/m_voucher_java/tambah_voucher',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();

    $m_customer_id     =$params['m_customer_id'];
    $m_promo_id        =$params['m_promo_id'];    
    $tgl_awal          =$params['tgl_awal'];
    $tgl_akhir         =$params['tgl_akhir'];
    $jumlah            =$params['jumlah'];
    $catatan           =$params['catatan'];
    

    $data_akhir = $db->insert('m_voucher', $params);
    $hasil_output = 'Berhasil Input Produk !!';

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output,

  ]);
});

$app->post('/m_voucher_java/update_voucher',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_voucher');

    $model = $data->findAll();

    $input = $request->getParsedBody();
  
    $id                =$input['id'];
    $m_customer_id       =$input['m_customer_id'];
    $m_promo_id        = $input['m_promo_id'];
    $tgl_awal          =$input['tgl_awal'];
    $tgl_akhir         =$input['tgl_akhir'];
    $jumlah            = $input['jumlah'];
    $catatan           = $input['catatan'];

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('m_voucher',['m_customer_id' => $m_customer_id,'m_promo_id' => $m_promo_id, 'tgl_awal' => $tgl_awal, 'tgl_akhir' => $tgl_akhir, 'jumlah' => $jumlah,'catatan' => $catatan],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id
        ]);
});
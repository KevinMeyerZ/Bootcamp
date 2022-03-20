<?php
use Service\Db;
use Service\Landa;

$app->post('/b_voucher/tambah_promo',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();

    $folderPath = "assets/img/upload_produk/";

    $image_parts = explode(";base64,", $params['fileSource']);

    $image_type_aux = explode("image/", $image_parts[0]);

    $image_type = $image_type_aux[1];

    $image_base64 = base64_decode($image_parts[1]);

    $file = $folderPath . uniqid() . '.png';

    compress($params['fileSource'], $file, 50);

    $nama              =$params['nama'];
    $tipe              =$params['tipe'];
    $id_kategori       =$params['diskon'];
    $harga             =$params['harga'];
    $kadaluarsa        =$params['kadaluarsa'];
    $params['gambar']  =$file;        


    if($nama == null){
        $outputc = "Eror";
    }else{
        $outputc = 1;
    }

    if($outputc == 1){
        $data_akhir = $db->insert('m_promo', $params);
        $hasil_output = 'Berhasil Input Produk !!';
    }else{
        $hasil_output = $outputc;
    }

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output,

  ]);
});

$app->post('/b_voucher/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_promo');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id_hapus =$input['id'];

    for($x=0; $x<count($model); $x++){
        if($model[$x]->id_promo == $id_hapus){
            $h_hapus = $model[$x];
        }else{
            $h_hapus2 = '';
        }
    }

    if($h_hapus == null){
        $output = 'Data tidak ditemukan !!';
    }else{
        $hapus = $db->update('m_promo',['is_deleted' => 1],['id_promo' => $h_hapus->id_promo]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->post('/b_voucher/customer',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_konsumen');

    $model = $data->findAll();

    $input = $request->getParsedBody();

  
    $id                =$input['id'];
    $status              =$input['status'];

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
        $update = $db->update('m_konsumen',['status' => $status],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->get('/b_voucher/list_promo',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_promo')
    ->where('is_deleted','=', 0);

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

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    $model = $data->findAll();
    $totalItems = $data->count(); 


    return successResponse($response, [
        'user' => $model,
        'totalItems' => $totalItems
    ]);
});

$app->post('/b_voucher/tambah_voucher',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();

    $id_customer       =$params['id_customer'];
    $tgl_awal          =$params['tgl_awal'];
    $tgl_akhir         =$params['tgl_akhir'];
    $jumlah            =$params['jumlah'];
    $catatan           =$params['catatan'];
    $v_promo_id        =$params['v_promo_id'];    

    $date1 = str_replace('-', '/', $tgl_awal);
    $date = date('Y-m-d', strtotime($date1 . "+".$tgl_akhir." days"));

    $params['tgl_akhir'] = $date;

    $data_akhir = $db->insert('m_voucher', $params);
    $hasil_output = 'Berhasil Input Produk !!';

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output,

  ]);
});

$app->get('/b_voucher/list_voucher',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('m_voucher.id_voucher,m_voucher.id_customer,m_konsumen.nama AS nama_customer,m_promo.nama AS nama_promo,m_voucher.jumlah,m_voucher.tgl_awal,m_voucher.tgl_akhir,m_voucher.catatan,m_voucher.v_promo_id, m_promo.harga AS nominal, m_promo.gambar')
    ->from('m_voucher')
    ->leftJoin('m_konsumen','m_voucher.id_customer = m_konsumen.id')
    ->leftJoin('m_promo','m_voucher.v_promo_id = m_promo.id_promo')
    ->where('m_voucher.is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'customer') {
                $data->where('m_konsumen.nama','LIKE',$value);
            }
            if ($key == 'voucher') {
                $data->where('m_voucher.v_promo_id','LIKE',$value);
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
        'user' => $model,
        'totalItems' => $totalItems
    ]);
});

$app->post('/b_voucher/update_promo',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_promo');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    if($input['fileSource'] == null){
        $outputfoto = 'Foto tetap';
    }else{
        $folderPath = "assets/img/upload_produk/";
        $image_parts = explode(";base64,", $input['fileSource']);
        $image_type_aux = explode("image/", $image_parts[0]);
        $image_type = $image_type_aux[1];
        $image_base64 = base64_decode($image_parts[1]);
        $file = $folderPath . uniqid() . '.png';
        compress($input['fileSource'], $file, 50);
    }
  
    $id                =$input['id'];
    $nama              =$input['nama'];
    $tipe              =$input['tipe'];
    $diskon            = $input['diskon'];
    $harga             = $input['harga'];
    $kadaluarsa        = $input['kadaluarsa'];
    $input['gambar']   = $file;


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_promo == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        if(isset($input['fileSource'])&& !empty($input['fileSource'])){
            $update = $db->update('m_promo',['nama' => $nama, 'tipe' => $tipe, 'diskon' => $diskon, 'harga' => $harga,'kadaluarsa' => $kadaluarsa,'gambar' => $file],['id_promo' => $data_update->id_promo]);
            $h_id = 'Data Berhasil di Update!!';
        }else{
            $update = $db->update('m_promo',['nama' => $nama, 'tipe' => $tipe, 'diskon' => $diskon, 'harga' => $harga,'kadaluarsa' => $kadaluarsa],['id_promo' => $data_update->id_promo]);
            $h_id = 'Data Berhasil di Update!!';
        }
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->post('/b_voucher/update_voucher',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_voucher');

    $model = $data->findAll();

    $input = $request->getParsedBody();
  
    $id                =$input['id'];
    $id_customer       =$input['id_customer'];
    $tgl_awal          =$input['tgl_awal'];
    $tgl_akhir         =$input['tgl_akhir'];
    $jumlah            = $input['jumlah'];
    $catatan           = $input['catatan'];
    $v_promo_id        = $input['v_promo_id'];

    $date1 = str_replace('-', '/', $tgl_awal);
    $date = date('Y-m-d', strtotime($date1 . "+".$tgl_akhir." days"));

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_voucher == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        if($date == null){
            $update = $db->update('m_voucher',['id_customer' => $id_customer, 'tgl_awal' => $tgl_awal, 'jumlah' => $jumlah,'catatan' => $catatan,'v_promo_id' => $v_promo_id],['id_voucher' => $data_update->id_voucher]);
            $h_id = 'Data Berhasil di Update!!';
        }else{
            $update = $db->update('m_voucher',['id_customer' => $id_customer, 'tgl_awal' => $tgl_awal, 'tgl_akhir' => $date, 'jumlah' => $jumlah,'catatan' => $catatan,'v_promo_id' => $v_promo_id],['id_voucher' => $data_update->id_voucher]);
            $h_id = 'Data Berhasil di Update!!';
        }
        
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $date
        ]);
});

$app->post('/b_voucher/hapus_voucher',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_voucher');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id_hapus =$input['id'];

    for($x=0; $x<count($model); $x++){
        if($model[$x]->id_voucher == $id_hapus){
            $h_hapus = $model[$x];
        }else{
            $h_hapus2 = '';
        }
    }

    if($h_hapus == null){
        $output = 'Data tidak ditemukan !!';
    }else{
        $hapus = $db->update('m_voucher',['is_deleted' => 1],['id_voucher' => $h_hapus->id_voucher]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

function compress($source, $destination, $quality){
	$info = getimagesize($source);

	if ($info['mime'] == 'image/jpeg') 
      $image = imagecreatefromjpeg($source);  
    elseif ($info['mime'] == 'image/gif') 
      $image = imagecreatefromgif($source);  
    elseif ($info['mime'] == 'image/png') 
      $image = imagecreatefrompng($source);  
    $data = imagejpeg($image, $destination, $quality);    

	return $data;

}
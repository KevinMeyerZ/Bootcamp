<?php
use Service\Db;
use Service\Landa;

$app->get('/b_menu/menu',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    if(isset($params['id_produk'])){
        $data = $db->select('*')
        ->from('m_produk')
        ->leftJoin('m_kategori','m_produk.id_kategori = m_kategori.id')
        ->where('m_produk.id_produk','=', $params['id_produk'])
        ->andwhere('m_produk.is_deleted','=', 0);
        
    }else{
        $data = $db->select('*')
        ->from('m_produk')
        ->leftJoin('m_kategori','m_produk.id_kategori = m_kategori.id')
        ->where('m_produk.is_deleted','=', 0);
    }

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'kategori') {
                $data->where('m_produk.id_kategori','LIKE',$value);
            }
            if ($key == 'menu') {
                $data->where('m_produk.nama','LIKE',$value);
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

$app->get('/b_menu/kategori',function ($request,$response){
    $db = Db::db();

    $data = $db->select('*')
    ->from('m_kategori');

    $model = $data->findAll(); 

    return successResponse($response, [
                'user' => $model
            ]);
});

$app->post('/b_menu/tambah_produk',function ($request,$response){
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
    $harga             =$params['harga'];
    $id_kategori       = $params['id_kategori'];
    $toping            = $params['toping'];
    $deskripsi         = $params['deskripsi'];
    $level              = $params['level'];
    $params['foto']    = $file;

    if($nama == null){
        $outputc = "Eror";
    }else{
        $outputc = 1;
    }

    if($outputc == 1){
        $data_akhir = $db->insert('m_produk', $params);
        $hasil_output = 'Berhasil Input Produk !!';
    }else{
        $hasil_output = $outputc;
    }

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output,

  ]);
});

$app->post('/b_menu/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_produk');

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
        $hapus = $db->update('m_produk',['is_deleted' => 1],['id_produk' => $h_hapus->id_produk]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->post('/b_menu/update_produk',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_produk');

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
    $harga             =$input['harga'];
    $status             =$input['status'];
    $id_kategori       = $input['id_kategori'];
    $toping            = $input['toping'];
    $deskripsi         = $input['deskripsi'];
    $level               = $input['level'];


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_produk == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        if(isset($input['fileSource'])&& !empty($input['fileSource'])){
            $update = $db->update('m_produk',['nama' => $nama, 'harga' => $harga, 'id_kategori' => $id_kategori, 'deskripsi' => $deskripsi,'toping' => $toping,'foto' => $file, 'level' => $level, 'status' => $status],['id_produk' => $data_update->id_produk]);
            $h_id = 'Data Berhasil di Update!!';
        }else{
            $update = $db->update('m_produk',['nama' => $nama, 'harga' => $harga, 'id_kategori' => $id_kategori, 'deskripsi' => $deskripsi,'toping' => $toping,'level' => $level, 'status' => $status],['id_produk' => $data_update->id_produk]);
            $h_id = 'Data Berhasil di Update!!';
        } 
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
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
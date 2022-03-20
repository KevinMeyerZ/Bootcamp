<?php
use Service\Db;
use Service\Landa;

$app->get('/m_promo_java/list_promo',function ($request,$response){
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
        'list' => $model,
        'totalItems' => $totalItems
    ]);
});

$app->post('/m_promo_java/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_promo');

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
        $hapus = $db->update('m_promo',['is_deleted' => 1],['id' => $h_hapus->id]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->post('/m_promo_java/tambah_promo',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
    if($params['fileSource'] != null && $params['fileSource'] != ''){
        $folderPath = "assets/img/upload_produk/";

        $image_parts = explode(";base64,", $params['fileSource']);

        $image_type_aux = explode("image/", $image_parts[0]);

        $image_type = $image_type_aux[1];

        $image_base64 = base64_decode($image_parts[1]);

        $file = $folderPath . uniqid() . '.png';

        compress($params['fileSource'], $file, 50);
    }

    $nama              =$params['nama'];
    $tipe              =$params['tipe'];
    $diskon            =$params['diskon'];
    $harga             =$params['harga'];
    $kadaluarsa        =$params['kadaluarsa'];
    $params['foto']  =$file;        
    $deskripsi        =$params['deskripsi'];


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

$app->post('/m_promo_java/update_promo',function ($request,$response){
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
    $input['foto']   = $file;
    $deskripsi        = $input['deskripsi'];


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
        if(isset($input['fileSource'])&& !empty($input['fileSource'])){
            $update = $db->update('m_promo',['nama' => $nama, 'tipe' => $tipe, 'diskon' => $diskon, 'harga' => $harga,'kadaluarsa' => $kadaluarsa,'foto' => $file, 'deskripsi' => $deskripsi],['id' => $data_update->id]);
            $h_id = 'Data Berhasil di Update!!';
        }else{
            $update = $db->update('m_promo',['nama' => $nama, 'tipe' => $tipe, 'diskon' => $diskon, 'harga' => $harga,'kadaluarsa' => $kadaluarsa, 'deskripsi' => $deskripsi],['id' => $data_update->id]);
            $h_id = 'Data Berhasil di Update!!';
        }
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id
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
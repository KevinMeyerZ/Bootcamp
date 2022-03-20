<?php
use Service\Db;
use Service\Landa;

$app->get('/m_menu_java/menu',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select("*")
        ->from("m_menu")
        ->where('is_deleted','=', '0');

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model
    ]);
});

$app->get('/m_menu_java/test_menu_detail',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select("m_menu_detail.id as id_topping,m_menu_detail.m_menu_id,m_menu_detail.tipe,m_menu_detail.nama as detail_nama,m_menu_detail.harga,m_menu.nama")
        ->from("m_menu_detail")
        ->innerJoin("m_menu", "m_menu_detail.m_menu_id = m_menu.id")
        ->where('m_menu.is_deleted','=', 0);

        if (isset($params['filter'])) {
            $filter = (array) json_decode($params['filter']);
            foreach ($filter as $key => $value) {
                if ($key == 'kategori') {
                    $data->where('m_menu.kategori','LIKE',$value);
                }
                if ($key == 'menu') {
                    $data->where('m_menu.nama','LIKE',$value);
                }
            }
        }

        $model = $data->findAll();

    echo json_encode($model);
});

$app->get('/m_menu_java/test_menu',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
    $data = $db->select("m_menu.id,m_menu.nama,m_menu.kategori,m_menu.harga,m_menu.deskripsi,m_menu.status,m_menu.foto")
        ->from("m_menu")
        ->where('m_menu.is_deleted','=', 0);

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'kategori') {
                $data->where('m_menu.kategori','LIKE',$value);
            }
            if ($key == 'menu') {
                $data->where('m_menu.nama','LIKE',$value);
            }
        }
    }

    $model = $data->findAll();

    echo json_encode($model);
});

$app->get('/m_menu_java/dashboard_menu',function ($request,$response){
    $params = $request->getParams();
    $is_tampil = true;
    $filter = (isset($params['filter'])) ? urlencode($params['filter']) : null;
    $limit = $params['limit'];
    $offset = $params['offset'];

    $data = json_decode(file_get_contents("http://localhost/training-angular-9/api/m_menu_java/test_menu_detail?filter={$filter}"));
    $menu = json_decode(file_get_contents("http://localhost/training-angular-9/api/m_menu_java/test_menu?filter={$filter}"));

    //Kelola menu makanan
    $dataMenu = [];
    foreach ($menu as $value) {
        $dataMenu[$value->nama]['id_menu'] = $value->id;
        $dataMenu[$value->nama]['nama'] = $value->nama;
        $dataMenu[$value->nama]['kategori'] = $value->kategori;
        $dataMenu[$value->nama]['harga'] = $value->harga;
        $dataMenu[$value->nama]['deskripsi'] = $value->deskripsi;
        $dataMenu[$value->nama]['status'] = $value->status;
        $dataMenu[$value->nama]['foto'] = $value->foto;
        $dataMenu[$value->nama]['detail'] = [];
    }

    foreach ($data as $dalam) {
        array_push($dataMenu[$dalam->nama]['detail'], $dalam);
    }

    $dataFinal = [];

    foreach ($dataMenu as $value) {
        array_push($dataFinal, ['id_menu' => $value['id_menu'],'nama' => $value['nama'],'kategori' => $value['kategori'],'harga' => $value['harga'],'deskripsi' => $value['deskripsi'],'status' => $value['status'],'detail' => $value['detail'],'foto' => $value['foto']]);
    }

    

    return successResponse($response, [
        'list' => array_slice($dataFinal, $offset, $limit),
        'totalItems' => count($dataFinal)
    ]);
});

$app->post('/m_menu_java/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_menu');

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
        $hapus = $db->update('m_menu',['is_deleted' => 1],['id' => $h_hapus->id]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->post('/m_menu_java/tambah_menu',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();

    $data = $db->select('*')
    ->from('m_menu');

    $model = $data->findAll();

    $folderPath = "assets/img/upload_produk/";

    $image_parts = explode(";base64,", $params['fileSource']);

    $image_type_aux = explode("image/", $image_parts[0]);

    $image_type = $image_type_aux[1];

    $image_base64 = base64_decode($image_parts[1]);

    $file = $folderPath . uniqid() . '.png';

    compress($params['fileSource'], $file, 50);
 

    $nama              =$params['nama'];
    $kategori          = $params['kategori'];
    $harga             =$params['harga'];
    $deskripsi         = $params['deskripsi'];
    $status            = $params['status'];
    $params['foto']    = $file;
    
    if($nama == null){
        $outputc = "Eror";
    }else{
        $outputc = 1;
    }

    if($params['fileSource'] == null || $params['fileSource'] == ''){
        $params['foto'] = '';
    }

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->nama == $nama){
            $hasil_output = $model[$x];
        }
    }

    if($hasil_output == null){
        $data_akhir = $db->insert('m_menu', $params);
        $hasil_output = 'Berhasil Input Produk !!';
    }else{
        $hasil_output = 'Nama Tidak Boleh Sama';
    }

    if($params['detail'] != ''){
        $detail            = $params['detail'];

        for($i=0; $i<count($detail); $i++){
            $data_lanjutan = ['m_menu_id'=> $data_akhir->id, 'tipe'=>$detail[$i]['tipe'],'nama'=>$detail[$i]['keterangan'],'harga'=>$detail[$i]['harga']];
            $data_lanjutan = $db->insert('m_menu_detail', $data_lanjutan);
        }
    }
   

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output
    ]);
});

$app->post('/m_menu_java/update_produk',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_menu');

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
    
    $id                = $input['id'];
    $nama              = $input['nama'];
    $kategori          = $input['kategori'];
    $harga             = $input['harga'];
    $deskripsi         = $input['deskripsi'];
    $status            = $input['status'];
    $input['foto']    = $file;


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
            $update = $db->update('m_menu',['nama' => $nama, 'harga' => $harga, 'kategori' => $kategori, 'deskripsi' => $deskripsi,'foto' => $file, 'status' => $status],['id' => $data_update->id]);
            $h_id = 'Data Berhasil di Update!!';

            $detail            = $input['detail'];
            $data_baru         = $input['data_baru'];

            for($i=0; $i<count($detail); $i++){
                $data_lanjutan = ['tipe'=>$detail[$i]['tipe'],'nama'=>$detail[$i]['keterangan'],'harga'=>$detail[$i]['harga']];
                $data_lanjutan = $db->update('m_menu_detail', $data_lanjutan, ['id'=> $detail[$i]['id']]);
            }

            if($data_baru != null && $data_baru != ''){
                for($i=0; $i<count($data_baru); $i++){
                    $data_lanjutan = ['m_menu_id'=> $update->id, 'tipe'=>$data_baru[$i]['tipe'],'nama'=>$data_baru[$i]['keterangan'],'harga'=>$data_baru[$i]['harga']];
                    $data_lanjutan = $db->insert('m_menu_detail', $data_lanjutan);
                }
            }
        }else{
            $update = $db->update('m_menu',['nama' => $nama, 'harga' => $harga, 'kategori' => $kategori, 'deskripsi' => $deskripsi, 'status' => $status],['id' => $data_update->id]);
            $h_id = 'Data Berhasil di Update!!';

            $detail            = $input['detail'];
            $data_baru         = $input['data_baru'];

            for($i=0; $i<count($detail); $i++){
                $data_lanjutan = ['tipe'=>$detail[$i]['tipe'],'nama'=>$detail[$i]['keterangan'],'harga'=>$detail[$i]['harga']];
                $db->update('m_menu_detail', $data_lanjutan, ['id'=> $detail[$i]['id']]);
            }

            if($data_baru != null && $data_baru != ''){
                for($i=0; $i<count($data_baru); $i++){
                    $data_lanjutan = ['m_menu_id'=> $update->id, 'tipe'=>$data_baru[$i]['tipe'],'nama'=>$data_baru[$i]['keterangan'],'harga'=>$data_baru[$i]['harga']];
                    $data_lanjutan = $db->insert('m_menu_detail', $data_lanjutan);
                }
            }
        } 
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id2
        ]);
});

$app->post('/m_menu_java/hapus_topping',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_menu_detail');

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
        $hapus = $db->delete('m_menu_detail',['id' => $h_hapus->id]);
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
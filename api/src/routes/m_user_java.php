<?php
use Service\Db;
use Service\Landa;

$app->get('/m_user_java/list_user',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $id = $params['id_akses'];

    $data = $db->select('*')
    ->from('m_user')
    ->where('m_user.is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'nama') {
                $data->where('m_user.nama','LIKE',$value);
            }
        }
    }

    if (isset($params['id']) && !empty($params['id'])) {
        $data->leftJoin('m_akses', 'm_user.m_akses_id = m_akses.id');
        $data->where('m_user.id','=',$params['id']);
    }

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    $model = $data->findAll();
    $totalItems = $data->count();

    $array = json_decode($model[0]->akses);

    return successResponse($response, [
        'list' => $model,
        'totalItems' => $totalItems,
        'akses' => $array
    ]);
});

$app->post('/m_user_java/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_user');

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
        $hapus = $db->update('m_user',['is_deleted' => 1],['id' => $h_hapus->id]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->post('/m_user_java/tambah_user',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();

    $folderPath = "assets/img/upload_produk/";

    $image_parts = explode(";base64,", $params['fileSource']);

    $image_type_aux = explode("image/", $image_parts[0]);

    $image_type = $image_type_aux[1];

    $image_base64 = base64_decode($image_parts[1]);

    $file = $folderPath . uniqid() . '.png';

    compress($params['fileSource'], $file, 50);
 

    $nama              = $params['nama'];
    $email             = $params['email'];
    $password          = sha1($params['password']);
    $c_password        = sha1($params['c_password']);
    $hak_akses         = $params['hak_akses'];

    if($params['fileSource'] == null || $params['fileSource'] == ''){
        $file = '';
    }
    
    if($password == $c_password){
        $data_akhir = $db->insert('m_user', ['nama' => $nama, 'email' => $email, 'password' => $password, 'm_akses_id' => $hak_akses, 'foto' => $file]);
        $hasil_output = 'Berhasil Input Produk !!';
    }else{
        $hasil_output = 'Password Tidak Sama !!';
    }

    return successResponse($response, [
    'list' => $data_akhir,
    'massage' => $hasil_output
    ]);
});

$app->post('/m_user_java/update_user',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_user');

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
    $email             = $input['email'];
    $p_lama            = $input['p_lama'];
    $password          = $input['password'];
    $c_password        = $input['c_password'];
    $hak_akses         = $input['hak_akses'];


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'User Tidak Ditemukan !';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        if($p_lama == null){
            if(isset($input['fileSource'])&& !empty($input['fileSource'])){
                $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'm_akses_id' => $hak_akses,'foto' => $file],['id' => $data_update->id]);
                $h_id = 'Data Berhasil di Update!!';
            }else{
                $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'm_akses_id' => $hak_akses],['id' => $data_update->id]);
                $h_id = 'Data Berhasil di Update!!';
            }
        }else{
            if(sha1($p_lama) == $data_update->password){
                if($password != null && $c_password != null){
                    if($password == $c_password){
                        if(isset($input['fileSource'])&& !empty($input['fileSource'])){
                            $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'password' => sha1($password), 'm_akses_id' => $hak_akses,'foto' => $file],['id' => $data_update->id]);
                            $h_id = 'Data Berhasil di Update!!';
                        }else{
                            $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'password' => sha1($password), 'm_akses_id' => $hak_akses],['id' => $data_update->id]);
                            $h_id = 'Data Berhasil di Update!!';
                        }
                    }else{
                        $h_id = 'Password Tidak Sama !';
                    }
                }else{
                    $h_id = 'Password atau Confirm password kosong !';
                }
            }else{
                $h_id = 'Password Lama Salah';
            }
        }
        // if($password == $c_password){
        //     if(isset($input['fileSource'])&& !empty($input['fileSource'])){
        //         $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'password' => $password, 'hak_akses' => $hak_akses,'foto' => $file],['id' => $data_update->id]);
        //         $h_id = 'Data Berhasil di Update!!';
        //     }else{
        //         $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'password' => $password, 'hak_akses' => $hak_akses],['id' => $data_update->id]);
        //         $h_id = 'Data Berhasil di Update!!';
        //     }
        // }else{
        //     $h_id = 'Password Tidak Sama !';
        // }
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id
        ]);
});

$app->get('/m_user_java/akses',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();


    $data = $db->select('*')
    ->from('m_akses')
    ->where('id' ,'=', $params['id']);

    $model = $data->findAll();

    $array = explode(',',$model[0]->akses);

    return successResponse($response, [
            'user' => $model,
            'massage' => $array[0]
        ]);
});

$app->post('/m_user_java/tambah_akses',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
 
    $user              = $params['user'];
    $akses             = json_encode($params['akses']);

    $data_akhir = $db->insert('m_akses', ['nama' => $user, 'akses' => $akses]);
    $hasil_output = 'Berhasil Input Produk !!';

    return successResponse($response, [
    'list' => $data_akhir,
    'massage' => $hasil_output
    ]);
});

$app->get('/m_user_java/select_akses',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();


    $data = $db->select('*')
    ->from('m_akses')
    ->where('is_deleted','=','0');

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'nama') {
                $data->where('m_akses.nama','LIKE',$value);
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

    $rescue = [];
    for($i=0; $i<count($model); $i++){
        $model[$i]->akses = json_decode($model[$i]->akses);
    }

    return successResponse($response, [
            'list' => $model,
            'totalItems' => $totalItems,
            'massage' => 'berhasil!!'
        ]);
});

$app->post('/m_user_java/edit_akses',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_akses');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                = $input['id'];
    $nama              = $input['nama'];
    $akses             = json_encode($input['akses']);


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'User Tidak Ditemukan !';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('m_akses',['nama' => $nama, 'akses' => $akses],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id
        ]);
});

$app->post('/m_user_java/hapus_akses',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_akses');

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
        $hapus = $db->update('m_akses',['is_deleted' => 1],['id' => $h_hapus->id]);
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
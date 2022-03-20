<?php
use Service\Db;
use Service\Landa;

$app->get('/b_karyawan/list_karyawan',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_karyawan')
    ->where('is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'karyawan') {
                $data->where('m_karyawan.nama','LIKE',$value);
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

$app->post('/b_karyawan/update_ngaji',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_karyawan');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                =$input['id'];
    $number             =$input['number'];

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_karyawan == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('m_karyawan',['s_ngaji' => $number],['id_karyawan' => $data_update->id_karyawan]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->post('/b_karyawan/update_kehadiran',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_karyawan');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                =$input['id'];
    $number             =$input['number'];

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_karyawan == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('m_karyawan',['s_kehadiran' => $number],['id_karyawan' => $data_update->id_karyawan]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->post('/b_karyawan/update_rekruit',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_karyawan');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                =$input['id'];
    $number             =$input['number'];

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_karyawan == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('m_karyawan',['s_rekruit' => $number],['id_karyawan' => $data_update->id_karyawan]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->get('/b_karyawan/list_user',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_user')
    ->where('is_deleted','=', 0)
    ->andwhere('id','=', $params['id']);

    $model = $data->findAll();

    return successResponse($response, [
        'user' => $model,
        'message' => 'Berhasil !'
    ]);
});
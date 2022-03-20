<?php
use Service\Db;
use Service\Landa;

$app->get('/m_diskon_java/list_customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_customer')
    ->where('is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'customer') {
                $data->where('m_customer.nama','LIKE',$value);
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

    $ngaji = 1;

    $total_ngaji = array_count_values(array_column($model, 'ngaji'))[$ngaji];
    $total_ontime = array_count_values(array_column($model, 'on_time'))[$ngaji];


    return successResponse($response, [
        'list' => $model,
        'totalItems' => $totalItems,
        't_ngaji' => $total_ngaji,
        't_ontime' => $total_ontime
    ]);
});

$app->post('/m_diskon_java/update_ngaji',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_customer');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                =$input['id'];
    $number             =$input['number'];

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
        $update = $db->update('m_customer',['ngaji' => $number],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $id
        ]);
});

$app->post('/m_diskon_java/update_ontime',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_customer');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id                =$input['id'];
    $number             =$input['number'];

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
        $update = $db->update('m_customer',['on_time' => $number],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});
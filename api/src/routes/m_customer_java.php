<?php
use Service\Db;
use Service\Landa;

$app->get('/m_customer_java/customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_customer')
    ->where('m_customer.is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'namaku') {
                $data->where('m_customer.nama','LIKE',$value);
            }
            if ($key == 'statusku') {
                if($value != ""){
                    $data->where('m_customer.status','=',$value);
                }
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

$app->post('/m_customer_java/edit_customer',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_customer');

    $model = $data->findAll();

    $input = $request->getParsedBody();

  
    $id                  =$input['id'];
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
        $update = $db->update('m_customer',['status' => $status],['id' => $data_update->id]);
        $h_id = 'Data Berhasil di Update!!';
    }
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});
<?php
use Service\Db;
use Service\Landa;

$app->post('/b_dashboard/hari_ini',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d');

    $data = $db->select('sum(t_pesanan_detail.total) as total_hari')
    ->from('t_pesanan')
    ->innerJoin('t_pesanan_detail', 't_pesanan.id = t_pesanan_detail.t_pesanan_id')
    ->where('t_pesanan.tanggal','=',$date);

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => 'Berhasil'
            ]);
});

$app->post('/b_dashboard/hari_kemarin',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d', strtotime(' - 1 days'));

    $data = $db->select('sum(t_pesanan_detail.total) as total_hari')
    ->from('t_pesanan')
    ->innerJoin('t_pesanan_detail', 't_pesanan.id = t_pesanan_detail.t_pesanan_id')
    ->where('t_pesanan.tanggal','=',$date);

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => 'Berhasil'
            ]);
});

$app->post('/b_dashboard/bulan_ini',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d');
    $month = date('m', strtotime($date));

    $data = $db->select('MONTHNAME(t_pesanan.tanggal),sum(t_pesanan_detail.total) as bulan_ini')
    ->from('t_pesanan')
    ->innerJoin('t_pesanan_detail', 't_pesanan.id = t_pesanan_detail.t_pesanan_id')
    ->where('MONTH(tanggal)','=',$month)
    ->groupBy('YEAR(tanggal), MONTH(tanggal)');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/b_dashboard/bulan_kemarin',function ($request,$response){
    $db = Db::db();

    $date = date('Y-m-d', strtotime(' - 1 months'));
    $month = date('m', strtotime($date));

    $data = $db->select('MONTHNAME(t_pesanan.tanggal),sum(t_pesanan_detail.total) as bulan_ini')
    ->from('t_pesanan')
    ->innerJoin('t_pesanan_detail', 't_pesanan.id = t_pesanan_detail.t_pesanan_id')
    ->where('MONTH(tanggal)','=',$month)
    ->groupBy('YEAR(tanggal), MONTH(tanggal)');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/b_dashboard/barchart',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();
    

    $data = $db->select('*')
    ->from('t_pesanan')
    ->leftJoin('t_pesanan_detail','t_pesanan.id = t_pesanan_detail.t_pesanan_id');

    $model = $data->findAll();

    $pertahun =  [];

    if(isset($params['date']) && !empty($params['date'])){
        $date = date('Y', strtotime( $params['date']));
    }

    if(empty($params['date'])){
        $date = date('Y');
    }

    $angka = 1;
    for($m=0; $m<=11; $m++){
        $month = date('F', mktime(0,0,0, $angka, 1, date('Y')));
        $pertahun[$m]['tahun'] = $date;
        $pertahun[$m]['bulan'] = $month;
        $pertahun[$m]['total_terjual'] = 0;
        $angka += 1;
    }

    for($i=0; $i<count($model); $i++){
        $month = date('F', strtotime($model[$i]->tanggal));
        $years = date('Y', strtotime($model[$i]->tanggal));
        for($m=0; $m<count($pertahun); $m++){
            if($month == $pertahun[$m]['bulan'] && $years == $pertahun[$m]['tahun']){
                $pertahun[$m]['total_terjual'] += $model[$i]->total;
            }
        }
    }

    return successResponse($response, [
                'user' => $pertahun,
                'massage' => 'Berhasil !!'
            ]);
});

$app->get('/b_dashboard/customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_konsumen')
    ->where('m_konsumen.is_deleted','=', 0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'namaku') {
                $data->where('m_konsumen.nama','LIKE',$value);
            }
            if ($key == 'statusku') {
                $data->where('m_konsumen.status','LIKE',$value);
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
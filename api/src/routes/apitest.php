<?php
use Service\Db;
use Service\Landa;

$app->get('/apitest/rekap',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('acc_m_akun.id,acc_m_akun.nama')
    ->from('acc_m_akun')
    ->where('acc_m_akun.id','=',25);

    $model = $data->findAll();

    for($i=0; $i<count($model); $i++){
        $coba = $db->select('acc_trans_detail.m_akun_id,acc_trans_detail.debit,acc_trans_detail.reff_type,date(acc_trans_detail.tanggal) as stat_day')
        ->from('acc_m_akun')
        ->leftJoin('acc_trans_detail','acc_m_akun.id = acc_trans_detail.m_akun_id')
        ->where('acc_m_akun.id','=',$model[$i]->id)
        ->groupBy('date(stat_time)');
        $detail = $data->findAll();
        $model[0]->detail = $detail;
        for($i=0; $i<count($detail); $i++){
            if($detail[$i]->reff_type == 'acc_pengeluaran'){
                $totalpenge = $totalpenge + $detail[$i]->debit;
            }
            if($detail[$i]->reff_type == 'acc_pemasukan'){
                $totalpemas = $totalpemas + $detail[$i]->debit;
            }
        }
        $model[0]->totalpemasukan = $totalpemas;
        $model[0]->totalpengeluaran = $totalpenge;
        $model[0]->totalkeseluruhan = $totalpemas - $totalpenge;
    }


    return successResponse($response, [
        'user' => $model,
        'hasil' => 'berhasil'
    ]);
});
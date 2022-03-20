<?php
use Service\Db;
use Service\Landa;

$app->get('/test_ketiga/saldo_awal',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $nama_item = (isset($params['nama_item'])) ? $params['nama_item'] : null;
    $nama_gudang = (isset($params['nama_gudang'])) ? $params['nama_gudang'] : null;
    $nama_cabang = (isset($params['nama_cabang'])) ? $params['nama_cabang'] : null;
    $akhiran_jumlah = 0;
    $akhiran_harga = 0;
    $akhiran_total =0;

    $menu = $db->select("inv_kartu_stok.tanggal,inv_kartu_stok.kode,inv_kartu_stok.jenis_stok,inv_kartu_stok.catatan,inv_kartu_stok.jumlah_masuk,inv_kartu_stok.jumlah_keluar,inv_kartu_stok.m_item_id,m_item.nama as nama_item,inv_kartu_stok.hpp as hrg_jual,inv_kartu_stok.m_gudang_id,m_gudang.nama as nama_gudang,m_gudang.cabang_id,m_cabang.nama as nama_cabang")
            ->from("inv_kartu_stok")
            ->innerJoin("m_item", "inv_kartu_stok.m_item_id = m_item.id")
            ->innerJoin("m_gudang", "inv_kartu_stok.m_gudang_id = m_gudang.id")
            ->innerJoin("m_cabang", "m_gudang.cabang_id = m_cabang.id");

    if(isset($params['nama_gudang'])){
        $db->where("m_gudang.id", "=", $nama_gudang);
    }   
    if(isset($params['nama_item'])){
        $db->where("m_item.id", "=", $nama_item);
    }   
    if(isset($params['nama_cabang'])){
        $db->where("m_cabang.id", "=", $nama_cabang);
    }   

    $date = strtotime($params['tgl_awal']);
    $wow = date('Y-m-d', $date);

    $db->andwhere('inv_kartu_stok.tanggal', '<', $wow);
    // $db->where('month(inv_kartu_stok.tanggal)', '<', $bulan);
    // $db->andwhere("year(inv_kartu_stok.tanggal)", "<=", $tahun);
    $db->orderBy("inv_kartu_stok.tanggal ASC");

    $model = $db->findAll();

    $data_pengeluaran = [];
    $data_pemasukan = [];
    foreach ($model as $value) {
        if($value->jenis_stok == 'keluar'){
            $data_pengeluaran[$value->kode]['tanggal'] = $value->tanggal;
            $data_pengeluaran[$value->kode]['kode'] = $value->kode;
            $data_pengeluaran[$value->kode]['catatan'] = $value->catatan;
            $data_pengeluaran[$value->kode]['jumlah_keluar'] += $value->jumlah_keluar;
            $data_pengeluaran[$value->kode]['harga'] = $value->hrg_jual;
            $data_pengeluaran[$value->kode]['total'] = $value->jumlah_keluar * $value->hrg_jual;
        }
        if($value->jenis_stok == 'masuk'){
            $data_pemasukan[$value->kode]['tanggal'] = $value->tanggal;
            $data_pemasukan[$value->kode]['kode'] = $value->kode;
            $data_pemasukan[$value->kode]['catatan'] = $value->catatan;
            $data_pemasukan[$value->kode]['jumlah_masuk'] += $value->jumlah_masuk;
            $data_pemasukan[$value->kode]['harga'] = $value->hrg_jual;
            $data_pemasukan[$value->kode]['total'] = $value->jumlah_masuk * $value->hrg_jual;
        }
    }

    $dataFinal = [];
    $dataGrand = [];

    foreach ($data_pemasukan as $value) {
        array_push($dataFinal, ['tanggal' => $value['tanggal'],'kode' => $value['kode'],'catatan' => $value['catatan'],'jumlah_masuk' => $value['jumlah_masuk'],'harga' => $value['harga'],'total' => $value['total']]);
    }

    foreach ($data_pengeluaran as $value) {
        array_push($dataFinal, ['tanggal' => $value['tanggal'],'kode' => $value['kode'],'catatan' => $value['catatan'],'jumlah_keluar' => $value['jumlah_keluar'],'harga' => $value['harga'],'total' => $value['total']]);
    }
    
    for($x= 0; $x<count($dataFinal); $x++){
        if($dataFinal[$x]['jumlah_masuk'] != null ){
            $grand_jumlah += $dataFinal[$x]['jumlah_masuk'];
            $grand_harga  = $dataFinal[$x]['harga'];
            $grand_saldo  += $dataFinal[$x]['total'];
            $dataFinal[$x]['jumlah_akhir'] = $grand_jumlah;
            $dataFinal[$x]['harga_akhir'] = $grand_harga;
            $dataFinal[$x]['saldo_akhir'] = $grand_saldo;
        }
        if($dataFinal[$x]['jumlah_keluar'] != null ){
            $grand_jumlah -= $dataFinal[$x]['jumlah_keluar'];
            $grand_harga  = $dataFinal[$x]['harga'];
            $grand_saldo  -= $dataFinal[$x]['total'];
            $dataFinal[$x]['jumlah_akhir'] = $grand_jumlah;
            $dataFinal[$x]['harga_akhir'] = $grand_harga;
            $dataFinal[$x]['saldo_akhir'] = $grand_saldo;
        }
    }

    for($x= 0; $x<count($dataFinal); $x++){
        if($dataFinal[$x]['jumlah_keluar'] != null){
            $akhiran_jumlah = $akhiran_jumlah - $dataFinal[$x]['jumlah_keluar'];
            $akhiran_total = $akhiran_total - $dataFinal[$x]['total'];
            $akhiran_harga = $dataFinal[$x]['harga'];
        }
        if($dataFinal[$x]['jumlah_masuk'] != null){
            $akhiran_jumlah = $akhiran_jumlah + $dataFinal[$x]['jumlah_masuk'];
            $akhiran_total = $akhiran_total + $dataFinal[$x]['total'];
            $akhiran_harga = $dataFinal[$x]['harga'];
        }
    }

    echo json_encode(['b_grand_jumlah' => $akhiran_jumlah,'b_grand_harga' => $akhiran_harga, 'b_grand_saldo' => $akhiran_total]);
});

$app->get('/test_ketiga/master',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $nama_item = (isset($params['nama_item'])) ? $params['nama_item'] : null;
    $nama_gudang = (isset($params['nama_gudang'])) ? $params['nama_gudang'] : null;
    $nama_cabang = (isset($params['nama_cabang'])) ? $params['nama_cabang'] : null;

    $menu = $db->select("inv_kartu_stok.tanggal,inv_kartu_stok.kode,inv_kartu_stok.jenis_stok,inv_kartu_stok.catatan,inv_kartu_stok.jumlah_masuk,inv_kartu_stok.jumlah_keluar,inv_kartu_stok.m_item_id,m_item.nama as nama_item,inv_kartu_stok.hpp as hrg_jual,inv_kartu_stok.m_gudang_id,m_gudang.nama as nama_gudang,m_gudang.cabang_id,m_cabang.nama as nama_cabang")
            ->from("inv_kartu_stok")
            ->innerJoin("m_item", "inv_kartu_stok.m_item_id = m_item.id")
            ->innerJoin("m_gudang", "inv_kartu_stok.m_gudang_id = m_gudang.id")
            ->innerJoin("m_cabang", "m_gudang.cabang_id = m_cabang.id");

    if(isset($params['nama_gudang'])){
        $db->where("m_gudang.id", "=", $nama_gudang);
    }   
    if(isset($params['nama_item'])){
        $db->where("m_item.id", "=", $nama_item);
    }   
    if(isset($params['nama_cabang'])){
        $db->where("m_cabang.id", "=", $nama_cabang);
    }   

    $db->where('inv_kartu_stok.tanggal', '>=', $params['tgl_awal']);
    $db->andwhere('inv_kartu_stok.tanggal', '<=', $params['tgl_akhir']);
        
    $db->orderBy("inv_kartu_stok.tanggal ASC");

    $model = $db->findAll();
    $b_nama_item = $nama_item;
    $b_nama_gudang = $nama_gudang;
    $b_nama_cabang = $nama_cabang;
    $tgl_awal = $params['tgl_awal'];
    $tgl_akhir =$params['tgl_akhir'];
    $data_lalu = json_decode(file_get_contents("http://localhost/training-angular-9/api/test_ketiga/saldo_awal?tgl_awal={$tgl_awal}&tgl_akhir={$tgl_akhir}&nama_item={$b_nama_item}&nama_gudang={$b_nama_gudang}&nama_cabang={$b_nama_cabang}"));
    $data_pengeluaran = [];
    $data_pemasukan = [];

    foreach ($model as $value) {
        if($value->jenis_stok == 'keluar'){
            $data_pengeluaran[$value->kode]['tanggal'] = $value->tanggal;
            $data_pengeluaran[$value->kode]['jenis_stok'] = $value->jenis_stok;
            $data_pengeluaran[$value->kode]['kode'] = $value->kode;
            $data_pengeluaran[$value->kode]['catatan'] = $value->catatan;
            $data_pengeluaran[$value->kode]['jumlah_keluar'] += $value->jumlah_keluar;
            $data_pengeluaran[$value->kode]['harga'] = $value->hrg_jual;
            $data_pengeluaran[$value->kode]['total'] = ($value->jumlah_keluar * $value->hrg_jual) + $value->b_total;
        }
        if($value->jenis_stok == 'masuk'){
            $data_pemasukan[$value->kode]['tanggal'] = $value->tanggal;
            $data_pemasukan[$value->kode]['jenis_stok'] = $value->jenis_stok;
            $data_pemasukan[$value->kode]['kode'] = $value->kode;
            $data_pemasukan[$value->kode]['catatan'] = $value->catatan;
            $data_pemasukan[$value->kode]['jumlah_masuk'] += $value->jumlah_masuk;
            $data_pemasukan[$value->kode]['harga'] = $value->hrg_jual;
            $data_pemasukan[$value->kode]['total'] = ($value->jumlah_masuk * $value->hrg_jual) + $value->b_total;
        }
    }

    $dataFinal = [];
    $dataGrand = [];

    foreach ($data_pemasukan as $value) {
        array_push($dataFinal, ['tanggal' => $value['tanggal'],'jenis_stok' => $value['jenis_stok'],'kode' => $value['kode'],'catatan' => $value['catatan'],'jumlah_masuk' => $value['jumlah_masuk'],'harga' => $value['harga'],'total' => $value['total']]);
    }

    foreach ($data_pengeluaran as $value) {
        array_push($dataFinal, ['tanggal' => $value['tanggal'],'jenis_stok' => $value['jenis_stok'],'kode' => $value['kode'],'catatan' => $value['catatan'],'jumlah_keluar' => $value['jumlah_keluar'],'harga' => $value['harga'],'total' => $value['total']]);
    }
    
    for($x= 0; $x<count($dataFinal); $x++){
        if($dataFinal[$x]['jumlah_masuk'] != null ){
            $grand_jumlah += $dataFinal[$x]['jumlah_masuk'];
            $grand_harga  = $dataFinal[$x]['harga'];
            $grand_saldo  += $dataFinal[$x]['total'];
            $dataFinal[$x]['jumlah_akhir'] = $grand_jumlah + $data_lalu->b_grand_jumlah;
            $dataFinal[$x]['harga_akhir'] = $grand_harga;
            $dataFinal[$x]['saldo_akhir'] = $grand_saldo + $data_lalu->b_grand_saldo;
        }
        if($dataFinal[$x]['jumlah_keluar'] != null ){
            $grand_jumlah -= $dataFinal[$x]['jumlah_keluar'];
            $grand_harga  = $dataFinal[$x]['harga'];
            $grand_saldo  -= $dataFinal[$x]['total'];
            $dataFinal[$x]['jumlah_akhir'] = $grand_jumlah + $data_lalu->b_grand_jumlah;
            $dataFinal[$x]['harga_akhir'] = $grand_harga;
            $dataFinal[$x]['saldo_akhir'] = $grand_saldo + $data_lalu->b_grand_saldo;
        }
    }

    $masa_kelam = [];
    array_push($masa_kelam, $data_lalu);
    
    return successResponse($response, [
        "is_tampil" => $dataFinal,
        "grand_jumlah" => $masa_kelam
    ]);
});

$app->get('/test_ketiga/item',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_item');

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model
    ]);
});

$app->get('/test_ketiga/cabang',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_cabang');

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model
    ]);
});

$app->get('/test_ketiga/gudang',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_gudang');

    if(isset($params['id'])){
        $db->where("m_gudang.cabang_id", "=", $params['id']);
    }   

    $model = $data->findAll();

    return successResponse($response, [
        'list' => $model
    ]);
});
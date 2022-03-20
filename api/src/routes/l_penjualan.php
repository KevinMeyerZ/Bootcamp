<?php
use Service\Db;
use Service\Landa;

$app->get('/l_penjualan/rekap_penjualan',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('m_user.id,m_pembayaran.id_pembayaran,t_transaksi.id_transaksi,t_transaksi.diskon,t_transaksi.kode,t_transaksi.tanggal,m_user.nama,t_transaksi.total,m_pembayaran.jenis_pembayaran,m_customer.status,m_customer.id_status')
    ->from('t_transaksi')
    ->leftJoin('m_user','t_transaksi.id_user = m_user.id')
    ->leftJoin('m_pembayaran','t_transaksi.jenis_pembayaran = m_pembayaran.id_pembayaran')
    ->leftJoin('m_customer','t_transaksi.status = m_customer.id_status')
    ->where('t_transaksi.is_deleted', '=',0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'kasir') {
                $data->where('t_transaksi.id_user','LIKE',$value);
            }
            if ($key == 'jenis_pembayaran') {
                $data->where('m_pembayaran.id_pembayaran','LIKE',$value);
            }
            if ($key == 'status') {
                $data->where('m_customer.id_status','LIKE',$value);
            }
        }
    }
    if(isset($params['kasir']) && !empty($params['kasir'])){
        $data->where('t_transaksi.id_user','LIKE',$params['kasir']);
    }

    if(isset($params['tgl_awal']) && !empty($params['tgl_awal'])){
        $data->where('t_transaksi.tanggal', '>=', $params['tgl_awal'])
        ->andwhere('t_transaksi.tanggal', '<=', $params['tgl_akhir']);
    }

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    $data_periode = [
        'tgl_awal' => $params['tgl_awal'],
        'tgl_akhir' => $params['tgl_akhir']
    ];

    $model = $data->findAll();
    $totalItems = $data->count();

    for($i=0; $i<count($model); $i++){
        $coba = $db->select('t_transaksi.kode,m_produk.nama,t_transaksi_det.qty,t_transaksi_det.id_detail,m_produk.harga,t_transaksi.total')
         ->from('t_transaksi')
         ->leftJoin('t_transaksi_det','t_transaksi.kode = t_transaksi_det.kode')
         ->leftJoin('m_produk','t_transaksi_det.id_produk = m_produk.id_produk')
         ->where('t_transaksi.kode','=',$model[$i]->kode);
         $detail = $data->findAll();
         $model[$i]->detail = $detail;
         $hitung = $model[$i]->detail;
         for($x=0; $x<count($hitung); $x++){
             $total = $hitung[$x]->harga * $hitung[$x]->qty;
             $hitung[$x]->nomor = $x+1;
             $hitung[$x]->total = $total;
             $total_tdiskon = $total_tdiskon + $hitung[$x]->total;
             $total_all =($model[$i]->diskon/100) * $total_tdiskon;
             $total_allnemen = $total_tdiskon - $total_all;
             $total_allnemen2 = $total_tdiskon;
         }
         $total_tdiskon = 0;
         $total_all = 0;
         $totalan = $totalan + $total_allnemen2;
         $tuotal  = $tuotal + $total_allnemen;
         $model[$i]->nomor = $i+1;
         $model[$i]->totaldiskon = $total_allnemen;
         $model[$i]->rows += count($hitung);
     }

     $total_without = $totalan;
     $total_with = $tuotal;

     $total_bawah = [
         'total_tanpa_diskon' => $total_without,
         'total_diskon' => $total_with
     ];
     
    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/laporan_penjualan_pdf.html', [
          'list' => $model,
          'total_bawah' => $total_bawah
        ]);
      
        echo $content;

       
     
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
    }
    elseif(isset($params['is_print']) && 1 == $params['is_print']) {
        $view = twigView();
        $content = $view->fetch('laporan/laporan_penjualan_pdf.html', [
          'list' => $model,
          'total_bawah' => $total_bawah
        ]);
        echo $content;
      
        echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';

    }else {
    return successResponse($response, [
        'list' => $model,
        'totalItems' => $totalItems,
        'total_bawah' => $total_bawah
        ]);
    }
});

$app->post('/l_penjualan/jenis_customer',function ($request,$response){
    $db = Db::db();

    $data = $db->select('*')
    ->from('m_customer');

    $model = $data->findAll();

    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);
});

$app->post('/l_penjualan/edit_qty',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();

    $data = $db->select('*')
    ->from('t_transaksi_det');

    $model = $data->findAll();

    $input = $request->getParsedBody();
  
    $id                =$input['id_detail'];
    $qty               =$input['qty'];
    $kode              =$input['kode'];


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->id_detail == $id){
            $data_update = $model[$x];
        }else{
            $h_id2 = 'eror';
        }
    }

    if($data_update == null){
        $h_id = 'Data Tidak Ada!!';
    }else{
        $update = $db->update('t_transaksi_det',['qty' => $qty],['id_detail' => $data_update->id_detail]);
        $h_id = 'Data Berhasil di Update!!';
    }

    $coba = $db->select('t_transaksi.kode,m_produk.nama,t_transaksi_det.qty,t_transaksi_det.id_detail,m_produk.harga')
    ->from('t_transaksi')
    ->leftJoin('t_transaksi_det','t_transaksi.kode = t_transaksi_det.kode')
    ->leftJoin('m_produk','t_transaksi_det.id_produk = m_produk.id_produk')
    ->where('t_transaksi.kode','=',$kode);
    $detail = $coba->findAll();
    $model[$i]->detail = $detail;
    $hitung = $model[$i]->detail;
    for($x=0; $x<count($hitung); $x++){
        $total = $hitung[$x]->harga * $hitung[$x]->qty;
        $hitung[$x]->total = $total;
        $total_all = $total_all + $hitung[$x]->total;
    }

    $update = $db->update('t_transaksi',['total' => $total_all],['kode' => $kode]);
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $file
        ]);
});

$app->post('/l_penjualan/hapus_data',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('t_transaksi');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $id_hapus =$input['id_transaksi'];

    for($x=0; $x<count($model); $x++){
        if($model[$x]->id_transaksi == $id_hapus){
            $h_hapus = $model[$x];
        }else{
            $h_hapus2 = '';
        }
    }

    if($h_hapus == null){
        $output = 'Data tidak ditemukan !!';
    }else{
        $hapus = $db->update('t_transaksi',['is_deleted' => 1],['id_transaksi' => $h_hapus->id_transaksi]);
        $output = 'Data berhasil Di Hapus!';
    }

    return successResponse($response, [
            'user' => $hapus,
            'massage' => $output
        ]);
});

$app->get('/l_penjualan/per_bulan',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $default = date('m');

    $data = $db->select('YEAR(t_transaksi.tanggal) as tahunku,DAY(t_transaksi.tanggal) as hariku,MONTH(t_transaksi.tanggal) as bulanku,m_user.id,m_pembayaran.id_pembayaran,t_transaksi.id_transaksi,t_transaksi.diskon,t_transaksi.kode,t_transaksi.tanggal,m_user.nama,t_transaksi.total,m_pembayaran.jenis_pembayaran,m_customer.status,m_customer.id_status')
    ->from('t_transaksi')
    ->leftJoin('m_user','t_transaksi.id_user = m_user.id')
    ->leftJoin('m_pembayaran','t_transaksi.jenis_pembayaran = m_pembayaran.id_pembayaran')
    ->leftJoin('m_customer','t_transaksi.status = m_customer.id_status')
    ->where('t_transaksi.is_deleted', '=',0);

    $coba = (string)$params['month'];
    
    if(isset($params['month'])){
        $data->where('MONTH(t_transaksi.tanggal)', '=', $params['month']);
        $bulan = date('F', strtotime('11-'.$params['month'].'-22'));
    }   

    if($params['awal'] == 1){
        $data->where('MONTH(t_transaksi.tanggal)', '=', $default);
        $params['month'] = $params['awal'];
        $bulan = date('F', strtotime('11-1-22'));
    }


    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'kasir') {
                $data->where('t_transaksi.id_user','LIKE',$value);
            }
            if ($key == 'jenis_pembayaran') {
                $data->where('m_pembayaran.id_pembayaran','LIKE',$value);
            }
            if ($key == 'status') {
                $data->where('m_customer.id_status','LIKE',$value);
            }
        }
    }
    if(isset($params['kasir']) && !empty($params['kasir'])){
        $data->where('t_transaksi.id_user','LIKE',$params['kasir']);
    }

    if(isset($params['tgl_awal']) && !empty($params['tgl_awal'])){
        $data->where('t_transaksi.tanggal', '>=', $params['tgl_awal'])
        ->andwhere('t_transaksi.tanggal', '<=', $params['tgl_akhir']);
    }

    if (isset($params['limit']) && !empty($params['limit'])) {
        $data->limit($params['limit']);
    }
    if (isset($params['offset']) && !empty($params['offset'])) {
        $data->offset($params['offset']);
    }

    $data_periode = [
        'tgl_awal' => $params['tgl_awal'],
        'tgl_akhir' => $params['tgl_akhir']
    ];

    $model = $data->findAll();
    $totalItems = $data->count();

    for($i=0; $i<count($model); $i++){
        $coba = $db->select('m_kategori.nama_kategori,t_transaksi.kode,m_produk.nama,t_transaksi_det.qty,t_transaksi_det.id_detail,m_produk.harga,t_transaksi.total')
         ->from('t_transaksi')
         ->leftJoin('t_transaksi_det','t_transaksi.kode = t_transaksi_det.kode')
         ->leftJoin('m_produk','t_transaksi_det.id_produk = m_produk.id_produk')
         ->leftJoin('m_kategori','m_produk.id_kategori = m_kategori.id')
         ->where('t_transaksi.kode','=',$model[$i]->kode);
         $detail = $data->findAll();
         $model[$i]->detail = $detail;
         $hitung = $model[$i]->detail;
         for($x=0; $x<count($hitung); $x++){
             $total = $hitung[$x]->harga * $hitung[$x]->qty;
             $hitung[$x]->nomor = $x+1;
             $hitung[$x]->total = $total;
             $hitung[$x]->hariku = $model[$i]->hariku;
             $hitung[$x]->tahunku = $model[$i]->tahunku;
         }
     }

     $total_without = $totalan;
     $total_with = $tuotal;
     
     $bulan_filter =[
        [
            'bulan' => '1',
            'day' => 31
        ],
        [
            'bulan' => '2',
            'day' => 28
        ],
        [
            'bulan' => '3',
            'day' => 31
        ],
        [
            'bulan' => '4',
            'day' => 31
        ],
        [
            'bulan' => '5',
            'day' => 31
        ],
        [
            'bulan' => '6',
            'day' => 31
        ],
        [
            'bulan' => '7',
            'day' => 31
        ],
        [
            'bulan' => '8',
            'day' => 31
        ],
        [
            'bulan' => '9',
            'day' => 31
        ],
        [
            'bulan' => '10',
            'day' => 31
        ],
        [
            'bulan' => '11',
            'day' => 31
        ],
        [
            'bulan' => '12',
            'day' => 31
        ]
     ];
     $bulan_tentuan = 0;
    for($x=0; $x<count($bulan_filter); $x++){
        if($params['month'] == $bulan_filter[$x]['bulan']){
            $bulan_tentuan = $bulan_filter[$x]['day'];
        }else{
            $massage = 'Yo gagal lur!';
        }
    }
    $arraybaruku = [];
    $detailbaruku = [];
    for($x=0; $x<$bulan_tentuan; $x++){
        $tambah = $tambah + 1;
        $arraybaruku[$x]['harian'] = $tambah;
        $arraybaruku[$x]['detail'] = [];
    }

    $all_produk = [];
    for($x=0; $x<count($model); $x++){
        for($i=0;$i<count($model[$x]->detail); $i++){
            $data = ['nama'=>$model[$x]->detail[$i]->nama,'kategori' => $model[$x]->detail[$i]->nama_kategori];
            array_push($all_produk, $data);
        }
    }

    $all_kategori = [];
    for($x=0; $x<count($model); $x++){
        for($i=0;$i<count($model[$x]->detail); $i++){
            $data = ['kategori' => $model[$x]->detail[$i]->nama_kategori];
            array_push($all_kategori, $data);
        }
    }

    $tempArr = array_unique(array_column($all_produk, 'nama'));
    $tempArr2 = array_unique(array_column($all_kategori, 'kategori'));

    $produk_final = [];

    $baruan = array_intersect_key($all_produk, $tempArr);
    $w = 0;
    for($x=0; $x<count($all_produk);$x++){
        if($baruan[$x]['nama'] == null && $baruan[$x]['kategori'] == null){
             
        }else{
            $produk_final[$w] = ['produk' => $baruan[$x]['nama'], 'produk_kategori' => $baruan[$x]['kategori']]; 
            $w +=1;
        }
    }

    $kategori_final = [];

    $baruan2 = array_intersect_key($all_kategori, $tempArr2);
    $w = 0;
    for($x=0; $x<count($all_produk);$x++){
        if($baruan2[$x]['nama'] == null && $baruan2[$x]['kategori'] == null){
             
        }else{
            $kategori_final[$w] = ['kategori' => $baruan[$x]['kategori']]; 
            $w +=1;
        }
    }
    
    for($x=0; $x<count($model); $x++){
        for($i=0; $i<count($arraybaruku); $i++){
            if($model[$x]->hariku == $arraybaruku[$i]['harian']){
                for($a=0; $a<count($model[$x]->detail); $a++){
                    if($arraybaruku[$i]['detail'][$a] == null){
                        $data = [];
                        $data = [
                            'kategori' =>   $model[$x]->detail[$a]->nama_kategori,
                            'nama' =>       $model[$x]->detail[$a]->nama,
                            'total' =>      $model[$x]->detail[$a]->total,
                            'hariku' =>     $model[$x]->detail[$a]->hariku
                        ];
                        $arraybaruku[$i]['detail'][$a] = $data;
                        $arraybaruku[$i]['total_pertanggal'] += $model[$x]->detail[$a]->total;
                    }else{
                        $coba = count($arraybaruku[$i]['detail']) + 1;
                        $nyoba = count($arraybaruku[$i]['detail']);
                        for($r=count($arraybaruku[$i]['detail']);$r<$coba; $r++){
                            for($e=0;$e<$nyoba; $e++){
                                if($model[$x]->detail[$a]->nama != $arraybaruku[$i]['detail'][$e]['nama']){
                                    
                                }else{
                                    $arraybaruku[$i]['detail'][$e]['total'] += $model[$x]->detail[$a]->total;
                                    $arraybaruku[$i]['total_pertanggal'] += $model[$x]->detail[$a]->total;
                                }
                            }
                        }
                    }   
                }
            }else{
                // $arraybaruku['detail'] = 0;
            }
        }
    }

    $final_katek =[];

    for($q=0; $q<count($arraybaruku); $q++){
        for($c=0; $c<count($arraybaruku[$q]['detail']); $c++){
            for($g=0; $g<count($kategori_final); $g++){
                if($arraybaruku[$q]['detail'][$c]['kategori'] == $kategori_final[$g]['kategori']){
                    $final_katek[$g]['kategori_sek'] = $kategori_final[$g]['kategori'];
                    $final_katek[$g]['total']        += $arraybaruku[$q]['detail'][$c]['total'];
                }
                // $final_katek[$c]['kategori_sek'] = $arraybaruku[$q]['detail'][$c]['kategori'];
                
            }
        }
    }

    $final_produk =[];

    for($q=0; $q<count($arraybaruku); $q++){
        for($c=0; $c<count($arraybaruku[$q]['detail']); $c++){
            for($g=0; $g<count($produk_final); $g++){
                if($arraybaruku[$q]['detail'][$c]['nama'] == $produk_final[$g]['produk']){
                    $final_produk[$g]['nama_pro'] = $produk_final[$g]['produk'];
                    $final_produk[$g]['total']        += $arraybaruku[$q]['detail'][$c]['total'];
                }
                // $final_katek[$c]['kategori_sek'] = $arraybaruku[$q]['detail'][$c]['kategori'];
                
            }
        }
    }

    for($q=0; $q<count($arraybaruku); $q++){
        $grand_total += $arraybaruku[$q]['total_pertanggal'];
    }


     $total_bawah = [
         'total_tanpa_diskon' => $total_without,
         'total_diskon' => $total_with
     ];
     
    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/perbulan.html', [
            'list' => $arraybaruku,
            'produk' => $produk_final,
            'kategori' => $kategori_final,
            'total_kategori' => $final_katek,
            'total_produk'  =>$final_produk,
            'g_total' => $grand_total,
            'month' => $bulan
        ]);
      
        echo $content;

       
     
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
    }
    elseif(isset($params['is_print']) && 1 == $params['is_print']) {
        $view = twigView();
        $content = $view->fetch('laporan/perbulan.html', [
            'list' => $arraybaruku,
            'produk' => $produk_final,
            'kategori' => $kategori_final,
            'total_kategori' => $final_katek,
            'total_produk'  =>$final_produk,
            'g_total' => $grand_total,
            'month' => $bulan
        ]);
        echo $content;
      
        echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';

    }else {
    return successResponse($response, [
        'list' => $arraybaruku,
        'produk' => $produk_final,
        'kategori' => $kategori_final,
        'month' => $bulan
        ]);
    }
});


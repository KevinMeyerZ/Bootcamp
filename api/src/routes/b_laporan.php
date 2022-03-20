<?php
use Service\Db;
use Service\Landa;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

$app->get('/b_laporan/rekap_menu',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('m_konsumen.id,m_pembayaran.id_pembayaran,t_transaksi.id_transaksi,t_transaksi.diskon,t_transaksi.kode,t_transaksi.tanggal,m_konsumen.nama,t_transaksi.total,m_pembayaran.jenis_pembayaran,m_customer.status,m_customer.id_status')
    ->from('t_transaksi')
    ->leftJoin('m_konsumen','t_transaksi.id_customer = m_konsumen.id')
    ->leftJoin('m_pembayaran','t_transaksi.jenis_pembayaran = m_pembayaran.id_pembayaran')
    ->leftJoin('m_customer','t_transaksi.status = m_customer.id_status')
    ->where('t_transaksi.is_deleted', '=',0);

    if (isset($params['filter'])) {
        $filter = (array) json_decode($params['filter']);
        foreach ($filter as $key => $value) {
            if ($key == 'customer') {
                $data->where('m_konsumen.nama','LIKE',$value);
            }
            if ($key == 'menu') {
                $data->where('t_transaksi.kode','LIKE',$value);
            }
        }
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
     
    if(isset($params['is_print']) && 1 == $params['is_print']) {
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

$app->get('/b_laporan/per_bulan',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $default = date('m');

    $data = $db->select('YEAR(t_transaksi.tanggal) as tahunku,DAY(t_transaksi.tanggal) as hariku,MONTH(t_transaksi.tanggal) as bulanku,m_konsumen.id,m_pembayaran.id_pembayaran,t_transaksi.id_transaksi,t_transaksi.diskon,t_transaksi.kode,t_transaksi.tanggal,m_konsumen.nama,t_transaksi.total,m_pembayaran.jenis_pembayaran,m_customer.status,m_customer.id_status')
    ->from('t_transaksi')
    ->leftJoin('m_konsumen','t_transaksi.id_customer = m_konsumen.id')
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
            if ($key == 'kategori') {
                $data->where('t_transaksi.id_user','LIKE',$value);
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

        if(isset($params['kategori']) && !empty($params['kategori'])) {
            $coba->where('m_kategori.id','=',$params['kategori']);
        }
        
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
        $content = $view->fetch('laporan/tabel_menu.html', [
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
    }else {
    return successResponse($response, [
        'list' => $arraybaruku,
        'produk' => $produk_final,
        'kategori' => $kategori_final,
        'month' => $bulan
        ]);
    }
});

$app->get('/b_laporan/customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $default = date('m');
    $default2 = date('Y');

    $data = $db->select('m_konsumen.id,m_pembayaran.id_pembayaran,t_transaksi.id_transaksi,t_transaksi.diskon,t_transaksi.kode,t_transaksi.tanggal,m_konsumen.nama,t_transaksi.total,m_pembayaran.jenis_pembayaran,m_customer.status,m_customer.id_status')
    ->from('t_transaksi')
    ->leftJoin('m_konsumen','t_transaksi.id_customer = m_konsumen.id')
    ->leftJoin('m_pembayaran','t_transaksi.jenis_pembayaran = m_pembayaran.id_pembayaran')
    ->leftJoin('m_customer','t_transaksi.status = m_customer.id_status')
    ->where('t_transaksi.is_deleted', '=',0);

    
    if(isset($params['month']) && isset($params['year'])){
        $data->where('MONTH(t_transaksi.tanggal)', '=', $params['month']);
        $data->where('YEAR(t_transaksi.tanggal)', '=', $params['year']);
    }   
    

    if($params['awal'] == 1){
        $data->where('MONTH(t_transaksi.tanggal)', '=', $default);
        $data->where('YEAR(t_transaksi.tanggal)', '=', $default2);
        $params['month'] = $default;
        $params['year'] = $default2;
    }

    if(isset($params['customer']) && !empty($params['customer'])){
        $data->where('m_konsumen.nama','LIKE',$params['customer']);
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
    }

    $list=[];
    $month = $params['month'];
    $year = $params['year'];

    $date_c = 0;
    for($d=1; $d<=31; $d++){
        $time=mktime(12, 0, 0, $month, $d, $year);          
        if (date('m', $time)==$month){     
            $list[$date_c]['hari']= date('d', $time);
            $list[$date_c]['tanggal']= date('Y-m-d', $time);
            $list[$date_c]['detail']= [];
            $date_c += 1;
        }
    }

    $customer_all =[];

    for($x=0; $x<count($model); $x++){
        $customer_all[$x]['customer'] = $model[$x]->nama;
    }

    $customer_final=[];

    $tempArr = array_unique(array_column($customer_all, 'customer'));

    $baruan = array_intersect_key($customer_all, $tempArr);
    $w = 0;
    for($x=0; $x<count($customer_all);$x++){
        if($baruan[$x]['customer'] != null){
            $customer_final[$w] = ['customer' => $baruan[$x]['customer']]; 
            $w +=1;
        }
    }

    for($x=0; $x<count($model); $x++){
        for($i=0; $i<count($list); $i++){
            if($model[$x]->tanggal == $list[$i]['tanggal']){
                if($list[$i]['detail'][0] == null){
                    $list[$i]['detail'][0]['nama'] = $model[$x]->nama;
                    $list[$i]['detail'][0]['total'] = $model[$x]->total;
                }else{
                    for($h=0; $h<count($list[$i]['detail']); $h++){
                        if($model[$x]->nama == $list[$i]['detail'][$h]['nama']){
                            $list[$i]['detail'][$h]['total'] += $model[$x]->total;
                        }else{
                            $total_list = count($list[$i]['detail']);
                            $total_list2 = count($list[$i]['detail'])+1;
                            for($m=$total_list; $m<$total_list2; $m++){
                                $list[$i]['detail'][$m]['nama'] = $model[$x]->nama;
                                $list[$i]['detail'][$m]['total'] = $model[$x]->total;
                            }
                        }
                    }
                }
            }
        }
    }

    for($x=0; $x<count($list); $x++){
        for($i=0; $i<count($list[$x]['detail']); $i++){
            $list[$x]['g_total'] +=  $list[$x]['detail'][$i]['total'];
        }
    }

    $cobajawes = count($customer_final);

    if (isset($params['is_export']) && 1 == $params['is_export']) {
        $view = twigView();
        $content = $view->fetch('laporan/tabel_customer.html', [
            'list' => $list,
            'year' => $year,
            'month' => $month,
            'customer' => $customer_final
        ]);
      
        echo $content;

       
     
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
    }else{
        return successResponse($response, [
            'list' => $list,
            'year' => $year,
            'month' => $month,
            'customer' => $customer_final,
            'totalItems'=> $cobajawes
            ]);
    }
});

$app->get('/b_laporan/test',function ($request,$response){
    $link = 'http://tes-web.landa.id/intermediate/menu';

    $data = json_decode(get_api($link));

    $all_kategori = [];
    for($x=0; $x<count($data); $x++){
        $coba = ['kategori' => $data[$x]->kategori];
        array_push($all_kategori, $coba);
    }

    $tempArr2 = array_unique(array_column($all_kategori, 'kategori'));

    $kategori_final = [];

    $baruan2 = array_intersect_key($all_kategori, $tempArr2);

    $w = 0;
    for($x=0; $x<count($all_kategori);$x++){
        if($baruan2[$x]['kategori'] != null){
            $kategori_final[$w]['kategori'] = $baruan2[$x]['kategori']; 
            $w +=1;
        }
    }

    return successResponse($response, [
            'list' => $data,
            'kategori' => $kategori_final
            ]);
});

$app->get('/b_laporan/tanggalan',function ($request,$response){
    $link = 'http://tes-web.landa.id/intermediate/transaksi?tahun=2021';

    $data = json_decode(get_api($link));

    $list=[];
    $year = $params['year'];
    $date_c = 0;

    for ($m=1; $m<=12; $m++) {
        $month = date('F', mktime(0,0,0,$m, 1, date('Y')));
        $list[$date_c]['bulan']= $month;
        $list[$date_c]['detail']= [];
        $date_c += 1;
    }

    for($x=0; $x<count($data); $x++){
        for($i=0; $i<count($list); $i++){
            $month = date('F', strtotime($data[$x]->tanggal));
            if(date('F', strtotime($data[$x]->tanggal)) == $list[$i]['bulan']){
                if($list[$i]['detail'] == null){
                    $list[$i]['detail'][0]['menu'] = $data[$x]->menu;
                    $list[$i]['detail'][0]['bulan'] = $month;
                    $list[$i]['detail'][0]['total'] = $data[$x]->total;
                }else{
                    for($h=0; $h<count($list[$i]['detail']); $h++){
                        if($data[$x]->menu == $list[$i]['detail'][$h]['menu']){
                            $list[$i]['detail'][$h]['menu'] = $data[$x]->menu;
                            $list[$i]['detail'][$h]['bulan'] = $month;
                            $list[$i]['detail'][$h]['total'] += $data[$x]->total;
                        }else{
                            $total_seluruhlo = count($list[$i]['detail']);

                        }
                    }
                }
            }
        }
    }


    // for($i=0; $i<count($data); $i++){
    //     for($q=0; $q<count($list); $q++){
    //         if(date('F', strtotime($data[$i]->tanggal)) == $list[$q]['bulan']){
    //             if($list[$q]['detail'][0] == null){
    //                 $list[$q]['detail'][0]['menu'] = $data[$i]->menu;
    //                 $list[$q]['detail'][0]['tanggal'] = date('F', strtotime($data[$i]->tanggal));
    //                 $list[$q]['detail'][0]['total'] = $data[$i]->total;
    //             }else{
    //                 for($x=0; $x<count($list[$q]['detail']); $x++){
    //                     if($data[$i]->menu != $list[$q]['detail'][$x]['menu']){
    //                         $total_punya = count($list[$q]['detail']);
    //                         $total_punya2 = count($list[$q]['detail'])+1;
    //                         for($b=$total_punya; $b<$total_punya2; $b++){
    //                             $list[$q]['detail'][$b]['menu'] = $data[$i]->menu;
    //                             $list[$q]['detail'][$b]['tanggal'] = date('F', strtotime($data[$i]->tanggal));
    //                             $list[$q]['detail'][$b]['total'] = $data[$i]->total;
    //                         }
    //                     }else{
    //                         $list[$q]['detail'][$x]['total'] += $data[$i]->total;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

    return successResponse($response, [
            'list' => $list,
            'coba' => $total_seluruhlo
            ]);
});

function get_api($link){
	$info = getimagesize($source);

	$ch = curl_init();
    curl_setopt_array($ch, array(
        CURLOPT_URL => $link
    , CURLOPT_HEADER => 0
    , CURLOPT_RETURNTRANSFER => 1
    , CURLOPT_ENCODING => 'gzip'
    ));
    $data = curl_exec($ch);
    return $data;
}

$app->get('/b_laporan/test_menu',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $menu = $db->select("nama as menu, kategori")
            ->from("m_menu");

    if(isset($params['kategori']) && !empty($params['kategori'])){
        $db->where('m_menu.kategori','=',$params['kategori']);
    }

    $model = $db->findAll();

    echo json_encode($model);
});

$app->get('/b_laporan/test_transaksi',function ($request,$response){
    $params = $request->getParams();
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $db = Db::db();
    if (isset($tahun) && !empty($tahun)) {
        $data = $db->select("t_pesanan.tanggal, m_menu.nama as menu, t_pesanan_detail.total")
            ->from("t_pesanan_detail")
            ->innerJoin("t_pesanan", "t_pesanan_detail.t_pesanan_id = t_pesanan.id")
            ->innerJoin("m_menu", "t_pesanan_detail.m_menu_id = m_menu.id")
            ->orderBy("tanggal ASC")
            ->where("year(t_pesanan.tanggal)", "=", $tahun)
            ->andwhere("month(t_pesanan.tanggal)", "=", $bulan)
            ->findAll();
        echo json_encode($data);
    }
});

$app->get('/b_laporan/test_perbulan', function ($request, $response) {
    $params = $request->getParams();
    $limit = $params['limit'];
    $offset = $params['offset'];
    $is_tampil = false;
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;;
    $f_kategori = urlencode($params['kategori']);
    $dataMakanan = [];
    $dataMinuman = [];
    $total_bawah = [];
    $grand_total = 0;
    if (isset($tahun) && !empty($tahun)) {
        $is_tampil = true;
        $data = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_transaksi?tahun={$tahun}&bulan={$bulan}"));
        $menu = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_menu?kategori={$f_kategori}"));
        $number = cal_days_in_month(CAL_GREGORIAN, $bulan, $tahun);
        //Kelola menu makanan
        $dataMenu = [];
        foreach ($menu as $value) {
            $dataMenu[$value->menu] = $value;
        }

        //Kelola isian data
        foreach ($data as $value) {
            $data[$value->menu]['menu'] = $value->menu;
            $data[$value->menu]['hari'] = [];
            $data[$value->menu]['total_kanan'] = 0;
            $data[$value->menu]['awal'][(int)date("d", strtotime($value->tanggal))][] = $value->total;
            for ($i = 1; $i <= $number; $i++) {
                if (isset($data[$value->menu]['awal'][$i])) {
                    $jumlah = array_sum($data[$value->menu]['awal'][$i]);
                    array_push($data[$value->menu]['hari'], ['hariku'=>$i,'total'=>$jumlah]);
                } else {
                    $jumlah = 0;
                    array_push($data[$value->menu]['hari'], ['hariku'=>$i,'total'=>$jumlah]);
                }
                $data[$value->menu]['total_kanan'] += $jumlah;
            }
        }

        $itungan=[];

        for ($i = 1; $i <= $number; $i++) {
            array_push($itungan, ['hariku'=>$i,'total'=>0]);
        }

        //Marge data
        foreach ($dataMenu as $value) {
            $dataMenu[$value->menu]->hari = (isset($data[$value->menu]['hari'])) ? $data[$value->menu]['hari'] : $itungan;
            $dataMenu[$value->menu]->total_kanan = (isset($data[$value->menu]['total_kanan'])) ? $data[$value->menu]['total_kanan'] : 0;

            if ($value->kategori == 'makanan') {
                $dataMakanan[$value->menu] = $dataMenu[$value->menu];
            }
            if ($value->kategori == 'minuman') {
                $dataMinuman[$value->menu] = $dataMenu[$value->menu];
            }
        }

        $total_bawah = [];

        for ($i = 1; $i <= $number; $i++) {
            array_push($total_bawah,['hari' => $i, 'total' => 0]);
        }

        foreach ($dataMenu as $key => $value) {
            $dataMenu[$key] = (array) $value;
            for ($i = 0; $i < count($dataMenu[$key]['hari']); $i++) {
                $countku = count($dataMenu[$key]['hari']);
                $countku2 = count($dataMenu[$key]['hari'])+2;
                for($x = 0; $x < count($total_bawah); $x++){
                    if ($dataMenu[$key]['hari'][$i]['hariku'] == $total_bawah[$x]['hari']) {
                        $total = $dataMenu[$key]['hari'][$i]['total'];
                        $total_bawah[$x]['total'] += $total;
                    }
                }
            }
        }

        for ($i = 0; $i < count($total_bawah); $i++) {
            $nominal = $total_bawah[$i]['total'];
            $grand_total += $nominal;
        }

        $dataFinal = [];
        $data_excel = [];

        foreach ($dataMakanan as $value) {
            array_push($dataFinal, ['menu' => $value->menu,'kategori' => $value->kategori,'hari' => $value->hari,'total_kanan' => $value->total_kanan]);
            array_push($data_excel, ['menu' => $value->menu,'kategori' => $value->kategori,'hari' => $value->hari,'total_kanan' => $value->total_kanan]);
        }

        $dataFinalM = [];

        foreach ($dataMinuman as $value) {
            array_push($dataFinalM, ['menu' => $value->menu,'kategori' => $value->kategori,'hari' => $value->hari,'total_kanan' => $value->total_kanan]);
            array_push($data_excel, ['menu' => $value->menu,'kategori' => $value->kategori,'hari' => $value->hari,'total_kanan' => $value->total_kanan]);
        }
    }

    if($params['is_export'] == 1){
        $spreadsheet = new Spreadsheet();

        $sheet = $spreadsheet->getActiveSheet();
        
		$sheet->setCellValue('A2', 'Menu');
		$sheet->mergeCells("B1:C1");
		$sheet->setCellValue('B1', 'Periode : '.$bulan.'-'.$tahun);

		$c_tanggal = 2;
		for ($i=1; $i <= count($total_bawah); $i++) { 
			$sheet->setCellValueByColumnAndRow($c_tanggal, 2, $i);
			$c_tanggal++;

			if ($i == count($total_bawah)) {
				$sheet->setCellValueByColumnAndRow($c_tanggal++, 2, "Total");
			}
		}

		$row = 3;
		for ($x=0; $x < count($data_excel); $x++) {
			if ($x == 0) {
				
				$sheet->setCellValueByColumnAndRow(1, $row, 'Grand Total');
				$c_g = 2;
				for ($p=0; $p < count($total_bawah); $p++) {
					$sheet->setCellValueByColumnAndRow($c_g, $row, $total_bawah[$p]['total']);
					$c_g++;

					if ($p + 1 == count($total_bawah)) {
						$sheet->setCellValueByColumnAndRow($c_g++, $row, $grand_total);
					}
				}
				$row++;
			}

			$sheet->setCellValueByColumnAndRow(1, $row, $data_excel[$x]['menu']);

            $c_d = 2;
			for ($i=0; $i< count($total_bawah); $i++) { 
				$detail = $data_excel[$x]['hari'][$i];
				$sheet->setCellValueByColumnAndRow($c_d, $row, $detail['total']);
				$c_d++;

				if ($i + 1 == count($total_bawah)) {
					$sheet->setCellValueByColumnAndRow($c_d++, $row, $data_excel[$x]['total_kanan']);
				}
			}

			$row++;
		}
        
        $writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	    header('Content-Disposition: attachment; filename="'.'laporan menu.xlsx'.'"');

	    $writer->save('php://output');
    }else{
        return successResponse($response, [
            "is_tampil" => $is_tampil,
            "tahun" => $tahun,
            "bulanku" => $bulan,
            "bulan" =>  date('F', mktime(0,0,0,$bulan, 1, date($tahun))),
            "allTahun" => [
                "2022",
                "2021"
            ],
            "allBulan" => [
                "01",
                "02",
                "03"
            ],
            "data_makanan" => $dataFinal,
            "data_minuman" => $dataFinalM,
            'totalItems' => count($dataFinal),
            "total_bawah" => $total_bawah,
            "grand_total" => $grand_total,
            "colspanku" => $countku,
            "colspanku2" => $countku2,
        ]);
    }
});

$app->get('/b_laporan/test_customer',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $f_customer = $params['customer'];

    $menu = $db->select("nama as customer")
                        ->from("m_customer");

    $nama = (explode(',', $f_customer));
    foreach($nama as $name){
        $db->orWhere('nama', 'LIKE', $name.'%');
    }

    $db->andwhere("is_deleted", "=", "0");

    $model = $db->findAll();

    
    echo json_encode($model);
});

$app->get('/b_laporan/test_c_transaksi',function ($request,$response){
    $params = $request->getParams();
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $db = Db::db();
    if (isset($tahun) && !empty($tahun)) {
        $data = $db->select("t_pesanan.tanggal, m_customer.nama as customer, t_pesanan_detail.total")
            ->from("t_pesanan_detail")
            ->innerJoin("t_pesanan", "t_pesanan_detail.t_pesanan_id = t_pesanan.id")
            ->innerJoin("m_customer", "t_pesanan.m_customer_id = m_customer.id")
            ->orderBy("tanggal ASC")
            ->where("year(t_pesanan.tanggal)", "=", $tahun)
            ->andwhere("month(t_pesanan.tanggal)", "=", $bulan)
            ->findAll();
        echo json_encode($data);
    }
});

$app->get('/b_laporan/test_p_customer', function ($request, $response) {
    $params = $request->getParams();
    $is_tampil = false;
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $f_customer = urlencode($params['customer']);
    $dataCustomerlo = [];
    $total_bawah = [];
    $grand_total = 0;
    if (isset($tahun) && !empty($tahun)) {
        $is_tampil = true;
        $data = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_c_transaksi?tahun={$tahun}&bulan={$bulan}"));
        $customer = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_customer?customer={$f_customer}"));
        $number = cal_days_in_month(CAL_GREGORIAN, $bulan, $tahun);
        //Kelola menu makanan
        $dataCustomer = [];
        foreach ($customer as $value) {
            $dataCustomer[$value->customer] = $value;
        }

        //Kelola isian data
        foreach ($data as $value) {
            $data[$value->customer]['customer'] = $value->customer;
            $data[$value->customer]['hari'] = [];
            $data[$value->customer]['total_kanan'] = 0;
            $data[$value->customer]['awal'][(int)date("d", strtotime($value->tanggal))][] = $value->total;
            for ($i = 1; $i <= $number; $i++) {
                if (isset($data[$value->customer]['awal'][$i])) {
                    $jumlah = array_sum($data[$value->customer]['awal'][$i]);
                    array_push($data[$value->customer]['hari'], ['hariku'=>$i,'total'=>$jumlah]);
                } else {
                    $jumlah = 0;
                    array_push($data[$value->customer]['hari'], ['hariku'=>$i,'total'=>$jumlah]);
                }
                $data[$value->customer]['total_kanan'] += $jumlah;
            }
        }

        $itungan=[];

        for ($i = 1; $i <= $number; $i++) {
            array_push($itungan, ['hariku'=>$i,'total'=>0]);
        }

        //Marge data
        foreach ($dataCustomer as $value) {
            $dataCustomer[$value->customer]->hari = (isset($data[$value->customer]['hari'])) ? $data[$value->customer]['hari'] : $itungan;
            $dataCustomer[$value->customer]->total_kanan = (isset($data[$value->customer]['total_kanan'])) ? $data[$value->customer]['total_kanan'] : 0;

            $dataCustomerlo[$value->customer] = $dataCustomer[$value->customer];
        }

        $total_bawah = [];

        for ($i = 1; $i <= $number; $i++) {
            array_push($total_bawah,['hari' => $i, 'total' => 0]);
        }

        foreach ($dataCustomer as $key => $value) {
            $dataCustomer[$key] = (array) $value;
            for ($i = 0; $i < count($dataCustomer[$key]['hari']); $i++) {
                $countku = count($dataCustomer[$key]['hari']);
                $countku2 = count($dataCustomer[$key]['hari'])+2;
                for($x = 0; $x < count($total_bawah); $x++){
                    if ($dataCustomer[$key]['hari'][$i]['hariku'] == $total_bawah[$x]['hari']) {
                        $total = $dataCustomer[$key]['hari'][$i]['total'];
                        $total_bawah[$x]['total'] += $total;
                    }
                }
            }
        }

        for ($i = 0; $i < count($total_bawah); $i++) {
            $nominal = $total_bawah[$i]['total'];
            $grand_total += $nominal;
        }

        $dataFinal = [];

        foreach ($dataCustomer as $value) {
            array_push($dataFinal, ['customer' => $value['customer'],'hari' => $value['hari'],'total_kanan' => $value['total_kanan']]);
        }
    }

    if($params['is_export'] == 1){
        // require_once('vendor/autoload.php');
        
        // Creates New Spreadsheet
        $spreadsheet = new Spreadsheet();
        
        // Retrieve the current active worksheet
        $sheet = $spreadsheet->getActiveSheet();
        
        $sheet->setCellValue('A2', 'No');
		$sheet->setCellValue('B2', 'Customer');
		$sheet->mergeCells("C1:E1");
		$sheet->setCellValue('C1', 'Periode : '.$bulan.'-'.$tahun);

        // header table
		$c_h = 3;
		for ($i=1; $i <= count($total_bawah); $i++) { 
			$sheet->setCellValueByColumnAndRow($c_h, 2, $i);
			$c_h++;

			if ($i == count($total_bawah)) {
				$sheet->setCellValueByColumnAndRow($c_h++, 2, "Total");
			}
		}

		$row = 3;
		$no  = 0;
		for ($x=0; $x < count($dataFinal); $x++) {
			if ($x == 0) {				
				$sheet->mergeCells("A3:B3");
				$sheet->setCellValueByColumnAndRow(1, $row, "Grand Total");
				$c_g = 3;
				for ($p=0; $p < count($total_bawah); $p++) {
					$sheet->setCellValueByColumnAndRow($c_g, $row, $total_bawah[$p]['total']);
					$c_g++;

					if ($p + 1 == count($total_bawah)) {
						$sheet->setCellValueByColumnAndRow($c_g++, $row, $grand_total);
					}
				}
				$row++;
			}

            $no++;
			$sheet->setCellValueByColumnAndRow(1, $row, $no);

			$sheet->setCellValueByColumnAndRow(2, $row, $dataFinal[$x]['customer']);

            $c_d = 3;
			for ($i=0; $i< count($total_bawah); $i++) { 
				$detail = $dataFinal[$x]['hari'][$i];
				$sheet->setCellValueByColumnAndRow($c_d, $row, $detail['total']);
				$c_d++;

				if ($i + 1 == count($total_bawah)) {
					$sheet->setCellValueByColumnAndRow($c_d++, $row, $dataFinal[$x]['total_kanan']);
				}
			}

			$row++;
		}
        
        $writer = new Xlsx($spreadsheet);
		header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
	    header('Content-Disposition: attachment; filename="'.'laporan customer.xlsx'.'"');

	    $writer->save('php://output');
    }else{
        return successResponse($response, [
            "is_tampil" => $is_tampil,
            "tahun" => $tahun,
            "bulanku" => $bulan,
            "bulan" =>  date('F', mktime(0,0,0,$bulan, 1, date($tahun))),
            "list"      => $dataFinal,
            "colspanku" => $countku,
            "total_bawah" => $total_bawah,
            "grand_total" => $grand_total
            
        ]);
    }
});

$app->get('/b_laporan/test_kode',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $f_customer = $params['customer'];

    $menu = $db->select("t_pesanan.id,t_pesanan.kode,t_pesanan.tanggal,t_pesanan.diskon, t_pesanan.voucher,m_customer.nama as customer")
            ->from("t_pesanan")
            ->leftJoin("m_customer", "t_pesanan.m_customer_id = m_customer.id");

    $nama = (explode(',', $f_customer));
    foreach($nama as $name){
        $db->orWhere('m_customer.nama', 'LIKE', $name.'%');
    }

    $db->where("year(t_pesanan.tanggal)", "=", $tahun);
    $db->andwhere("month(t_pesanan.tanggal)", "=", $bulan);
    $db->orderBy("t_pesanan.tanggal ASC");

    $model = $db->findAll();

    
    echo json_encode($model);
});

$app->get('/b_laporan/test_kode_detail',function ($request,$response){
    $params = $request->getParams();
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $f_menu = $params['menu'];

    $db = Db::db();
    if (isset($tahun) && !empty($tahun)) {
        $data = $db->select("t_pesanan_detail.t_pesanan_id as id, m_menu.nama as menu , m_menu.harga,t_pesanan_detail.jumlah,t_pesanan_detail.total")
            ->from("t_pesanan_detail")
            ->innerJoin("t_pesanan", "t_pesanan_detail.t_pesanan_id = t_pesanan.id")
            ->innerJoin("m_menu", "t_pesanan_detail.m_menu_id = m_menu.id");

        $nama = (explode(',', $f_menu));
        foreach($nama as $name){
            $db->orWhere('m_menu.nama', 'LIKE', $name.'%');
        }

        $db->orderBy("id ASC");
        $db->where("year(t_pesanan.tanggal)", "=", $tahun);
        $db->where("month(t_pesanan.tanggal)", "=", $bulan);
    
        $model = $db->findAll();

        echo json_encode($model);
    }
});

$app->get('/b_laporan/test_kode_final',function ($request,$response){
    $params = $request->getParams();
    $limit = $params['limit'];
    $offset = $params['offset'];
    $is_tampil = false;
    $tahun = (isset($params['tahun'])) ? $params['tahun'] : null;
    $bulan = (isset($params['bulan'])) ? $params['bulan'] : null;
    $f_customer = urlencode($params['customer']);
    $f_menu = urlencode($params['menu']);
    $datacobaan = [];
    if (isset($tahun) && !empty($tahun)) {
        $is_tampil = true;
        $detail = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_kode_detail?tahun={$tahun}&bulan={$bulan}&menu={$f_menu}"));
        $kode = json_decode(file_get_contents("http://localhost/training-angular-9/api/b_laporan/test_kode?tahun={$tahun}&bulan={$bulan}&customer={$f_customer}"));
        $number = cal_days_in_month(CAL_GREGORIAN, $bulan, $tahun);
        //Kelola menu makanan
        $dataList = [];
        foreach ($kode as $value) {
            $dataList[$value->id] = $value;
            $dataList[$value->id]->detail = [];
        }

        foreach ($detail as $value) {
            array_push($dataList[$value->id]->detail, ['menu' => $value->menu,'jumlah'=> $value->jumlah,'harga'=> $value->harga,'total'=> $value->total]);
            $dataList[$value->id]->total_bayar += $value->total; 
        }

        foreach ($dataList as $value){
            if($value->voucher != null && $value->voucher != ''){
                $dataList[$value->id]->total_diskon = $value->total_bayar - $value->voucher;
            }
            if($value->diskon != null && $value->diskon != ''){
                $diskon = ($value->diskon/100) * $value->total_bayar;
                $dataList[$value->id]->total_diskon = $value->total_bayar - $diskon;
            }
            if($value->diskon == null && $value->diskon == '' && $value->voucher == null && $value->voucher == ''){
                $dataList[$value->id]->total_diskon = $value->total_bayar;
            }
        }

        $dataFinal = [];

        foreach ($dataList as $value) {
            array_push($dataFinal, ['id' => $value->id,'kode' => $value->kode,'tanggal' => $value->tanggal,'diskon' => $value->diskon,'voucher' => $value->voucher,'customer' => $value->customer,'detail' => $value->detail,'total_bayar' => $value->total_bayar,'total_diskon' => $value->total_diskon, 'rows' => count($value->detail)+1,'rows_baru' => count($value->detail)]);
        }

        for ($i = 0; $i < count($dataFinal); $i++) {
            if($dataFinal[$i]['id'] != null){
                $nominal = $dataFinal[$i]['total_bayar'];
                $grand_total += $nominal;
            }
        }

        for ($i = 0; $i < count($dataFinal); $i++) {
            if($dataFinal[$i]['id'] != null){
                $nominal = $dataFinal[$i]['total_diskon'];
                $grand_diskon += $nominal;
            }
        }
    }

    if(isset($params['is_print'])){
        require_once 'vendor/tecnickcom/tcpdf/examples/tcpdf_include.php';
        $pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

            // set document information
            $pdf->SetCreator(PDF_CREATOR);
            $pdf->SetAuthor('Nicola Asuni');
            $pdf->SetTitle('TCPDF Example 002');
            $pdf->SetSubject('TCPDF Tutorial');
            $pdf->SetKeywords('TCPDF, PDF, example, test, guide');

            // remove default header/footer
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);

            // set default monospaced font
            $pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

            // set margins
            $pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);

            // set auto page breaks
            $pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

            // set image scale factor
            $pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

            // set some language-dependent strings (optional)
            if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
                require_once(dirname(__FILE__).'/lang/eng.php');
                $pdf->setLanguageArray($l);
            }

            // ---------------------------------------------------------

            // set font
            $pdf->SetFont('times', 'BI', 20);

            // add a page
            $pdf->AddPage();

        $pdf->SetFont('helvetica', '', 8);

        // -----------------------------------------------------------------------------
        $tbl = '';
        $tbl .='
         <table cellspacing="0" cellpadding="1" border="1">
            <tr style="text-align: center;">
                <th rowspan="2">No Struk</th>
                <th rowspan="2">Customer</th>
                <th rowspan="2">Tanggal</th>
                <th rowspan="2">Menu</th>
                <th rowspan="2">Jumlah</th>
                <th rowspan="2">Harga</th>
                <th rowspan="2">Total</th>
                <th colspan="2">Promo</th>
                <th rowspan="2">Total Bayar</th>
            </tr>
            <tr style="text-align: center;">
                <th>Diskon</th>
                <th>Voucher</th>
            </tr>';
        for($i=0; $i<count($dataFinal); $i++){
            if($dataFinal[$i]['detail'] != '' && $dataFinal[$i]['detail'] != null){
                if($dataFinal[$i]['customer'] != ''){
                    $tbl .= '<tr style="text-align: center;">
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">'.$dataFinal[$i]['kode'].'</th>
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">'.$dataFinal[$i]['customer'].'</th>
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">'.$dataFinal[$i]['tanggal'].'</th>
                                <th>'.$dataFinal[$i]['detail'][0]['menu'].'</th>
                                <th>'.$dataFinal[$i]['detail'][0]['jumlah'].'</th>
                                <th>'.$dataFinal[$i]['detail'][0]['harga'].'</th>
                                <th>'.$dataFinal[$i]['detail'][0]['total'].'</th>
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">0</th>
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">0</th>
                                <th rowspan="'.$dataFinal[$i]['rows_baru'].'">'.$dataFinal[$i]['total_bayar'].'</th>
                            </tr>';    
                }
            }
            for($x=0; $x<count($dataFinal[$i]['detail']); $x++){
                if($dataFinal[$i]['detail'][$x]['menu'] != $dataFinal[$i]['detail'][0]['menu']){
                    $tbl .='<tr style="text-align: center;">
                                <th>'.$dataFinal[$i]['detail'][$x]['menu'].'</th>
                                <th>'.$dataFinal[$i]['detail'][$x]['jumlah'].'</th>
                                <th>'.$dataFinal[$i]['detail'][$x]['harga'].'</th>
                                <th>'.$dataFinal[$i]['detail'][$x]['total'].'</th>
                            </tr>';    
                }
            }
        }
        $tbl .= '</table>';  

        $pdf->writeHTML($tbl);  

        $pdf->Output('laporan_penjualan.pdf', 'I');
    }else{
        return successResponse($response, [
            "is_tampil" => $is_tampil,
            "list" => $dataFinal,
            "grand_total" => $grand_total,
            "grand_diskon" => $grand_diskon
        ]);
    }
});


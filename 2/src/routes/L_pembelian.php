<?php
use Service\Db;
use Service\Landa;

$app->get('/L_pembelian/getAll', function($request,$response){
    $params = $request->getParams();
    $db     = Db::db();

    if ('null' != $params['periode_mulai'] && 'null' != $params['periode_selesai']) {
        $tanggal_awal = date('Y-m-d', strtotime($params['periode_mulai']));
        $tanggal_akhir = date('Y-m-d', strtotime($params['periode_selesai']));
    } else {
        $tanggal_awal = null;
        $tanggal_akhir = null;
    }


    $db->select('t_pembelian.*,
                 t_pembelian_det.jumlah_barang,
                 t_pembelian_det.harga,
                 t_pembelian_det.diskon,
                 t_pembelian_det.jumlah_diskon,
                 t_pembelian_det.total_item,
                 m_barang.nama as nama_barang,
                 m_supplier.nama as nama_sup')
        ->from('t_pembelian')
        ->leftJoin('t_pembelian_det','t_pembelian_det.t_pembelian_id = t_pembelian.id')
        ->leftJoin('m_barang','t_pembelian_det.m_barang_id = m_barang.id')
        ->leftJoin('m_supplier','t_pembelian.m_supplier_id = m_supplier.id')
        ->where('t_pembelian.tanggal', '>=', $tanggal_awal)
        ->andwhere('t_pembelian.tanggal', '<=', $tanggal_akhir);

        if (!empty($params['supplier_id'])) {
            $db->where('t_pembelian.m_supplier_id','=', $params['supplier_id']);

        }

        $models = $db->findAll();
        
        $arrperTgl = [];

        if (!empty($models)) {
            foreach ($models as $key => $value) {
               if(!isset($arrperTgl[$value->tanggal])){
                $arrperTgl[$value->tanggal]['tgl'] = $value->tanggal;
                $arrperTgl[$value->tanggal]['kode'] = $value->kode;
                $arrperTgl[$value->tanggal]['total'] = 0;
                $arrperTgl[$value->tanggal]['rows'] = 0;

               }
               $arrperTgl[$value->tanggal]['detail'][] = $value;
               $arrperTgl[$value->tanggal]['total'] += $value->total_item;
               $arrperTgl[$value->tanggal]['rows'] += 1;

            }
        }
        $arrBaru = [];
        $ind     = 0;   
        $total = $qty = 0;
        foreach ($arrperTgl as $key => $val) {
            $arrBaru[$ind] = (array) $val;
      
            $ind++;
        }

        $total_bawah    = 0;
       foreach ($arrBaru as $key => $value) {
        if (isset($value['total']) && $value['total'] != 0) {
            $total_bawah += $value['total'];
         
        }
    }

    $nama_sup  = $db->select('m_supplier.nama')
    ->from('m_supplier')
    ->where('m_supplier.id','=',$params['supplier_id'])
    ->find();



    $data = [
        'tgl_awal' => $tanggal_awal,
        'tgl_akhir' => $tanggal_akhir,
        'sup'       => $nama_sup->nama,
        'total_bawah'=>$total_bawah
    ];

   

      


        if (isset($params['is_export']) && 1 == $params['is_export']) {
            $view = twigView();
            $content = $view->fetch('laporan/laporan_pembelianexport.html', [
              'list' => $arrBaru,
              'data_atas'=> $data
           
            ]);
          
            echo $content;

           
         
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;Filename="List Pembelian.xls"');
        }

          elseif(isset($params['is_print']) && 1 == $params['is_print']) {
            $view = twigView();
            $content = $view->fetch('laporan/laporan_pembelian.html', [
              'list' => $arrBaru,
              'data_atas'=> $data             
            
            ]);
            echo $content;
          
            echo '<script type="text/javascript">window.print();setTimeout(function () { window.close(); }, 500);</script>';

          }
          else {
            return successResponse($response, [
              'list' => $arrBaru,
              'data_atas'=> $data
            
              ]);
          }


});
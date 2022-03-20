<?php
use Service\Db;
use Service\Landa;

$data_global =[
    [
        'id'        => '1',
        'nama'      => 'farid',
        'email'     => 'farid@email.com',
        'alamat'    => 'Teluk Grajakan',
        'no_telp'   => '08973678182',
        'password'  => 'admin'
    ],
    [
        'id'        => '2',
        'nama'      => 'kevin',
        'email'     => 'kevin@email.com',
        'alamat'    => 'Btu',
        'no_telp'   => '087818412104',
        'password'  => 'kevin123'
    ]
];
$data_forgot =[
    [
        'id'           => '1',
        'nama'         => 'joni',
        'email'        => 'joni@email.com',
        'no_telp'      => '081234',
        'password'     => 'joni_ganteng'
    ],
    [
        'id'           => '2',
        'nama'         => 'bela',
        'email'        => 'bela@email.com',
        'no_telp'      => '082345',
        'password'     => 'bela_cantik'
    ],
    [
        'id'           =>  '3',
        'nama'         =>  'andi',
        'email'        =>  'andi@email.com',
        'no_telp'      =>  '083456',
        'password'     =>  'andi_ganteng'

    ]
];
$data_individu =[
    [
        'id'        => 1,
        'kasir'     => 'joni',
        'customer'  => 'member',
        'nominal'   => 25000
    ],
    [
        'id'        => 3,
        'kasir'     => 'joni',
        'customer'  => 'member',
        'nominal'   => 50000
    ],
    [
        'id'        => 5,
        'kasir'     => 'joni',
        'customer'  => 'non-member',
        'nominal'   => 12000
    ]
];


$app->post('/auth/setSessions', function ($request, $response) {
    $params = $request->getParams();
        $landa = new Landa();
        $db = Db::db();
        // Ambil data user dari 
       
      
        if (isset($params['email']) && !empty($params['email'])) {
            $data = $db->select('*')
            ->from('m_user')
            ->where('m_user.username' ,'=',$params['email'])
            ->AndWhere('m_user.password','=',sha1($params['password']))
            ->AndWhere('m_user.is_deleted','=', 0)
            ->find();
           if(!empty($data)){
            $_SESSION['user']['nama'] = $data->nama;
            $_SESSION['user']['id'] = $data->id;
            $_SESSION['user']['akses'] =json_decode($data->akses);
            return successResponse($response, ['user' => $_SESSION['user']]);
           }
        }
    return unprocessResponse($response, ['User Tidak Ditemukan']);
})->setName('setSession');

$app->post('/auth/login',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();

    $data = $db->select('*')
    ->from('m_user')
    ->where('m_user.is_deleted','=', 0);

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $username=$input['username'];

    $password=sha1($input['password']);


    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->username == $username && $model[$x]->password == $password || $model[$x]->email == $username && $model[$x]->password == $password){
            $data_akhirku = $model[$x];
            $berhasil = 'Berhasil Login!!';
        }else{
            $berhasil2 = 'Gagal Login!!';
        }
    }
    
    if($berhasil == null){
        $berhasil_akhir = $berhasil2;
    }else{
        $data_akhir = $data_akhirku;
        $berhasil_akhir = $berhasil;
    }

    return successResponse($response, [
        'user' => $data_akhirku,
        'massage' => $berhasil_akhir
    ]);
});

$app->post('/auth/register',function ($request,$response){
    $params = $request->getParams();
    $db = Db::db();


    $data = $db->select('*')
    ->from('m_user');

    $model = $data->findAll();

    $username       =$params['username'];
    $nama           =$params['nama'];
    $password       =sha1($params['password']);
    $c_password     =sha1($params['c_password']);
    $email          = $params['email'];
    $jenis_kelamin  = $params['jenis_kelamin'];
    $alamat         = $params['alamat'];
    $telepon        = $params['telepon'];

    $params['password'] = $password;

    if($username == null){
        $outputc = "Eror";
    }else{
        $outputc = 1;
    }

    if($password == $c_password){
        $outputpass = "";
    }else{
        $outputpass = "Password Tidak Sama!!";
    }

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->username == $username){
            $output = 'Username Telah Terdaftar!!';
        }
        else{
            $output2 = "";
        }
    }

    if($email == "" | $email =='null'){
        $erorlo = "eror";
    }else{
        for($x = 0; $x < count($model); $x++){
            if($model[$x]->email == $email){
                $outemail = 'Email Telah Terdaftar!!';
            }
            else{
                $output2 = "";
            }
        }
    }
    

    if($output == null && $outputpass == null && $outemail == null && $outputc == 1){
        $data_akhir = $db->insert('m_user', $params);
        $hasil_output = 'Berhasil Register, Silahkan Login !!';
    }else{
        $hasil_output = $output." ".$outputpass." ".$outemail;
    }

    return successResponse($response, [
    'user' => $data_akhir,
    'massage' => $hasil_output
  ]);
});

$app->post('/auth/data_user',function ($request,$response){
    $db = Db::db();
    $params = $request->getParams();

    $data = $db->select('*')
    ->from('m_user')
    ->where('m_user.id','=', $params['id'])
    ->andwhere('m_user.is_deleted','=', 0);

    $model = $data->findAll();


    return successResponse($response, [
        'user' => $model,
        'massage' => 'Data!'
    ]);
});

$app->post('/auth/update_profile',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_user');

    $model = $data->findAll();

    $input = $request->getParsedBody();
  
    $id                =$input['id'];
    $nama              =$input['nama'];
    $email             =$input['email'];
    $alamat            =$input['alamat'];
    $no_telp           =$input['no_telp'];
    $password_lama     =sha1($input['password_lama']);
    $password_baru     =sha1($input['password_baru']);
    $c_password_baru   =sha1($input['c_password_baru']);

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
        if(empty($input['password_lama'])){
           $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'alamat' => $alamat, 'telepon' => $no_telp],['id' => $data_update->id]);
           $h_id = 'Data Berhasil di Update!!';
        }else{
            if($data_update->password == $password_lama){
                if($password_baru == $c_password_baru){
                    $update = $db->update('m_user',['nama' => $nama, 'email' => $email, 'alamat' => $alamat, 'telepon' => $no_telp, 'password' => $password_baru],['id' => $data_update->id]);
                    $h_id = 'Data Berhasil di Update!!';
                }else{
                    $h_id = 'Password Tidak Sama!!';
                }
            }else{
                $h_id = 'Password lama salah!!';
            }
        }
    }

    // $db->update('m_barang',['is_deleted' => 1],['id' => $data['id']]);

    // for ($x = 0; $x < count($data); $x++) {
    //     if($data[$x][nama] == $username){
    //         $data[$x][nama]    = $username;
    //         $data[$x][email]  = $email;
    //         $data[$x][alamat]  = $alamat;
    //         $data[$x][no_telp] = $no_telp;

    //         $berhasil = ['nama' => $data[$x][nama], 'email' => $data[$x][email], 'telp' => $data[$x][no_telp], 'password' => $data[$x][password], 'confirm_password' => $data[$x][password]];
    //     }else{
    //         $coba2 = 'eror';
    //     }
    // }

    // if($berhasil == null){
    //     $out = successResponse($response, [
    //         'user' => $berhasil,
    //         'massage' => "Gagal !!"
    //     ]);
    // }else{
    //     $out = successResponse($response, [
    //         'user' => $berhasil,
    //         'massage' => "Berhasil update profile"
    //     ]);
    // }
  
  
    return successResponse($response, [
            'user' => $update,
            'massage' => $h_id
        ]);
});

$app->post('/auth/forgot',function ($request,$response){
    $db = Db::db();
    $input = $request->getParsedBody();


    $data = $db->select('*')
    ->from('m_user');

    $model = $data->findAll();

    $input = $request->getParsedBody();

    $forgot=$input['email'];

    for ($x = 0; $x < count($model); $x++) {
        if($model[$x]->email == $forgot || $model[$x]->telepon == $forgot){
            $h_forgot = $model[$x];
        }else{
            $h_forgot2 = 'eror';
        }
    }

    if($h_forgot == null){
        $output = 'Email Atau Nomor Telepon Tidak Ditemukan!!';
    }else{
        $update = $db->update('m_user',['password' => sha1($h_forgot->username)],['id' => $h_forgot->id]);
        $output = 'Password berhasil di Update!';
    }

    // for ($x = 0; $x < count($data); $x++) {
    //     if($data[$x][email] == $forgot || $data[$x][no_telp] == $forgot){
    //         $nama    = $data[$x][nama];
    //         $email   = $data[$x][email];
    //         $telepon = $data[$x][no_telp];

    //         $berhasil = ['nama' => $nama, 'email' => $email, 'telp' => $telepon];
    //     }else{
    //         $coba2 = 'eror';
    //     }
    // }

    // if($berhasil == null){
    //     $out = successResponse($response, [
    //         'user' => $berhasil,
    //         'massage' => "Data tidak sesuai !!"
    //     ]);
    // }else{
    //     $out = successResponse($response, [
    //         'user' => $berhasil,
    //         'massage' => "Berhasil update password, cek email!!"
    //     ]);
    // }
  
    return successResponse($response, [
            'user' => $h_forgot,
            'massage' => $output
        ]);
});

$app->post('/auth/hapus_data',function ($request,$response){
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

$app->post('/auth/transaksi',function ($request,$response){
    $db = Db::db();

    $data = $db->select('*')
    ->from('t_transaksi');

    $model = $data->findAll();

    for($i=0; $i<count($model); $i++){
       $coba = $db->select('t_transaksi.id_transaksi,t_produk.nama_produk,t_detail_transaksi.qty,t_produk.harga')
    ->from('t_transaksi')
    ->leftJoin('t_detail_transaksi','t_transaksi.id_transaksi = t_detail_transaksi.id_transaksi')
    ->leftJoin('t_produk','t_detail_transaksi.id_produk = t_produk.id_produk')
    ->where('t_transaksi.id_transaksi','=',$model[$i]->id_transaksi);
    $detail = $data->findAll();
    $model[$i]->detail = $detail;
    }


    return successResponse($response, [
                'user' => $model,
                'massage' => "Berhasil"
            ]);

    // $data = $GLOBALS['data_individu'];

    // $berhasil = $data;

    // if($berhasil == null){
    //     $out = successResponse($response, [
    //         'transaksi' => $berhasil,
    //         'massage' => "Data tidak sesuai !!"
    //     ]);
    // }else{
    //     $out = successResponse($response, [
    //         'transaksi' => $berhasil,
    //         'massage' => "Berhasil!!"
    //     ]);
    // }
  
    // return $out;
});

$app->post('/auth/transaksi/{id}',function ($request,$response){
    $id = $request->getAttribute('id');
   $db = Db::db();

    $data = $db->select('*')
    ->from('t_transaksi')
    ->where('t_transaksi.id_transaksi','=',$id);

    $model = $data->findAll();

    for($i=0; $i<count($model); $i++){
       $coba = $db->select('t_transaksi.id_transaksi,t_produk.nama_produk,t_detail_transaksi.qty,t_produk.harga')
    ->from('t_transaksi')
    ->leftJoin('t_detail_transaksi','t_transaksi.id_transaksi = t_detail_transaksi.id_transaksi')
    ->leftJoin('t_produk','t_detail_transaksi.id_produk = t_produk.id_produk')
    ->where('t_transaksi.id_transaksi','=',$model[$i]->id_transaksi);
    $detail = $data->findAll();
    $model[$i]->detail = $detail;
    }

    $hitung = $model[0]->detail;

    for($i=0; $i<count($hitung); $i++){
            $total = $hitung[$i]->harga * $hitung[$i]->qty;
            $hitung[$i]->total = $total;
    }

    if($model == null){
        $out = 'Gagal!!';
    }else{
        $out = 'Berhasil!!';
    }


  
    return successResponse($response, [
            'transaksi' => $model,
            'massage' => $out
        ]);;
});

<?php
use Service\Db;
use Service\Landa;

$app->post('/log_in',function ($request,$response){
    $db = Db::db();
	$params = $request->getParams();
	$username = $_POST['username'];
	$password = $_POST['password'];


	$data = $db->select('*')
	->from('t_pengguna')
	->where('username','=', $username)
	->andwhere('password','=', $password);

	$model = $data->findAll();

	if($model == null){
		$out =	successResponse($response, [
		            'user' => $model,
		            'massage' => "Username dan Password Salah!!"
	        	]);
	}else{
		$out =	successResponse($response, [
		            'user' => $model,
		            'massage' => "Berhasil!!"
	        	]);
	}

	return $out;
});

$app->post('/log_in/data_produk',function ($request,$response){
    $db = Db::db();
	$params = $request->getParams();


	$data = $db->select('t_produk.nama_produk,t_kategori.nama_kategori,t_produk.harga, t_outlet.nama_outlet')
	->from('t_produk')
	->leftJoin('t_kategori','t_produk.id_kategori = t_kategori.id_kategori')
	->leftJoin('t_outlet','t_produk.outlet = t_outlet.id_outlet');

	$model = $data->findAll();

	return successResponse($response, [
	            'user' => $model,
	            'massage' => "Berhasil!!"
	        ]);
});
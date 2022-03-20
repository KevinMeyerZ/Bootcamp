import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { LandaService } from '../../../core/services/landa.service';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

let data_produk: { id: number, produk: string, kategori: string, harga:string}[] = [
  { "id": 0, "produk": "Nasi Ayam Geprek", "kategori": "Makanan", "harga": "20000"},
  { "id": 1, "produk": "Mie Soto", "kategori": "Makanan", "harga": "15000"},
  { "id": 2, "produk": "Vietnam Drip", "kategori": "Minuman", "harga": "13000"}
];

export class MyItems {    
  Value: string;    
  constructor(Value:string)    
  {    
    this.Value = Value;    
  }    
}    
    

@Component({
  selector: 'app-produk',
  templateUrl: './produk.component.html',
  styleUrls: ['./produk.component.scss']
})
export class ProdukComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtInstance: Promise<DataTables.Api>;
  dtOptions: any;
  apiURL = environment.apiURL;

  ckEditorConfig: Array<{}>;

  id_hapus = '';
  id_update = '';
  
  fileToReturn;

  Dataupdate: MyItems[] = new Array();
  Datahasil_final;

  produk_database;
  data_tampil;
  showForm: boolean;
  showForm2: boolean;

  
  //image
  imageSrc: string;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  //topping
  hitung = 1;
  arrayOfObj = [1];

  //update produk
  u_imageSrc: string;
  data_topping;
  u_topping;
  b_foto;
  u_hitung = 0;
  u_arrayOfObj = [];
  button_u: boolean;

  model: any = {

  };
  modelParam: {
    kategori,
    produk
  }

  topping = [];

  data_get = this.authenticationService.currentUser();

  @ViewChild('closebutton') closebutton;
  requiredForm: FormGroup = new FormGroup({});
  updateForm: FormGroup = new FormGroup({});

  constructor(
    private modalService: NgbModal, 
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService) {}

  page = 1;
  count = 0;
  tableSize = 5;

  ngOnInit(): void {
    this.validasi();
    this.modelParam = {
      kategori: '',
      produk: ''
    }
    this.data();
    this.empty();
    
    this.myForm();
    this.updateFormku();
  }

  onAddRow(){
    this.hitung ++;
    this.arrayOfObj.push(this.hitung);
  }

  onAddRowupdate(){
    if(this.u_hitung == 0){
      this.u_hitung = this.u_topping.length+1;
      this.u_arrayOfObj.push(this.u_hitung);
    }else{
      this.u_hitung ++;
      this.u_arrayOfObj.push(this.u_hitung);
    }
  }

  empty() {
    this.model = {

    };
    this.data();
  }

  onTableDataChange(event){
    this.page = event;
  }

  myForm() {
    this.requiredForm = this.fb.group({
    nama_produk: ['', Validators.required ],
    harga_jual: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    hpp: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
    kategori: ['', Validators.required],
    foto: ['', Validators.required],
    deskripsi: ['', Validators.required],
    fileSource: ['']
    });
  }

  updateFormku(){
      this.updateForm = this.fb.group({
      unama_produk: ['', Validators.required ],
      id_produk: ['', Validators.required ],
      uhpp: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      uharga_jual: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      ukategori: ['', Validators.required],
      udeskripsi: ['', Validators.required],
      ufileSource: ['']
      });
  }

  get v_update(){
    return this.updateForm.controls;
  }
  
  validasi(){
    if(this.data_get == null){
      this.router.navigate(['/account/t_login']);
    }else{
      console.log(this.data_get);
    }
  }

  get f(){
    return this.requiredForm.controls;
  }

  fileChangeEvent(event: any): void {
    this.showForm = !this.showForm;
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  
    this.fileToReturn = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
  
    return this.fileToReturn;
  }

  cropku(){
    const reader = new FileReader();

    reader.readAsDataURL(this.fileToReturn);
    reader.onload = () => {
      this.imageSrc  = reader.result as string;
      this.requiredForm.patchValue({
        fileSource: reader.result
      });
    };
    this.showForm = !this.showForm;
    this.showForm2 = !this.showForm2;
  }

  u_cropku(){
    const reader = new FileReader();

    reader.readAsDataURL(this.fileToReturn);
    reader.onload = () => {
      this.u_imageSrc  = reader.result as string;
      this.updateForm.patchValue({
        ufileSource: reader.result
      });
    };
    this.showForm = !this.showForm;
    this.showForm2 = !this.showForm2;
  }
  imageLoaded() {
      // show cropper
  }
  cropperReady() {

  }
  loadImageFailed() {
      // show message
  }

  base64ToFile(data, filename) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  submit(){
    let toppingku;
    let toppingkuuu;
    for (let i = 1; i <=this.arrayOfObj.length; i++) {
      toppingku = "topping"+i.toString();
      toppingkuuu = (document.getElementById(toppingku) as HTMLInputElement).value;
      this.topping.push(toppingkuuu);
    }
    this.landaService
    .DataPost('/produk/tambah_produk', {
      id_outlet: 1,
      nama: this.f.nama_produk.value,
      harga: this.f.harga_jual.value,
      id_kategori: this.f.kategori.value,
      fileSource: this.requiredForm.value['fileSource'],
      deskripsi: this.f.deskripsi.value,
      toping: this.topping,
      hpp: this.f.hpp.value
    })
    .subscribe((res: any) => {
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Tambah Produk !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Produk Telah Tersimpan');
          this.refresh();
          this.data();
        }
    });
  }

  refresh(){
    this.f.nama_produk.setValue('');
    this.f.harga_jual.setValue('');
    this.f.kategori.setValue('');
    this.f.deskripsi.setValue('');
    this.f.foto.setValue('');
    this.f.hpp.setValue('');
    this.imageSrc = '';
  }
  
  search(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }

  b_hapus(): void {
    this.landaService
      .DataPost('/produk/hapus_data', {
        id_produk: this.id_hapus
      })
      .subscribe((res: any) => {

      });
  }

  async submit_update(){
    var panjang = this.u_topping.length + this.u_arrayOfObj.length;
    var con:number = +panjang;
    const topping = [];
    let toppingku;
    let toppingkuuu;
    
    for (let i = 1; i <=con; i++) {
      toppingku = "u_topping"+i;
      toppingkuuu = (document.getElementById(toppingku) as HTMLInputElement).value;
      topping.push(toppingkuuu);
    }

    this.landaService
    .DataPost('/produk/update_produk', {
      id: this.v_update.id_produk.value,
      nama: this.v_update.unama_produk.value,
      harga: this.v_update.uharga_jual.value,
      id_kategori: this.v_update.ukategori.value,
      ufileSource: this.updateForm.value['ufileSource'],
      deskripsi: this.v_update.udeskripsi.value,
      hpp: this.v_update.uhpp.value,
      toping: topping,
    })
    .subscribe((res: any) => {
      console.log(res.data.user);
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          this.landaService.alertSuccess('Berhasil', 'Data Telah Terupdate');
          this.data();
        }
    });
  }

  openModal(modaladd: any) {
    this.modalService.open(modaladd, { size: 'xl' });
  }

  deleteModal(content: any, id: string) {
    this.modalService.open(content);
    this.id_hapus = id;
  }

  updateModal(modalupdate: any, id: string) {
    this.modalService.open(modalupdate, { size: 'xl' });
    this.landaService
      .DataGet('/produk/data_produk', {
        id_produk: id
      })
      .subscribe((res: any) => {
        this.b_foto = res.data.user;
        this.data_tampil = res.data.user[0];
        this.data_topping = this.data_tampil.toping;
        console.log(this.data_topping);
        if(this.data_topping == null){
          this.u_topping = ["Kosong"];
        }else{
          this.u_topping = this.data_topping.split(",");
        }
        
        this.u_hitung = 0; 
        this.u_arrayOfObj = [];
        console.log(this.data_tampil);
        this.v_update.uhpp.setValue(this.data_tampil.hpp);
        this.v_update.id_produk.setValue(this.data_tampil.id_produk);
        this.v_update.unama_produk.setValue(this.data_tampil.nama);
        this.v_update.ukategori.setValue(this.data_tampil.id_kategori);
        this.v_update.uharga_jual.setValue(this.data_tampil.harga);
        this.v_update.udeskripsi.setValue(this.data_tampil.deskripsi);
      });
  }

  data(){
    this.dtOptions = {
      serverSide: true,
      processing: true,
      ordering: false,
      pagingType: 'full_numbers',
      ajax: (dataTablesParameters: any, callback) => {
        const params = {
          filter: JSON.stringify(this.modelParam),
          offset: dataTablesParameters.start,
          limit: dataTablesParameters.length,
        };
        this.landaService.DataGet('/produk/data_produk', params).subscribe((res: any) => {
          this.produk_database = res.data.user;
          callback({
            recordsTotal: res.data.totalItems,
            recordsFiltered: res.data.totalItems,
            data: [],
          });
        });
      },
    };
  }

}

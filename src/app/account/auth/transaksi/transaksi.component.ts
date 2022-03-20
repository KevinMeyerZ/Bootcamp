import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../../core/services/auth.service';
import { MessagingService } from '../../../core/services/messaging.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LandaService } from '../../../core/services/landa.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

let data_produk: { id_transaksi: string, waktu: string, kasir: string, nama_kasir: string, jenis_pembayaran: string ,total_transaksi: number}[] = [
  { "id_transaksi": "5cde678ed", "waktu": "21/9/2021", "kasir": "2", "nama_kasir": "Farid Angga", "jenis_pembayaran": "Tunai" , "total_transaksi": 50000},
  { "id_transaksi": "10cde68dx", "waktu": "11/10/2021", "kasir": "3", "nama_kasir": "Rifan Hidayat", "jenis_pembayaran": "Debit", "total_transaksi": 100000},
  { "id_transaksi": "50dje65ed", "waktu": "22/10/2021", "kasir": "1", "nama_kasir": "Yokevin Febrian", "jenis_pembayaran": "Ovo", "total_transaksi": 75000}
];

@Component({
  selector: 'app-transaksi',
  templateUrl: './transaksi.component.html',
  styleUrls: ['./transaksi.component.scss']
})
export class TransaksiComponent implements OnInit {
  Datahasil;
  total_card = 0;

  page = 1;
  count = 0;
  tableSize = 5;

  //awal reload
  transaksi_database;
  total;

  //detail transaksi
  Datafilter;
  data_produk;
  total_produk;

  //search
  search_data;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private messagingService: MessagingService,
    public landaService: LandaService
    ) { 
  }

  requiredForm: FormGroup = new FormGroup({});
  data_get = this.authenticationService.currentUser();
  @ViewChild('dateFrom') dateFrom;
  @ViewChild('dateTo') dateTo;

  ngOnInit(): void {
    this.validasi();
    this.data();
  }

  onTableDataChange(event){
    this.page = event;
  }

  search(): void{
    var data_tgl_mulai = this.dateFrom.nativeElement.value;
    var data_tgl_akhir = this.dateTo.nativeElement.value;

    console.log(data_tgl_mulai);
    if(!!data_tgl_mulai && !!data_tgl_akhir){
      this.search_data = this.transaksi_database.filter( m => m.tanggal >= data_tgl_mulai && m.tanggal <= data_tgl_akhir);
    }else{
      this.search_data = this.transaksi_database;
    }
    

    // if(!!data_tgl_akhir && !!data_tgl_akhir && !!kasir ){
    //   this.data_filter = this.data_laporan.filter( m => m.waktu_l >= data_tgl_mulai && m.waktu_l <= data_tgl_akhir && m.kasir_l === kasir);
    // }

    // if(!!data_tgl_akhir && !!data_tgl_akhir && !!kasir && !!jenis_bayar){
    //   this.data_filter = this.data_laporan.filter( m => m.waktu_l >= data_tgl_mulai && m.waktu_l <= data_tgl_akhir && m.kasir_l === kasir && m.jenis_bayar === jenis_bayar);
    // }
  }

  data(){
    this.landaService
      .DataPost('/auth/transaksi', {
        
      })
      .subscribe((res: any) => {
        this.transaksi_database = res.data.user;
        this.search_data = this.transaksi_database;
        this.total = this.transaksi_database.length;
        for (let i = 0; i < this.transaksi_database.length; i++) {
          this.total_card = this.total_card + this.transaksi_database[i].total;
        }
      });
  }

  detailModal(content: any, id: string) {
    this.modalService.open(content);
    this.getTransaksi(id);
  }

  updateModal(content: any, id: string) {
    this.modalService.open(content);
    this.getTransaksi(id);
  }

  getTransaksi(id){
    this.Datafilter = this.transaksi_database.filter(x => x.kode === id);
    this.data_produk = this.Datafilter[0]['detail'];
    this.total_produk = this.data_produk.length;
  }

  validasi(){
    if(this.data_get == null){
      this.router.navigate(['/account/t_login']);
    }else{
      console.log(this.data_get);
    }
  }

  async submit(){
    const data_id = [];
    const data_qty = [];
    let idku;
    let qty;
    let id_detail;
    let qty_detail;
    for (let i = 0; i <this.data_produk.length; i++) {
      idku = "id"+i.toString();
      qty = "qty"+i.toString()
      qty_detail = (document.getElementById(qty) as HTMLInputElement).value;
      id_detail = (document.getElementById(idku) as HTMLInputElement).value;
      data_id.push(id_detail);
      data_qty.push(qty_detail);
    }    

    this.landaService
    .DataPost('/auth/qty', {
      id: data_id,
      qty: data_qty,
      kode: (document.getElementById("kode") as HTMLInputElement).value
    })
    .subscribe((res: any) => {
        /**
         * Simpan detail user ke session storage
         */
        if (res.data.user == null) {
          this.landaService.alertError('Gagal Update !!', res.errors);
        } else {   
          // this.landaService.alertSuccess('Berhasil', 'Data User Telah Terupdate');
          window.location.href = '/account/transaksi';
        }
    });
  }
}

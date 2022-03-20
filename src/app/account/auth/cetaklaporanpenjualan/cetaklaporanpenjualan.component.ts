import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../event-emitter.service';    


import { jsPDF } from 'jspdf';  
import html2canvas from 'html2canvas';  
import * as XLSX from 'xlsx'; 

@Component({
  selector: 'app-cetaklaporanpenjualan',
  templateUrl: './cetaklaporanpenjualan.component.html',
  styleUrls: ['./cetaklaporanpenjualan.component.scss']
})
export class CetaklaporanpenjualanComponent implements OnInit {
  fileName= 'ExcelSheet.xlsx';
  data_cetak;


  constructor(private eventEmitterService: EventEmitterService) {    }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      invokeFirstComponentFunction.subscribe((data:any) => {    
        this.data_filter(data);    
      });    
    }    
  }

  data_filter(data){
    this.data_cetak = data;
  }

  cetak(): void{
    var data = document.getElementById('contentToConvert');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;  
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)  
      pdf.save('MYPdf.pdf'); // Generated PDF   
    });  
  }

  exportexcel(): void {
    /* table id is passed over here */   
    let element = document.getElementById('excel-table'); 
    const ws: XLSX.WorkSheet =XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, this.fileName);	
  }



}

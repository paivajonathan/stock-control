import { MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products/products.service';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: []
})
export class DashboardHomeComponent implements OnInit {
  productsList: Array<GetAllProductsResponse> = [];

  constructor(
    private productService: ProductsService,
    private messageService: MessageService,
    private productsDataTransferService: ProductsDataTransferService,
  ) { }

  ngOnInit(): void {
    this.getProductsData();
  }

  getProductsData(): void {
    this.productService
      .getAllProducts()
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsList = response;
            this.productsDataTransferService.setProductsData(this.productsList);
          }
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos',
            life: 2500,
          })
        }
      })
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  productsDataEmitter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);
  productsData: Array<GetAllProductsResponse> = [];

  setProductsData(productsData: Array<GetAllProductsResponse>): void {
    if (productsData) {
      this.productsDataEmitter$.next(productsData);
    }
  }

  getProductsData() {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) => data?.filter((product) => product.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsData = response;
          }
        },
      });
    return this.productsData;
  }
}

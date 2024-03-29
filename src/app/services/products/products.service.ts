import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map } from 'rxjs';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';
import { CreateProductResponse } from 'src/app/models/interfaces/products/response/CreateProductResponse';
import { DeleteProductResponse } from 'src/app/models/interfaces/products/response/DeleteProductResponse';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = environment.API_URL;
  private JWT_TOKEN = this.cookieService.get('USER_INFO');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.httpClient
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/products`,
        this.httpOptions
      )
      .pipe(
        map((products) => products.filter((product) => product?.amount > 0))
      );
  }

  createProduct(requestData: CreateProductRequest): Observable<CreateProductResponse> {
    return this.httpClient.post<CreateProductResponse>(
      `${this.API_URL}/product`,
      requestData,
      this.httpOptions,
    );
  }

  editProduct(requestData: EditProductRequest): Observable<void> {
    return this.httpClient.put<void>(
      `${this.API_URL}/product/edit`,
      requestData,
      this.httpOptions,
    );
  }

  deleteProduct(productId: string): Observable<DeleteProductResponse> {
    return this.httpClient.delete<DeleteProductResponse>(
      `${this.API_URL}/product/delete`,
      {
        ...this.httpOptions,
        params: {
          product_id: productId,
        },
      },
    );
  }
}

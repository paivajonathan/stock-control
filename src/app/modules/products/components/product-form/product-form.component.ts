import { ProductsDataTransferService } from './../../../../shared/services/products/products-data-transfer.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, filter, take, takeUntil } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { GetCategoriesResponse } from 'src/app/models/interfaces/categories/response/GetCategoriesResponse';
import { CreateProductRequest } from 'src/app/models/interfaces/products/request/CreateProductRequest';
import { ProductsService } from 'src/app/services/products/products.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EventAction } from 'src/app/models/interfaces/products/event/EventAction';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { ProductEvent } from 'src/app/models/enums/products/ProductEvent';
import { EditProductRequest } from 'src/app/models/interfaces/products/request/EditProductRequest';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  categoriesData: Array<GetCategoriesResponse> = [];
  selectedCategory: Array<{ name: string; code: string }> = [];
  productAction!: {
    event: EventAction;
    productsData: Array<GetAllProductsResponse>;
  };
  productsData!: Array<GetAllProductsResponse>;
  selectedProductData!: GetAllProductsResponse;

  addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });
  saleProductForm = this.formBuilder.group({
    amount: [0, Validators.required],
    product_id: ['', Validators.required],
  });
  selectedSaleProduct!: GetAllProductsResponse;
  renderDropdown = false;

  addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private productsDataTransferService: ProductsDataTransferService
  ) {}

  ngOnInit(): void {
    this.productAction = this.config.data;

    if (this.productAction?.event?.action === this.saleProductAction)
      this.getProductsData();

    this.getAllCategories();
    this.renderDropdown = true;
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesData = response;
            if (
              this.productAction?.event?.action === this.editProductAction &&
              this.productAction?.productsData
            ) {
              this.getSelectedProductData(
                this.productAction?.event?.id as string
              );
            }
          }
        },
        error: (error) => {
          console.log('Error:', error);
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: this.addProductForm.value.amount as number,
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.messageService.add({
                severity: 'success',
                summary: 'Sucesso',
                detail: 'Produto criado com sucesso!',
                life: 2500,
              });
            }
          },
          error: (error) => {
            console.log('Error:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto!',
              life: 2500,
            });
          },
        });

      this.addProductForm.reset();
    }
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: this.editProductForm.value.name as string,
        price: this.editProductForm.value.price as string,
        description: this.editProductForm.value.description as string,
        product_id: this.productAction?.event?.id as string,
        amount: this.editProductForm.value.amount as number,
        category_id: this.editProductForm.value.category_id as string,
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
          },
          complete: () => {
            this.ref.close();
          },
        });
      this.editProductForm.reset();
    }
  }

  getSelectedProductData(productId: string): void {
    const allProducts = this.productAction?.productsData;

    if (allProducts.length > 0) {
      const filteredProduct = allProducts.filter(
        (product) => product.id === productId
      );

      if (filteredProduct) {
        this.selectedProductData = filteredProduct[0];
        this.editProductForm.setValue({
          name: this.selectedProductData?.name,
          price: this.selectedProductData?.price,
          amount: this.selectedProductData?.amount,
          description: this.selectedProductData?.description,
          category_id: this.selectedProductData?.category?.id
        });
      }
    }
  }

  getProductsData(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsData = response;
            this.productsData &&
              this.productsDataTransferService.setProductsData(
                this.productsData
              );
          }
        },
        error: (error) => {},
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

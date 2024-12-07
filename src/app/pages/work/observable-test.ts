import {ApplicationRef, Component, computed, createComponent, inject, Injector, OnInit, signal} from "@angular/core";
import {AsyncPipe, NgClass, NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {BehaviorSubject, map, mergeMap} from "rxjs";
import {Product} from "../../infrastructures/types/product";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'observable-test',
  template: `
    <div> SIGNALS </div>
    <div>########################################################################################################</div>
    <form>
      <label>Select between sold and not sold products</label>
      <select id="status" [(ngModel)]="soldStateSignal" name="status" (ngModelChange)="filterProductsSignal()">
        <option value="allProducts">All Products</option>
        <option value="sold">Sold</option>
        <option value="notSold">Not Sold</option>
      </select>

      <p>Selected Value: {{ soldStateSignal }}</p>
    </form>

    <div>Product Signal</div>
    <br>
    <div>Total Deleted: {{ deletedProductsWritableSignal().length }}</div>
    <div>Products signal on the list: {{ productsSignal().length }}</div>
    <div>Products Sold: {{ soldProductsSignal().length }}</div>
    <div>Products To Sold: {{ productsToSoldSignal().length }}</div>
    <br>
    <ng-container *ngIf="productsSignal().length > 0; else notFoundObservable">
      <li *ngFor="let productSignal of filteredSignals(); index as productIndex">
        {{ productSignal.name }}
        <br>
        <div *ngIf="setOwnerSignal()">{{ productSignal.owner }}</div>
        <br>
        <div (click)="deleteSignal(productIndex)">delete</div>
        <br>
        <div>Categories:</div>
        <br>
        <div>Select category</div>
        <br>
        <span *ngFor="let category of productSignal.categories; index as categoryIndex">
          | <span [ngClass]="{'selected' : category.selected}"
                  (click)="selectCategory(categoryIndex, productIndex, productSignal.nif)">{{ category.name }}</span>
        </span>
        <br>
        <br>
      </li>
    </ng-container>

    <input type="checkbox" name="ownerSignal" [ngModel]="setOwnerSignal()"
           (ngModelChange)="setOwnerSignal.set($event)"/>
    <label for="ownerSignal">Show owner</label>
    <ng-template #notFoundObservable>
      <div>Not Found</div>
    </ng-template>
    <ng-container *ngComponentOutlet="confirmDialog"></ng-container>
    <br>
    <br>
    <br>
    <div> OBSERVABLES </div>
    <div>####################################################################################</div>
    <br>
    <form>
      <label>Select between sold and not sold products</label>
      <select id="status" [(ngModel)]="soldState" name="status" (ngModelChange)="filterProducts()">
        <option value="allProducts">All Products</option>
        <option value="sold">Sold</option>
        <option value="notSold">Not Sold</option>
      </select>

      <p>Selected Value: {{ soldState }}</p>
    </form>
    <br>
    <div>Products Observable</div>
    <br>
    <div>Total deleted: {{ deletedProducts.length }}</div>
    <div>Sold State: {{ soldState }}</div>
    <div>Products in the list: {{ (productsBehaviourSubject$ | async)?.length }}</div>
    <div>Products sold: {{ getSoldProducts().length }}</div>
    <div>Products to sold: {{ getProductsToSold().length }}</div>
    <br>
    <div *ngFor="let product of filteredProducts$ | async; index as i">
      {{ product.name }}
      <span [ngClass]="{'selected': category.selected}"
            *ngFor="let category of product.categories; index as productCategoryIndex"
            (click)="selectCategoryObservable(product.id ,productCategoryIndex)">{{ category.name }}
      </span>
      <span>Like: {{ product.like }}</span>
      <span>Dislike: {{ product.dislike }}</span>
      <span>total likes: {{ product.totalLikes }}</span>
      <button (click)="delete(i)">Delete</button>
      <button (click)="like(i)">Like</button>
      <button (click)="dislike(i)">Dislike</button>
    </div>
  `,
  styles: [
    `
      .selected {
        border: 1px solid red;
      }
    `
  ]
  ,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    AsyncPipe,
    NgClass,
    NgComponentOutlet
  ],
  standalone: true
})
export class ObservableTestComponent implements OnInit {
  // Rxjs Observables

  productsBehaviourSubject$ = new BehaviorSubject<Product[]>(
    [
      {
        id: 1,
        name: 'Mi Band',
        seller: 'Pcdiga',
        owner: 'Hugo',
        sold: true,
        like: 0,
        dislike: 0,
        totalLikes: 0,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      },
      {
        id: 2,
        name: 'Pc Components Mouse',
        seller: 'Pc Components',
        owner: 'Pedro',
        sold: false,
        like: 0,
        dislike: 0,
        totalLikes: 0,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      },
      {
        id: 3,
        name: 'Pc Components Keyboard',
        seller: 'Pc Components',
        owner: 'Carlos',
        sold: false,
        like: 0,
        dislike: 0,
        totalLikes: 0,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      }
    ]
  )

  deletedProductBehaviourSubject$ = new BehaviorSubject<Product[]>([]);
  filteredProducts$ = this.productsBehaviourSubject$.asObservable();
  deletedProducts = <Product[]>[];
  soldState  = 'allProducts';
  soldStateSignal  = 'allProducts';

  ngOnInit() {
    this.getSoldProducts();
    this.getProductsToSold();
    this.updateDeletedProducts();
    this.filterProducts();
  }

  getSoldProducts(): Product[]  {
    return this.productsBehaviourSubject$.getValue().filter((product) => product.sold === true);
  }

  getProductsToSold(): Product[] {
    return this.productsBehaviourSubject$.getValue().filter((product) => product.sold == false)
  }

  delete(index: number) {
    const deletedProduct = this.productsBehaviourSubject$.getValue().filter((_, i) => i === index);
    const updatedProducts = this.productsBehaviourSubject$.getValue().filter((_, i) => i !== index);

    this.deletedProductBehaviourSubject$.next(deletedProduct);
    this.productsBehaviourSubject$.next(updatedProducts);
  }

  like(index: number) {
    const product = this.productsBehaviourSubject$.getValue();

    const updatedProduct = product.map((product, i) => {
      return i === index ? {...product, like: product.like! + 1, totalLikes: product.totalLikes! + 1} : product
    })

    this.productsBehaviourSubject$.next(updatedProduct);
  }

  dislike(index: number) {
    const products = this.productsBehaviourSubject$.getValue();

    const updatedProduct = products.map((product, i) => {
      return i === index ? {...product, dislike: product.dislike! + 1, totalLikes: product.totalLikes! + 1} : product
    })

    this.productsBehaviourSubject$.next(updatedProduct);
  }

  filterProducts() {
    if (this.soldState === 'sold') {
      this.filteredProducts$ = this.productsBehaviourSubject$.pipe(
        map((products) => products.filter(product => product.sold))
      )
    } else if(this.soldState === 'notSold') {
      this.filteredProducts$ = this.productsBehaviourSubject$.pipe(
        map((products) => products.filter(product => !product.sold))
      )
    } else {
      this.filteredProducts$ = this.productsBehaviourSubject$.asObservable();
    }
  }

  selectCategoryObservable(id: number | undefined, index: number) {
    const products = this.productsBehaviourSubject$.getValue();

    const updatedProduct = products.map(product => {
      return product.id === id ? {...product, categories: product.categories?.map((category, i) =>
          i === index ? {...category, selected: category!.selected = !category!.selected } : category)} : product
    })

    this.productsBehaviourSubject$.next(updatedProduct)
  }

  private updateDeletedProducts() {
    this.deletedProductBehaviourSubject$.pipe(
      mergeMap(products => products)
    ).subscribe((product) => {
      this.deletedProducts.push(product);
    })
  }

  log() {
    console.log(this.productsBehaviourSubject$.getValue())
  }

  // Signal
  injector = inject(Injector);
  appRef = inject(ApplicationRef);
  confirmDialog: any = null;
  setOwnerSignal = signal<boolean>(false);
  deletedProductsWritableSignal = signal<Product[]>([]);
  selectedSoldState = signal<string>('allProducts');
  allowMultipleSelect = signal<boolean>(true)
  selectedProductSignal = signal<Product>({
    categories: [],
    deleted: false,
    dislike: 0,
    id: 0,
    like: 0,
    name: "",
    nif: 0,
    owner: "",
    seller: "Pcdiga",
    sold: false,
    totalLikes: 0
  })
  selectedProductNif = signal<number>(0)
  productsSignal = signal<Product[]>(
    [
      {
        id: 1,
        name: 'Mi Band',
        seller: 'Pcdiga',
        owner: 'Hugo',
        sold: true,
        nif: 10,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      },
      {
        id: 2,
        name: 'Pc Components Mouse',
        seller: 'Pc Components',
        owner: 'Pedro',
        sold: false,
        nif: 11,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      },
      {
        id: 3,
        name: 'Pc Components Keyboard',
        seller: 'Pc Components',
        owner: 'Carlos',
        sold: false,
        nif: 11,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      },
      {
        id: 4,
        name: 'Pc Components Keyboard',
        seller: 'Pc Components',
        owner: 'Carlos',
        sold: false,
        nif: 17,
        categories: [
          {
            id: 1,
            name: 'computing',
            selected: false,
          },
          {
            id: 2,
            name: 'leisure',
            selected: false
          },
          {
            id: 3,
            name: 'housing',
            selected: false
          }
        ]
      }
    ]
  )

  filteredSignals = computed<Product[]>(() => {
    return this.productsSignal().filter((product) => {
      if(this.selectedSoldState() === 'allProducts') {
        return product;
      }
      return this.selectedSoldState() === 'sold' ? product.sold : !product.sold;
    });
  })

  soldProductsSignal = computed<Product[]>(() => {
    return this.productsSignal().filter((p) => p.sold === true)
  })

  productsToSoldSignal = computed<Product[]>(() => {
    return this.productsSignal().filter((p) => p.sold === false)
  })

  selectProductsWithEqualNifComputed = computed(() => {
    return this.productsSignal().some(
      product => product.nif === this.selectedProductNif() && product.id !== this.selectedProductSignal()?.id
    ) && this.allowMultipleSelect();
  })

  deleteSignal(index: number) {
    this.getDeleteProductCount(index);
    this.productsSignal.update((products) => {
      return products.filter((_, i) => i !== index)
    });
  }

  filterProductsSignal() {
    this.selectedSoldState.set(this.soldStateSignal);
  }

  selectCategory(categoryIndex?: number, productIndex?: number, productNif?: number | undefined) {
    const selectedProduct = this.productsSignal().find((_, index) => index === productIndex);
    this.selectedProductSignal.set(selectedProduct!);
    this.selectedProductNif.set(productNif!)

    if(this.selectProductsWithEqualNifComputed()) {
      this.showConfirmationDialog(categoryIndex!, productIndex!, productNif!);
    } else {
      this.productsSignal.update((products) => {
        return products.map((product, index) =>
          index === productIndex ? {...product, categories: product.categories?.map((category, index) =>
              index === categoryIndex ? {...category, selected: category.selected = !category.selected } : category
            )} : product
        )
      })
    }
  }

  handleConfirm(categoryIndex: number, productNif: number) {
    this.productsSignal.update((products) => {
      return products.map((product) =>
        product.nif === productNif ? {...product, categories: product.categories?.map((category, index) =>
          index === categoryIndex ? {...category, selected: category.selected = !category.selected } : category
          )} : product
      )
    })
  }

  handleCancel(categoryIndex: number, productIndex: number) {
    this.productsSignal.update((products) => {
      return products.map((product, index) =>
        index === productIndex ? {...product, categories: product.categories?.map((category, index) =>
            index === categoryIndex ? {...category, selected: category.selected = !category.selected } : category
          )} : product
      )
    })
  }

  private getDeleteProductCount(index: number) {
    const deletedProduct = this.productsSignal().filter((_, i) => i === index);
    this.deletedProductsWritableSignal.update((products) => [...products, ...deletedProduct])
  }

  // dialog

  async showConfirmationDialog(categoryIndex: number, productIndex: number, productNif: number) {
    const { ConfirmationDialogComponent } = await import(
      '../../shared/components/confirmation-dialog.component'
      );

    const dialogRef = createComponent(ConfirmationDialogComponent, {
      environmentInjector: this.injector.get(ApplicationRef).injector,
    });

    dialogRef.instance.isConfirmationOpen = true;

    // Pass the arguments to the confirm handler
    dialogRef.instance.confirm.subscribe(() => {
      this.handleConfirm(categoryIndex, productNif);
      this.removeDialog(dialogRef);
    });

    dialogRef.instance.cancel.subscribe(() => {
      this.handleCancel(categoryIndex, productIndex);
      this.removeDialog(dialogRef);
    });

    this.appRef.attachView(dialogRef.hostView);
    document.body.appendChild(dialogRef.location.nativeElement);
    this.allowMultipleSelect.set(false);
  }

  private removeDialog(dialogRef: any) {
    this.appRef.detachView(dialogRef.hostView);
    dialogRef.destroy();
  }
}

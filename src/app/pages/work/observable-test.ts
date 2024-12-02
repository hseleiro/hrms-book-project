import {Component, computed, OnInit, signal} from "@angular/core";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {BehaviorSubject, map, mergeMap} from "rxjs";
import {Product} from "../../infrastructures/types/product";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'observable-test',
  template: `
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
      <li *ngFor="let productSignal of filteredSignals(); index as i">
        {{ productSignal.name }}
        <br>
        <div *ngIf="setOwnerSignal()">{{ productSignal.owner }}</div>
        <br>
        <div (click)="deleteSignal(i)">delete</div>
        <br>
        <div>Categories:</div>
        <br>
        <div *ngFor="let category of productSignal.categories; index as categoryIndex">
          <span [ngClass]="{'selected' : category.selected}" (click)="selectCategory(categoryIndex, productSignal.id)">{{category.name}}</span>
        </div>
        <br>
      </li>
    </ng-container>

    <input type="checkbox" name="ownerSignal" [ngModel]="setOwnerSignal()"
           (ngModelChange)="setOwnerSignal.set($event)"/>
    <label for="ownerSignal">Show owner</label>
    <ng-template #notFoundObservable>
      <div>Not Found</div>
    </ng-template>
    <br>
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

    <div>Total deleted: {{deletedProducts.length}}</div>
    <div>Sold State: {{soldState}}</div>
    <div>Products in the list: {{ (productsBehaviourSubject$ | async)?.length }}</div>
    <div>Products sold: {{getSoldProducts().length}}</div>
    <div>Products to sold: {{getProductsToSold().length}}</div>
    <div *ngFor="let product of filteredProducts$ | async; index as i">
      {{product.name}}
      {{product.like}}
      {{product.dislike}}
      <span>total likes: {{product.totalLikes}}</span>
      <button (click)="delete(i)">Delete</button>
      <button (click)="like(i)">Like</button>
      <button (click)="dislike(i)">Dislike</button>
    </div>
    <div (click)="log()">Log</div>
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
    NgClass
  ],
  standalone: true
})
export class ObservableTestComponent implements OnInit {
  // Rxjs Observables

  productsBehaviourSubject$ = new BehaviorSubject<Product[]>([
    {
      id: 1,
      name: 'Mi Band',
      seller: 'Pcdiga',
      owner: 'Hugo',
      sold: true,
      like: 0,
      dislike: 0,
      totalLikes: 0
    },
    {
      id: 2,
      name: 'Pc Components Mouse',
      seller: 'Pc Components',
      owner: 'Pedro',
      sold: false,
      like: 0,
      dislike: 0,
      totalLikes: 0
    },

    {
      id: 3,
      name: 'Pc Components Keyboard',
      seller: 'Pc Components',
      owner: 'Carlos',
      sold: false,
      like: 0,
      dislike: 0,
      totalLikes: 0
    }
  ])

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
    const updatedProducts = this.productsBehaviourSubject$.getValue().map<Product>((product, i) => {
      return i === index ? {...product, like: product.like! + 1, totalLikes: product.totalLikes! + 1 } : product;
    })

    this.productsBehaviourSubject$.next(updatedProducts);
  }

  dislike(index: number) {
    const updatedProducts = this.productsBehaviourSubject$.getValue().map<Product>((product, i) => {
      return i === index ? {...product, dislike: product.dislike! + 1, totalLikes: product.totalLikes! + 1 } : product;
    })

    this.productsBehaviourSubject$.next(updatedProducts);
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
  setOwnerSignal = signal<boolean>(false);
  deletedProductsWritableSignal = signal<Product[]>([]);
  selectedSoldState = signal<string>('allProducts');
  productsSignal = signal<Product[]>(
    [
      {
        id: 1,
        name: 'Mi Band',
        seller: 'Pcdiga',
        owner: 'Hugo',
        sold: true,
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

  deleteSignal(index: number) {
    this.getDeleteProductCount(index);
    this.productsSignal.update((products) => {
      return products.filter((_, i) => i !== index)
    });
  }

  filterProductsSignal() {
    this.selectedSoldState.set(this.soldStateSignal);
  }

  selectCategory(index: number, productId: number | undefined) {
    this.productsSignal.update((products) => {

      const selectedProduct = products.find((product) => product.id === productId);

      if (selectedProduct?.categories) {
        const selectedCategory = selectedProduct.categories.find((_, i) => i === index);
        selectedCategory!.selected = !selectedCategory!.selected;
      }

      return [...products]
    })
  }

  private getDeleteProductCount(index: number) {
    const deletedProduct = this.productsSignal().filter((_, i) => i === index);
    this.deletedProductsWritableSignal.update((products) => [...products, ...deletedProduct])
  }

}

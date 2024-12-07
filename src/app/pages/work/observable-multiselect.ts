import {ApplicationRef, Component, createComponent, inject, Injector} from "@angular/core";
import {BehaviorSubject, map} from "rxjs";
import {AsyncPipe, NgClass, NgComponentOutlet, NgForOf, NgIf} from "@angular/common";
import {Product} from "../../infrastructures/types/product";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'teste2',
  template: `
    <select id="state" [(ngModel)]="productState" name="state" (ngModelChange)="filterProducts()">
      <option value="allProducts">All Products</option>
      <option value="sold">Sold</option>
      <option value="notSold">Not sold</option>
    </select>
    <br>
    <br>
    <div>Products Sold: {{ getSoldProducts().length }}</div>
    <div>Products to Sold: {{ getProductsToSold().length }}</div>
    <ng-container *ngIf="(products$ | async)!.length > 0; else notFound">
      <ul>
        <li *ngFor="let product of filteredProducts$ | async">
          {{ product.name }}
          <button (click)="deleteProduct(product.id)">Delete product</button>
          <button (click)="like(product.id)">Likes: {{product.like}}</button>
          <button (click)="dislike(product.id)">Dislikes: {{product.dislike}}</button>
          <ul>
            <li *ngFor="let category of product.categories; index as categoryIndex">
              <span (click)="selectCategory(product.id, categoryIndex)" [ngClass]="{'selected' : category.selected}">{{category.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </ng-container>

    <ng-template #notFound>
      <div>Products Not Found</div>
    </ng-template>

    <ng-container *ngComponentOutlet="confirmDialog"></ng-container>
  `,
  styles: [`
    .selected {
      border: 1px solid red;
    }
  `],
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    FormsModule,
    NgClass,
    NgComponentOutlet
  ],
  standalone: true
})
export class ObservableMultiSelectComponent {
  injector = inject(Injector);
  appRef = inject(ApplicationRef);
  confirmDialog: any = null;

  products$ = new BehaviorSubject<Product[]>(
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
        like: 0,
        dislike: 0,
        totalLikes: 0,
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
        like: 0,
        dislike: 0,
        totalLikes: 0,
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
      }
    ]
  )

  filteredProducts$ = this.products$.asObservable();
  productState: string = 'allProducts'
  allowMultipleSelect = true;

  getSoldProducts() {
    return this.products$.getValue().filter((product) => product.sold === true);
  }

  getProductsToSold() {
    return this.products$.getValue().filter((product) => product.sold === false);
  }

  filterProducts() {
    this.filteredProducts$ = this.products$.pipe(
      map((products) => this.productState === 'allProducts' ? products : products.filter((product) =>  {
        return this.productState === 'sold' ? product.sold : !product.sold
      }))
    )
  }

  deleteProduct(productId: number | undefined) {
    const updatedProductList = this.products$.getValue().filter((product) => product.id !== productId);

    this.products$.next(updatedProductList);
  }

  like(productId: number | undefined) {
    const updatedProductList = this.products$.getValue().map((product) =>
      product.id === productId ? {...product, like: product.like! + 1} : product
    )

    this.products$.next(updatedProductList);
  }

  dislike(productId: number | undefined) {
    const updatedProductList = this.products$.getValue().map((product) =>
      product.id === productId ? {...product, dislike: product.dislike! + 1} : product
    )

    this.products$.next(updatedProductList);
  }

  selectCategory(productId: number | undefined, categoryIndex: number) {
    const selectedProduct = this.products$.getValue().find((product) => product.id === productId);

    const hasEqualNif = this.products$.getValue().some((product) =>
      product.nif === selectedProduct!.nif && product.id !== selectedProduct!.id
    )

    if(hasEqualNif && this.allowMultipleSelect) {
      this.showConfirmationDialog(selectedProduct?.nif, productId, categoryIndex);
    } else {
      this.products$.getValue().map((product) =>
        product.id === productId
          ? {...product, categories: product.categories?.map((category, i) =>
              i === categoryIndex
                ? {...category, selected: category.selected = !category.selected }
                : category
            )}
          : product
      )
    }

  }

  // dialog
  private handleConfirm(productNif: number | undefined, categoryIndex: number) {
    this.products$.getValue().map((product) =>
      product.nif === productNif
        ? {...product, categories: product.categories!.map((category,i) =>
            i === categoryIndex
              ? {...category, selected: category.selected = !category.selected}
              :
              category
          )}
        :
        product
    )
  }

  private handleCancel(productId: number | undefined, categoryIndex: number) {
    this.products$.getValue().map((product, i) =>
      i === productId
        ? {...product, categories: product.categories?.map((category,i) =>
            i === categoryIndex
              ? {...category, selected: category.selected = !category.selected }
              :
              category
          )}
        :
        product
    )
  }

  async showConfirmationDialog(productNif: number | undefined, productId: number | undefined, categoryIndex: number ) {
    const { ConfirmationDialogComponent } = await import(
      '../../shared/components/confirmation-dialog.component'
      );

    const dialogRef = createComponent(ConfirmationDialogComponent, {
      environmentInjector: this.injector.get(ApplicationRef).injector,
    });

    dialogRef.instance.isConfirmationOpen = true;

    // Pass the arguments to the confirm handler
    dialogRef.instance.confirm.subscribe(() => {
      this.handleConfirm(productNif, categoryIndex);
      this.removeDialog(dialogRef);
    });

    dialogRef.instance.cancel.subscribe(() => {
      this.handleCancel(productId, categoryIndex);
      this.removeDialog(dialogRef);
    });

    this.appRef.attachView(dialogRef.hostView);
    document.body.appendChild(dialogRef.location.nativeElement);

    this.allowMultipleSelect = false;
  }

  private removeDialog(dialogRef: any) {
    this.appRef.detachView(dialogRef.hostView);
    dialogRef.destroy();
  }

}

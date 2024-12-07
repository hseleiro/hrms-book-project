import {ApplicationRef, Component, computed, createComponent, effect, inject, Injector, signal} from "@angular/core";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Product} from "../../infrastructures/types/product";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'signals-multiselect',
  template: `
    <select id="state" name="state" [(ngModel)]="soldState" (ngModelChange)="filterProducts()">
      <option value="allProducts">All products</option>
      <option value="sold">Sold</option>
      <option value="toSell">To sell</option>
    </select>
    <br>
    <br>
    <div>Products sold: {{productsSold().length}}</div>
    <div>Products to sold: {{productsToSold().length}}</div>
    <ng-container *ngIf="productsSignal().length > 0">
      <ul>
        <li *ngFor="let product of filteredProducts(); index as productIndex">
          {{ product.name }}
          <button (click)="deleteProduct(productIndex)">Delete</button>
          <button (click)="like(productIndex)">Like: {{product.like}}</button>
          <button (click)="dislike(productIndex)">Dislike: {{product.dislike}}</button>
          <ul>
            <li *ngFor="let category of product.categories; index as categoryIndex">
              <span (click)="selectCategory(product.id, categoryIndex, productIndex, product.nif)" [ngClass]="{'selected' : category.selected}">{{category.name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </ng-container>
  `,
  styles: [
    `.selected {
      border: 1px solid red;
    }`
  ],
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    NgClass
  ],
  standalone: true
})
export class SignalsMultiselectComponent {
  soldState = 'allProducts';
  injector = inject(Injector);
  appRef = inject(ApplicationRef);
  soldStateSignal = signal<string>('allProducts');
  productsSignal = signal<Product[]>(
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

  productsSold = computed(() => {
    return this.productsSignal().filter((product) => product.sold);
  })

  productsToSold = computed(() => {
    return this.productsSignal().filter((product) => !product.sold)
  })

  filteredProducts = computed(() => {
    return this.productsSignal().filter((product) =>
      this.soldStateSignal() === 'allProducts' ? product :
      this.soldStateSignal() === 'sold' ? product.sold : !product.sold)
      ;
  })

  filterProducts() {
    this.soldStateSignal.set(this.soldState);
  }

  deleteProduct(productIndex: number) {
    this.productsSignal.update((products) =>
      products.filter((_, i) => i !== productIndex )
    )
  }

  like(productIndex: number) {
    this.productsSignal.update((products) =>
      products.map((product, i) =>
        i === productIndex ? {...product, like: product.like! + 1} : product
      )
    )
  }

  dislike(productIndex: number) {
    this.productsSignal.update((products) =>
      products.map((product, i) =>
        i === productIndex ? {...product, dislike: product.dislike! + 1} : product
      )
    )
  }

  selectCategory(ProductId: number | undefined,  categoryIndex: number, productIndex: number, productNif: number | undefined) {

    const hasEqualNif = this.productsSignal().some((product, i) =>
      product.nif === productNif && product.id !== ProductId
    )

    console.log('hasEqualNif', hasEqualNif)

    if (hasEqualNif) {
      this.showConfirmationDialog(productNif, productIndex, categoryIndex)
    } else {
      this.productsSignal.update((products) =>
        products.map((product, i) =>
          i === productIndex
            ?
            {...product, categories: product.categories?.map((category, i) =>
                i === categoryIndex
                  ?
                  {...category, selected: category.selected = !category.selected}
                  :
                  category
              )}
            : product
        )
      )
    }
  }



  private handleConfirm(productNif: number | undefined, categoryIndex: number) {
    this.productsSignal.update((products) =>
      products.map((product) =>
        product.nif === productNif
          ?
          {...product, categories: product.categories?.map((category, i) =>
              i === categoryIndex
                ? {...category, selected: category.selected = !category.selected}
                :
                category
            )}
          : product
      )
    )
  }

  constructor() {

    effect(() => {
      console.log('This count')
    })

  }


  private handleCancel(productIndex: number , categoryIndex: number) {
    this.productsSignal.update((products) =>
      products.map((product, i) =>
        i === productIndex
          ? {...product, categories: product.categories?.map((category, i) =>
              i === categoryIndex
                ? {...category, selected: category.selected = !category.selected}
                :
                category
            )}
          :
          product
      )
    )
  }

  async showConfirmationDialog(productNif: number | undefined, productIndex: number, categoryIndex: number ) {
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
      this.handleCancel(productIndex, categoryIndex);
      this.removeDialog(dialogRef);
    });

    this.appRef.attachView(dialogRef.hostView);
    document.body.appendChild(dialogRef.location.nativeElement);
  }

  private removeDialog(dialogRef: any) {
    this.appRef.detachView(dialogRef.hostView);
    dialogRef.destroy();
  }


}

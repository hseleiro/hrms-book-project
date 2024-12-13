import {Component, computed, signal} from "@angular/core";
import {Product} from "../infrastructures/types/product";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'registration',
  template: `
    <h1>Registration</h1>
    <div>Total Deleted: {{ deletedCounter().length }}</div>
    <div>Products in the list: {{ totalProducts() }}</div>
    <div>Products to be sold: {{ productsToBeSold().length }}</div>
    <div>Sold products: {{ soldProducts().length }}</div>
    <ng-container *ngIf="totalProducts() > 0; else notFound">
      <li *ngFor="let product of products()">
        {{ product.name }}
        <h2 *ngIf="showOwner()">Owner: {{ product.owner }}</h2>
        <button (click)="deleteProduct(product.name)">Delete</button>
      </li>
      <br>
    </ng-container>
    <button (click)="createProduct()">Create</button>

    <input type="checkbox" name="checkbox" [ngModel]="showOwner()" (ngModelChange)="showOwner.set($any($event))"/>
    <label for="checkbox">{{ showOwner() ? 'Hide Owner' : 'Show Owner' }}</label>
    <ng-template #notFound>
      <div></div>
    </ng-template>
  `,
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  providers: [],
})
export class RegistrationComponent {
  showOwner = signal<boolean>(false);
  name = signal<string>('Hugo');
  deletedCounter = signal<Product[]>([]);
  products = signal<Product[]>([
    {
      name: 'Mi Band',
      seller: 'Pcdiga',
      owner: 'Hugo',
      sold: true,
    },
    {
      name: 'Pc Components Mouse',
      seller: 'Pc Components',
      owner: 'Pedro',
      sold: false,
    },
    {
      name: 'Pc Components Keyboard',
      seller: 'Pc Components',
      owner: 'Carlos',
      sold: false,
    }
  ])

  totalProducts = computed(() => {
    return this.productsToBeSold().length + this.soldProducts().length
  })

  soldProducts = computed(() => {
    return this.products().filter((p) => p.sold === true)
  })

  productsToBeSold = computed(() => {
    return this.products().filter((p) => p.sold === false)
  })

  deleteProduct(selectedProduct: string) {
    this.setDeletedCounter(selectedProduct);
    this.products.update((products) => {
      return products.filter((product) => {
        return !product.name.toLowerCase().includes(selectedProduct.toLowerCase())
      })
    })
  }

  createProduct() {
    const newProduct: Product = { name: 'rato a pilhas', seller: 'Pcdiga', owner: 'Pedro', sold: false };
    this.products.update((products) => [...products, newProduct]);
  }

  setDeletedCounter(selectedName: string) {
    const deletedProduct = this.products().filter((product) =>
      product.name.toLowerCase().includes(selectedName.toLowerCase())
    )
    this.deletedCounter.update((p) => [...p, ...deletedProduct])
  }
}

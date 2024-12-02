import {Component, computed, signal} from "@angular/core";
import {Product} from "../../infrastructures/types/product";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'unit',
  template: `
    <div (click)="logProducts()">Log</div>
    <div>Deletes Products: {{ deletedCounter().length }}</div>
    <div>Products Quantity {{ products().length }}</div>
    <div>Sold Products: {{ soldProducts().length }}</div>
    <div>Products to sold: {{ productsToSold().length }}</div>
    <ng-container *ngIf="products().length > 0; else notFound">
      <li *ngFor="let product of products()">
        {{ product.name }}
        <span>Product likes: {{ product.like }}</span>
        <span>Product dislikes: {{ product.dislike }}</span>
        <span>Total Likes: {{product.totalLikes}}</span>
        <button (click)="delete(product.id)">Delete</button>
        <button (click)="like(product.id)">Like</button>
        <button (click)="dislike(product.id)">Dislike</button>
        <button (click)="resetLikes(product.id)">Reset</button>
      </li>

    </ng-container>

    <ng-template #notFound>
      <div>Not Found</div>
    </ng-template>
  `,
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class UnitTestComponent {
  deletedCounter = signal<Product[]>([]);
  deletedProducts = signal<number>(0);
  products = signal<Product[]>([
    {
      id: 1,
      name: 'Mi Band',
      seller: 'Pcdiga',
      owner: 'Hugo',
      sold: true,
      like: 0,
      dislike: 0,
      totalLikes: 0,
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
    }
  ])

  soldProducts = computed(() =>{
    return this.products().filter((product) => product.sold !== false);
  })

  productsToSold = computed(() => {
    return this.products().filter((product) => product.sold !== true);
  })

  delete(productId: number | undefined) {
    this.setDeletedCounter(productId);
    this.products.update((products) => {
      return products.filter((product) => product.id !== productId)
    })
  }

  like(id: number | undefined) {
    this.products.update((products) => {
      const selectedProduct = products.find((product) => product.id === id);
      if(selectedProduct && selectedProduct.like !== undefined && selectedProduct.totalLikes !== undefined) {
        selectedProduct.like++;
        selectedProduct.totalLikes++
      }
      return products
    })
  }

  dislike(id: number | undefined) {
    this.products.update((products) => {
      const selectedProduct = this.products().find((product) => product.id === id);
      if(selectedProduct && selectedProduct.dislike !== undefined && selectedProduct.totalLikes !== undefined) {
        selectedProduct.dislike++
        selectedProduct.totalLikes++
      }
      return products;
    })
  }

  resetLikes(id: number | undefined) {
    this.products.update((products) => {
      const selectedProduct = products.find((product) => product.id === id);
      if (selectedProduct && selectedProduct.like !== undefined) {
        selectedProduct.like = 0;
        selectedProduct.dislike = 0;
        selectedProduct.totalLikes = 0;
      }
      return products;
    })
  }

  setDeletedCounter(id: number | undefined) {
    const deletedProduct = this.products().filter((product) => product.id === id);
    this.deletedCounter.update((counter) => [...counter, ...deletedProduct]);
  }

  logProducts() {
    console.log(this.products())
  }
}

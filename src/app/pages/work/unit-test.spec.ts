/// <reference types="cypress" />

import {UnitTestComponent} from "./unit-test.component";

describe('UnitTestComponent', () => {
  let component: UnitTestComponent;

  beforeEach(() => {
    component = new UnitTestComponent();
  })

  it('should delete a product', () => {
    const productIdToDelete = 2;
    component.delete(productIdToDelete);

    cy.wrap(component.products().length).should('eq', 2);

  })

  it('should delete a product and update counts', () => {
    const productIdToDelete = 2;
    component.delete(productIdToDelete);

    cy.wrap(component.products().length).should('eq', 2);
    cy.wrap(component.soldProducts().length).should('eq', 1);
    cy.wrap(component.productsToSold().length).should('eq', 1);
    cy.wrap(component.deletedProducts().length).should('eq', 1);
  });

})

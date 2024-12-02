import {UnitTestComponent} from "../../src/app/pages/work/unit-test.component";
import {mount} from "cypress/angular";

describe('UnitTestComponent Integration Test', () => {
  beforeEach(() => {
    mount(UnitTestComponent);
  });

  it('should display the correct number of products', () => {
    cy.get('div:nth-child(2)').should('contain', 'Products Quantity 3');
  });

  it('should delete a product when the delete button is clicked', () => {
    const initialProductCount = 3;

    // Click the delete button for the first product
    cy.get('button').first().click();

    // Verify the product count decreases by 1
    cy.get('div:nth-child(2)').should('not.contain', 'Products Quantity ' + initialProductCount);
    cy.get('div:nth-child(2)').should('contain', 'Products Quantity ' + (initialProductCount - 1));
  });
});

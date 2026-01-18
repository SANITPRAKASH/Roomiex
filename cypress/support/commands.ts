/// <reference types="cypress" />

// ***********************************************
// Custom commands for Cypress tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to sign in a user
       * @example cy.signIn('test@example.com', 'password123')
       */
      signIn(email: string, password: string): Chainable<void>
      
      /**
       * Custom command to sign up a user
       * @example cy.signUp('Test User', 'test@example.com', 'password123')
       */
      signUp(fullName: string, email: string, password: string): Chainable<void>
    }
  }
}

// Sign in command
Cypress.Commands.add('signIn', (email: string, password: string) => {
  cy.visit('/auth')
  cy.get('input#email').clear().type(email)
  cy.get('input#password').clear().type(password)
  cy.get('button[type="submit"]').click()
})

// Sign up command
Cypress.Commands.add('signUp', (fullName: string, email: string, password: string) => {
  cy.visit('/auth')
  cy.contains("Don't have an account? Sign up").click()
  cy.get('input#fullName').type(fullName)
  cy.get('input#email').type(email)
  cy.get('input#password').type(password)
  cy.get('button[type="submit"]').click()
})

export {}
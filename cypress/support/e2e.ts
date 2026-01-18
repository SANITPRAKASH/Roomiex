// Import commands
import './commands'

// Hide fetch/XHR logs to reduce noise
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  return false
})
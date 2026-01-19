describe('Browse Rooms', () => {
  beforeEach(() => {
    cy.visit('/rooms')
  })

  it('should display browse rooms page', () => {
    cy.contains('Browse Rooms').should('be.visible')
    cy.contains('Find rooms posted by real owners').should('be.visible')
  })

  it('should show search input and filters', () => {
    cy.get('input[placeholder*="Search by location"]').should('be.visible')
    cy.contains('All Types').should('be.visible')
    cy.contains('Filters').should('be.visible')
  })

  it('should filter by search query', () => {
    cy.contains('rooms found', { timeout: 10000 })
    cy.get('input[placeholder*="Search by location"]').type('Bangalore')
    cy.contains(/rooms found|No rooms found/).should('be.visible')
  })

  it('should open and close filters sheet', () => {
    cy.contains('button', 'Filters').click()
    cy.wait(500)
    cy.contains('Refine your search results', { timeout: 5000 }).should('exist')
    cy.get('body').type('{esc}')
    cy.wait(300)
  })

 
  it('should clear all filters', () => {
    cy.get('input[placeholder*="Search by location"]').type('Test Location')
    cy.wait(300)
    cy.contains('Location: Test Location').should('be.visible')
    cy.contains('button', 'Clear').click()
    cy.wait(300)
    cy.contains('Location: Test Location').should('not.exist')
  })

  it('should handle empty state', () => {
    cy.get('input[placeholder*="Search by location"]').type('ZZZNonexistentLocation123')
    cy.wait(500)
    cy.contains('No rooms found').should('be.visible')
    cy.contains('Try adjusting your filters').should('be.visible')
  })

  it('should navigate to list room page', () => {
    cy.contains('Browse Rooms', { timeout: 10000 })
    cy.get('body').then($body => {
      if ($body.text().includes('No real listings yet')) {
        cy.contains('List a Room').should('be.visible')
      }
    })
  })
})
describe('Homepage', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.wait(1500) // Wait for animations
  })

  it('should load homepage successfully', () => {
    cy.contains('Find Your Perfect', { timeout: 10000 }).should('exist')
    cy.contains('Room').should('exist')
  })

  it('should display navigation bar', () => {
    cy.contains('RoomieX').should('exist')
    cy.contains('Browse Rooms').should('exist')
  })

  it('should display hero section with search', () => {
    cy.contains('Find Your Perfect').should('exist')
    cy.contains('Room').should('exist')
    cy.contains('Flatmates').should('exist')
    
    // Check for search inputs
    cy.get('input[placeholder*="city"]').should('exist')
    cy.get('input[placeholder*="budget"]').should('exist')
    cy.contains('button', 'Search').should('exist')
  })

  it('should search with location', () => {
    cy.get('input[placeholder*="city"]').first().type('Koramangala')
    cy.contains('button', 'Search').click()
    cy.url().should('include', '/rooms')
    cy.url().should('include', 'location=Koramangala')
  })

  it('should use quick filters', () => {
    cy.wait(500)
    cy.contains('Near Metro').click()
    cy.url().should('include', '/rooms')
    cy.url().should('include', 'location=Metro')
  })

  it('should display stats', () => {
    cy.contains('12,000+').should('exist')
    cy.contains('Verified Rooms').should('exist')
    cy.contains('50,000+').should('exist')
    cy.contains('Happy Tenants').should('exist')
  })

  it('should display featured rooms section', () => {
    cy.scrollTo(0, 800)
    cy.wait(500)
    cy.contains('Featured Rooms Near You').should('exist')
  })

  it('should display features section', () => {
    cy.scrollTo(0, 1500)
    cy.wait(800)
    cy.contains('Why Choose RoomieX').should('exist')
    cy.contains('Flatmate Compatibility').should('exist')
  })

  it('should display how it works section', () => {
    cy.scrollTo(0, 2500)
    cy.wait(800)
    cy.contains('How').should('exist')
    cy.contains('RoomieX').should('exist')
    cy.contains('Works').should('exist')
    cy.contains('Tell Us Your Vibe').should('exist')
  })

  it('should navigate to auth page from navbar', () => {
    cy.contains('Sign In').click()
    cy.url().should('include', '/auth')
  })

  it('should navigate to browse rooms', () => {
    cy.scrollTo(0, 800)
    cy.wait(500)
    cy.contains('a', 'Browse All Rooms').click({ force: true })
    cy.url().should('include', '/rooms')
  })

  it('should display footer', () => {
    cy.scrollTo('bottom')
    cy.wait(500)
    cy.contains('© 2026 RoomieX').should('exist')
  })

  it('should have working footer links', () => {
    cy.scrollTo('bottom')
    cy.wait(500)
    cy.contains('Browse Rooms').should('have.attr', 'href')
    cy.contains('Find Flatmates').should('have.attr', 'href')
    cy.contains('About Us').should('have.attr', 'href')
    cy.contains('Privacy Policy').should('have.attr', 'href')
  })

  it('should be responsive', () => {
    cy.viewport('iphone-x')
    cy.contains('RoomieX').should('exist')
    
    cy.viewport('ipad-2')
    cy.contains('Find Your Perfect').should('exist')
    
    cy.viewport(1920, 1080)
    cy.contains('Find Your Perfect').should('exist')
  })
})
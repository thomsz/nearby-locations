/// <reference types="cypress" />

before(() => {
	cy.visit('/');
});

describe('Map', () => {
	it('should be able to get a map', () => {
		cy.get('div.gm-style').should('not.exist');
		cy.get('.ant-input-affix-wrapper').click().type('berlin{enter}');
		cy.get('div.gm-style');
	});

	it('should have a marker for the searched city', () => {
		cy.get('map').first().children('area').click({ force: true });
		cy.get('.markerTitle').contains('Berlin');
	});

	it('should have 3 nearby cities markers', () => {
		cy.get('map').should('have.length', 4);
	});
});

describe('Information window', () => {
	it('should get information window', () => {
		cy.get('map').last().children('area').click({ force: true });
		cy.get('button.gm-ui-hover-effect').children('img');
	});

	it('should get temperature', () => {
		cy.contains('Temperature')
			.parent()
			.within(() => {
				cy.get(
					'.ant-statistic-content .ant-statistic-content-value .ant-statistic-content-value-int'
				).contains(/^[0-9]*$/gm);
			});
	});

	it('should get population', () => {
		cy.contains('Population')
			.parent()
			.within(() => {
				cy.get(
					'.ant-statistic-content .ant-statistic-content-value'
				).contains(/[0-9]*,?[0-9]*/gm);
			});
	});

	it('should get distance', () => {
		cy.contains('Distance')
			.parent()
			.within(() => {
				cy.get(
					'.ant-statistic-content .ant-statistic-content-value'
				).contains(/[0-9]*/gm);
			});
	});

	it('should be able to close info window', () => {
		cy.get('.gm-style-iw.gm-style-iw-c')
			.children('button.gm-ui-hover-effect')
			.click({ force: true });
		cy.get('.gm-style-iw.gm-style-iw-c').should('not.exist');
	});
});

describe('Search bar', () => {
	it('should capitalize query', () => {
		cy.get('.ant-input-affix-wrapper').click().type('berlin{enter}');
		cy.get('#currentLocation').should('have.text', 'Berlin');
		cy.get('.ant-input-affix-wrapper input').clear();
	});

	it('should be able to clear search', () => {
		cy.get('.ant-input-affix-wrapper').click().type('berlin{enter}');
		cy.get('.ant-input-suffix > .anticon > svg').click();
		cy.get('.ant-input-affix-wrapper input').should('be.empty');
	});

	it('should be able to search for another city', () => {
		cy.get('.ant-input-affix-wrapper').click().type('new york{enter}');
		cy.get('#currentLocation').should('have.text', 'New York');
	});

	it('should be back at the front page after clearing', () => {
		cy.get('.ant-input-affix-wrapper').click().type('berlin{enter}');
		cy.get('.ant-input-suffix > .anticon > svg').click();
		cy.get('#placeholder');
	});
});

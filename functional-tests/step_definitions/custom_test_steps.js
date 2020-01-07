const methods_interactions = require('kakunin').methods.interactions;
const methods_checkers = require('kakunin').methods.checkers;

const { When, Then } = require('kakunin');

When(/^I click the button$/, function() {
    const elementName = element(by.xpath('//button[@id="button"]'));
    return methods_interactions.click(this.currentPage, elementName);
});

Then(/^there are "([^"]*)" elements$/, function(numberExpression) {
    const elementName = $$('table tr');
    return methods_checkers.checkNumberOfElements(this.currentPage, numberExpression, elementName);
});

Then(/^the button is not visible$/, function() {
    const elementName = element(by.xpath('//button[@id="button"]'));
    return this.currentPage
        .isVisible(elementName)
        .then(isVisible => Promise.reject(isVisible))
        .catch(isVisible => {
            if (isVisible === true) {
                return Promise.reject(`Element '${elementName}' should not be visible.`);
            }

            return Promise.resolve();
        });
});

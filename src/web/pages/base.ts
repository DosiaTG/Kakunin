import config from '../../core/config.helper';
import { waitForInvisibilityOf, waitForVisibilityOf } from '../methods/wait-for-condition.methods';
import { isRelativePage, waitForUrlChangeTo } from '../url-parser.helper';
import { stringify } from 'querystring';
import { element } from 'protractor';
import chalk from 'chalk';

class Page {
  private url: string;

  public visit() {
    if (config.type === 'otherWeb' || !isRelativePage(this.url)) {
      protractor.browser.ignoreSynchronization = true;

      return protractor.browser.get(this.url);
    }

    return protractor.browser.get(this.url).then(() => protractor.browser.waitForAngular());
  }

  public visitWithParameters(data) {
    const additionalParams: any = [];

    const url =
      data.raw().reduce((prev, item) => {
        if (prev.indexOf(`:${item[0]}`) === -1) {
          additionalParams[item[0]] = item[1];
          return prev;
        }
        return prev.replace(`:${item[0]}`, item[1]);
      }, this.url) + (Object.entries(additionalParams).length > 0 ? '?' + stringify(additionalParams) : '');

    if (config.type === 'otherWeb' || !isRelativePage(url)) {
      protractor.browser.ignoreSynchronization = true;

      return protractor.browser.get(url);
    }

    return protractor.browser.get(url).then(() => protractor.browser.waitForAngular());
  }

  public visitWithBasicAuthCredentials(credentials: string) {
    const url = isRelativePage(this.url) ? `${config.baseUrl}${this.url}` : this.url;
    const splittedUrl = url.split('//');
    const urlWithBasicAuth = `${splittedUrl[0]}//${credentials}@${splittedUrl[1]}`;

    if (config.type === 'otherWeb' || !isRelativePage(this.url)) {
      protractor.browser.ignoreSynchronization = true;

      return browser.get(urlWithBasicAuth);
    }

    return browser.get(urlWithBasicAuth).then(() => protractor.browser.waitForAngular());
  }

  public async isOn() {
    if (isRelativePage(this.url) && config.type !== 'otherWeb') {
      protractor.browser.ignoreSynchronization = false;
    }

    return browser.wait(async () => {
      const currentUrl = await browser.getCurrentUrl().then(url => url);

      return waitForUrlChangeTo(this.url, currentUrl)(config.baseUrl);
    }, config.waitForPageTimeout * 1000);
  }

  public click(elementName: string) {
    return this.getElement(elementName).click();
  }

  public isDisabled(elementName: string) {
    return this.getElement(elementName)
      .getAttribute('disabled')
      .then(disabled => ['disabled', true, 'true'].indexOf(disabled) !== -1);
  }

  public isVisible(elementName: string) {
    return this.getElement(elementName).isDisplayed();
  }

  public isPresent(elementName: string) {
    return this.getElement(elementName).isPresent();
  }

  public getNumberOfElements(elementName: any) {
    return this.getElements(elementName).count();
  }

  public scrollIntoElement(elementName: string, elementIndex?: string) {
    if (elementIndex !== undefined) {
      return browser.executeScript(
        'arguments[0].scrollIntoView(false);',
        this.getElement(elementName)
          .get(elementIndex)
          .getWebElement()
      );
    }

    return browser.executeScript('arguments[0].scrollIntoView(false);', this.getElement(elementName).getWebElement());
  }

  public switchIframe(elementName: string) {
    if (elementName === 'default') {
      return protractor.browser.switchTo().defaultContent();
    }
    return protractor.browser.switchTo().frame(this.getElement(elementName).getWebElement());
  }

  public waitForVisibilityOf(elementName: string) {
    return waitForVisibilityOf(this.getElement(elementName));
  }

  public waitForInvisibilityOf(elementName: string) {
    return waitForInvisibilityOf(this.getElement(elementName));
  }

  public getElement(elementName: any) {
    if (!this[elementName]) {
      if (elementName instanceof protractor.ElementFinder === true) {
        return elementName;
      } else {
        console.warn(
          chalk.grey(
            `Element "${elementName}" does not exist in the currentPage. CSS selector will be build from the string!`
          )
        );
        return element(by.css(elementName));
      }
    }
    return this[elementName];
  }

  public getElements(elementName: any) {
    if (!this[elementName]) {
      if (elementName instanceof protractor.ElementArrayFinder === true) {
        return elementName;
      } else {
        console.warn(
          chalk.grey(
            `Element "${elementName}" does not exist in the currentPage. CSS selector will be build from the string!`
          )
        );
        return element.all(by.css(elementName));
      }
    }
    return this[elementName];
  }
}

export default Page;

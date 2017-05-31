import Base from './base';
import { fromHandlers } from '../form-handlers';
import variableStore from '../helpers/variable-store.helper';

class FormPage extends Base {
  fillForm(formData) {
    const fieldsPromises = [];
    formData.forEach((item) => fieldsPromises.push(this.fillField(item[0], item[1])));

    return Promise.all(fieldsPromises);
  }

  checkForm(formData) {
    const fieldsPromises = [];
    formData.forEach((item) => fieldsPromises.push(this.checkField(item[0], item[1])));

    return Promise.all(fieldsPromises);
  }

  fillField(name, value) {
    const self = this;

    return this.getFieldType(name)
      .then(function (fieldType) {
        return fromHandlers.handleFill(fieldType, self, name, variableStore.replaceTextVariables(value));
      });
  }

  checkField(name, value) {
    const self = this;

    return this.getFieldType(name)
      .then(function (fieldType) {
        return fromHandlers.handleCheck(fieldType, self, name, value);
      });
  }

  getFieldType(name) {
    const self = this;

    return self[name].getTagName()
      .then(function (tagName) {
        const fieldType = fromHandlers.findFieldTypeByElementName(name);
        if (fieldType !== null) {
          return fieldType;
        }

        if (tagName.indexOf('select-field') >= 0) {
          return 'CustomAngularSelect';
        }

        if (tagName === 'select') {
          return 'select';
        }

        if (tagName === 'input') {
          return self[name].getAttribute('type').then((inputType) => inputType);
        }

        if (tagName instanceof Array) {
          return self[name].first().getAttribute('type').then((inputType) => inputType);
        }

        return 'text';
      });
  }

  acceptDialog(dialogName, dialogAcceptCheckbox, dialogAcceptButton) {
    const self = this;

    return this.isVisible(dialogName)
      .then(function () {
        return self.click(dialogAcceptCheckbox);
      })
      .then(function () {
        return self.click(dialogAcceptButton);
      });
  }
}

export default FormPage;

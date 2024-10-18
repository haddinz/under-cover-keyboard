import { ChangeEvent, Component } from 'react';

export default abstract class ControlledComponent<P, S> extends Component<P, S> {
  handleInputChange = (e: ChangeEvent, callback?: (val: any) => any) => {
    if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
      return;
    }
    const input: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = e.target;
    const { id, name: fieldPath } = input;

    let value: any;

    if (input.type === 'number') {
      value = input.value;
    } else if (input.type === 'checkbox' && input instanceof HTMLInputElement) {
      value = input.checked;
    } else {
      value = input.value;
    }

    this.setStateObjectValue(this.state, fieldPath, value, () => {
      if (id) {
        document.getElementById(id)?.focus();
      }
      if (callback) {
        callback(value);
      }
    });
  }

  setStateObjectValue = (oldState:any, path: string, value: any, callback?: () => any) => {
    const rawName = path.split('.');
    const rawNameLength = rawName.length;
    let obj = oldState;

    rawName.forEach((key, index) => {
      if (obj && index < rawNameLength - 1) {
        obj = obj[key];
      }
      if (index === rawNameLength - 1) {
        obj[key] = value;
      }
    });
    // console.log("obj: ", obj);
    // console.log("oldState: ", oldState);
    this.setState({ ...oldState }, () => {
      // console.log("STATE: ", this.state);
      if (callback) {
        callback();
      }
    });
  }
}

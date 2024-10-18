/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React from "react";

import { Modal } from "react-bootstrap";
// import {connect} from 'react-redux';

import KeyboardedInput from "./src/KeyboardedInput";

import "./KeyboardModal.less";
// import * as modalActions from 'ProteinConcentrator/ClientApp/Store/actions/modalActions';

// @connect((store) => ({
//   keyboardVisible: store.modalStore.keyboardVisible,
//   keyboardValue: store.modalStore.keyboardValue,
//   keyboardTitle: store.modalStore.keyboardTitle,
//   keyboardCallBack: store.modalStore.keyboardCallBack,
//   overwriteFirstInput: store.modalStore.overwriteFirstInput,
//   keyboardPlaceholder: store.modalStore.keyboardPlaceholder,
//   max: store.modalStore.max,
//   keyboardCancel: store.modalStore.keyboardCancel,
//   disableSymbols: store.modalStore.disableSymbols,
// }))
class KeyboardModal extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.close = this.close.bind(this);
    this.onClear = this.onClear.bind(this);
    this.state = {
      keyboardValue: "",
      overwriteFirstInput: false,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.showKeyboard(nextProps);
    this.overwriteFirstInput(nextProps);
  }

  // eslint-disable-next-line react/sort-comp
  showKeyboard(nextProps) {
    if (nextProps.keyboardVisible) {
      this.setState({
        keyboardValue: nextProps.keyboardValue,
      });
    }
  }

  overwriteFirstInput(nextProps) {
    if (nextProps.overwriteFirstInput) {
      this.setState({
        overwriteFirstInput: nextProps.overwriteFirstInput,
      });
    }
  }

  close() {
    const { onHide, keyboardCallBack } = this.props;
    onHide();
    // this.props.dispatch(modalActions.hideKeyboard());
    const value =
      this.state.keyboardValue === "" ? "" : this.state.keyboardValue;
    if (keyboardCallBack) {
      keyboardCallBack({ type: this.props.keyboardTitle, value });
    }
  }

  cancel = () => {
    const { onHide, keyboardCancel } = this.props;
    onHide();
    // this.props.dispatch(modalActions.hideKeyboard());
    if (keyboardCancel) keyboardCancel();
  };

  // eslint-disable-next-line react/sort-comp
  onChange(e) {
    console.log("output ", e.target.value);
    let input = e.target.value;
    if (this.state.overwriteFirstInput) {
      input = input.replace(this.state.keyboardValue, "");
      this.setState({
        overwriteFirstInput: false,
      });
    }
    this.setState({ keyboardValue: input }, () => {
      // Maintain the cursor position if necessary
      const textArea = e.target.value;
      if (textArea) {
        const cursorPosition = textArea.selectionEnd;
        textArea.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }

  onClear() {
    this.setState({ keyboardValue: "" });
  }

  render() {
    const { keyboardVisible, keyboardTitle, keyboardPlaceholder } = this.props;
    const dataset = {
      type: "input",
    };
    return (
      <Modal
        show={keyboardVisible}
        dialogClassName="modal-dialog-keyboard"
        onHide={this.cancel}
        className="disableTextSelect hideOverflowKeyboard "
      >
        <Modal.Header className="headerKeyboard" closeButton>
          <Modal.Title className="keyboard-title">{keyboardTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-keyboard">
          <div className="divValue center ">
            <div className="valueBackgroundColor">
              <KeyboardedInput
                input={false}
                enabled
                type="text"
                onChange={this.onChange}
                value={this.state.keyboardValue}
                // min={this.props.min}
                max={this.props.max}
                // step={this.props.step}
                name="KeyboardInput"
                className="inputPosition"
                placeholder={keyboardPlaceholder}
                defaultKeyboard="us"
                secondaryKeyboard="de" // optional
                // isDraggable={true}
                onClose={this.close}
                dataset={dataset}
                fontSize={25}
                onClear={this.onClear}
                disableSymbols={this.props.disableSymbols}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
export default KeyboardModal;

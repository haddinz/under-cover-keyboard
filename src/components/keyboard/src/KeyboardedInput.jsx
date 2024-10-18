/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-string-refs */
import React, { createRef } from "react";

import PropTypes from "prop-types";

import Keyboard from "./Keyboard";

class KeyboardedInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusLost = this.handleFocusLost.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.hideKeyboard = this.hideKeyboard.bind(this);
    this.handleClear = this.handleClear.bind(this);

    this.state = {
      showKeyboard: true,
      localValue: props.value,
      // message: "",
    };
    this.inputRef = createRef(undefined);
  }

  componentDidMount() {
    this.inputRef.current.addEventListener("input", this.handleChange);
  }

  componentWillUnmount() {
    this.inputRef.current.removeEventListener("input", this.handleChange);
  }

  handleChange(event) {
    const { onChange, max, value } = this.props;
    event.preventDefault();
    const str = event.target.value;
    if (max !== undefined) {
      let val = "";
      if (str.length <= max) {
        onChange(event);
        val = str;
        // document.getElementById("textAreaKeyboard").value = str;
      } else {
        // document.getElementById("textAreaKeyboard").value = value;
        val = value;
      }
      this.setState({
        localValue: val,
      });
    } else {
      onChange(event);
    }
  }

  handleFocus() {
    if (this.inputRef.current === undefined) return;
    // Prevent blinking of the keyboard if opaque
    // setTimeout(() => {
    if (typeof this.props.value !== "undefined" && this.inputRef?.current) {
      this.inputRef.current.focus();
      this.inputRef.current.select();
      this.inputRef.current.setSelectionRange(
        this.props.value.length,
        this.props.value.length
      );
      // eslint-disable-next-line react/no-access-state-in-setstate
      this.setState({ showKeyboard: true });
    }
    // }, 5);
  }

  handleFocusLost() {
    // setTimeout(() => {
    //   if (!document.activeElement.classList.contains('keyboard-button') && !document.activeElement.classList.contains('keyboard') && !document.activeElement.classList.contains('keyboard-row')) {
    //     this.setState({ ...this.state, showKeyboard: false });
    //   }
    // }, 0);
    if (this.inputRef.current === undefined || !this.inputRef.current) return;
    this.inputRef.current.focus();
    this.inputRef.current.select();
    this.inputRef.current.setSelectionRange(
      this.props.value.length,
      this.props.value.length
    );
    this.setState({ showKeyboard: true });
  }

  handleClear() {
    const { onClear } = this.props;
    this.setState({
      localValue: "",
    });
    onClear();
  }

  hideKeyboard() {
    const { onClose } = this.props;
    this.setState({ showKeyboard: false });
    onClose();
  }

  render() {
    const {
      fontSize,
      value,
      name,
      className,
      placeholder,
      type,
      min,
      max,
      step,
      pattern,
      readOnly,
      defaultKeyboard,
      secondaryKeyboard,
      dataset,
      enabled,
    } = this.props;
    const { localValue, showKeyboard } = this.state;
    const style = {
      constraint: {
        // textAlign: "center",
        fontSize,
      },
    };
    const isDisabledClearIcon = !(value !== undefined && value.length > 0);
    console.log({ ss: this.inputRef });
    return (
      <div style={style.constraint}>
        <div className="divRowKeyboard">
          <textarea
            id="textAreaKeyboard"
            name={name}
            className={className}
            placeholder={placeholder}
            value={localValue}
            type={type}
            onFocus={this.handleFocus}
            onBlur={this.handleFocusLost}
            min={min}
            maxLength={max}
            step={step}
            pattern={pattern}
            onChange={this.handleChange}
            readOnly={readOnly === true}
            ref={(el) => {
              this.inputRef.current = el;
            }}
            // ref={this.inputRef}
          />
          <div className="divColKeyboard">
            <button
              type="button"
              className="buttonClear"
              onClick={this.handleClear}
              disabled={isDisabledClearIcon}
            >
              <span
                className={
                  isDisabledClearIcon === true
                    ? "glyphicon glyphicon-trash clearIcon-disabled"
                    : "glyphicon glyphicon-trash  clearIcon"
                }
              />
            </button>
            <div className="counterKeyboard">
              {value === undefined ? 0 : value.length} / {max}
            </div>
          </div>
        </div>

        {showKeyboard &&
          enabled &&
          readOnly !== true &&
          this.inputRef.current && (
            <Keyboard
              hideKeyboard={this.hideKeyboard}
              defaultKeyboard={defaultKeyboard}
              secondaryKeyboard={secondaryKeyboard}
              inputNode={this.inputRef.current}
              isDraggable={false}
              dataset={dataset}
              maxLength={max}
            />
          )}
      </div>
    );
  }
}

KeyboardedInput.propTypes = {
  value: PropTypes.string,
  fontSize: PropTypes.number,
  name: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  pattern: PropTypes.string,
  readOnly: PropTypes.bool,
  enabled: PropTypes.bool,
  defaultKeyboard: PropTypes.string,
  secondaryKeyboard: PropTypes.string,
  dataset: PropTypes.any,
  onChange: PropTypes.func,
  onClear: PropTypes.func,
  onClose: PropTypes.func,
};

KeyboardedInput.defaultProps = {
  value: "",
  fontSize: 0,
  name: "",
  className: "",
  placeholder: "",
  type: "",
  min: 0,
  max: 0,
  step: 0,
  pattern: "",
  readOnly: false,
  enabled: false,
  defaultKeyboard: "us",
  secondaryKeyboard: "",
  dataset: null,
  onChange: () => {},
  onClear: () => {},
  onClose: () => {},
};

export default KeyboardedInput;

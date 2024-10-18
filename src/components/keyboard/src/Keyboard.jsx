import React, {PureComponent} from 'react';

import {isFinite} from 'lodash';
import PropTypes from 'prop-types';

import BackspaceIcon from './icons/BackspaceIcon';
import LanguageIcon from './icons/LanguageIcon';
import ShiftIcon from './icons/ShiftIcon';
import KeyboardButton from './KeyboardButton';
import CyrillicLayout from './layouts/CyrillicLayout';
import GermanLayout from './layouts/GermanLayout';
import LatinLayout from './layouts/LatinLayout';
import SymbolsLayout from './layouts/SymbolsLayout';

export default class Keyboard extends PureComponent {
  constructor(props) {
    super(props);
    this.handleLetterButtonClick = this.handleLetterButtonClick.bind(this);
    this.handleBackspaceClick = this.handleBackspaceClick.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.handleShiftClick = this.handleShiftClick.bind(this);
    this.handleSymbolsClick = this.handleSymbolsClick.bind(this);
    this.handleLanguageClick = this.handleLanguageClick.bind(this);
    this.handleDragKeyClick = this.handleDragKeyClick.bind(this);

    this.state = {
      currentLanguage: props.defaultKeyboard,
      showSymbols: false,
      uppercase: this.isUppercase(),
    };
  }

  handleLanguageClick() {
    const {defaultKeyboard, secondaryKeyboard} = this.props;
    const {currentLanguage} = this.state;
    this.setState({
      currentLanguage: currentLanguage === defaultKeyboard ? secondaryKeyboard : defaultKeyboard,
    });
  }

  handleShiftClick() {
    const {uppercase} = this.state;
    this.setState({uppercase: !uppercase});
  }

  handleSymbolsClick() {
    const {showSymbols} = this.state;
    this.setState({showSymbols: !showSymbols});
  }

  handleLetterButtonClick(key) {
    const {inputNode, maxLength, onClick} = this.props;
    const {value} = inputNode;
    let selectionStart;
    let selectionEnd;

    try {
      selectionStart = inputNode.value.length;
      selectionEnd = inputNode.value.length;
    } catch (e) {
      selectionStart = value.length;
      selectionEnd = value.length;
    }

    if (maxLength === value.length) {
      selectionStart = value.length;
      selectionEnd = value.length;
    }
    const nextValue = value.substring(0, selectionStart) + key + value.substring(selectionEnd);

    inputNode.value = nextValue;
    if (onClick) {
      onClick(nextValue);
    }
    setTimeout(() => {
      inputNode.focus();
      try {
        const offset = !isFinite(key) ? key.length : 1;
        inputNode.setSelectionRange(selectionStart + offset, selectionStart + offset);
      } catch (e) {
        console.error(e);
      }
    });
    this.setState({uppercase: this.isUppercase()});
    inputNode.dispatchEvent(new CustomEvent('input'));
  }

  handleDragKeyClick() {
    const {inputNode} = this.props;
    setTimeout(() => {
      inputNode.focus();
    }, 0);
  }

  handleBackspaceClick() {
    const {inputNode, onClick} = this.props;
    const {value} = inputNode;
    let selectionStart;
    let selectionEnd;
    try {
      selectionStart = inputNode.selectionStart;
      selectionEnd = inputNode.selectionEnd;
    } catch (e) {
      selectionStart = 0;
      selectionEnd = value.length;
    }

    let nextValue;
    let nextSelectionPosition;
    if (selectionStart === selectionEnd) {
      nextValue = value.substring(0, selectionStart - 1) + value.substring(selectionEnd);
      nextSelectionPosition = selectionStart - 1;
    } else {
      nextValue = value.substring(0, selectionStart) + value.substring(selectionEnd);
      nextSelectionPosition = selectionStart;
    }
    nextSelectionPosition = nextSelectionPosition > 0 ? nextSelectionPosition : 0;

    inputNode.value = nextValue;
    if (onClick) {
      onClick(nextValue);
    }
    setTimeout(() => {
      inputNode.focus();
      try {
        inputNode.setSelectionRange(nextSelectionPosition, nextSelectionPosition);
      } catch (e) {
        console.error(e);
      }
    }, 0);
    this.setState({uppercase: this.isUppercase()});
    inputNode.dispatchEvent(new CustomEvent('input'));
  }

  getKeys() {
    const {showSymbols, currentLanguage, uppercase} = this.state;
    let keysSet;
    if (showSymbols) {
      keysSet = SymbolsLayout;
    } else if (currentLanguage === 'us') {
      keysSet = LatinLayout;
    } else if (currentLanguage === 'de') {
      keysSet = GermanLayout;
    } else if (currentLanguage === 'ru') {
      keysSet = CyrillicLayout;
    } else if (currentLanguage) {
      keysSet = currentLanguage;
    } else {
      keysSet = LatinLayout;
    }

    return uppercase
      ? keysSet.map((keyRow) => keyRow.map((key) => (isFinite(key) ? key : key.toUpperCase())))
      : keysSet;
  }

  getSymbolsKeyValue() {
    const {showSymbols, currentLanguage} = this.state;
    let symbolsKeyValue;
    if (!showSymbols) {
      symbolsKeyValue = '.?!&';
    } else if (currentLanguage === 'us' || currentLanguage === 'de') {
      symbolsKeyValue = 'Abc';
    } else if (currentLanguage === 'ru') {
      symbolsKeyValue = 'Абв';
    } else {
      symbolsKeyValue = 'Abc';
    }
    return symbolsKeyValue;
  }

  clearInput() {
    const {inputNode, onClick} = this.props;

    inputNode.value = '';
    if (onClick) {
      onClick('');
    }

    setTimeout(() => {
      inputNode.focus();
    }, 0);
    inputNode.dispatchEvent(new CustomEvent('input'));
  }

  isUppercase() {
    const {inputNode, isFirstLetterUppercase, uppercaseAfterSpace, dataset} = this.props;
    console.log({inputNode});
    if (inputNode === undefined || inputNode === null) return false;
    return (
      inputNode.type !== 'password' &&
      dataset.type !== 'email' &&
      ((!inputNode.value.length && isFirstLetterUppercase) ||
        (inputNode.value.length > 0 && inputNode.value[inputNode.value.length - 1] === ' ' && uppercaseAfterSpace))
    );
  }

  render() {
    const {secondaryKeyboard, keyboardClassName, opacity, isDraggable, hideKeyboard} = this.props;
    const keys = this.getKeys();
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    const symbolsKeyValue = this.getSymbolsKeyValue();

    return (
      <div className="center">
        <div
          className={`keyboard keyboard-wrapper ${typeof keyboardClassName !== 'undefined' ? keyboardClassName : ''}`}
          style={{opacity: `${typeof opacity !== 'undefined' ? opacity : 1}`}}
        >
          <div className="keyboard-row">
            {numbers.map((button) => (
              <KeyboardButton
                value={button}
                onClick={this.handleLetterButtonClick}
                classes="keyboard-numberButton"
                key={button}
              />
            ))}
            <KeyboardButton
              value={<BackspaceIcon />}
              onClick={this.handleBackspaceClick}
            />
          </div>

          {keys.map((row, i) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={`r${i}`}
              className="keyboard-row"
            >
              {keys.length === i + 1 && (
                <KeyboardButton
                  classes="shift-symbols"
                  value={<ShiftIcon />}
                  onClick={this.handleShiftClick}
                />
              )}
              {row.map((button, ii) => (
                <KeyboardButton
                  value={button}
                  onClick={this.handleLetterButtonClick}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`b${ii}`}
                />
              ))}

              {keys.length === i + 1 && (
                <KeyboardButton
                  classes="shift-symbols"
                  value={symbolsKeyValue}
                  onClick={this.handleSymbolsClick}
                />
              )}
            </div>
          ))}

          <div className="keyboard-row">
            {typeof secondaryKeyboard !== 'undefined' ? (
              <KeyboardButton
                value={<LanguageIcon />}
                onClick={this.handleLanguageClick}
              />
            ) : null}
            {isDraggable !== false ? (
              <KeyboardButton
                value={
                  ''
                  // <DraggableIcon />
                }
                classes=""
                onClick={this.handleDragKeyClick}
              />
            ) : null}
            <KeyboardButton
              value={' '}
              classes="keyboard-space"
              onClick={this.handleLetterButtonClick}
            />
            <KeyboardButton
              value="Ok"
              classes="keyboard-submit-button"
              onClick={hideKeyboard}
            />
          </div>
        </div>
        {/* </Draggable> */}
      </div>
    );
  }
}
Keyboard.propTypes = {
  keyboardClassName: PropTypes.string,
  opacity: PropTypes.number,
  isDraggable: PropTypes.bool,
  isFirstLetterUppercase: PropTypes.bool,
  defaultKeyboard: PropTypes.string,
  secondaryKeyboard: PropTypes.string,
  hideKeyboard: PropTypes.func,
  onClick: PropTypes.func,
  inputNode: PropTypes.any,
  uppercaseAfterSpace: PropTypes.bool,
  dataset: PropTypes.any,
  maxLength: PropTypes.number,
};

Keyboard.defaultProps = {
  keyboardClassName: '',
  opacity: 1,
  isDraggable: false,
  isFirstLetterUppercase: false,
  defaultKeyboard: 'us',
  secondaryKeyboard: '',
  hideKeyboard: () => {},
  onClick: () => {},
  inputNode: undefined,
  dataset: {},
  uppercaseAfterSpace: false,
  maxLength: null,
};

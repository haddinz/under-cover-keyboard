import React, {PureComponent} from 'react';

import PropTypes from 'prop-types';

class KeyboardButton extends PureComponent {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const {onClick, value} = this.props;
    onClick(value);
  }

  render() {
    const {isDisabled, classes, autofocus, value} = this.props;
    return (
      <button
        type="button"
        tabIndex="-1"
        className={`keyboard-button ${classes}`}
        onClick={isDisabled ? null : this.handleClick}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={autofocus}
        disabled={isDisabled}
      >
        {value}
      </button>
    );
  }
}
KeyboardButton.propTypes = {
  value: PropTypes.string,
  classes: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  autofocus: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

KeyboardButton.defaultProps = {
  value: '',
  classes: '',
  autofocus: false,
  isDisabled: false,
};

export default KeyboardButton;

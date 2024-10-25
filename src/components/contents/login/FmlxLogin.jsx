/* eslint-disable react/jsx-no-useless-fragment */
import "./FmlxLogin.scss";

import React, { useState } from "react";
import {
  FmlxButton,
  FmlxCheckBox,
  FmlxIcon,
  FmlxLabel,
  FmlxLink,
  FmlxTextBox,
} from "fmlx-common-ui";
import PropTypes from "prop-types";
import Keyboard from "../../keyboard/Keyboard";
import useScreenSize from "../../../hooks/useScreenSize";

// import FormulatrixIcon from '../../../_assets/images/formulatrix.svg';

const FmlxLogin = function FmlxLogin({
  logo,
  username,
  password,
  title,
  version,
  year,
  customLabelUsername,
  customLabelPassword,
  showRememberMe,
  showRequestNewAccount,
  showForgotPassword,
  rememberMe,
  onUsernameChange,
  onPasswordChange,
  onRememberMeChange,
  onButtonLoginClick,
  onRequestNewAccountClick,
  onForgotPasswordClick,
  id,
  showPassword,
  handleShowPassword,
  size,
  showKeyboard,
  hideFooter,
  hideRequestAccount,
  hideTitle,
  hideRememberMe,
  textBoxSize,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [idInputValue, setIdInputValue] = useState("");
  const [onFocusName, setOnFocusName] = useState("");
  const [inputUsername, setInputUsername] = useState(username || "");
  const [inputPassword, setInputPassword] = useState(password || "");

  const handleUsernameChange = (textBoxValue) => {
    setInputUsername(textBoxValue);
  };

  const handlePasswordChange = (textBoxValue) => {
    if (onPasswordChange) {
      onPasswordChange(textBoxValue.value);
    }
  };

  const handleClick = (e) => {
    const valueId = e.target.id;
    setOnFocusName(valueId);
    setIdInputValue(valueId);
    setIsOpen(!isOpen);
  };

  const handleRememberMeChange = (e) => {
    if (onRememberMeChange) {
      onRememberMeChange(e);
    }
  };

  const handleRequestNewAccountClick = (e) => {
    if (onRequestNewAccountClick) {
      onRequestNewAccountClick(e);
    }
  };

  const handleForgotPasswordClick = (e) => {
    if (onForgotPasswordClick) {
      onForgotPasswordClick(e);
    }
  };

  const handleInputValue = (input) => {
    if (onFocusName === "username") {
      setInputUsername(input);
      if (onUsernameChange) {
        onUsernameChange(input);
      }
    } else if (onFocusName === "password") {
      setInputPassword(input);
      if (onPasswordChange) {
        onPasswordChange(input);
      }
    }

    setIsOpen(!isOpen);
  };

  return (
    <div className="external-screen">
      <div
        id={id}
        className={size ? "login-screen-full" : "login-screen"}
      >
        <div className="login-body">
          <div className="logo">{logo}</div>

          {hideTitle && (
            <div className="title">
              <h3>{title}</h3>
            </div>
          )}

          <form className="login-form">
            <div className="form-group">
              <FmlxLabel
                label={
                  customLabelUsername !== "" ? customLabelUsername : "Username"
                }
              />
              <FmlxTextBox
                id="username"
                size={
                  FmlxTextBox.Size[textBoxSize]
                }
                value={inputUsername}
                onChange={(e) => {
                  handleUsernameChange(e.value);
                }}
                placeholder={customLabelUsername}
                decoration={FmlxTextBox.Decoration.NONE}
                onClick={handleClick}
              />
            </div>

            <div className="form-group">
              <FmlxLabel
                label={
                  customLabelPassword !== "" ? customLabelPassword : "Password"
                }
              />
              <FmlxTextBox
                id="password"
                size={
                  FmlxTextBox.Size[textBoxSize]
                }
                mode={FmlxTextBox.Mode.TEXT}
                value={inputPassword}
                onChange={(e) => {
                  handlePasswordChange(e.value);
                }}
                placeholder={customLabelPassword}
                decoration={FmlxTextBox.Decoration.ICON}
                onClick={handleClick}
              />
            </div>
          </form>

          {showRememberMe && hideRememberMe ? (
            <div className="remember-me">
              <FmlxCheckBox
                label="Remember me"
                checked={rememberMe}
                size={FmlxCheckBox.Size.SMALL}
                onChange={handleRememberMeChange}
              />
            </div>
          ) : (
            <></>
          )}
          <FmlxButton
            label="LOGIN"
            type={FmlxButton.Type.PRIMARY}
            variant={FmlxButton.Variant.CONTAIN}
            onClick={onButtonLoginClick}
            fullWidth
          />

          {(showRequestNewAccount || showForgotPassword) && hideRequestAccount ? (
            <div className="additional">
              {showRequestNewAccount ? (
                <div className="request-new-account">
                  <FmlxLink
                    id={`${id}--link-request-new-account`}
                    label="Request New Account"
                    onClick={handleRequestNewAccountClick}
                  />
                </div>
              ) : (
                <></>
              )}
              {showForgotPassword ? (
                <div className="forgot-password">
                  <FmlxLink
                    id={`${id}--link-forgot-${customLabelPassword}`}
                    label={`Forgot ${customLabelPassword}`}
                    onClick={handleForgotPasswordClick}
                  />
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
        {hideFooter ? (
          <div className="login-footer">
            <div className="app-version">
              {version ? `Version ${version}` : <></>}
            </div>
            <div className="formulatrix-icon">
              {/* <FormulatrixIcon /> */}Icon Formulatrix
            </div>
            {year ? (
              <div className="year">
                &#169;
                {year}
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}

        {showKeyboard && !size && (
          <Keyboard
            title={idInputValue}
            show={isOpen}
            onCloseClick={() => setIsOpen(!isOpen)}
            onPrimaryButtonClick={handleInputValue}
            primaryButtonName="Ok"
          />
        )}
      </div>
    </div>
  );
};

FmlxLogin.propTypes = {
  logo: PropTypes.node,
  title: PropTypes.node,
  username: PropTypes.string,
  password: PropTypes.string,
  version: PropTypes.node,
  year: PropTypes.node,
  customLabelUsername: PropTypes.string,
  customLabelPassword: PropTypes.string,
  showRememberMe: PropTypes.bool,
  showRequestNewAccount: PropTypes.bool,
  showForgotPassword: PropTypes.bool,
  rememberMe: PropTypes.bool,
  onUsernameChange: PropTypes.func,
  onPasswordChange: PropTypes.func,
  onRememberMeChange: PropTypes.func,
  onButtonLoginClick: PropTypes.func,
  onRequestNewAccountClick: PropTypes.func,
  onForgotPasswordClick: PropTypes.func,
  id: PropTypes.string,
  showPassword: PropTypes.bool,
  handleShowPassword: PropTypes.func,
  size: PropTypes.bool,
  showKeyboard: PropTypes.bool,
  hideFooter: PropTypes.bool,
  hideRequestAccount: PropTypes.bool,
  hideTitle: PropTypes.bool,
  hideRememberMe: PropTypes.bool,
  textBoxSize: PropTypes.string,
};

FmlxLogin.defaultProps = {
  logo: null,
  title: "Login Into Account",
  username: "",
  password: "",
  version: "1.0.0",
  year: new Date().getFullYear(),
  customLabelUsername: "Username",
  customLabelPassword: "Password",
  showRememberMe: true,
  showRequestNewAccount: false,
  showForgotPassword: true,
  rememberMe: false,
  onUsernameChange: () => {},
  onPasswordChange: () => {},
  onRememberMeChange: () => {},
  onButtonLoginClick: () => {},
  onRequestNewAccountClick: () => {},
  onForgotPasswordClick: () => {},
  id: "login-component",
  showPassword: false,
  handleShowPassword: () => {},
  size: false,
  showKeyboard: false,
  hideFooter: false,
  hideRequestAccount: false,
  hideTitle: false,
  hideRememberMe: false,
  textBoxSize: "MEDIUM",
};

export default FmlxLogin;

/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React, { useState } from "react";
import { FmlxIcon, FmlxKeyboard, FmlxLabel } from "fmlx-common-ui";
import Content from "../keyboardCostum/content";

interface UserCredentialsProps {
  username: string;
  password: string;
  showPassword?: boolean;
  handleShowPassword?: () => void;
  handleChangeUsername: (value: string) => void;
  handleChangePassword: (value: string) => void;
  handleSubmit?: (e: React.SyntheticEvent) => void;
}

const ExternalScreenSmallSize: React.FC<UserCredentialsProps> =
  function ExternalScreenSmallSize({
    username,
    password,
    showPassword,
    handleShowPassword,
    handleChangeUsername,
    handleChangePassword,
    handleSubmit,
  }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [onFocusName, setOnFocusName] = useState<string>("");
    const [inputUsername, setInputUsername] = useState<string>(username);
    const [inputPassword, setInputPassword] = useState<string>(password);

    const handleFocusInput = (e: React.FocusEvent<HTMLInputElement>) => {
      const inputName = e.target.name;
      setOnFocusName(inputName);
      setIsOpen(!isOpen);
    };

    const handleInputValue = (input: string) => {
      if (onFocusName === "username") {
        setInputUsername(input);
        handleChangeUsername(input);
      } else if (onFocusName === "password") {
        setInputPassword(input);
        handleChangePassword(input);
      }

      setIsOpen(!isOpen);
    };

    return (
      <div>
        <form className="external-form" onSubmit={handleSubmit}>
          <div className="external-screen-icon">{logo}</div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              name="username"
              className="form-input-solid"
              type="text"
              id="username"
              placeholder="Username"
              value={inputUsername}
              onChange={(e) => {
                setInputUsername(e.target.value);
                handleChangeUsername(e.target.value);
              }}
              onFocus={handleFocusInput}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="form-input-password">
              <input
                name="password"
                className="form-input-transparent"
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Password"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                  handleChangePassword(e.target.value);
                }}
                onFocus={handleFocusInput}
                required
              />

              <button
                type="button"
                className="toggle-password"
                onClick={handleShowPassword}
              >
                {showPassword ? (
                  <FmlxIcon name="Eye" size="sm" customColor="grey" />
                ) : (
                  <FmlxIcon name="EyeOff" size="sm" customColor="grey" />
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="form-button">
            LOGIN
          </button>
        </form>

        <FmlxKeyboard
          title={
            onFocusName === "username" ? "Input Username" : "Input Password"
          }
          open={isOpen}
          id="keyboard-costum"
          onCloseClick={() => setIsOpen(!isOpen)}
          onButtonOkClick={handleInputValue}
        />

        <Content
          title={onFocusName === "username" ? "Input Username" : "Input Password"}
          show={true}
          onCloseClick={() => setIsOpen(!isOpen)}
          onButtonOkClick={handleInputValue}
        />
      </div>
    );
  };

const logo = (
  <>
    <FmlxIcon name="Stampede" customColor="#f7a246" customSize={72} />
    <FmlxLabel label="Stampede" size="3xl" />
  </>
);

export default ExternalScreenSmallSize;

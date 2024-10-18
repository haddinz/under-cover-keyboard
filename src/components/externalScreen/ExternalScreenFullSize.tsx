/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
import React, { SyntheticEvent } from 'react';
import { FmlxIcon, FmlxLogin } from 'fmlx-common-ui';

interface UserCredentialsProps {
  username: string;
  password: string;
  rememberMe: boolean;
  onRememberMeChange: (event: SyntheticEvent<Element, Event>) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  handleSubmit?: (e: React.SyntheticEvent) => void;
}

const ExternalScreenFullSize: React.FC<UserCredentialsProps> =
  function ExternalScreenFullSize({
    username,
    password,
    rememberMe,
    onRememberMeChange,
    onUsernameChange,
    onPasswordChange,
    handleSubmit,
  }) {
    return (
      <div className="external-screen">
        <FmlxLogin
          logo={logo}
          username={username}
          password={password}
          rememberMe={rememberMe}
          onRememberMeChange={onRememberMeChange}
          onUsernameChange={onUsernameChange}
          onPasswordChange={onPasswordChange}
          onButtonLoginClick={handleSubmit}
        />
      </div>
    );
  };

const logo = (
  <>
    <FmlxIcon name="Stampede" size="sm" />
    <div>Stampede</div>
  </>
);

export default ExternalScreenFullSize;

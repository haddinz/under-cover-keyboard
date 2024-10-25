import React, { useState } from "react";
import { FmlxIcon, FmlxLabel } from "fmlx-common-ui";
import useScreenSize from "../../../hooks/useScreenSize";
import FmlxLogin from "./FmlxLogin";

const Login: React.FC = function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRemeberMe] = useState<boolean>(false);

  const size = useScreenSize();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    window.alert("access denide");
  };

  const handleChangeUsername = (value: string) => {
    setUsername(value);
  };

  const handleChangePassword = (value: string) => {
    setPassword(value);
  };

  const handleRememberMeChange = (e) => {
    setRemeberMe(e.target.checked);
  };

  const logo = (
    <>
      <FmlxIcon name="Stampede" customColor="#f7a246" customSize={size ? 46 : 54} />
      <FmlxLabel label="Stampede" size={size ? "xl" : "2xl"} />
    </>
  );

  return (
    <div className="external-screen">
      <FmlxLogin
        logo={logo}
        username={username}
        password={password}
        showPassword={showPassword}
        handleShowPassword={handleShowPassword}
        onUsernameChange={handleChangeUsername}
        onPasswordChange={handleChangePassword}
        size={size}
        hideFooter={size}
        showKeyboard={!size}
        hideRequestAccount={size}
        hideTitle={size}
        hideRememberMe={size}
        textBoxSize={size ? "MEDIUM" : "SMALL"}
      />
    </div>
  );
};

export default Login;

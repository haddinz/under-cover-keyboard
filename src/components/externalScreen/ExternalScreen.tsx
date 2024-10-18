import "./ExternalScreen.scss";
import React, { useState } from "react";
import { useMediaQuery } from "@mui/material";
import ExternalScreenSmallSize from "./ExternalScreenSmallSize";
import ExternalScreenFullSize from "./ExternalScreenFullSize";
import KeyboardModal from "../keyboard/KeyboardModal";
import useScreenSize from "../../libs/hooks/useScreenSize";
import Content from "../keyboardCostum/content";

const ExternalScreen: React.FC = function ExternalScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRemeberMe] = useState<boolean>(false);

  const matches = useScreenSize();

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

  return (
    <div className="external-screen">
      {matches ? (
        <ExternalScreenFullSize
          username={username}
          password={password}
          rememberMe={rememberMe}
          onRememberMeChange={handleRememberMeChange}
          onUsernameChange={handleChangeUsername}
          onPasswordChange={handleChangePassword}
          handleSubmit={handleSubmit}
        />
      ) : (
        <ExternalScreenSmallSize
          username={username}
          password={password}
          showPassword={showPassword}
          handleShowPassword={handleShowPassword}
          handleChangeUsername={handleChangeUsername}
          handleChangePassword={handleChangePassword}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default ExternalScreen;

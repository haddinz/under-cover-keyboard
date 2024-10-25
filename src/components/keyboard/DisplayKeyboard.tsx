import { Button } from "@mui/material";
import React from "react";

interface DisplayKeyboardProps {
  keypadValue: string[][];
  enterValue: string;
  shiftValue: boolean;
  style: string;
  handleButtonClick: (value: string) => void;
  handlePrimaryButtonClick: (value: string) => void;
  onShiftButtonColor: () => void;
  handleDisplayKeyboard: (value: string) => void;
  handleButtonKeypad: (key: string) => React.ReactNode;
  displayKeyboard: string;
  primaryButtonName: string | undefined;
}

const DisplayKeyboard: React.FC<DisplayKeyboardProps> =
  function DisplayKeyboard({
    keypadValue,
    enterValue,
    shiftValue,
    style,
    handleButtonClick,
    handlePrimaryButtonClick,
    onShiftButtonColor,
    handleDisplayKeyboard,
    handleButtonKeypad,
    displayKeyboard,
    primaryButtonName,
  }) {
    return (
      <div className="display-style">
        {keypadValue.map((row) => (
          <div key={`row-${row}`} className="first-row ">
            {row.map((key) => (
              <Button
                key={key}
                type="button"
                className={key === "shift" ? `${style}` : ""}
                style={{ textTransform: "none" }}
                onClick={() => {
                  if (key === "shift") {
                    handleButtonClick("shift");
                    onShiftButtonColor();
                  } else if (key === "=/<") {
                    handleDisplayKeyboard("=/<");
                  } else if (key === "?123") {
                    handleDisplayKeyboard("?123");
                  } else {
                    handleButtonClick(key);
                  }
                }}
              >
                {handleButtonKeypad(key)}
              </Button>
            ))}
          </div>
        ))}

        <div className="last-row">
          {displayKeyboard === "ABC" ? (
            <Button type="button" onClick={() => handleDisplayKeyboard("?123")}>
              ?123
            </Button>
          ) : (
            <Button type="button" onClick={() => handleDisplayKeyboard("ABC")}>
              ABC
            </Button>
          )}
          <Button
            type="button"
            className="spacebar"
            onClick={() => handleButtonClick("spacebar")}
          >
            spacebar
          </Button>
          <Button
            type="submit"
            className="enter"
            onClick={() => handlePrimaryButtonClick(enterValue)}
          >
            {primaryButtonName}
          </Button>
        </div>
      </div>
    );
  };

export default DisplayKeyboard;

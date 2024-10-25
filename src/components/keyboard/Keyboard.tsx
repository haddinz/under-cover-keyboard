/* eslint-disable no-nested-ternary */
import { FmlxIcon } from "fmlx-common-ui";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import buttonKeyboard from "./ButtonKeyboard";
import DisplayKeyboard from "./DisplayKeyboard";
import { keyIconRows, keyIconSecondRows, keyLetterRows } from "./KeyKeyboard";

import "./Keyboard.scss";

interface KeyboardProps {
  title?: string;
  show?: boolean;
  onCloseClick?: () => void | undefined;
  onPrimaryButtonClick?: (inputValue: string) => void | undefined;
  id?: string;
  primaryButtonName?: string;
}

const Keyboard: React.FC<KeyboardProps> = function Keyboard({
  title,
  show,
  onCloseClick,
  onPrimaryButtonClick,
  id,
  primaryButtonName,
}) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const [enterValue, setEnterValue] = useState<string>("");
  const [capslockValue, setCapslockValue] = useState<boolean>(false);
  const [shiftValue, setShiftValue] = useState<boolean>(false);

  const [style, setStyle] = useState<string>("dark");
  const [displayKeyboard, setDisplayKeyboard] = useState<string>("ABC");

  const [inputValues, setInputValues] = useState({});

  const handleInputChange = (e) => {
    const { id: idInput, value } = e.target;

    setInputValues((prevValues) => ({
      ...prevValues,
      [idInput]: value,
    }));

    setEnterValue(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition]);

  const onShiftButtonColor = () => {
    setStyle((prevStyle) => (prevStyle === "light" ? "dark" : "light"));
  };

  const handleDisplayKeyboard = (modelKey) => {
    setDisplayKeyboard(modelKey);
  };

  const handleButtonClick = (value: string) => {
    if (textAreaRef.current) {
      const newCursorPosition = textAreaRef.current.selectionStart || 0;
      const leftPart = enterValue.slice(0, newCursorPosition);
      const rightPart = enterValue.slice(newCursorPosition);

      switch (value) {
        case "backspace":
          if (newCursorPosition > 0) {
            setEnterValue(leftPart.slice(0, -1) + rightPart);
            setCursorPosition(newCursorPosition - 1);
          }
          break;
        case "caps":
          setCapslockValue(!capslockValue);
          break;
        case "tab":
          setEnterValue(`${leftPart}    ${rightPart}`);
          setCursorPosition(newCursorPosition + 4);
          break;
        case "shift":
          setShiftValue(!shiftValue);
          break;
        case "spacebar":
          setEnterValue(`${leftPart} ${rightPart}`);
          setCursorPosition(newCursorPosition + 1);
          break;
        default:
          const [primaryChar, secChar, Terchar] = buttonKeyboard[value];
          let charToAppend;
          if (capslockValue === shiftValue) {
            charToAppend = primaryChar;
          } else if (capslockValue === true && shiftValue === false) {
            charToAppend = Terchar;
          } else {
            charToAppend = secChar;
          }
          setEnterValue(leftPart + charToAppend + rightPart);
          setCursorPosition(newCursorPosition + 1);
          break;
      }
    }
  };

  const handleClose = () => {
    if (onCloseClick) {
      onCloseClick();
    }
    setDisplayKeyboard("ABC");
    // setEnterValue({inputValues});
  };

  const handlePrimaryButtonClick = (value: string) => {
    if (onPrimaryButtonClick) {
      onPrimaryButtonClick(value);
    }
    setDisplayKeyboard("ABC");
    // setEnterValue();
  };

  const onTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEnterValue(e.target.value);
    setCursorPosition(e.target.selectionStart || 0);
  };

  const handleButtonKeypad = (key) => {
    if (key === "shift") {
      return <FmlxIcon name="ArrowUpAlt" />;
    }
    if (key === "backspace") {
      return <FmlxIcon name="Backspace" />;
    }
    if (key === "xx") {
      return "x";
    }
    return shiftValue ? key.toUpperCase() : key.toLowerCase();
  };

  if (!show) {
    return null;
  }

  return (
    show && (
      <Box className="keyboard-style" id={id}>
        <Box className="kerbord-header">
          <Typography variant="h6">Input {title}</Typography>
          <IconButton onClick={handleClose}>
            <FmlxIcon name="CloseOutline" />
          </IconButton>
        </Box>

        <Box className="textbox">
          <textarea
            value={enterValue}
            placeholder="type here"
            ref={textAreaRef}
            // onChange={onTextAreaChange}
            onChange={handleInputChange}
            onSelect={(e) => setCursorPosition(e.currentTarget.selectionStart)}
          />
        </Box>

        <DisplayKeyboard
          enterValue={enterValue}
          shiftValue={shiftValue}
          handleButtonClick={handleButtonClick}
          handlePrimaryButtonClick={handlePrimaryButtonClick}
          onShiftButtonColor={onShiftButtonColor}
          style={style}
          handleButtonKeypad={handleButtonKeypad}
          handleDisplayKeyboard={handleDisplayKeyboard}
          displayKeyboard={displayKeyboard}
          primaryButtonName={primaryButtonName}
          keypadValue={
            displayKeyboard === "ABC"
              ? keyLetterRows
              : displayKeyboard === "?123"
              ? keyIconRows
              : keyIconSecondRows
          }
        />
      </Box>
    )
  );
};

Keyboard.propTypes = {
  title: PropTypes.string,
  show: PropTypes.bool,
  onCloseClick: PropTypes.func,
  onPrimaryButtonClick: PropTypes.func,
  id: PropTypes.string,
  primaryButtonName: PropTypes.string,
};

Keyboard.defaultProps = {
  title: "some title",
  show: false,
  onCloseClick: () => {},
  onPrimaryButtonClick: () => {},
  id: "id-style",
  primaryButtonName: "",
};

export default Keyboard;

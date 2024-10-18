import { FmlxIcon } from "fmlx-common-ui";
import React from "react";

interface DisplayProps {
  enterValue: string;
  shiftValue: boolean;
  style: string;
  handleButtonClick: (value: string) => void;
  handleButtonOkClick: (value: string) => void;
  handleShiftButtonColor: () => void;
  handleDisplayKeyboard: () => void;
}

const Display: React.FC<DisplayProps> = function Display({
  enterValue,
  shiftValue,
  style,
  handleButtonClick,
  handleButtonOkClick,
  handleShiftButtonColor,
  handleDisplayKeyboard,
}) {
  return (
    <div className="display-style">
      <div className="first-row">
        <button type="button" onClick={() => handleButtonClick("q")}>
          {shiftValue ? "Q" : "q"}
        </button>
        <button type="button" onClick={() => handleButtonClick("w")}>
          {shiftValue ? "W" : "w"}
        </button>
        <button type="button" onClick={() => handleButtonClick("e")}>
          {shiftValue ? "E" : "e"}
        </button>
        <button type="button" onClick={() => handleButtonClick("r")}>
          {shiftValue ? "R" : "r"}
        </button>
        <button type="button" onClick={() => handleButtonClick("t")}>
          {shiftValue ? "T" : "t"}
        </button>
        <button type="button" onClick={() => handleButtonClick("y")}>
          {shiftValue ? "Y" : "y"}
        </button>
        <button type="button" onClick={() => handleButtonClick("u")}>
          {shiftValue ? "U" : "u"}
        </button>
        <button type="button" onClick={() => handleButtonClick("i")}>
          {shiftValue ? "I" : "i"}
        </button>
        <button type="button" onClick={() => handleButtonClick("o")}>
          {shiftValue ? "O" : "o"}
        </button>
        <button type="button" onClick={() => handleButtonClick("p")}>
          {shiftValue ? "P" : "p"}
        </button>
        <button type="button" onClick={() => handleButtonClick("backspace")}>
          <FmlxIcon name="Backspace" />
        </button>
      </div>

      <div className="second-row">
        <button type="button" onClick={() => handleButtonClick("a")}>
          {shiftValue ? "A" : "a"}
        </button>
        <button type="button" onClick={() => handleButtonClick("s")}>
          {shiftValue ? "S" : "s"}
        </button>
        <button type="button" onClick={() => handleButtonClick("d")}>
          {shiftValue ? "D" : "d"}
        </button>
        <button type="button" onClick={() => handleButtonClick("f")}>
          {shiftValue ? "F" : "f"}
        </button>
        <button type="button" onClick={() => handleButtonClick("g")}>
          {shiftValue ? "G" : "g"}
        </button>
        <button type="button" onClick={() => handleButtonClick("h")}>
          {shiftValue ? "H" : "h"}
        </button>
        <button type="button" onClick={() => handleButtonClick("j")}>
          {shiftValue ? "J" : "j"}
        </button>
        <button type="button" onClick={() => handleButtonClick("k")}>
          {shiftValue ? "K" : "k"}
        </button>
        <button type="button" onClick={() => handleButtonClick("l")}>
          {shiftValue ? "L" : "l"}
        </button>
        <button type="button" onClick={handleDisplayKeyboard}>
          ?123
        </button>
      </div>

      <div className="third-row">
        <button
          type="button"
          className={`${style}`}
          onClick={() => {
            handleButtonClick("shift");
            handleShiftButtonColor();
          }}
        >
          <FmlxIcon name="ArrowUpAlt" />
        </button>
        <button type="button" onClick={() => handleButtonClick("z")}>
          {shiftValue ? "Z" : "z"}
        </button>
        <button type="button" onClick={() => handleButtonClick("x")}>
          {shiftValue ? "X" : "x"}
        </button>
        <button type="button" onClick={() => handleButtonClick("c")}>
          {shiftValue ? "C" : "c"}
        </button>
        <button type="button" onClick={() => handleButtonClick("v")}>
          {shiftValue ? "V" : "v"}
        </button>
        <button type="button" onClick={() => handleButtonClick("b")}>
          {shiftValue ? "B" : "b"}
        </button>
        <button type="button" onClick={() => handleButtonClick("n")}>
          {shiftValue ? "N" : "n"}
        </button>
        <button type="button" onClick={() => handleButtonClick("m")}>
          {shiftValue ? "M" : "m"}
        </button>
      </div>

      <div className="forth-row">
        <button type="button" onClick={() => handleButtonClick(".")}>
          .
        </button>
        <button
          type="button"
          className="spacebar"
          onClick={() => handleButtonClick("spacebar")}
        >
          spacebar
        </button>
        <button type="button" onClick={() => handleButtonClick(",")}>
          ,
        </button>
        <button
          type="submit"
          className="enter"
          onClick={() => handleButtonOkClick(enterValue)}
        >
          ok
        </button>
      </div>
    </div>
  );
};

export default Display;

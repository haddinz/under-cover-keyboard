import { FmlxIcon } from "fmlx-common-ui";
import React from "react";

interface NumpadProps {
  enterValue: string;
  shiftValue: boolean;
  style: string;
  handleButtonClick: (value: string) => void;
  handleButtonOkClick: (value: string) => void;
  handleShiftButtonColor: () => void;
  handleDisplayKeyboard: () => void;
}

const Numpad: React.FC<NumpadProps> = function Numpad({
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
        <button type="button" onClick={() => handleButtonClick("1")}>
          1
        </button>
        <button type="button" onClick={() => handleButtonClick("2")}>
          2
        </button>
        <button type="button" onClick={() => handleButtonClick("3")}>
          3
        </button>
        <button type="button" onClick={() => handleButtonClick("4")}>
          4
        </button>
        <button type="button" onClick={() => handleButtonClick("5")}>
          5
        </button>
        <button type="button" onClick={() => handleButtonClick("6")}>
          6
        </button>
        <button type="button" onClick={() => handleButtonClick("7")}>
          7
        </button>
        <button type="button" onClick={() => handleButtonClick("8")}>
          8
        </button>
        <button type="button" onClick={() => handleButtonClick("9")}>
          9
        </button>
        <button type="button" onClick={() => handleButtonClick("0")}>
          0
        </button>
        <button type="button" onClick={() => handleButtonClick("backspace")}>
          <FmlxIcon name="Backspace" />
        </button>
      </div>

      <div className="second-row">
        <button type="button" onClick={() => handleButtonClick("!")}>
          !
        </button>
        <button type="button" onClick={() => handleButtonClick("@")}>
          @
        </button>
        <button type="button" onClick={() => handleButtonClick("#")}>
          #
        </button>
        <button type="button" onClick={() => handleButtonClick("$")}>
          $
        </button>
        <button type="button" onClick={() => handleButtonClick("%")}>
          %
        </button>
        <button type="button" onClick={() => handleButtonClick("^")}>
          ^
        </button>
        <button type="button" onClick={() => handleButtonClick("&")}>
          &amp;
        </button>
        <button type="button" onClick={() => handleButtonClick("*")}>
          *
        </button>
        <button type="button" onClick={() => handleButtonClick("(")}>
          (
        </button>
        <button type="button" onClick={() => handleButtonClick(")")}>
          )
        </button>
        <button type="button" onClick={handleDisplayKeyboard}>
          ?ABC
        </button>
      </div>

      <div className="third-row">
        <button type="button" onClick={() => handleButtonClick("+")}>
          +
        </button>
        <button type="button" onClick={() => handleButtonClick("-")}>
          -
        </button>
        <button type="button" onClick={() => handleButtonClick("=")}>
          =
        </button>
        <button type="button" onClick={() => handleButtonClick("/")}>
          /
        </button>
        <button type="button" onClick={() => handleButtonClick("_")}>
          _
        </button>
        <button type="button" onClick={() => handleButtonClick("<")}>
          &lt;
        </button>
        <button type="button" onClick={() => handleButtonClick(">")}>
          &gt;
        </button>
        <button type="button" onClick={() => handleButtonClick("[")}>
          [
        </button>
        <button type="button" onClick={() => handleButtonClick("]")}>
          ]
        </button>
        <button type="button" onClick={() => handleButtonClick(":")}>
          :
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

export default Numpad;

import {useEffect} from "react";
import {FINALIZE_SELECTION, NEW_GAME, ROLL_DICE, TOGGLE_CHOICE} from "./gameReducer";

export const useKeyboardShortcuts = (dispatch) => {
  useEffect(() => {
    const handleKeypress = event => {
      switch(event.key) {
        case "r":
          dispatch({type: ROLL_DICE});
          break;
        case "n":
          dispatch({type: NEW_GAME});
          break;
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          dispatch({type: TOGGLE_CHOICE, payload: parseInt(event.key)});
          break;
        case "f":
          dispatch({type: FINALIZE_SELECTION});
          break;
        default:
          break;
      }
    };
    window.addEventListener("keypress", handleKeypress);
    return () => window.removeEventListener("keypress", handleKeypress);
  });
};
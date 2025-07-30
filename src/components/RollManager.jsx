import { useEffect } from "react";
import { useSelector, useDispacth } from "react-redux";
import {
    setRollDiceCount,
    clearRollTrigger
} from "../../src/redux/diceSlice.js";

export default function RollManger(){
    const dispatch = useDispatch();
    const { rollTrigger, gameStarted, dice } = useSelector((state) => state.dice);

    useEffect(() => {
        if (!rollTrigger) return;

        const diceToRoll = dice.filter((die, index) => {
            if (!gameStarted && (index == 0 || index === 5)) {
                return true;
            }
            if (gameStarted && !die.held) {
                return true;
            }
            return false;
        });

        dispatch(setRollDiceCount(diceToRoll.length));

        const timer = setTimeout(() => {
            dispatch(clearRollTrigger());
        }, 10);

        return () => clearTimeout(timer);
    }, [rollTrigger, gameStarted, dice, dispatch]);

    return null;
}
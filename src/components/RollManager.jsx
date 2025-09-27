// import { useDispatch, useSelector } from "react-redux";
// import { setDice } from "../redux/diceSlice.js"

// export default function RollManger({ onFinish}) {
//     const dispatch = useDispatch();
//     const dice = useSelector((state) => state.dice.dice);

//     const rollForTurn = () => {
//         let p1, p2;

//         do {
//             p1 = Math.floor(Math.random() * 6) + 1;
//             p2 = Math.floor(Math.random() * 6) + 1;

//             const updateDice = dice.map((die, idx) => {
//                 if (idx === 0) return{ ...die, value: p1, sideIndex: Math.floor(Math.random() * 4) };
//                 if (idx === dice.length - 1) return { ...die, value: p2, sideIndex: Math.floor(Math.random() * 4) };
//             return die; 
//             });
//             dispatch(setDice(updateDice));
//         } while (p1 === p2);

//         const startingPlayer = p1 > p2 ? 1 : 2;
//         onFinish(startingPlayer);
//     };
//        return null;
// }
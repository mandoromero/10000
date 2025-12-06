import { useDispatch, useSelector } from "react-redux";
import { setPlayerName } from "../../redux/diceSlice.js";
import "./PlayerNameInput.css";

export default function PlayerNameInput({ playerKey }) {
  const dispatch = useDispatch();
  const namesLocked = useSelector((state) => state.dice.namesLocked);

  // Get current player name from Redux
  const playerName = useSelector((state) =>
    playerKey === "player1" ? state.dice.player1Name : state.dice.player2Name
  );

  const handleChange = (e) => {
    if (!namesLocked) {
      dispatch(setPlayerName({ player: playerKey, name: e.target.value }));
    }
  };

  return (
    <div className="player-name-input">
      <input
        type="text"
        value={playerName}
        onChange={handleChange}
        placeholder={`Enter player name`}
        disabled={namesLocked}
      />
    </div>
  );
}

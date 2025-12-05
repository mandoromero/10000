import { useDispatch } from "react-redux";
import { setPlayerName } from "../../redux/diceSlice.js";
import "./PlayerNameInput.css";

export default function PlayerNameInput({ playerKey, currentName }) {
  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(setPlayerName({ player: playerKey, name: e.target.value }));
  };

  return (
    <div className="player-name-input">
      <input
        type="text"
        value={currentName}
        onChange={handleChange}
        placeholder={`Enter player name`}
      />
    </div>
  );
}

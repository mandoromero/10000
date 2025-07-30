import { useDispatch, useSelector } from "react-redux";
import { triggerRoll } from "../redux/diceSlice";

export default function Navbar({ setVisibleSection }) {
    const dispatch = useDispatch();
    const rollingDiceCount = useSelector((state) => state.dice.rollingDiceCount);
    const gameStarted = useSelector((state) => state.dice.gameStarted);

    const handleStart = () => {
        dispatch(triggerRoll());  
    }

    return (
        <nav 
            className="navbar navbar-expand-lg bg-body-tertiary bg-primary navbar-dark px-4"
            style={{ backgroundColor: "#edd4c2" }}  
        >
            <div className="container-fluid justify-content-between">
                <button 
                    className="btn btn-success"
                    onClick={handleStart}
                    disabled={rollingDiceCount > 0 || gameStarted}
                >
                    Start
                </button>
                
                <div className="dropdown ms-auto">
                    <button className="btn btn-secondary px-4 dropdown-toggle" type="button" id="navbarDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                        Menu
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                        <li><a className="dropdown-item" onClick={() => setVisibleSection("rules")}>How to play</a></li>
                        <li><a className="dropdown-item" onClick={() => setVisibleSection("score")}>How to score</a></li>
                    </ul>
                </div>
            </div>
        </nav>       
    )
}
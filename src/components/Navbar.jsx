import { useDispatch, useSelector } from 'react-redux';
import { startRoll } from '../redux/diceSlice.js';

export default function Navbar({onShowRules}) {
    const dispatch = useDispatch();
    const gameStarted = useSelector(state => state.dice.gameStarted);
    const startingPlayer = useSelector(state => state.dice.startingPlayer);

    const handleStart = () => {
        dispatch({ type: "dice/startRoll"});

        setTimeout(() => {
            dispatch(startRoll());
        }, 1000); // delay matches animation    
    };

    return (
        <nav 
            className="navbar navbar-expand-lg bg-body-tertiary navbar-dark px-4"
            style={{ backgroundColor: "#edd4c2" }}  
        >
            <div className="container-fluid justify-content-between">
                <button
                    onClick={handleStart} 
                    className="start"
                    disabled={gameStarted}
                >
                    Start
                </button>
                
                <div className="ms-auto">
                    <button className="how-to-play"
                    onClick={onShowRules}
                >
                        How to play
                    </button>
                    
                </div>
            </div>
        </nav>       
    )
}
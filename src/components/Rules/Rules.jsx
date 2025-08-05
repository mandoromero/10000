import "../Rules/Rules.css";

export default function Rules({ onBack }) {
    return (
        <div className="rules-container">
            <h2 className="rules-title">Rules</h2>
            <ul>
                <li className="rule">
                    The game is played with 2+ players and 6 dice.
                </li>
                
                <li className="rule">
                    Each player takes turns rolling one die. Who ever rolls highset, player on the left goes next.
                </li>
                
                <li className="rule">
                    On your turn, roll 6 dice. Check for scoring dice combinations: single 1s, single 5s, three or more-of-a-kind, pairs or straights.  These will earn you points. If you do not roll a scoring dice your turn is over.
                </li>
                
                <li className="rule">
                    Hold or Bank any scoring dice you want to save. Reroll the remaining dice to try and score more during your round.
                </li>
                
                <li className="rule">
                    You must hold at least one scoring die. If you do not roll a scoring die or scoring combanation, your turn is over and you loose an point you had in the bank.
                </li>
                
                <li className="rule">
                    You may end your turn when you choose to stop and add the points in the bank, to your total score.  
                </li>
                
                <li className="rule">
                    On your first round, you must accumalate 1000 points in order to keep add point to your score. After you can score as many or as little points as you'd like.
                </li>
                
                <li className="rule">
                    Once a player accumalates 10,000 or more points, the remaining players take their last turn to add  points to their score.  Player with the highest score wins.
                </li>
            
            </ul>
            
        </div>
    )
}
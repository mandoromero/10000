import "../Rules/Rules.css";

export default function Rules({ onBack }) {
    return (
        <div className="rules-container">
            <h2 className="rules-title">Rules</h2>
            <ul>
                <li>
                    On your turn, roll 6 dice. Check for single 1s, single 5s, three or more-of-a-kind, pairs or straights.  These will earn you points. If you do not roll a scoring dice your turn is over.
                </li>
                <li>
                    Hold or Bank any scoring dice you want to save. Reroll the remaining dice to try and score more during your round.
                </li>
                <li>
                    End your turn when you choose to stop and add the points to your total score.  If none of your dice can score on a roll, your turn ends and your score 0 for the round.
                </li>
                <li>
                    You must accumalate 1000 points on your first roll to start the game. After you can bank as many or as little points as you'd like.
                </li>
                <li>
                    Once a player accumalates 10,000 or more points, the remaining players take there last turn to try and beat the highest score.  Player with the highest score wins.
                </li>
            </ul>
            <div className="btn-container">
                <button className="back" onClick={onBack}>Back</button>
            </div>
        </div>
    )
}
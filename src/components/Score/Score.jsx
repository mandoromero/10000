import "../Score/Score.css";

export default function Score({ onBack }) {
    return (
        <div className="scoring-container">
            <h2 className="scoring-title">How to score</h2>
            <p>Singles</p>
                <ul>
                    <li>1s: 100 points</li>
                    <li>5s: 50 points</li>
                </ul>
            <p>Three_of-a-kind</p>
                <ul>
                    <li>Three 2s: 200 points0</li>
                    <li>Three 3s: 300 points</li>
                    <li>Three 4s: 400 points</li>
                    <li>Three 5s: 500 points</li>
                    <li>Three 6s: 600 points</li>
                    <li>Three 1s: 1000 points</li>
                </ul>
            <p>For each extra die with the same value as a Three-of-a-kind, you earn douple the amount of points</p>
            <p>Four-of-a-kind</p>
                <ul>
                    <li>Four 2s: 400 points</li>
                    <li>Four 3s: 600 points</li>
                    <li>Four 4s: 800 points</li>
                    <li>Four 5s: 1000 points</li>
                    <li>Four 6s: 1200 points</li>
                    <li>Four 1s: 2000 points</li>
                </ul>
            <p>Five-of-a-kind</p>
                <ul>
                    <li>Five 2s: 800 points</li>
                    <li>Five 3s: 1200 points</li>
                    <li>Five 4s: 1600 points</li>
                    <li>Five 5s: 2000 points</li>
                    <li>Five 6s: 2400 points</li>
                    <li>Five 1s: 4000 points</li>
                </ul>
            <p>Six-of-a-king</p>
                <ul>
                    <li>Six 2s: 1600</li>
                    <li>Six 3s: 2400</li>
                    <li>Six 4s: 3200</li>
                    <li>Six 5s: 4000</li>
                    <li>Six 6s: 4800</li>
                    <li>Six 1s: 10000</li>
                </ul>  
            <p>Straight</p>
                <ul>
                    <li>1, 2, 3, 4, 5, 6: 1500 points</li>
                </ul>
            <p>Three pairs</p>
                <ul>
                    <li>Three pair, exmaple a pair of 3s, a pair of 4s and a pair of 6s: 750p points</li>
                </ul>
        </div>
        
    )
}
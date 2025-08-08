import "./Header.css";

export default function Header() {
    return (
        <header className="header">
            <div className="dice-icon">
                <i class="fa-solid fa-dice"></i>
            </div>
            <div>
                <h1 className="title">10,000</h1>
                <p className="header-subtitle">A Dice Game</p>
            </div>
            <div className="dice-icon">
                <i class="fa-solid fa-dice"></i>
            </div>
        </header>
    )
}
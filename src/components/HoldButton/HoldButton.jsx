import "../HoldButton/HoldButton.css";

export default function HoldButton({ isHeld, onToggle }) {
    return (
        <button 
            className="hold-button" 
            onClick={onToggle}
            style={{ backgroundColor: isHeld ? "#954535" : "#ddd", color: isHeld ? "white" : "black", cursor: "pointer" }}    
        >
            {isHeld ? "Held" : "Hold"}
        </button>
    )
}
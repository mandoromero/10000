// src/components/Navbar.jsx
import StartButton from "./StartButton/StartButton.jsx";

export default function Navbar({ onShowRules }) {
  return (
    <nav
      className="
        navbar
        navbar-expand-lg
        bg-body-tertiary
        navbar-dark
        px-4
      "
      style={{
        backgroundColor: "#edd4c2",
      }}
    >
      <div className="container-fluid justify-content-between">
        <StartButton />
      </div>

      <div className="ms-auto">
        <button className="how-to-play" onClick={onShowRules}>
          How to play
        </button>
      </div>
    </nav>
  );
}

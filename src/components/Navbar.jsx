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
      <StartButton />
      <div className="container-fluid d-flex align-items-center justify-content-between ">
        <div className="ms-auto text-center">
          <h1 className="mb-0 me-2">10,000</h1>
          <h3 className="mb-0">A Dice Game</h3>
        </div>
        <div className="ms-auto">
          <button className="how-to-play" onClick={onShowRules}>
            How to play
          </button>
        </div>
      </div>
    </nav>
  );
}

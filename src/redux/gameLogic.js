export const canOpen = (playerOpen, turnTotal) =>
    playerOpen || turnTotal >= 1000;

export const getNextPlayer = (current) =>
    current === "player1" ? "player2" : "player1";

export const determinWinner = (p1, p2, player1Name, player2Name) => {
    if (p1 > p2) return player1Name;
    if (p2 > p1) return player2Name;
    return "It's a tie!";
}
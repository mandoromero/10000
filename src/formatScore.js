export default function formatScore(score) {
    if (score == null) return "00000"
    return score.toString().padStart(5, "0")
}
import { useState, useRef } from "react"
import "./App.css"
import queenImg from "./assets/queen.png"

const BOARD_SIZE = 8

function App() {
  const [highlighted, setHighlighted] = useState(
    Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false))
  )
  const boardRef = useRef(null)

  const highlightedCount = highlighted.flat().filter(Boolean).length

  const handleSquareClick = (row, col) => {
    if (!highlighted[row][col] && highlightedCount >= 8) {
      return
    }
    setHighlighted(prev =>
      prev.map((r, i) =>
        r.map((cell, j) => (i === row && j === col ? !cell : cell))
      )
    )
  }

  const clearHighlights = () => {
    setHighlighted(
      Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(false))
    )
  }

  // Share button handler
  const handleShare = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default
      const canvas = await html2canvas(boardRef.current)
      canvas.toBlob(async blob => {
        if (blob) {
          await navigator.clipboard.write([
            new window.ClipboardItem({ "image/png": blob }),
          ])
          alert("Chessboard image copied to clipboard!")
        }
      })
    } catch (err) {
      alert("Failed to copy image. Please try again.")
    }
  }

  return (
    <div className="container">
      <h2>Chess Board</h2>
      <div className="board" ref={boardRef}>
        {highlighted.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`square ${(i + j) % 2 === 0 ? "light" : "dark"}`}
              onClick={() => handleSquareClick(i, j)}
            >
              {cell && <img src={queenImg} alt="Queen" className="queen" />}
            </div>
          ))
        )}
      </div>
      <div className="controls">
        <button onClick={clearHighlights}>Clear</button>
        <button onClick={handleShare}>Share</button>
        <span>Highlighted Squares: {highlightedCount}</span>
      </div>
      <div className="instructions">
        Place 8 queens on the board such that no two queens attack each other.
      </div>
    </div>
  )
}

export default App

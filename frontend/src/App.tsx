import { useEffect, useState } from 'react'
import './App.css'
import { useCharacters, usePosition } from './artifactsmmo-client/client.ts'
import type { Position } from './types.ts'

function App() {
  const characters = useCharacters()
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)

  useEffect(() => {
    if (characters.length) setActiveCharacter(characters[0])
  }, [characters])

  const { pos, move } = usePosition(activeCharacter)
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

  return (
    <>
      <h1>
        {activeCharacter}@{pos.x},{pos.y}
      </h1>

      <div className="card">
        <input
          type="number"
          value={targetPos.x}
          onChange={(e) => setTargetPos({ y: targetPos.y, x: Number(e.target.value) })}
        />
        <input
          type="number"
          value={targetPos.y}
          onChange={(e) => setTargetPos({ x: targetPos.x, y: Number(e.target.value) })}
        />
        <button type="button" onClick={() => move(targetPos)}>
          Move
        </button>
      </div>
    </>
  )
}

export default App

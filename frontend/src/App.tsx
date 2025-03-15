import { useEffect, useState } from 'react'
import './App.css'
import { Temporal } from '@js-temporal/polyfill'
import { useCharacters, usePosition } from './artifactsmmo-client/client.ts'
import { useInterval } from './hooks/use-interval.ts'
import type { Position } from './types.ts'

function App() {
  const [cooldown, setCooldown] = useState(Temporal.Now.instant())
  const characters = useCharacters()
  const [activeCharacter, setActiveCharacter] = useState<string | null>(null)

  useEffect(() => {
    if (characters.length) setActiveCharacter(characters[0])
  }, [characters])

  const { pos, move } = usePosition(activeCharacter)
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 })

  const [timeUntilReady, setTimeUntilReady] = useState<Temporal.Duration | null>(null)

  const onTick = () => {
    const ready = Temporal.Instant.compare(Temporal.Now.instant(), cooldown) !== -1
    if (ready) setTimeUntilReady(null)
    if (!ready) setTimeUntilReady(Temporal.Now.instant().until(cooldown))
  }
  useInterval(onTick, 100)

  const handleMove = (pos: Position) => {
    move(pos).then((result) => {
      if (result) {
        setCooldown(Temporal.Instant.from(result.cooldown.expiration))
      }
    })
  }

  return (
    <>
      <h1>
        {activeCharacter}@{pos.x},{pos.y}
      </h1>
      <h2>
        {timeUntilReady?.toJSON()} <br />
        {!timeUntilReady && 'Ready'}
      </h2>
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
        <button type="button" onClick={() => handleMove(targetPos)}>
          Move
        </button>
      </div>
    </>
  )
}

export default App

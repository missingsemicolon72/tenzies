import React from "react";
import Die from "./components/Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti"

export default function App() {

  const randNum = () => {
    const newDice = []
    for(let i = 0; i < 10; i++)
      newDice.push({
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
      })
    return newDice
  }

  const [allNewDice, setAllNewDice] = React.useState(randNum())
  const [tenzies, setTenzies] = React.useState(false)
  const [rollCount, setRollCount] = React.useState(0)
  const [timeTaken, setTimeTaken] = React.useState({
    startTime: Date.now(),
    endTime: null
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeTaken(prevTime => ({
        ...prevTime,
        endTime: Date.now()
      }))
    }, 1000)
    if(tenzies)
      clearInterval(interval)
    
    return () => clearInterval(interval)
  }, [tenzies])

  React.useEffect(() => {
    const allHeld = allNewDice.every(die => die.isHeld)
    const firstValue = allNewDice[0].value
    const allSame = allNewDice.every(die => die.value === firstValue)
    if(allHeld && allSame)
      setTenzies(true)
  }, [allNewDice])
  
  function holdDie(dieId){
    setAllNewDice(prevDice => prevDice.map(die => ({
      ...die,
      isHeld: die.id === dieId ? !die.isHeld : die.isHeld
    })))
  }
  
  function rollDice(){
    if(tenzies){
      startNewGame()
      return;
    }
    setAllNewDice(oldDice => oldDice.map(die => (
      {
        ...die,
        id: die.isHeld ? die.id : nanoid(),
        value: die.isHeld ? die.value : Math.ceil(Math.random() * 6)
      }
      // Another way to do it
      // isHeld ? {...die} : {...die, id: nanoid(), value: Math.ceil(Math.random() * 6)}
    )))
    setRollCount(oldCount => oldCount + 1)
  }
  
  function startNewGame(){
    setAllNewDice(randNum())
    setRollCount(0)
    setTimeTaken({
      startTime: Date.now(),
      endTime: null
    })
    setTenzies(false)
  }

  return (
    <main>
      {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
      <div className="canvas">
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <hr />
        <div className="dice-container">
          {
            allNewDice.map(dice => {
              return(
                <Die
                  key={dice.id}
                  value={dice.value}
                  isHeld={dice.isHeld}
                  holdDie={() => holdDie(dice.id)}
                />
              )
            })
          }
        </div>
        <div className="flex">
          <div>
            <h3 className="detail-heading">Roll Count</h3>
            <h3 className="detail-body">{rollCount}</h3>
          </div>
          <div className="btn-roll">
            <button type="button" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
          </div>
          <div>
            <h3 className="detail-heading">Time Taken</h3>
            <h3 className="detail-body">{Math.floor((timeTaken.endTime - timeTaken.startTime) / 1000)}</h3>
          </div>
        </div>
      </div>
    </main>
  )
}
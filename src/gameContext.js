import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from "./utils";

const GameContext = React.createContext()

export const useGame = () => {
    return useContext(GameContext)
}

export const GameProvider = ({children}) => {

    const [game,setGame] = useState()
    const [player,setPlayer] = useState()



    const launchGame = (playerName) => {
        const idGame = uuidv4()
        const newPlayer = {id: 1,name : playerName, points: 0,type:'human'}

        let newGameObject = {}
        newGameObject.idGame = idGame
        newGameObject.players = [newPlayer]
        newGameObject.grid = [0,0,0,0,0,0,0,0,0]
        newGameObject.currentPlayerId = 1
        newGameObject.isFinish = false
        newGameObject.isWin = false

        setGame(newGameObject)
        setPlayer(newPlayer)
        return idGame
    }

    const restartGame = () => {
        let newGameObject = game
        newGameObject.grid = [0,0,0,0,0,0,0,0,0]
        newGameObject.currentPlayerId = 1
        newGameObject.isFinish = false
        newGameObject.isWin = false
        setGame({...newGameObject})

    }


    const addPlayer = (playerName,type) => {
        let newGameObject = game
        const newPlayer = {id: 2,name : playerName, points: 0,type:type}
        newGameObject.players.push(newPlayer)
        setGame({...newGameObject})
    }


    const selectSquare = (idSquare) => {
        const currentState = game.grid[idSquare]
        if(currentState === 0){
            let newGameObject = game
            newGameObject.grid[idSquare] = game.currentPlayerId
            newGameObject.currentPlayerId = newGameObject.currentPlayerId === 1 ? 2 : 1
            setGame({...newGameObject})
        }
    }

    const checkGame = (grid) => {
        const allIsChecked = grid?.filter(item => item === 0).length === 0 ? true : false
        const isWin = getWinner(grid) ? true : false
        if(!game?.isWin || !game?.isFinish){
            let newGameObject = game
            if(isWin){
                newGameObject.isWin = true
                newGameObject.isFinish = true
                newGameObject.winnerPlayerId = getWinner(grid)
                
                const playerIndex = game.players.findIndex(player => player.id === newGameObject.winnerPlayerId)
                newGameObject.players[playerIndex].points = newGameObject.players[playerIndex].points + 1

            }
            if(allIsChecked  && !game?.isFinish){
                newGameObject.isFinish = true
                setGame({...newGameObject})
            }
            if(isWin || allIsChecked && !game?.isFinish){
                setGame({...newGameObject})
            }
        }
    }

    const getWinner = (grid) => {
        if(grid){
            if(grid[0] === grid[1] && grid[1] === grid[2] && grid[0] !== 0 ) return grid[0]
            if(grid[3] === grid[4] && grid[4] === grid[5] && grid[3] !== 0 ) return grid[3]
            if(grid[6] === grid[7] && grid[7] === grid[8] && grid[6] !== 0 ) return grid[6]
            if(grid[0] === grid[3] && grid[3] === grid[6] && grid[0] !== 0 ) return grid[0]
            if(grid[1] === grid[4] && grid[4] === grid[7] && grid[1] !== 0 ) return grid[1]
            if(grid[2] === grid[5] &&  grid[5] === grid[8] && grid[2] !== 0 ) return grid[2]
            if(grid[0] === grid[4] && grid[4] === grid[8] && grid[0] !== 0 ) return grid[0]
            if(grid[2] === grid[4] && grid[4] === grid[6] && grid[2] !== 0 ) return grid[2]
            return false
        }
    }

    const IAPlay = () => {
        // Dumby AI ...
        if(game){
            const isIATurn = game?.players?.find(player => player.id === game.currentPlayerId).type === 'IA' ? true : false
            console.log('isIATurn',isIATurn)
            if(isIATurn && game.grid.filter(item => item === 0).length > 0){
                // Choose a random place
                let square
                let n
                while(square !== 0){
                    n = getRandomInt(9)
                    square = game?.grid[n]
                }
                console.log(n)
                selectSquare(n)
            }
        }
    }

    useEffect(()=>{
        console.log('udpate game object',game)
        checkGame(game?.grid)
        IAPlay(game)
    },[game])


    


    return (
        <GameContext.Provider value={{launchGame,game,selectSquare,addPlayer,restartGame}}>
            {children}
        </GameContext.Provider>
    )
}
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { getRandomInt } from "./utils";
import { Peer } from "peerjs";

const GameContext = React.createContext()

export const useGame = () => {
    return useContext(GameContext)
}

export const GameProvider = ({children}) => {

    const [game,setGame] = useState()
    const [currentPeer,setCurrentPeer] = useState()
    const [currentIdPeer,setCurrentIdPeer] = useState()
    const [hostIdPeer,setHostIdPeer] = useState()
    const [playerToAdd,setPlayerToAdd] = useState()

    const [profile,setProfile] = useState()



    const launchGame = (playerName) => {
        const idGame = uuidv4()
        const newPlayer = {id: 1,name : playerName, points: 0,type:'human'}

        // Game Object
        let newGameObject = {}
        newGameObject.idGame = idGame
        newGameObject.players = [newPlayer]
        newGameObject.grid = [0,0,0,0,0,0,0,0,0]
        newGameObject.currentPlayerId = 1
        newGameObject.isFinish = false
        newGameObject.isWin = false
        setGame({...newGameObject})
        setProfile('host')
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


    const addPlayer = (playerName,type,idPeer) => {
        const newPlayer = {id: 2,name : playerName, points: 0,type:type,idPeer:idPeer}
        setPlayerToAdd(newPlayer)
    }

    useEffect(()=>{
        console.log('new player to add',playerToAdd)
        if(playerToAdd){
            let newGameObject = game
            newGameObject.players.push(playerToAdd)
            setGame({...newGameObject})
            setPlayerToAdd(null)
        }
    },[playerToAdd])


    const selectSquare = (idSquare) => {
        const currentState = game.grid[idSquare]
        if(currentState === 0){
            let newGameObject = game
            newGameObject.grid[idSquare] = game.currentPlayerId
            newGameObject.currentPlayerId = newGameObject.currentPlayerId === 1 ? 2 : 1
            setGame({...newGameObject})
        }
        if(profile === 'client'){
            selectSquare_client(idSquare)
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
            if(isIATurn && game.grid.filter(item => item === 0).length > 0){
                // Choose a random place
                let square
                let n
                while(square !== 0){
                    n = getRandomInt(9)
                    square = game?.grid[n]
                }
                selectSquare(n)
            }
        }
    }

    useEffect(()=>{
        checkGame(game?.grid)
        IAPlay(game)
    },[game])


    useEffect(()=>{

            let id = uuidv4()
            const peer = new Peer(id)
            setCurrentPeer(peer)
            setCurrentIdPeer(id)
            peer.on("connection", (conn) => {
                conn.on("data", (data) => {
                    handlePeerData(data)
                });
                conn.on("open", () => {
                    console.log('Connexion ouverte')
                    conn.send("hello!");
                });
            });
    },[])



    const joinGame_client = (playerName,idPeer) => {
        console.log(currentIdPeer)
        setHostIdPeer(idPeer)
        if(currentPeer){
            const peer = currentPeer
            const conn = peer.connect(idPeer);
            const objectConnexion = {playerName:playerName,idPeer:currentIdPeer,type:'join-game'}
            conn.on("open", () => {
                conn.send(objectConnexion);
            });
            setProfile('client')
        }else{
            console.log('pas de peer de lancé')
        }
    }


    const handlePeerData = (data) => {
        console.log('handlePeerData',data)

        // Register player in host
        if(data.type === 'join-game'){
            console.log('game in handlepeerdata',game)
            addPlayer(data.playerName,'human',data.idPeer)
        }
        if(data.type === 'select-square'){
            setGame(data.game)
        }


        // Receive game info in client
        if(data.type === 'synchro-game'){
            synchroGameClient_client(data)
        }
        
    }

    const synchroPeer = () => {
        console.log('synchroPeer')
        // Envoi du jeu au client
        synchroGameClient_host()
    }

    const synchroGameClient_host = () => {
        const peer = currentPeer
        game.players.forEach((player)=>{
            if(player.idPeer){
                const conn = peer.connect(player.idPeer);
                const objectSynchro = {game:game,type:'synchro-game'}
                conn.on("open", () => {
                    conn.send(objectSynchro);
                });
            }
        })
       
    }

    const synchroGameClient_client = (data) => {
        setGame({...data.game})
    }

    useEffect(()=>{
        if(profile === 'host'){
            synchroGameClient_host()
        }
    },[game])


    const selectSquare_client = (idSquare) => {

        if(currentPeer){
            const peer = currentPeer
            const conn = peer.connect(hostIdPeer);
            const object = {game:game,type:'select-square'}
            conn.on("open", () => {
                conn.send(object);
            });
        }else{
            console.log('pas de peer de lancé')
        }
    }

    const canPlay = () => {
        if(!game) return false
        if(game.isWin || game.isFinish) return false
        const currentPlayer = game.players.find(player => player.id === game.currentPlayerId)
        if(currentPlayer.type === 'IA') return false
        if(currentPlayer.type === 'human' && currentPlayer.idPeer === currentIdPeer) return true
    }
 
    


    return (
        <GameContext.Provider value={{profile,launchGame,game,selectSquare,addPlayer,restartGame,currentIdPeer,joinGame_client,synchroPeer,canPlay}}>
            {children}
        </GameContext.Provider>
    )
}
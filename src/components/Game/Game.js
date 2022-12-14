import React, {useState, useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import Container from '../Container/Container';
import { useGame } from '../../gameContext';
import { Typography,Box, Button, TextField } from '@mui/material';
import TicTacToe from '../TicTacToe/TicTacToe';
import { useParams } from 'react-router-dom';
import { copyTextToClipboard } from '../../utils';



const Game = () => {
  
    const {game,addPlayer,restartGame,currentIdPeer} = useGame()
    const [addingPlayer,setAddingPlayer] = useState(false)
    const newPlayer = useRef()

    const handleAddNewPlayer = () => {
      const newPlayerName = newPlayer.current.value
      addPlayer(newPlayerName,'human')
      setAddingPlayer(false)
    }

    const handleRestartGame =  () => {
      restartGame()
    }

    const handleAddComputer = () => {
      addPlayer('Computer','IA')
    }

    const handleGetLink = () => {
        console.log(window.location.origin+'/'+currentIdPeer)
        copyTextToClipboard(window.location.origin+'/'+currentIdPeer)
    }
  

  return(
    <Container>
      <Typography variant="h5">Players : </Typography>
      {game?.players && game?.players?.map((player)=>(
       <Typography>Player {player.id} : {player.name} , {player.points} points</Typography> 
      )
      )} 
      <Box sx={{marginY:2}}>
        {game?.isFinish &&
        <Box>
          <Button onClick={handleRestartGame} variant="contained">Restart game</Button>
        </Box>}

        {!addingPlayer && game?.players?.length < 2 &&
        <Box sx={{display:'flex',gap:2}}>
          <Button variant="contained" onClick={()=>{setAddingPlayer(true)}}>Add local player</Button>
          <Button variant="contained" onClick={()=>{handleGetLink()}}>Invite online player</Button>
          <Button variant="contained" onClick={()=>{handleAddComputer()}}>Add computer player</Button>
        </Box>
        }
        {addingPlayer &&
        <Box sx={{marginTop:1}}>
          
          <TextField fullWidth label={'Name'} inputRef={newPlayer}/>
          <Button sx={{marginTop:1}}variant="contained" onClick={handleAddNewPlayer}>Add player</Button>
        </Box>}
      </Box>
      {game?.players?.length === 2 &&
      <Box>
      
      {!game?.isFinish &&
        <Typography> {game?.players?.find((player)=> player.id === game.currentPlayerId)?.name } is your turn</Typography>
      }
      {game?.isWin && 
      <Typography>{game?.players?.find((player)=> player.id === game.winnerPlayerId)?.name} win the game !</Typography>}
      <Typography>{game?.isFinish && `Game is finish`}</Typography>

     
      <TicTacToe /> 
      </Box>}
      
    </Container>
  )


};



export default Game;

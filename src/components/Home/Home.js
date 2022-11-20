import React, {useRef, useState} from 'react';
import Container from '../Container/Container';
import { Box } from '@mui/system';
import { TextField, Button} from '@mui/material';
import { useGame } from '../../gameContext';
import { useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';


const Home = () => {

  const playerName = useRef()
  const peerIdToJoin = useRef()
  const {launchGame,joinGame_client} = useGame()
  const [loadingJoin,setLoadingJoin] = useState()
  const navigate = useNavigate()
  const {idGame} = useParams()

  const handleLaunchGame = () => {
    const idGame = launchGame(playerName.current.value)
    navigate(`/game`)
  }

  const handleJoinGame = () => {
    //setLoadingJoin(true)
    joinGame_client(playerName.current.value,peerIdToJoin.current.value)
    navigate(`/game`)

  }

  
  return( 
  <Container>
    <Box sx={{marginBottom:2}}>
      <TextField variant="outlined" label="Your name" fullWidth inputRef={playerName} />
    </Box>
    <Box>
      <TextField variant="outlined" label="ID party to join" fullWidth defaultValue={idGame} inputRef={peerIdToJoin}/>
    </Box>
    <Box sx={{marginTop:2,textAlign:'center',display:'flex',gap:2,justifyContent:'center'}}>
      <Button variant="contained" onClick={handleLaunchGame}>Host game</Button>
      <LoadingButton loading={loadingJoin} variant="contained" onClick={handleJoinGame}>Join game</LoadingButton>
    </Box>

  </Container>
)};


export default Home;

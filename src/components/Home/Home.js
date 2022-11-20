import React, {useRef} from 'react';
import Container from '../Container/Container';
import { Box } from '@mui/system';
import { TextField, Button} from '@mui/material';
import { useGame } from '../../gameContext';
import { useNavigate } from 'react-router-dom';


const Home = () => {

  const playerName = useRef()
  const {launchGame} = useGame()
  const navigate = useNavigate()

  const handleLaunchGame = () => {
    const idGame = launchGame(playerName.current.value)
    navigate(`game/${idGame}`)
  }

  
  return( 
  <Container>
    <Box>
      <TextField variant="outlined" label="Your name" fullWidth inputRef={playerName} />
    </Box>
    <Box sx={{marginTop:2,textAlign:'center'}}>
      <Button variant="contained" onClick={handleLaunchGame}>Launch game</Button>
    </Box>
  </Container>
)};


export default Home;

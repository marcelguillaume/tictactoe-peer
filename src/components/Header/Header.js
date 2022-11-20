import { Typography, Box } from '@mui/material';
import React from 'react';
import { useGame } from '../../gameContext';



const Header = () => {
  const {game,currentIdPeer,profile} = useGame()
  return(
  <Box sx={{textAlign:"center"}}>
    <Typography variant="h1">Tic Tac Toe</Typography>
    <Typography variant="body1">A peer multiplayer game !</Typography>
    {currentIdPeer && <Typography>Id de peer : {currentIdPeer} </Typography>}
    {profile && <Typography>Type : {profile} </Typography>}
  </Box>
)};


export default Header;

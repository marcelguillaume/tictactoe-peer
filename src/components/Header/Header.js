import { Typography, Box } from '@mui/material';
import React from 'react';



const Header = () => (
  <Box sx={{textAlign:"center"}}>
    <Typography variant="h1">Tic Tac Toe</Typography>
    <Typography variant="body1">A peer multiplayer game !</Typography>
  </Box>
);


export default Header;

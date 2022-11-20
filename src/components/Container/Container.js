import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import Header from '../Header/Header';


const Container = (props) => (
  <Box sx={{maxWidth:'600px',width:'90vw',margin:'auto'}}>
    <Box sx={{marginBottom:3,marginTop:2}}>
      <Header />
    </Box>
    <Box>
      {props.children}
    </Box>
  </Box>
);


export default Container;

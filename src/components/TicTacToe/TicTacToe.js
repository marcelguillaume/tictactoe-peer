import { Box, Grid} from '@mui/material';
import React from 'react';
import { useGame } from '../../gameContext';
import CloseIcon from '@mui/icons-material/Close';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';



const TicTacToe = () => {

  const {game,selectSquare} = useGame()

  const handleClickSquare = (key) => {
    selectSquare(key)
  }

  return (
    <Box sx={{marginY:3}}>
      <Grid container spacing="2">
      {game?.grid?.map((square,key)=>(<Square onClick={handleClickSquare} key={key} id={key} square={square} />))}
      </Grid>
    </Box>
  )
};

const Square = (props) => {
  return (<>
    <Grid onClick={()=>{props.onClick(props.id)}} item md={4} sx={{cursor:'pointer',border:'1px solid black',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <Box sx={{display:'flex',justifyContent:'center',alignItems:'center',height:'150px',width:'150px'}}>
        {props.square === 1 && <CloseIcon />}
        {props.square === 2 && <PanoramaFishEyeIcon />}
      </Box>
    </Grid>
  </>)
}


export default TicTacToe;

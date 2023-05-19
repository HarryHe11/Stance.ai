import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';
// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import "../styles/Output.css";

const useStyles = makeStyles({
    root: {
      maxWidth: 550,
    },
    table: {
        minWidth: 450,
    },
});



function Output(props) {
    
    const handleBackClick = () => {
        props.clearResult({});
    }

    const classes = useStyles();


    return (
        <div className="output_container">
        <Card className={`${classes.root} output_container__card`}>

                <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    <h2 className='resultTitle'>Predicted Stance: {props.predictedStance}</h2>
                </Typography>

                {/*<br/>*/}

                {/*<TableContainer component={Paper}>*/}
                {/*    <Table className={classes.table} aria-label="simple table">*/}
                {/*        <TableHead>*/}
                {/*        /!* <TableRow>*/}
                {/*            <TableCell component="th" align="center"><h2>Confidence of each stance category</h2></TableCell>*/}
                {/*        </TableRow> *!/*/}
                {/*        <TableRow>*/}
                {/*            <TableCell component="th" align="center"><b>Favor</b></TableCell>*/}
                {/*            <TableCell component="th" align="center"><b>Against</b></TableCell>*/}
                {/*            <TableCell component="th" align="center"><b>Neither</b></TableCell>*/}
                {/*        </TableRow>*/}
                {/*        </TableHead>*/}
                {/*        <TableBody>*/}
                {/*            <TableRow>*/}
                {/*                <TableCell align="center"> {(props.predictedProbs[0]* 100).toFixed(2)}% </TableCell>*/}
                {/*                <TableCell align="center"> {(props.predictedProbs[1]* 100).toFixed(2)}% </TableCell>*/}
                {/*                <TableCell align="center"> {(props.predictedProbs[2]* 100).toFixed(2)}% </TableCell>*/}
                {/*            </TableRow>*/}
                {/*        </TableBody>*/}
                {/*    </Table>*/}
                {/*</TableContainer>*/}

                </CardContent>

            <CardActions>
                <Button onClick={()=>handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                Back to Prediction
                </Button>
            </CardActions>
        </Card>
    </div>
    );

}

export default Output;



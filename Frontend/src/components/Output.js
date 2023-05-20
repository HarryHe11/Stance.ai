import { Button } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import "../styles/Output.css";
import BarChart from "./ResultChart";

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
                        <h2 className='resultTitle'>Predicted Stance: {props.label}</h2>
                        <h2 className='resultTitle'>Confidence: {props.max_prob}</h2>
                    </Typography>

                </CardContent>

                <BarChart data={props.probs} />

                <CardActions>
                    <Button onClick={() => handleBackClick()} className="back__button" variant="contained" size="small" color="primary">
                        Back to Prediction
                    </Button>
                </CardActions>
            </Card>
        </div>
    );

}

export default Output;



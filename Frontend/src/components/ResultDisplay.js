import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ResultChart from "./ResultChart";
import Copyright from "./Copyright";


const theme = createTheme();

export default function ResultDisplay(props) {
  const handleBackClick = () => {
    props.clearResult({});
  }
  console.log(props);
  const displayedData = [{name:'predicted probability',favor:props.probs["Favor"], against:props.probs['Against'], neither:props.probs["Neither"]}];
  console.log(displayedData);
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="sm" >
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            border: 3,
            borderRadius: 2,
            padding: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderColor: 'grey.500',
            bgcolor: "white",
          }}
        >
          <Typography component="h1" variant="h3">
            <h3>Result</h3>
          </Typography>

          <Typography gutterBottom component="h3" variant="h4">
            <h5>Predicted Stance: {props.label}</h5>
            <h5>Confidence: {props.max_prob.toFixed(2)}</h5>
          </Typography>

          <ResultChart data={displayedData} />
          <Button onClick={handleBackClick}
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Detect Again
          </Button>
          <Copyright />
        </Box>

        </Container>

      </ThemeProvider >
    );

}

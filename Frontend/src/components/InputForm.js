import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import TextField from '@mui/material/TextField';

import { createTheme, ThemeProvider } from "@mui/material/styles";
import api from "../api/stanceAPI";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import ModelTrainingOutlinedIcon from '@mui/icons-material/ModelTrainingOutlined';
import Button from "@mui/material/Button";
import { useState } from "react";
import Loading from "./Loading";
import ResultDisplay from "./ResultDisplay";
import Copyright from "./Copyright";
import localStorage from 'localStorage';

const theme = createTheme();

export default function InputForm() {
  const [predictionResult, setPredictionResult] = useState({})
  const [loadingStatus, setLoadingStatus] = useState(false)

  const handleSubmit = async (event) => {
    setLoadingStatus(true) //上传
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = new FormData()
    const user_email = localStorage.getItem('usr_email')
    request.append('user_email', user_email)
    for (var [key, value] of data.entries()) {
      request.append(key, value);
    }
    const response = await api.post(
      "/predict",
      request
    )
    const responseData = JSON.parse(response.data);
    setPredictionResult(responseData)
    setLoadingStatus(false)
  };

  if (predictionResult.label) {
    let parsed_probs =  JSON.parse(predictionResult.probs);
    console.log(parsed_probs)
    console.log("Output.....")
    return <ResultDisplay
        label={predictionResult.label}
        max_prob={predictionResult.max_prob}
        probs={parsed_probs}
        clearResult={setPredictionResult} />;
  }

  else if (loadingStatus) {
    console.log("loading")
    return <Loading />
  }

  else return (
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
          <Avatar sx={{ m: 1, bgcolor: 'tomato' }}>
            <ModelTrainingOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Stance Detection
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="target"
                  name="target"
                  required
                  fullWidth
                  id="target"
                  label="Target"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  autoComplete="text"
                  name="text"
                  required
                  fullWidth
                  id="text"
                  label="Text"
                />
              </Grid>
              <Grid item xs={12} sm={12}>
                <FormControl>
                  <FormLabel id="model">Model</FormLabel>
                  <RadioGroup
                    aria-labelledby="model"
                    name="model"
                  >
                    <FormControlLabel value="english" control={<Radio />} label="English" />
                    <FormControlLabel value="chinese" control={<Radio />} label="Chinese" />
                  </RadioGroup>
                </FormControl>
              </Grid>

            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Predict
            </Button>
          </Box>
          <Copyright />
        </Box>

      </Container>
    </ThemeProvider>
  );
}

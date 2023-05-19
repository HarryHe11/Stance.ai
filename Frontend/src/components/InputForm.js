import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import TextField from '@mui/material/TextField';

import {createTheme, ThemeProvider} from "@mui/material/styles";
import api from "../api/stanceAPI";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Button from "@mui/material/Button";
import {useState} from "react";
import Output from "./Output";
import Loading from "./Loading";

const theme = createTheme();

export default function InputForm() {
    const [predictionResult, setPredictionResult] = useState({})
    const [loadingStatus, setLoadingStatus] = useState(false)

    const handleSubmit = async (event) => {
        setLoadingStatus(true) //上传
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const request = new FormData()
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

    if(predictionResult.label) {
        console.log("Output.....")
        return <Output predictedStance={predictionResult.label} clearResult={setPredictionResult}/>;
    }

    else if(loadingStatus) {
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
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
                  autoComplete="target"
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
                  autoComplete="text"
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
                {/*<FormControlLabel value="chatgpt" control={<Radio />} label="ChatGPT" />*/}
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
        </Box>
      </Container>
    </ThemeProvider>
    );
}

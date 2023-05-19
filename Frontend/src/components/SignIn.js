import * as React from 'react';
import { useHistory } from 'react-router';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from "../api/stanceAPI";

const theme = createTheme();
export default function SignIn() {
    const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = new FormData();
    request.append('email', data.get('email'));
    request.append('password', data.get('password'));
    const response = await api.post("/signin", request);
    //console.log(response)
    if (response.status === 200) {
        // 登录成功
        alert('Sign in successfully!');
        predictRedirect();
    } else if (response.status === 201) {
        // 登录失败
        alert('Invalid username or password!');
    }
    else  {
      alert('An error occurred!')
    }
  };
    let history = useHistory();
    const signUpRedirect = () => {
        history.push("/signup")
    }
    const predictRedirect = () => {
        history.push("/predict")
    }
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
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="#" variant="body2" onClick={signUpRedirect}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    );
}

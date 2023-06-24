import * as React from 'react';
import { useHistory } from 'react-router'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import api from "../api/stanceAPI"
import Copyright from "./Copyright";


const theme = createTheme();

export default function SignUp() {
  let history = useHistory()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const request = new FormData();
    request.append('userName', data.get('firstName') + data.get('lastName'));
    request.append('email', data.get('email'));
    request.append('password', data.get('password'));
    try {
      const response = await api.post("/signup", request);
      if (response.status === 200) {
        // 注册成功
        alert('Sign up successfully! Please sign in!');
        signInRedirect();
      } else if (response.status === 201) {
        // 注册失败
        alert('Username already exists!');
      }
      else {
        alert("An error occurred!");
      }
    } catch (error) {
      // 处理错误
      alert('An error occurred:', error);
    }
  };
  const signInRedirect = () => {
    history.push("/signin")
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
            Sign up
          </Typography>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
            </Grid>
             <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" variant="body2" onClick={signInRedirect}>
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>

          </Box>
          <Copyright />
        </Box>

      </Container>
    </ThemeProvider>
  );
}

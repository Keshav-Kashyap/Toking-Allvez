import React, { useContext, useState } from 'react';
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AuthContext } from '../context/AuthContext';
import { Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const theme = createTheme();

export default function Authentication() {

const navigate = useNavigate();

    const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [name, setName] = useState("");
const [error, setError] = useState("");
const [message, setMessage] = useState("");
const [formState, setFormState] = useState(0);
const [open, setOpen] = useState(false);


const{handleRegister, handleLogin} = useContext(AuthContext);


const handleAuth = async (e) => {
  e.preventDefault(); // Prevent form submission
  
  try {
    if (formState === 0) {
      const result = await handleLogin(username, password);
      setMessage(result);
      setError(""); // Clear any previous errors
      setOpen(true);
      navigate("/home");
    }

    if (formState === 1) {
      const result = await handleRegister(name, username, password);
      setMessage(result);
      setUsername("");
      setError(""); // Clear any previous errors
      setOpen(true);
      setFormState(0);
    }
  } catch (err) {
    // console.log("Full error object:", err); // Debug log
    
    // Now the error object has a structured message property
    const errorMessage = err?.message || "Something went wrong";
    
    // console.log("Error message:", errorMessage);
    setError(errorMessage);
    setMessage(""); // Clear success message
    setOpen(true);
  }
};

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Grid 
        container 
        component="main" 
        sx={{ 
          height: '100vh', 
          width: '100vw', 
          margin: 0, 
          padding: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Left Image Side */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh'
          }}
        />
        
        {/* Right Form Side */}
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          
         
          square
          sx={{ 
            height: '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}
        >
          <Box
            sx={{
              mx: 4,
              width: '100%',
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            
            <div>
                <Button variant={formState ===0 ? "contained":""} onClick={()=>{setFormState(0)}}  >
                    Sign In
                </Button>
                 <Button  variant={formState ===1 ? "contained":""} onClick={()=>{setFormState(1)}} >
                    Sign Up
                </Button>
            </div>

           
            <Box component="form" noValidate sx={{ mt: 1, width: '100%' }} onSubmit={handleAuth}>

            {formState ===1 ?    <TextField 
                margin="normal" 
                required 
                fullWidth 
                id="FullName" 
                label="Full Name" 
                name="FullName" 
                autoComplete="FullName" 
                autoFocus 
                value={name}
                onChange={(e)=>setName(e.target.value)}
              />:<></> }
              

              <TextField 
                margin="normal" 
                required 
                fullWidth 
                id="Username" 
                label="Username" 
                name="username" 
                autoComplete="username" 
                autoFocus 
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
              />
              <TextField 
                margin="normal" 
                required 
                fullWidth 
                name="password" 
                label="Password" 
                type="password" 
                id="password" 
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            
              />

              <p style ={{color:"red"}}>{error}</p>


              <Button 
                onClick={handleAuth}
                type="submit" 
                fullWidth 
                variant="contained" 
                sx={{ mt: 3, mb: 2 }}
              >
                {formState === 0 ?  "Login" : "Register"}
               
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      <Snackbar
        open={open}
        autoHideDuration={4000}
        message={error || message}
        onClose={() => setOpen(false)}
      />
    </ThemeProvider>
  );
}
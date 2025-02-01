import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
}));

export default function SignUp(props) {
    
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [emailError, setEmailError] = useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = useState('')

  let navigate = useNavigate()


  const validateInputs = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      setPasswordError(true);
      setPasswordErrorMessage('Passwords do not match.');
      return;
    }
    if (!password|| password < 6){
        setPasswordError(true);
        setPasswordErrorMessage('Password must contain at least 6 characters.');
        return
    }
    setPasswordError(false);
    setPasswordErrorMessage('');

    let payload = {
      username: formData.get('username'),
      email: formData.get('email'),
      password,
    };

    try{
        let response = await fetch(`https://blog-backend-production-6422.up.railway.app/users`)
        if(!response.ok){
            let message = await response.json()
            throw new Error(message.error)
        }
        let emails = await response.json()
        console.log(emails)
        for(let i = 0 ; i < emails.length; i++){
            if(emails[i] == payload.email){
                setEmailError(true)
                setEmailErrorMessage('Email already in use, sign in below')
                return
            }
        }
   
    }catch(err){
        console.log(err)
    }


    //now send user details to server to upload

    try{
        let response = await fetch('https://blog-backend-production-6422.up.railway.app/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if(!response.ok){
            let message = await response.json()
            throw new Error(message.error)
        }
        navigate('/sign-in')

    }catch(err){
        console.log(err)
    }
  };

  return (
    <div {...props}>
      <CssBaseline enableColorScheme />

      <Box sx={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
        <Card variant="outlined">
          <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
            Sign up
          </Typography>
          <Box component="form" onSubmit={validateInputs} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField required fullWidth id="username" name="username" placeholder="Enter your username" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField required fullWidth id="email" name="email" placeholder="your@email.com" type="email" error={emailError}
                helperText={emailErrorMessage} />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField required fullWidth name="password" id="password" type="password" placeholder="••••••" />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="••••••"
                error={passwordError}
                helperText={passwordErrorMessage}
              />
            </FormControl>
            <Button type="submit" fullWidth variant="contained">
              Sign up
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center', mt: 2 }}>
            Already have an account? <Link to="/sign-in">Sign in</Link>
          </Typography>
        </Card>
      </Box>
    </div>
  );
}

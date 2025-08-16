import {Box, Button, Link, Typography} from '@mui/material';
import styled from '@mui/system/styled';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth.jsx';
import CircleWrapper from "../../component/CircleWrapper.jsx";
import Title from "../../component/Title.jsx";
import Subtitle from "../../component/Subtitle.jsx";
import CustomTextField from "../../component/CustomTextField.jsx";
import '@fontsource/outfit/400.css';

const Wrapper = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '600px',
    border: '0.5px solid rgba(0,0,0,0.3)',
    borderRadius: 10,
    padding: 30,
    backgroundColor: 'secondary.main'
})
const CustomLabel = styled(Typography)({
    textAlign: 'left',
    fontFamily: 'Outfit',
    fontSize: '18px',
    fontWeight: 400,
})
const StyledButton = styled(Button)({
    boxShadow: 'none',
    backgroundColor: '#1F8FFF',
    height: '45px',
    borderRadius: 10,
    marginTop: '15px',
    fontFamily: 'Outfit'
})
const HelperText = styled(Typography)({
    fontFamily: 'Outfit',
    fontWeight: 300,
    fontSize: '20px',
    marginTop: '50px'
})
const ErrorText = styled(Typography)({
    fontFamily: 'Outfit',
    fontWeight: 300,
    fontSize: '18px',
    textAlign: 'center',
    minHeight: '30px',
})

export default function SignIn() {
    const { login, error } = useAuth()
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })
  
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value,
        })
    }

    const handleLogin = (e) => {
        e.preventDefault()
        login(formData)
    }

    return (
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
            <Wrapper>
                <CircleWrapper size={75}>
                    <ShieldRoundedIcon sx={{fontSize: '45px'}}/>
                </CircleWrapper>
                <Title my={2}>
                    Welcome back!
                </Title>
                <Subtitle mb={3}>
                    Sign in to access your account.
                </Subtitle>
                <Box component='form' sx={{width:'100%'}}>
                    <CustomLabel gutterBottom>
                        Username
                    </CustomLabel>
                    <CustomTextField
                        value={formData.username}
                        name="username"
                        sx={{backgroundColor: '#fafafa', mb: 4}}
                        onChange={handleChange}
                    />
                    <CustomLabel gutterBottom>
                        Password
                    </CustomLabel>
                    <CustomTextField
                        type="password"
                        value={formData.password}
                        name="password"
                        sx={{backgroundColor: '#fafafa', mb: 2}}
                        onChange={handleChange}
                    />
                    <ErrorText color='error'>
                        {error || ""}
                    </ErrorText>
                    <StyledButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleLogin}
                        sx={{
                            boxShadow: 'none',
                        }}
                        disabled={!formData.username || !formData.password}
                    >
                        Login
                    </StyledButton>
                </Box>
                <HelperText>
                    Don't have an account? Register{' '}
                    <Link href="/signup" underline="hover">
                         here
                    </Link>
                    {'.'}
                </HelperText>
            </Wrapper>
        </Box>
    );
}

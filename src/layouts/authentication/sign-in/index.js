

import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Box from '@mui/material/Box'

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Amazon Sales ReportReact components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import Typography from '@mui/material/Typography'
// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { Routes, Route, Navigate, useLocation, redirect } from "react-router-dom";
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'

// Images
import bgImage from "assets/images/bg-01.jpg";
import axios from "axios";
import MDAlert from "components/MDAlert";

function Basic() {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState()
  const [paswword, setPassword] = useState()
  const [token, setToken] = useState(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)

  const onSubmit = () => {
    setError(false)
    if (email === undefined || paswword === undefined) {
      setError(true)
      setMessage("Email and Password is required")
    }
    else {
      axios.post('https://insight.roheex.com/login', { username: email, password: paswword }).then((response) => {
        if (response.data.token) {
          window.localStorage.setItem('token', response.data.token)
          setToken(response.data.token)
          setError(false)
        }
      }).catch((error) => {
        setError(true)
        setMessage("Email or Password is incorrect")
      })
    }
  }


  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  if (token) {
    return <Navigate replace to="/dashboard" />;
  }
  else {

    return (
      // <BasicLayout image={bgImage}>
      //   <Card>
      //     <MDBox
      //       variant="gradient"
      //       bgColor="info"
      //       borderRadius="lg"
      //       coloredShadow="info"
      //       mx={2}
      //       mt={-3}
      //       p={2}
      //       mb={1}
      //       textAlign="center"
      //     >
      //       <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
      //         Sign in
      //       </MDTypography>
      //       {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
      //       <Grid item xs={2}>
      //         <MDTypography component={MuiLink} href="#" variant="body1" color="white">
      //           <FacebookIcon color="inherit" />
      //         </MDTypography>
      //       </Grid>
      //       <Grid item xs={2}>
      //         <MDTypography component={MuiLink} href="#" variant="body1" color="white">
      //           <GitHubIcon color="inherit" />
      //         </MDTypography>
      //       </Grid>
      //       <Grid item xs={2}>
      //         <MDTypography component={MuiLink} href="#" variant="body1" color="white">
      //           <GoogleIcon color="inherit" />
      //         </MDTypography>
      //       </Grid>
      //     </Grid> */}
      //     </MDBox>
      //     <MDBox pt={4} pb={3} px={3}>
      //       <MDBox component="form" role="form">
      //         <MDBox mb={2}>
      //           <MDInput required type="email" label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
      //         </MDBox>
      //         <MDBox mb={2}>
      //           <MDInput required type="password" label="Password" fullWidth onChange={(e) => setPassword(e.target.value)} />
      //         </MDBox>

      //         {error ? <MDAlert color="error" dismissible className="alert-css">
      //           <MDTypography variant="body2" color="white">
      //             {message}
      //           </MDTypography>
      //         </MDAlert> : null}
      //         <MDBox mt={4} mb={1}>
      //           <MDButton variant="gradient" color="info" fullWidth onClick={() => onSubmit()}>
      //             sign in
      //           </MDButton>
      //         </MDBox>
      //       </MDBox>
      //     </MDBox>
      //   </Card>
      // </BasicLayout>
      <BasicLayout>
        <div className="main-login-container">
          <div className="wrapper">
            <div className="content">
              <div className="content-right">
                <div className="img-container">
                  <img alt="login-illustration" className="img1" src="https://demos.pixinvent.com/vuexy-nextjs-admin-template/demo-1/images/pages/auth-v2-login-illustration-light.png" />
                  <img alt="mask" className="img2" src="https://demos.pixinvent.com/vuexy-nextjs-admin-template/demo-1/images/pages/auth-v2-mask-light.png" />
                </div>
                <div className="content-container">
                  <div className="input-container">
                    <div className="inner-input-container">
                      <Box sx={{ my: 3 }}>
                        <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 1.385 }}>
                          {`Welcome to Amazon Sales Report Dashboard! 👋🏻`}
                        </Typography>
                        <Typography sx={{ color: 'text.secondary' }}>
                          Please sign-in to your account and start the adventure
                        </Typography>
                      </Box>


                      <form noValidate autoComplete='off'>
                        <FormControl fullWidth sx={{ mb: 2 }}>

                          <TextField
                            autoFocus
                            label='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="custom-input-style"
                            placeholder='name@domian.com'
                          />



                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 1.5 }}>
                          <InputLabel htmlFor='auth-login-v2-password' >
                            Password
                          </InputLabel>

                          <OutlinedInput
                            value={paswword}
                            className="custom-input-style"
                            label='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            id='auth-login-v2-password'


                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton
                                  edge='end'
                                // onMouseDown={e => e.preventDefault()}
                                // onClick={() => setShowPassword(!showPassword)}
                                >
                                  {/* <Icon icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} fontSize={20} /> */}
                                </IconButton>
                              </InputAdornment>
                            }
                          />

                        </FormControl>
                        <Box
                          sx={{
                            mb: 1.75,
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}
                        >
                        </Box>

                        {error ? <MDAlert color="error" dismissible className="alert-css">
                          <MDTypography variant="body2" color="white">
                            {message}
                          </MDTypography>
                        </MDAlert> : null}
                        <MDButton className="custom-btn-height" variant="gradient" color="info" fullWidth onClick={() => onSubmit()}>
                          sign in
                        </MDButton>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BasicLayout>
    );
  }
}

export default Basic;



import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Amazon Sales ReportReact components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import { Routes, Route, Navigate, useLocation, redirect } from "react-router-dom";

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

  console.log("email", email)
  console.log("passwrod", paswword)

  const onSubmit = () => {
    setError(false)
    if (email === undefined || paswword === undefined) {
      setError(true)
      setMessage("Email and Password is required")
    }
    else {
      axios.post('https://insight.roheex.com/login', { username: email, password: paswword }).then((response) => {
        console.log("response", response.data)
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
      <BasicLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign in
            </MDTypography>
            {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput required type="email" label="Email" fullWidth onChange={(e) => setEmail(e.target.value)} />
              </MDBox>
              <MDBox mb={2}>
                <MDInput required type="password" label="Password" fullWidth onChange={(e) => setPassword(e.target.value)} />
              </MDBox>

              {error ? <MDAlert color="error" dismissible className="alert-css">
                <MDTypography variant="body2" color="white">
                  {message}
                </MDTypography>
              </MDAlert> : null}
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth onClick={() => onSubmit()}>
                  sign in
                </MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayout>
    );
  }
}

export default Basic;

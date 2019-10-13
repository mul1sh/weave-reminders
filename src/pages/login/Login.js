import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button
} from "@material-ui/core";
import { withRouter } from "react-router-dom";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";

async function fileSelected(e) {

}

function notifyMe() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification("Hi there!");
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification("Hi there!");
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
 

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Weave Reminders</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <div className={classes.formButtons}>
                {isLoading ? (
                  <CircularProgress size={26} className={classes.loginLoader} />
                ) : (
                      <div className={classes.arweaveLogin}>
                          <h4>Welcome to Weave Reminders</h4>
                          <br/>
                          <h6>Your event reminders, stored securely in the permaweb</h6>
                          <br/>
                          <p>To continue, please load a valid Arweave Keystore.</p>
                          <Button 
                            onClick={()=> notifyMe()}
                            variant="contained"
                            color="primary"
                            size="large"
                            >
                              Load Keystore
                          </Button>
                          <br/>
                          <br/>
                          <h6>Need tokens or a wallet ?</h6>
                          <Button 
                              color="secondary"
                              onClick={()=> window.open("https://tokens.arweave.org/", "_blank")}
                          > 
                              Get Some Here
                          </Button>
                      </div>
                )}
              </div>
            </React.Fragment>

        </div>
        <Typography color="primary" className={classes.copyright}>
          © 2019 mul1sh
        </Typography>
      </div>
    </Grid>
  );
}

export default withRouter(Login);

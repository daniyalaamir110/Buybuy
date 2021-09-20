import types from "./types";
import axios from "../axios";
import swal from "sweetalert";

export const loading = () => {
  return {
    type: types.LOADING
  }
}

export const authenticateSuccess = user => {
  return {
    type: types.AUTHENTICATE_SUCCESS,
    payload: user
  }
}

export const authenticateFailure = error => {
  return {
    type: types.AUTHENTICATE_FAILURE,
    payload: error
  }
}

export const verifyEmail = () => {
  return {
    type: types.VERIFY_EMAIL
  }
}

export const logoutRequest = () => {
  return {
    type: types.LOGOUT_REQUEST
  }
}

export const changeProfileImage = image => {
  return {
    type: types.CHANGE_PROFILE_IMAGE,
    payload: image
  }
}

export const stopLoading = () => {
  return {
    type: types.STOP_LOADING
  }
}

// Create asynchronous actions
export const checkSession = () => dispatch => {
  dispatch(loading());
  axios.get("/api/user")
    .then(res => {
      if (res.data.user) {
        dispatch(authenticateSuccess(res.data.user));
      } else {
        dispatch(authenticateFailure("Out of session"));
      }
    })
    .catch(err => {
      dispatch(authenticateFailure("Something went wrong"))
    });
}


export const authenticate = credentials => dispatch => {
  dispatch(loading());
  axios.post("/api/login", credentials)
    .then(res => {
      if (res.data.user) {
        swal({
          title: "Success!",
          text: "User signed in",
          icon: "success",
          button: "Proceed",
        });
        dispatch(authenticateSuccess(res.data.user));
      } else {
        swal({
          title: "Oops!",
          text: "Incorrect username or password. Try again.",
          icon: "error",
          button: "OK",
        });
        dispatch(authenticateFailure(res.data.err));
      }
    }).catch(err => {
      dispatch(authenticateFailure(err.message))
    });
};

export const verify = secret => dispatch => {
  dispatch(loading());
  axios.post("/api/verify-email", {
    secret: secret
  }).then(res => {
    if (res.data.verified) {
      swal({
        title: "Success",
        text: "Your email has been verified",
        icon: "success",
        button: "Proceed",
      });
      dispatch(verifyEmail());
    } else {
      swal({
        title: "Error",
        text: "You typed an incorrect code",
        icon: "error",
        button: "OK",
      });
      dispatch(stopLoading());
    }
  });
}

export const logout = () => dispatch => {
  dispatch(loading());
  axios.get("/api/logout")
    .then(res => {
      dispatch(logoutRequest());
    });
}

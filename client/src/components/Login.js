import { useState } from "react";
import axios from "../axios";
import Navbar from "./Navbar";

// Redux
import { connect } from "react-redux";
import { authenticate } from "../redux/actions";

const Login = props => {

  // Form Input
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [processing, setProcessing] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // Client-side validation
  const handleUsernameChange = value => {
    setUsername(value);
    if (!value) setUsernameMessage("Required");
    else setUsernameMessage("");
  }

  const handlePasswordChange = value => {
    setPassword(value);
    if (!value) setPasswordMessage("Required");
    else setPasswordMessage("");
  }

  const checkError = () => {
    if (!username || usernameMessage || !password || passwordMessage) {
      return true;
    } else return false;
  }

  // Log in
  const handleSubmit = e => {
    e.preventDefault();
    if (!checkError() && !processing && !loggedIn) {
      props.authenticate({ username, password });
    }
  }

  return (
    <div className="auth-forms">
      <Navbar transparent={true} />
      <div className="container pt-5">
        <div className="row pt-5 text-light">
          <div className="col-lg-4 col-md-6 mt-5 p-4 mx-auto rounded">
            <h1 className="display-4 text-center">Login</h1>
            <div className="heading-divider-light mx-auto"></div>
            <form onSubmit={e => handleSubmit(e)} method="POST">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-12">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="username">Username</label>
                        {usernameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {usernameMessage}</span> : username && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="username" value={username} onChange={e => handleUsernameChange(e.target.value)} disabled={processing || loggedIn} />
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="password">Password</label>
                        {passwordMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {passwordMessage}</span> : password && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="password" className="form-control text-light border-light" id="password" value={password} onChange={e => handlePasswordChange(e.target.value)} disabled={processing || loggedIn} />
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className={`btn ${checkError() ? "btn-outline-secondary" : "btn-outline-light"} btn-block mx-auto`} disabled={checkError() || processing || loggedIn}>Login</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

// Redux state to component Props
const mapStateToProps = state => {
  return { state: state };
}

// Redux async actions to component props
const mapDispatchToProps = dispatch => {
  return {
    authenticate: credentials => {
      dispatch(authenticate(credentials));
    }
  }
}

// Connect the component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Login);

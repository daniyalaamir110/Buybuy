import { useState } from "react";
import axios from "../axios";
import Navbar from "./Navbar";
import swal from "sweetalert";

const Signup = () => {

  // Form Input
  const [firstName, setFirstName] = useState("");
  const [firstNameMessage, setFirstNameMessage] = useState("");

  const [lastName, setLastName] = useState("");
  const [lastNameMessage, setLastNameMessage] = useState("");

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [password2, setPassword2] = useState("");
  const [password2Message, setPassword2Message] = useState("");

  const [accountType, setAccountType] = useState("");
  const [accountTypeMessage, setAccountTypeMessage] = useState("");

  const [processing, setProcessing] = useState(false);
  const [signedUp, setSignedUp] = useState(false);

  // Client-side validation
  const handleFirstNameChange = value => {
    setFirstName(value);
    if (!value) setFirstNameMessage("Required");
    else setFirstNameMessage("");
  }

  const handleLastNameChange = value => {
    setLastName(value);
    if (!value) setLastNameMessage("Required");
    else setLastNameMessage("");
  }

  const handleEmailChange = value => {
    setEmail(value);
    if (!value) setEmailMessage("Required");
    else if (!/\S+@\S+\.\S+/.test(value)) setEmailMessage("Invalid email format")
    else setEmailMessage("");
  }

  const handleEmailBlur = () => {
    if (!emailMessage) {
      setEmailMessage("...");
      axios.get("/api/check-email?email=" + email)
      .then(res => {
        if (res.data.exists) {
          setEmailMessage("Already exists.");
        } else setEmailMessage("");
      });
    }
  }

  const handleUsernameChange = value => {
    setUsername(value);
    if (!value) setUsernameMessage("Required");
    else setUsernameMessage("");
  }

  const handleUsernameBlur = () => {
    if (!usernameMessage) {
      setUsernameMessage("...");
      axios.get("/api/check-username?username=" + username)
      .then(res => {
        if (res.data.exists) {
          setUsernameMessage("Already exists.");
        } else setUsernameMessage("");
      });
    }
  }

  const handlePasswordChange = value => {
    setPassword(value);
    if (!value) setPasswordMessage("Required");
    else if (value.length < 8 || value.length > 20) setPasswordMessage("Must be 8 to 20 characters long");
    else setPasswordMessage("");
  }

  const handlePassword2Change = value => {
    setPassword2(value);
    if (!value) setPassword2Message("Required");
    else if (value !== password) setPassword2Message("Didn't match")
    else setPassword2Message("");
  }

  const handleAccountTypeChange = value => {
    setAccountType(value);
    if (!value) setAccountTypeMessage("Required");
    else setAccountTypeMessage("");
  }

  const checkError = () => {
    if (!firstName || firstNameMessage || !lastName || lastNameMessage || !email || emailMessage || !username || usernameMessage || !password || passwordMessage || !password2 || password2Message || !accountType || accountTypeMessage) {
      return true;
    } else return false;
  }

  // Sign up
  const handleSubmit = e => {
    e.preventDefault();
    if (!checkError() && !processing && !signedUp) {
      setProcessing(true);
      axios.post("/api/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        password: password,
        password2: password2,
        accountType: accountType
      }).then(res => {
        setProcessing(false);
        if (res.data.success) {
          setSignedUp(true);
          swal({
            title: "Success",
            text: "Successfully signed up",
            icon: "success",
            button: "Proceed",
          })
            .then(proceed => {
              window.location.href = "/login";
            });
        } else {
          swal({
            title: "Error",
            text: "User could not be signed up",
            icon: "error",
            button: "OK",
          });
        }
      });
    }
  }

  return (
    <div className="auth-forms">
      <Navbar transparent={true} />
      <div className="container pt-5">
        <div className="row text-light">
          <div className="col-lg-8 mt-3 p-4 mx-auto rounded">
            <h1 className="display-4 text-center">Sign up</h1>
            <div className="heading-divider-light mx-auto"></div>
            <form onSubmit={e => handleSubmit(e)} method="POST">
              <div className="container-fluid p-0 mt-3">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="firstName">First Name</label>
                        {firstNameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {firstNameMessage}</span>: firstName && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="firstName" value={firstName} onChange={e => handleFirstNameChange(e.target.value)} disabled={processing || signedUp} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="lastName">Last Name</label>
                        {lastNameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {lastNameMessage}</span>: lastName && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="lastName" value={lastName} onChange={e => handleLastNameChange(e.target.value)} disabled={processing || signedUp} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="username">Email address</label>
                        {emailMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {emailMessage}</span>: email && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="email" value={email} onChange={e => handleEmailChange(e.target.value)} onBlur={handleEmailBlur} disabled={processing || signedUp} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="username">Username</label>
                        {usernameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {usernameMessage}</span>: username && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="username" value={username} onChange={e => handleUsernameChange(e.target.value)} onBlur={handleUsernameBlur} disabled={processing || signedUp} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="password">Password</label>
                        {passwordMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {passwordMessage}</span>: password && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="password" className="form-control text-light border-light" id="password" value={password} onChange={e => handlePasswordChange(e.target.value)} disabled={processing || signedUp} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="password">Re-type</label>
                        {password2Message ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {password2Message}</span>: password2 && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="password" className="form-control text-light" id="password2" value={password2} onChange={e => handlePassword2Change(e.target.value)} disabled={processing || signedUp} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <label htmlFor="accountType">Account Type</label>
                  {accountTypeMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {accountTypeMessage}</span>: accountType && <i className="text-success fas fa-check"></i>}
                </div>
                <div className="container-fluid p-0">
                  <div className="row">
                    <div className="col-md-3 col-6">
                      <div className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id="buying" name="accountType" onChange={e => handleAccountTypeChange("buying")} disabled={processing || signedUp} />
                        <label className="custom-control-label" htmlFor="buying">Buying</label>
                      </div>
                    </div>
                    <div className="col-md-3 col-6">
                      <div className="custom-control custom-radio">
                        <input type="radio" className="custom-control-input" id="selling" name="accountType" onChange={e => handleAccountTypeChange("selling")} disabled={processing || signedUp} />
                        <label className="custom-control-label" htmlFor="selling">Selling</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button type="submit" className={`btn ${checkError() ? "btn-outline-secondary" : "btn-outline-light"} btn-block mx-auto`} disabled={checkError() || processing || signedUp}>Signup</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;

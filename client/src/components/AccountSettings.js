import { useState, useEffect, useRef } from "react";
import axios from "../axios";

// Redux
import { connect } from "react-redux";
import { logout, changeProfileImage } from "../redux/actions";

import Sidebar from "./Sidebar";

import user from "../images/user.svg";

const AccountSettings = props => {

  // Form Input
  const [firstName, setFirstName] = useState(props.state.user.first_name);
  const [firstNameMessage, setFirstNameMessage] = useState("");

  const [lastName, setLastName] = useState(props.state.user.last_name);
  const [lastNameMessage, setLastNameMessage] = useState("");

  const [email, setEmail] = useState(props.state.user.email);
  const [emailMessage, setEmailMessage] = useState("");

  const [username, setUsername] = useState(props.state.user.username);
  const [usernameMessage, setUsernameMessage] = useState("");

  const [password, setPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [password2, setPassword2] = useState("");
  const [password2Message, setPassword2Message] = useState("");

  const [image, setImage] = useState("");

  const [processing, setProcessing] = useState(false);

  const imageRef = useRef();

  // Client-side validation
  const handleFirstNameChange = value => {
    value = value.trim();
    setFirstName(value);
    if (!value) setFirstNameMessage("Required");
    else setFirstNameMessage("");
  }

  const handleLastNameChange = value => {
    value = value.trim();
    setLastName(value);
    if (!value) setLastNameMessage("Required");
    else setLastNameMessage("");
  }

  const handleEmailChange = value => {
    value = value.trim();
    setEmail(value);
    if (!value) setEmailMessage("Required");
    else if (!/\S+@\S+\.\S+/.test(value)) setEmailMessage("Invalid email format")
    else setEmailMessage("");
  }

  const handleEmailBlur = () => {
    if (!emailMessage && email !== props.state.user.email) {
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
    value = value.trim();
    setUsername(value);
    if (!value) setUsernameMessage("Required");
    else setUsernameMessage("");
  }

  const handleUsernameBlur = () => {
    if (!usernameMessage && username !== props.state.user.username) {
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
    value = value.trim();
    setPassword(value);
    if (!value) setPasswordMessage("Required");
    else if (value.length < 8 || value.length > 20) setPasswordMessage("Must be 8 to 20 characters long");
    else setPasswordMessage("");
  }

  const handlePassword2Change = value => {
    value = value.trim();
    setPassword2(value);
    if (!value) setPassword2Message("Required");
    else if (value !== password) setPassword2Message("Didn't match")
    else setPassword2Message("");
  }

  const checkGeneralError = () => {
    if (!firstName || firstNameMessage || !lastName || lastNameMessage || !email || emailMessage || !username || usernameMessage) {
      return true;
    } else return false;
  }

  const checkPasswordError = () => {
    if (!password || passwordMessage || !password2 || password2Message) {
      return true;
    } else return false;
  }

  const handleSubmitGeneral = e => {
    e.preventDefault();
    if (!checkGeneralError() && !processing) {
      setProcessing(true);
      axios.post("/api/change-general-info", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username
      }).then(res => {
        setProcessing(false);
        if (res.data.success) {
          alert(res.data.success);
          window.location.reload();
        } else if (res.data.error) {
          alert(res.data.error);
        }
      });
    }
  }

  // Sign up
  const handleSubmitPassword = e => {
    e.preventDefault();
    if (!checkPasswordError() && !processing) {
      setProcessing(true);
      axios.post("/api/change-password", {
        password: password,
        password2: password2
      }).then(res => {
        setProcessing(false);
        if (res.data.success) {
          alert(res.data.success);
          window.location.reload();
        } else if (res.data.error) {
          alert(res.data.error);
        }
      });
    }
  }

  const displayImage = file => {
    setImage(file);
    const reader = new FileReader();
    reader.onload = e => {
      imageRef.current.src = e.target.result;
    }
    reader.readAsDataURL(file);
  }

  const uploadImage = () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      const config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      axios.post("/api/change-profile-image", formData, config)
        .then(res => {
          if (res.data.success) {
            alert(res.data.success);
            window.location.reload();
          }
        });
    }
  }

  const deleteImage = () => {
    axios.post("/api/delete-profile-image")
      .then(res => {
        if (res.data.success) {
          alert(res.data.success)
          window.location.reload();
        }
      });
  }

  return (
    <div className="content bg-light">
      <Sidebar />
      <h1 className="display-4 mt-2 text-center">Account</h1>
      <div className="heading-divider mx-auto"></div>
      <div className="container pb-4">
        <div className="row">
          <div className="col-md-7 mx-auto">
            <div className="container-fluid">
              <form method="POST">
                <h2>General</h2>
                <div className="row align-items-center bg-white p-3 mb-3 border">
                  <div className="col-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="firstName">First Name</label>
                        {firstNameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {firstNameMessage}</span>: firstName && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control" id="firstName" value={firstName} onChange={e => handleFirstNameChange(e.target.value)} disabled={processing} />
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="lastName">Last Name</label>
                        {lastNameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {lastNameMessage}</span>: lastName && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control" id="lastName" value={lastName} onChange={e => handleLastNameChange(e.target.value)} disabled={processing} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="email">Email Address</label>
                        {emailMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {emailMessage}</span>: email && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control" id="email" value={email} onChange={e => handleEmailChange(e.target.value)} disabled={processing} onBlur={handleEmailBlur} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="username">Username</label>
                        {usernameMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {usernameMessage}</span>: username && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control" id="username" value={username} onChange={e => handleUsernameChange(e.target.value)} disabled={processing} onBlur={handleUsernameBlur} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <button type="submit" className={`btn ${checkGeneralError() ? "btn-outline-dark" : "btn-outline-success"}`} disabled={checkGeneralError() || processing} onClick={e => handleSubmitGeneral(e)}>Save Changes</button>
                  </div>
                  <div className="col-12 pt-2">
                    <p>Note: You will have to verify your new email address.</p>
                  </div>
                </div>
              </form>

              <form method="POST" onClick={handleSubmitPassword}>
                <h2>Change Password</h2>
                <div className="row row-eq-height bg-white p-3 border">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="password">Password</label>
                        {passwordMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {passwordMessage}</span>: password && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="password" className="form-control" id="password" value={password} onChange={e => handlePasswordChange(e.target.value)} disabled={processing} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="password2">Confirm</label>
                        {password2Message ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {password2Message}</span>: password2 && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="password" className="form-control" id="password2" value={password2} onChange={e => handlePassword2Change(e.target.value)} disabled={processing} />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <button type="submit" className={`btn ${checkPasswordError() ? "btn-outline-dark" : "btn-outline-success"}`} disabled={checkPasswordError() || processing}>Save Changes</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-md-4 mx-auto">
            <h2>Profile Image</h2>
            <div className="form-group bg-white p-3 border">
              <input type="file" name="file" onChange={e => displayImage(e.target.files[0])} />
              <div className="uploaded-image">
                <img ref={imageRef} src={`/${props.state.user.profile_image}`} alt="No profile image" />
              </div>
              <button className="btn btn-sm btn-outline-success mt-2 mr-2" onClick={uploadImage} disabled={!image}>Use image</button>
              <button className="btn btn-sm btn-outline-danger mt-2" onClick={deleteImage} disabled={!props.state.user.profile_image}>Delete image</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Redux state to component Props
const mapStateToProps = state => {
  return { state: state };
}

// Redux async actions to component props
const mapDispatchToProps = dispatch => {
  return {
    logout: () => {
      dispatch(logout());
    },
    changeProfileImage: () => {
      dispatch(changeProfileImage())
    }
  }
}

// Connect the component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(AccountSettings);

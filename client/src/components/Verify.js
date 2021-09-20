import { useState } from "react";
import axios from "../axios";
import Navbar from "./Navbar";

// Redux
import { connect } from "react-redux";
import { verify } from "../redux/actions";

const Verify = props => {

  // Form Input
  const [secret, setSecret] = useState("");
  const [secretMessage, setSecretMessage] = useState("");

  const [processing, setProcessing] = useState(false);
  const [verified, setVerified] = useState(false);

  // Client-side validation
  const handleSecretChange = value => {
    if (value.length <= 4) setSecret(value);
    if (!value) setSecretMessage("Required");
    else if (!Number(value)) setSecretMessage("Must include digits only");
    else if (value.length < 4) setSecretMessage("Enter 4 digit code");
    else setSecretMessage("");
  }

  const checkError = () => {
    if (!secret || secretMessage) {
      return true;
    } else return false;
  }

  // Verify
  const handleSubmit = e => {
    e.preventDefault();
    if (!checkError() && !processing && !verified) {
      setProcessing(true)
      props.verify(secret);
    }
  }

  return (
    <div className="auth-forms">
      <Navbar transparent={true} />
      <div className="container pt-5">
        <div className="row pt-5 text-light">
          <div className="col-lg-6 mt-4 p-4 mx-auto rounded">
            <h1 className="display-4 text-center">Verify Your Email</h1>
            <div className="heading-divider-light mx-auto"></div>
            <p>{props.state.user.first_name}, we are grateful to see you join Buybuy. We have sent you a verification code to the email you provided. Please enter the code here to continue. Your account will be permenantly deleted after 30 days if you don't verify your email.</p>
            <form onSubmit={e => handleSubmit(e)} method="POST">
              <div className="container-fluid p-0">
                <div className="row">
                  <div className="col-8">
                    <div className="form-group">
                      <div className="d-flex flex-row justify-content-between align-items-center">
                        <label htmlFor="secret">Verfication Code</label>
                        {secretMessage ? <span className="text-danger font-weight-light small lead"><i class="fas fa-times"></i> {secretMessage}</span> : secret && <i className="text-success fas fa-check"></i>}
                      </div>
                      <input type="text" className="form-control text-light border-light" id="secret" value={secret} onChange={e => handleSecretChange(e.target.value)} disabled={processing || verified} />
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="form-group">
                      <label>Didn't receive?</label>
                      <button className="btn btn-outline-warning btn-block">Resend</button>
                    </div>
                  </div>
                  <div className="col-12">
                    <button type="submit" className={`btn ${checkError() ? "btn-outline-secondary" : "btn-outline-light"} btn-block mx-auto`} disabled={checkError() || processing || verified}>Verify</button>
                  </div>
                </div>
              </div>
            </form>
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
    verify: secret => {
      dispatch(verify(secret));
    }
  }
}

// Connect the component to redux store
export default connect(mapStateToProps, mapDispatchToProps)(Verify);

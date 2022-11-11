import React, { useCallback, useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { aboutSignet, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Alerts from '../Widgets/Alerts';
import Loading from '../Widgets/Loading';
import { GOOGLE_LOGIN_URL, MICROSOFT_LOGIN_URL } from '../../Config/Environment';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { setDefaultStatus } from '../../Redux-Toolkit/sessionSlice';
import { userLogin } from '../../Redux-Toolkit/sessionSlice/action';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [validity, setValidity] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  const handleClose = () => setAlertShow(false);

  const path = useLocation();

  const { userData, apiStatus, isFetching, isError, loading, error } = useSelector((state) => state.session);

  const ssoLogin = useCallback(() => {
    if (path.hash.includes('#access_token=')) {
      setIsLoading(true);
      const res = path.hash.split('&');
      const tempToken = res[0].split('#access_token=');
      localStorage.setItem('temp_token', tempToken[1]);
      navigate('/getuserdetails');
    } else if (path.hash.includes('#error=')) {
      setAlertShow('Your account is not active. Contact support at appsupport@signetgroup.net');
      setIsLoading(false);
    }
  }, [navigate, path.hash]);

  useEffect(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
    const approveLink = localStorage.getItem('approveLink');
    const socialError = localStorage.getItem('personalEmailLogin');
    if (!approveLink && !socialError) {
      localStorage.clear();
    }
    window.fcWidget.destroy();
  }, []);

  useEffect(() => {
    if (!isFetching) {
      setAlertShow(isError);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    ssoLogin();
  }, [ssoLogin]);

  useEffect(() => {
    setIsLoading(false);
    if (localStorage.getItem('personalEmailLogin')) {
      setAlertShow(localStorage.getItem('personalEmailLogin'));
      localStorage.removeItem('personalEmailLogin');
      setTimeout(() => {
        setAlertShow(false);
      }, 5000);
    }
    return () => {
      setEmail('');
      setPassword('');
      setIsLoading(false);
    };
  }, []);

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefaultStatus());
        const isMobileVerifydata = userData?.isMobileVerify;
        localStorage.setItem('id', userData?.userId);
        buttonTracker(gaEvents.LOGIN_VIA_EMAIL);
        if (isMobileVerifydata === false) {
          const datas = userData;
          navigate('/otpverify', { state: { datas } });
        } else {
          localStorage.setItem('id', userData?.userId);
          localStorage.setItem('email', userData?.orgEmail);
          localStorage.setItem('orgName', userData?.orgName);
          localStorage.setItem('orgNo', userData?.orgNo);
          localStorage.setItem('probe', userData?.probe);
          localStorage.setItem('isSocial', userData?.isSocial);
          localStorage.setItem('firstName', `  ${userData?.firstName}`);
          localStorage.setItem('lastName', `${userData?.lastName}`);
          localStorage.setItem('id', userData?.userId);
          navigate('/twofactor');
        }
      } else if (localStorage.getItem('id')) {
        window.location = '/';
      } else {
        setAlertShow(true);
        setAlertMessage(error);
        setTimeout(() => {
          setAlertShow(false);
        }, 5000);
      }
    }
  }, [apiStatus]);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidity(form.checkValidity());
    if (form.checkValidity() === true) {
      event.stopPropagation();

      const urlencoded = new URLSearchParams();
      urlencoded.append('username', email);
      urlencoded.append('password', password);

      dispatch(userLogin(urlencoded));
    }
    setValidated(true);
  };

  return (
    <Container fluid className="lognWrapper">
      {alertShow && <Alerts variant="danger" onClose={handleClose} alertshow={alertMessage} />}
      {isLoading && <Loading />}
      {loading && <Loading />}
      <Row>
        <Col lg={6} md={12} sm={12} className="d-none d-lg-block p-0">
          <div className="boxLeft d-flex align-items-center justify-content-center">
            <div className="boxWrap d-flex align-items-center justify-content-center flex-column text-center">
              <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/rafiki.png'} alt="" />
              <p>{aboutSignet}</p>
            </div>
          </div>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <div className="boxRight d-flex align-items-center">
            <div className="mainWrap d-flex align-items-flex-start flex-column justify-content-center">
              <div className="regTxt d-flex align-items-start flex-column">
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/logo.png'} alt="" />
              </div>
              <Form noValidate validated={validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="inputWrapper emailInput">
                  <Form.Control
                    required
                    className="email-input"
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={email}
                    onChange={emailChange}
                    data-validity={validity}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/envelop.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="formBasicPassword"
                  className={`inputWrapper passwordInput${password.length > 8 ? 'formValid' : 'formInvalid'}`}
                >
                  <Form.Control
                    required
                    className="password-input"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    value={password}
                    onChange={passwordChange}
                    data-validity={validity}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/key.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">Please provide a valid password</Form.Control.Feedback>
                </Form.Group>
                <div className="forgotBox d-flex align-items-center justify-content-between mt-3">
                  <Form.Group controlId="formBasicCheckbox" className="customCheck" />
                  <Link
                    to="/forgotpassword"
                    onClick={() => {
                      linkTracker(gaEvents.NAVIGATE_FORGOT_PASSWORD);
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column">
                  <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                    Login{' '}
                  </Button>
                  <span className="orTxt">Or</span>
                  <div className="signBox d-flex align-items-center justify-content-center">
                    <a
                      data-testid="googleURL"
                      href={GOOGLE_LOGIN_URL}
                      onClick={() => {
                        linkTracker(gaEvents.LOGIN_VIA_GOOGLE);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/google.png'} alt="Google" />
                    </a>
                    <a
                      data-testid="microsoftURL"
                      href={MICROSOFT_LOGIN_URL}
                      onClick={() => {
                        linkTracker(gaEvents.LOGIN_VIA_MICROSOFT);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/microsoft.png'} alt="Microsoft" />
                    </a>
                  </div>
                  <span>
                    Not a user?{' '}
                    <Link to="/signup" onClick={() => linkTracker(gaEvents.NAVIGATE_SIGNUP)}>
                      Create an account
                    </Link>
                  </span>
                  <span className="downloadApp">Download the App</span>
                  <div className="d-flex align-items-center justify-content-center flexGap">
                    <a
                      data-testid="playStoreURL"
                      href="https://play.google.com/"
                      rel="noreferrer"
                      target="_blank"
                      onClick={() => {
                        linkTracker(gaEvents.OPEN_PLAY_STORE);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/play_Store.png'} alt="Play store" />
                    </a>
                    <a
                      data-testid="appStoreURL"
                      href="https://www.apple.com/in/app-store/"
                      rel="noreferrer"
                      target="_blank"
                      onClick={() => {
                        linkTracker(gaEvents.OPEN_APP_STORE);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/app-store.png'} alt="App store" />
                    </a>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;

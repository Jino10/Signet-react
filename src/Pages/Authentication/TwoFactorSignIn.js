import React, { useEffect, useRef, useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { aboutSignet, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Alerts from '../Widgets/Alerts';
import Loading from '../Widgets/Loading';
import { userRoleId } from '../../Utilities/AppUtilities';
import { hidefcWidget, initFCWidget } from '../Chats/FreshChat';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { resendOTP, twoFactorLogin } from '../../Redux-Toolkit/sessionSlice/action';
import { setLogin, setDefaultStatus } from '../../Redux-Toolkit/sessionSlice';

function TwoFactorSignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialValue = useRef(true);
  const [otp, setOTP] = useState('');
  const [validated, setValidated] = useState(false);
  const [alertshow, setAlertShow] = useState('');
  const [alertVarient, setAlertVarient] = useState('danger');
  const [isLoading, setIsLoading] = useState(false);
  const { buttonTracker } = useAnalyticsEventTracker();

  const { loading, userData, isFetching, isError, apiFullStatus, apiStatus, error } = useSelector((state) => state.session);

  useEffect(() => {
    if (!isFetching) {
      setAlertShow(isError);
      setAlertVarient('danger');
      setIsLoading(false);
    }
    return () => {
      initialValue.current = true;
    };
  }, []);

  useEffect(() => {
    if (userData) {
      dispatch(setLogin());
    }
  }, []);

  const otpChange = (event) => {
    setOTP(event.target.value);
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefaultStatus());
        setAlertShow('OTP send to your email');
        setAlertVarient('success');
        setIsLoading(false);
        setTimeout(() => {
          setAlertShow(false);
        }, 5000);
      } else {
        setAlertShow('Something went wrong, try again');
        setAlertVarient('danger');
        setIsLoading(false);
        setTimeout(() => {
          setAlertShow(false);
        }, 5000);
      }
    }
  }, [apiStatus]);

  const requestOtp = async () => {
    buttonTracker(gaEvents.RESEND_OTP_EMAIL);
    setIsLoading(true);
    const id = localStorage.getItem('id');
    dispatch(resendOTP(id));
  };

  useEffect(async () => {
    if (apiFullStatus !== null) {
      if (apiFullStatus === httpStatusCode.SUCCESS) {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userData?.token);
        localStorage.setItem('id', userData?.userId);
        localStorage.setItem('contactSales', userData?.isContactSales);
        localStorage.setItem('firstName', `${userData?.firstName}`);
        localStorage.setItem('lastName', `${userData?.lastName}`);
        localStorage.setItem('roleId', userData?.roleId);
        localStorage.setItem('email', userData?.emailId);
        localStorage.setItem('mobile', userData?.mobileNumber);
        const redirectTo = localStorage.getItem('redirectTo');
        if (userData?.roleId === userRoleId.remoteSmartUser) {
          await initFCWidget().then(() => hidefcWidget());
        }
        if (userData?.roleId === userRoleId.signetAdmin) {
          const approveLink = localStorage.getItem('approveLink');
          if (approveLink) {
            navigate(approveLink);
          } else {
            navigate(`/users`);
          }
        } else if (userData?.roleId === userRoleId.nonRemoteSmartUser) {
          navigate('/tickets');
        } else if (userData?.roleId === userRoleId.remoteSmartUser && redirectTo) {
          localStorage.removeItem('redirectTo');
          navigate(redirectTo);
        } else {
          navigate('/tickets');
        }
      } else {
        console.log('er');
        setIsLoading(false);
        setAlertShow(error);
        setAlertVarient('danger');
        setIsLoading(false);
        setTimeout(() => {
          setAlertShow(false);
        }, 5000);
      }
    }
  }, [apiFullStatus]);

  const handleSubmit = async (event) => {
    buttonTracker(gaEvents.VERIFY_EMAIL_OTP);
    const form = event.currentTarget;
    event.preventDefault();
    setValidated(true);
    if (form.checkValidity() === true) {
      event.stopPropagation();

      const id = localStorage.getItem('id');
      dispatch(twoFactorLogin({ id, otp }));
    }
  };

  return (
    <Container fluid className="lognWrapper">
      {alertshow && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setAlertShow('');
          }}
          alertshow={alertshow}
        />
      )}
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
              <div className="messageBox">
                <div className="divLine" />
                <div>
                  Sent a verification code to <br /> <span>{localStorage.getItem('email')}</span>
                </div>
              </div>

              <Form noValidate validated={validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="inputWrapper emailInput">
                  <Form.Control
                    required
                    className="email-input"
                    type="text"
                    placeholder="OTP"
                    autoComplete="off"
                    value={otp}
                    onChange={otpChange}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/envelop.svg'} alt="" />
                  <div className="d-flex flex-row-reverse align-items-center">
                    <Button data-testid="resendOTP" className="resendText" onClick={requestOtp}>
                      Resend OTP
                    </Button>
                  </div>
                  <Form.Control.Feedback type="invalid">Please provide a OTP</Form.Control.Feedback>
                </Form.Group>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column">
                  <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                    Verify{' '}
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default TwoFactorSignIn;

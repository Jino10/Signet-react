import React, { useState, useEffect } from 'react';
import './NetworkHealth.css';
import { Button } from 'react-bootstrap';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultStatus } from '../../Redux-Toolkit/sessionSlice';
import { chartData } from '../../Redux-Toolkit/sessionSlice/action';

export default function NetworkHealth() {
  const [snackBar, setSnackBar] = useState(false);
  const { buttonTracker } = useAnalyticsEventTracker();
  const dispatch = useDispatch();

  const { apiStatus } = useSelector((state) => state.session);

  useEffect(() => {
    if (localStorage.getItem('contactSales') === 'true') {
      setSnackBar(true);
    }
  }, []);

  const handleClick = async () => {
    dispatch(chartData());
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefaultStatus());
        setSnackBar(true);
        localStorage.setItem('contactSales', 'true');
      }
    }
  }, [apiStatus]);

  return (
    <div className="wrapperBase">
      <div className="wrapperCard">
        <div className="wrapperCard--header">
          <div className="titleHeader">
            <div className="info">
              <h6>Dashboard</h6>
            </div>
          </div>
          <div className="wrapperCard--body">
            <div className="videoWrapper">
              <video width="100%" height="100%" controls src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4">
                <source src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4" type="video/mp4" />
              </video>
            </div>
            {!snackBar && (
              <Button
                className="buttonPrimary mb-5"
                onClick={() => {
                  buttonTracker(gaEvents.CONTACT_SALES);
                  handleClick();
                }}
              >
                Contact Sales
              </Button>
            )}
          </div>
        </div>
        {snackBar && <div className="contactSalesText">Thank you for your interest. We will be contacting you soon!</div>}
      </div>
    </div>
  );
}

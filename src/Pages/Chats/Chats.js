import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import { hidefcWidget, initFCWidget, showfcWidget } from './FreshChat';
import { userRoleId } from '../../Utilities/AppUtilities';
import './Chats.css';
import Loading from '../Widgets/Loading';
import { Button } from 'react-bootstrap';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultStatus } from '../../Redux-Toolkit/sessionSlice';
import { chartData } from '../../Redux-Toolkit/sessionSlice/action';

export default function Chats() {
  const location = useLocation();
  const [snackBar, setSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(location.state != null ? location.state.showLoader : true);
  const roledId = localStorage.getItem('roleId');
  const { buttonTracker } = useAnalyticsEventTracker();
  const dispatch = useDispatch();

  const { apiStatus } = useSelector((state) => state.session);

  useEffect(() => {
    if (roledId === userRoleId.remoteSmartUser) {
      if (!window.fcWidget.isInitialized()) {
        initFCWidget().then(() => showfcWidget());
      } else {
        showfcWidget();
      }
    }

    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false);
      }, 7000);
    }

    if (localStorage.getItem('contactSales') === 'true') {
      setSnackBar(true);
    }
  }, [isLoading, roledId]);
  /* Component cleanup function call start  */
  useEffect(
    () => () => {
      hidefcWidget().then();
    },
    [],
  );
  /* Component cleanup function call end  */
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
      {isLoading && <Loading />}
      {roledId !== userRoleId.remoteSmartUser && (
        <div className="wrapperCard">
          <div className="wrapperCard--header">
            <div className="titleHeader">
              <div className="info">
                <h6>Chat</h6>
              </div>
            </div>
          </div>
          <div className="wrapperCard--body">
            <div className="videoWrapper">
              <video width="100%" height="100%" controls>
                <source src="https://signet-group-public.s3.amazonaws.com/Animate+-+22182.mp4" />
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
          {snackBar && <div className="contactSalesText">Thank you for your interest. We will be contacting you soon!</div>}
        </div>
      )}
    </div>
  );
}

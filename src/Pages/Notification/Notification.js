import React, { useEffect, useState } from 'react';
import './Notification.css';
import { httpStatusCode } from '../../Constants/TextConstants';
import { Button } from 'react-bootstrap';
import Loading from '../Widgets/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultStatus } from '../../Redux-Toolkit/sessionSlice';
import { notificationData } from '../../Redux-Toolkit/sessionSlice/action';
import Alerts from '../Widgets/Alerts';

export default function Notification() {
  const organizationName = localStorage.getItem('orgName');
  const [notifications, setNotifications] = useState([]);
  const [lastPage, setLastPage] = useState(false);
  const [firstPage, setFirstPage] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [alertShow, setAlertShow] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [variant, setVariant] = useState('');

  const handleClose = () => setAlertShow(false);

  const dispatch = useDispatch();
  const { notifyStatus, notificationValues, error } = useSelector((state) => state.session);

  const fetchNotifications = async (pageNo) => {
    setIsLoading(true);
    dispatch(notificationData({ pageNo, organizationName }));
    if ((notifyStatus !== null && Array.isArray(notificationValues)) || notificationValues !== []) {
      if (notifyStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefaultStatus());
        setIsLoading(false);
        setNotifications(notificationValues.data.content);
        setLastPage(notificationValues.data.last);
        setFirstPage(notificationValues.data.first);
        setPageNumber(pageNo);
      } else {
        setIsLoading(false);
        setAlertShow(true);
        setVariant('danger');
        setAlertMessage(error);
        setTimeout(() => {
          setAlertShow(false);
        }, 5000);
      }
    }
  };

  useEffect(() => {
    fetchNotifications(0);
  }, []);

  const next = () => {
    const nextPageNumber = pageNumber + 1;
    fetchNotifications(nextPageNumber);
  };

  const previous = () => {
    const previousPageNumber = pageNumber - 1;
    fetchNotifications(previousPageNumber);
  };

  return (
    <div className="wrapperBase">
      <Alerts variant={variant} onClose={handleClose} alertshow={alertMessage} />
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="titleHeader d-flex align-items-center justify-content-between">
            <div className="info">
              <h6>Notifications</h6>
            </div>
          </div>
          <div className="notifyBodyWrap">
            {notifications.map((i) => (
              <div className="notifyBodyBox" key={i.id}>
                <span />
                <div className="notifyBodyInfo">
                  <div dangerouslySetInnerHTML={{ __html: i.notificationMessage }} />
                </div>
              </div>
            ))}
            <div className="pagination">
              <Button className="saveBtn paginationButton" disabled={firstPage} onClick={() => previous()}>
                {'<'}
              </Button>
              <Button className="saveBtn paginationButton" disabled={lastPage} onClick={() => next()}>
                {'>'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Loading from '../Widgets/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { useDispatch, useSelector } from 'react-redux';
import { setTickets } from '../../Redux-Toolkit/ticketSlice';
import { viewTicket } from '../../Redux-Toolkit/ticketSlice/action';

export default function ViewTicket() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const { id } = useParams();
  const { buttonTracker } = useAnalyticsEventTracker();
  const dispatch = useDispatch();

  const { ticketData, apiStatus } = useSelector((state) => state.ticket);

  const fetchTicketDetails = async () => {
    setLoading(true);
    dispatch(viewTicket(id));
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setTickets());
        setLoading(false);
        setData({ ...ticketData.data[0], description: ticketData.data[0].description.replace(/\n/g, '<br/>') });
      }
    }
  }, [apiStatus]);

  useEffect(() => {
    fetchTicketDetails();
  }, []);

  return (
    <div className="wrapperBase">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="titleHeader d-flex align-items-center justify-content-between">
            <div className="info">
              <h6>Ticket # : {data.callNo} </h6>
            </div>
            {data.callerEmail === localStorage.getItem('email') && (
              <Button
                className="buttonPrimary text-center"
                onClick={() => {
                  buttonTracker(gaEvents.NAVIGATE_EDIT_TICKET);
                  navigate(`/ticket/edit/${id}`);
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/edit.svg'} alt="" className="pRight6" /> Edit
              </Button>
            )}
          </div>

          <div className="wrapperBase">
            <Form>
              <Form.Group className="mb-3 input-group ">
                <div className="input-container">
                  <Form.Label className="view-heading">Description</Form.Label>
                  <div className="text-align-justify" dangerouslySetInnerHTML={{ __html: data.description }} />
                </div>
              </Form.Group>
              <hr />
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Site Name</Form.Label>
                  <div> {data.site} </div>
                </div>
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Priority</Form.Label>
                  <div> {parseInt(data.priority, 10)} </div>
                </div>
              </Form.Group>
              <hr />
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Status</Form.Label>
                  <div> {data.status} </div>
                </div>
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Assigned To</Form.Label>
                  <div> {data.assignedTo} </div>
                </div>
              </Form.Group>
              <hr />
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Solution Provided</Form.Label>
                  <div> {data.solutionProvided} </div>
                </div>
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Created By</Form.Label>
                  <div> {data.createdBy} </div>
                </div>
              </Form.Group>
              <hr />
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Created Date</Form.Label>
                  <div> {data.createdDate} </div>
                </div>
                <div className="input-container col-6">
                  <Form.Label className="view-heading">Problem Code</Form.Label>
                  <div> {data.problem} </div>
                </div>
              </Form.Group>
              <hr />
            </Form>
            <div className="d-flex justify-content-md-start justify-content-sm-center justify-content-center editAction">
              <input
                className="buttonDefault text-center minHeight45"
                type="submit"
                onClick={() => {
                  buttonTracker(gaEvents.NAVIGATE_TICKETS_LIST);
                  navigate('/tickets');
                }}
                value="Back"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

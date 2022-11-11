import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import Loading from '../Widgets/Loading';
import Alerts from '../Widgets/Alerts';
import { useNavigate, useParams } from 'react-router-dom';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import moment from 'moment-timezone';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPriorityData, fetchProblemData, fetchSiteData, fetchSystemData, fetchTicketData, ticketsUpdate } from '../../Redux-Toolkit/ticketSlice/action';
import { setTickets } from '../../Redux-Toolkit/ticketSlice';

export default function AddTicket() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [Priority, setPriority] = useState([]);
  const [ProblemCode, setProblemCode] = useState([]);
  const [systemType, setSystemType] = useState([]);
  const [PostObject, setPostObject] = useState({
    assignedTo: '',
    customerId: '',
    site: '',
    createdBy: '',
    createdDate: '',
    phoneNumber: '',
    status: 'ACTIVE',
    requestType: 'NOC',
    problem: 'System Trouble',
    description: '',
    callerEmail: '',
    priority: '3 - Medium',
    solutionProvided: '',
    ticketNo: '',
    callNo: '',
    systemType: '',
  });
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [options, setOptions] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { id } = useParams();
  const [validated, setValidated] = useState(false);
  const [selectedValue, setSelectedValue] = useState('');
  const { buttonTracker } = useAnalyticsEventTracker();
  const [noApiError, setNoApiError] = useState(true);
  const [apiErrorMsg, setApiErrorMsg] = useState('');
  const dispatch = useDispatch();

  const { siteList, priorityList, problemList, systemList, dataList, apiStatus,error } = useSelector((state) => state.ticket);

  const getDate = () => {
    const format = 'YYYY-MM-DD HH:mm';
    const date = moment.utc(new Date()).tz('America/New_York').format(format);
    return date;
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchSiteData());
      dispatch(fetchPriorityData());
      dispatch(fetchProblemData());
      dispatch(fetchTicketData(id));
    } else {
      dispatch(fetchSiteData());
      dispatch(fetchPriorityData());
      dispatch(fetchProblemData());
      dispatch(fetchSystemData());
    }
  }, []);

  const fetchPromise = async () => {
    const optionArray = [];
    let resolvedArr = [];
    if (id) {
      resolvedArr = await Promise.all([siteList, priorityList, problemList, dataList]);
    } else {
      resolvedArr = await Promise.all([siteList, priorityList, problemList, systemList]);
    }
    resolvedArr.forEach((i) => {
      if (i[0] !== httpStatusCode.SUCCESS) {
        setNoApiError(false);
        setApiErrorMsg(i[1].message ?? 'There was a problem with our ticketing service. Please try again later');
        setShowAlert(true);
        setAlertVarient('danger');
        setAlertMessage(i[1].message ?? 'There was a problem with our ticketing service. Please try again later');
        setTimeout(() => {
          setShowAlert(false);
          navigate('/tickets');
        }, 5000);
      }
    });
    if (resolvedArr && resolvedArr.every((i) => i[0] === httpStatusCode.SUCCESS)) {
      setNoApiError(true);
      const { 0: Sitelist, 1: PriorityList, 2: ProblemCodeList, 3: fetchTicket } = resolvedArr;
      Sitelist[1]?.data.length > 0 &&
        Sitelist[1]?.data.forEach((i) => {
          optionArray.push({ value: i.siteNo, label: i.siteName });
        });
      setOptions([{ label: 'Search for Site Name', value: '' }, ...optionArray]);
      setPriority(PriorityList[1]?.data);
      setProblemCode(ProblemCodeList[1]?.data);
      if (!id) {
        const { 3: systemTypeList } = resolvedArr;
        setSystemType(systemTypeList[1]?.data);
        setPostObject((prev) => {
          const Current = { ...prev };
          Current.systemType = systemTypeList[1]?.data[0].q360Systemtype;
          return Current;
        });
      }
      setLoading(false);
      if (id) {
        setOptions(optionArray);
        setPostObject((prev) => {
          const Current = { ...prev };
          Current.requestType = fetchTicket[1]?.data[0].requestType;
          Current.description = fetchTicket[1]?.data[0].description;
          Current.phoneNumber = fetchTicket[1]?.data[0].phoneNumber;
          Current.priority = fetchTicket[1]?.data[0].priority;
          Current.status = fetchTicket[1]?.data[0].status;
          Current.callerEmail = fetchTicket[1]?.data[0].callerEmail;
          Current.solutionProvided = fetchTicket[1]?.data[0].solutionProvided;
          Current.problem = fetchTicket[1]?.data[0].problem;
          Current.ticketNo = fetchTicket[1]?.data[0].ticketNo;
          Current.createdBy = fetchTicket[1]?.data[0].createdBy;
          Current.createdDate = fetchTicket[1]?.data[0].createdDate;
          Current.assignedTo = fetchTicket[1]?.data[0].assignedTo;
          Current.callNo = fetchTicket[1]?.data[0].callNo;
          Current.systemType = fetchTicket[1]?.data[0].systemType;
          Current.site = Sitelist[1]?.data.filter((i) => i.siteName === fetchTicket[1]?.data[0].site)[0].siteNo;
          return Current;
        });
        setSelectedValue(Sitelist[1]?.data.filter((i) => i.siteName === fetchTicket[1]?.data[0].site)[0].siteNo);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Array.isArray(siteList) && Array.isArray(priorityList) && Array.isArray(problemList) && (Array.isArray(systemList) || Array.isArray(dataList))) {
      if (siteList && priorityList && problemList && (systemList || dataList)) {
        fetchPromise();
      }
    }
  }, [siteList, priorityList, problemList, systemList, dataList]);

  useEffect(() => {
    setPostObject((prev) => {
      const Current = { ...prev };
      Current.customerId = localStorage.getItem('orgNo');
      Current.createdBy = localStorage.getItem('firstName') + ' ' + localStorage.getItem('lastName');
      Current.callerEmail = localStorage.getItem('email');
      Current.phoneNumber = localStorage.getItem('mobile');
      return Current;
    });
    fetchPromise();
  }, []);

  const saveTicket = async () => {
    setSaveLoading(true);
    let ticketObject = { ...PostObject };
    if (id) {
      if (additionalDetails && additionalDetails.trim().length > 0) {
        ticketObject = {
          ...PostObject,
          ticketNo: id,
          description: `${PostObject.description} \n \n ${getDate()} \n \n ${additionalDetails}`,
        };
      } else {
        ticketObject = { ...PostObject, ticketNo: id };
      }
      delete ticketObject.assignedTo;
      delete ticketObject.solutionProvided;
      delete ticketObject.createdDate;
      buttonTracker(gaEvents.UPDATE_TICKET_DETAILS);
    } else {
      buttonTracker(gaEvents.CREATE_NEW_TICKET);
    }
    if (PostObject.description && PostObject.site && PostObject.callerEmail === localStorage.getItem('email') && noApiError) {
      dispatch(ticketsUpdate(ticketObject));

    } else if (PostObject.callerEmail !== localStorage.getItem('email')) {
      setShowAlert(true);
      setAlertVarient('danger');
      setAlertMessage('You are not Authorized');
      setSaveLoading(false);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/tickets');
      }, 5000);
    } else if (noApiError !== true) {
      setShowAlert(true);
      setAlertVarient('danger');
      setAlertMessage(apiErrorMsg);
      setSaveLoading(false);
      setTimeout(() => {
        setShowAlert(false);
        navigate('/tickets');
      }, 5000);
    } else {
      setValidated(true);
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setTickets());
        setSaveLoading(false);
        setShowAlert(true);
        setAlertVarient('success');
        setAlertMessage('ticket created successfully');
        setTimeout(() => {
          setShowAlert(false);
          navigate('/tickets');
        }, 5000);
      } else {
        setShowAlert(true);
        setAlertVarient('danger');
        setAlertMessage(error);
        setSaveLoading(false);
        setTimeout(() => {
          setShowAlert(false);
          navigate('/tickets');
        }, 5000);
      }
    }
  }, [apiStatus]);

  const handleChange = (e) => {
    setSelectedValue(e.target.value);
    setPostObject((prev) => {
      const Current = { ...prev };
      Current.site = e.target.value;
      return Current;
    });
  };

  return (
    <div className="wrapperBase">
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(false);
          }}
          alertshow={alertMessage}
        />
      )}
      {saveLoading && <Loading />}
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="titleHeader d-flex align-items-center justify-content-between">
            <div className="info">
              <h6>{id ? `Edit Ticket # : ${PostObject.callNo}` : 'Add Ticket'}</h6>
            </div>
          </div>

          <div className="wrapperBase">
            <Form noValidate validated={validated}>
              <Form.Group className="mb-3 input-group">
                <div className="input-container col">
                  <Form.Label>Description {!id && <span className="requiredTxt">*</span>}</Form.Label>
                  {!id && (
                    <Form.Control
                      as="textarea"
                      className="width-95"
                      placeholder="Describe the issue or request"
                      required
                      name="description"
                      onChange={(e) => {
                        setPostObject((prev) => {
                          const Current = { ...prev };
                          Current.description = e.target.value;
                          return Current;
                        });
                      }}
                      value={PostObject.description}
                    />
                  )}
                  {id && (
                    <Form.Control
                      as="textarea"
                      className="width-95"
                      placeholder="Describe the issue or request"
                      name="description"
                      value={PostObject.description}
                      disabled
                      readOnly
                    />
                  )}
                  <Form.Control.Feedback type="invalid">Description is required</Form.Control.Feedback>
                </div>
              </Form.Group>
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col">
                    <Form.Label>Additional Details</Form.Label>
                    <Form.Control
                      as="textarea"
                      className="width-95"
                      placeholder="Enter additional details"
                      name="additionalDetails"
                      onChange={(e) => setAdditionalDetails(e.target.value)}
                      value={additionalDetails}
                    />
                  </div>
                </Form.Group>
              )}
              <div className="mb-3 input-group">
                <Form.Group controlId="siteName" className="input-container col-6">
                  <Form.Label>
                    Site Name <span className="requiredTxt">*</span>
                  </Form.Label>
                  <Form.Select
                    className={!selectedValue ? 'text-gray width-90' : 'width-90'}
                    required
                    data-testid="siteName"
                    onChange={handleChange}
                    placeholder="Search for Site Name"
                    value={selectedValue}
                  >
                    {options.map((i) => (
                      <option className="text-black" key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">Site Name is required</Form.Control.Feedback>
                </Form.Group>
                {!id && (
                  <Form.Group controlId="priority" className="input-container col-6">
                    <Form.Label>Priority {!id && <span className="requiredTxt">*</span>}</Form.Label>
                    <Form.Select
                      className="width-90"
                      data-testid="priority"
                      onChange={(e) => {
                        setPostObject((prev) => {
                          const Current = { ...prev };
                          Current.priority = e.target.value;
                          return Current;
                        });
                      }}
                      value={PostObject.priority}
                      disabled={id}
                    >
                      {Priority.map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                )}
                {id && (
                  <Form.Group controlId="priority" className="input-container col-6">
                    <Form.Label>Priority</Form.Label>
                    <Form.Control
                      data-testid="priority"
                      placeholder="Priority"
                      type="text"
                      className="width-90"
                      value={PostObject.priority}
                      disabled
                    />
                  </Form.Group>
                )}
              </div>
              <Form.Group className="mb-3 input-group">
                <div className="input-container col-6">
                  <Form.Label>Problem Code {!id && <span className="requiredTxt">*</span>}</Form.Label>
                  <Form.Select
                    className="width-90"
                    data-testid="problemCode"
                    onChange={(e) => {
                      setPostObject((prev) => {
                        const Current = { ...prev };
                        Current.problem = e.target.value;
                        return Current;
                      });
                    }}
                    value={PostObject.problem}
                    disabled={id}
                  >
                    {ProblemCode.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </Form.Select>
                </div>
                {!id && (
                  <div className="input-container col-6">
                    <Form.Label>System Type {!id && <span className="requiredTxt">*</span>}</Form.Label>
                    <Form.Select
                      className="width-90"
                      data-testid="systemType"
                      onChange={(e) => {
                        setPostObject((prev) => {
                          const Current = { ...prev };
                          Current.systemType = e.target.value;
                          return Current;
                        });
                      }}
                      value={systemType.q360Systemtype}
                      disabled={id}
                    >
                      {systemType.map((value) => (
                        <option key={value.id} value={value.q360Systemtype}>
                          {value.mobAppSystemType}
                        </option>
                      ))}
                    </Form.Select>
                  </div>
                )}
                {id && (
                  <div className="input-container col-6">
                    <Form.Label>Created Date</Form.Label>
                    <Form.Control
                      placeholder="Created Date"
                      type="text"
                      className="width-90"
                      value={PostObject.createdDate}
                      disabled
                    />
                  </div>
                )}
              </Form.Group>
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col-6">
                    <Form.Label>Assigned To</Form.Label>
                    <Form.Control
                      placeholder="Assigned To"
                      type="text"
                      className="width-90"
                      value={PostObject.assignedTo}
                      disabled
                    />
                  </div>
                  <div className="input-container col-6">
                    <Form.Label>Solution Provided</Form.Label>
                    <Form.Control
                      placeholder="Solution Provided"
                      type="text"
                      className="width-90"
                      value={PostObject.solutionProvided}
                      disabled
                    />
                  </div>
                </Form.Group>
              )}
              {id && (
                <Form.Group className="mb-3 input-group">
                  <div className="input-container col-6">
                    <Form.Label>Created By</Form.Label>
                    <Form.Control
                      placeholder="Created By"
                      type="text"
                      className="width-90"
                      value={PostObject.createdBy}
                      disabled
                    />
                  </div>
                  <div className="input-container col-6">
                    <Form.Label>Status</Form.Label>
                    <Form.Control placeholder="Status" type="text" className="width-90" value={PostObject.status} disabled />
                  </div>
                </Form.Group>
              )}
            </Form>
            <div className="d-flex justify-content-md-start justify-content-sm-center justify-content-center editAction">
              <input
                className="buttonDefault text-center minHeight45"
                type="submit"
                onClick={() => {
                  buttonTracker(gaEvents.NAVIGATE_TICKETS_LIST);
                  navigate('/tickets');
                }}
                value="Cancel"
              />
              <Button
                className="buttonPrimary text-center"
                onClick={() => {
                  if (PostObject.description.trim().length > 0) {
                    saveTicket();
                  } else {
                    setPostObject((prev) => {
                      const Current = { ...prev };
                      Current.description = '';
                      return Current;
                    });
                    setValidated(true);
                  }
                }}
              >
                {id ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

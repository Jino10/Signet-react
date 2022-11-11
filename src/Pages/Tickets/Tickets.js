/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Loading from '../Widgets/Loading';
import './Tickets.css';
import { userRoleId } from '../../Utilities/AppUtilities';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { useDispatch, useSelector } from 'react-redux';
import { setTickets } from '../../Redux-Toolkit/ticketSlice';
import { userAllTickets } from '../../Redux-Toolkit/ticketSlice/action';

function Tickets() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUser] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState(false);
  const closeAlert = () => setShowAlert(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  const { loading, userTickets, apiStatus } = useSelector((state) => state.ticket);

  const fetchAllUserDetails = async () => {
    // setIsLoading(true);
    dispatch(userAllTickets());
  };

  useEffect(() => {
    if (apiStatus !== null) {
      if (apiStatus === httpStatusCode.SUCCESS) {
        dispatch(setTickets());
        setIsLoading(false);
        setUser(userTickets);
      } else {
        setShowAlert(true);
        setError(true);
        setAlertMessage('Failed to fetch tickets');
        setIsLoading(false);
        setTimeout(() => {
          setShowAlert(false);
        }, 5000);
      }
    }
  }, [apiStatus])

  const handleClick = (ticketId) => {
    buttonTracker(gaEvents.NAVIGATE_EDIT_TICKET);
    navigate(`/ticket/edit/${ticketId}`);
  };

  const actionBtn = (_row, cell, _rowIndex) => (
    <div className="actionBox d-flex align-items-center">
      {cell.callerEmail === localStorage.getItem('email') && (
        <Button variant="link" id={cell.ticketNo} onClick={() => handleClick(cell.ticketNo)}>
          <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/edit.svg'} id={cell.ticketNo} alt="Edit" />
        </Button>
      )}
    </div>
  );

  const ticketView = (_row, cell, _rowIndex) => (
    <div className="d-flex align-items-center">
      <Button
        variant="link"
        id={cell.ticketNo}
        onClick={() => {
          linkTracker(gaEvents.NAVIGATE_VIEW_TICKET);
          navigate(`/ticket/view/${cell.ticketNo}`);
        }}
      >
        {cell.callNo}
      </Button>
    </div>
  );

  const descriptionText = (_row, cell, _rowIndex) => <p className="truncate">{cell.description}</p>;

  const columns = [
    {
      dataField: 'ticketNo',
      text: 'Ticket#',
      formatter: ticketView,
    },
    {
      dataField: 'description',
      text: 'Description',
      formatter: descriptionText,
    },
    {
      dataField: 'priority',
      text: 'Priority',
    },
    {
      dataField: 'status',
      text: 'Status',
    },
    {
      dataField: 'assignedTo',
      text: 'Assignee',
    },
    {
      dataField: 'Action',
      text: 'Edit',
      formatter: actionBtn,
      id: 'edit',
    },
  ];

  useEffect(() => {
    if (localStorage.getItem('roleId') === userRoleId.signetAdmin) {
      navigate('/');
    } else {
      fetchAllUserDetails();
    }
  }, []);

  const emptyDataMessage = () =>
    !isLoading ? (
      <h6 className="text-center text-bold m-0 p-0">No records found</h6>
    ) : (
      <h6 className="text-center text-bold m-0 p-0">Loading ...</h6>
    );

  return (
    <div className="wrapperBase">
      <div className="tabelBase" data-test-id="usertable">
        {isLoading && <Loading />}
        {loading && <Loading />}
        <ToolkitProvider keyField="ticketNo" data={users} columns={columns}>
          {(props) => (
            <>
              <div className="titleHeader d-flex align-items-center justify-content-between">
                <div className="info">
                  <h6>Tickets</h6>
                </div>
                <div className="headerAction d-flex align-items-center">
                  <Button
                    className="buttonPrimary"
                    onClick={() => {
                      buttonTracker(gaEvents.NAVIGATE_ADD_TICKET);
                      navigate(`/ticket/add`);
                      dispatch(setTickets());
                    }}
                  >
                    <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/plus.svg'} alt="" /> Create Ticket
                  </Button>
                </div>
              </div>
              <div className="tableBaseBox ticketTable">
                <BootstrapTable
                  {...props.baseProps}
                  pagination={users?.length > 10 ? paginationFactory({ sizePerPage: 10 }) : null}
                  noDataIndication={emptyDataMessage}
                />
              </div>
            </>
          )}
        </ToolkitProvider>

        {showAlert && (
          <Alert variant={!error ? 'success' : 'danger'} className="alertWrapper" onClose={closeAlert} dismissible>
            <Alert.Heading>{alertMessage}</Alert.Heading>
          </Alert>
        )}
      </div>
    </div>
  );
}

export default Tickets;

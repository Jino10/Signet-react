import React, { useEffect, useState } from 'react';
import { Row, Col, ProgressBar, OverlayTrigger, Tooltip, Spinner, Modal } from 'react-bootstrap';
import './HealthCharts.css';
import DoughnutChart from '../../Charts/DoughnutChart';
import VerticalBarChart from '../../Charts/VerticalBarChart';
import HorizontalBarChart from '../../Charts/HorizontalBarChart';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { httpStatusCode } from '../../Constants/TextConstants';
import moment from 'moment';
import { userRoleId } from '../../Utilities/AppUtilities';
import NetworkHealth from '../NetworkHealth/NetworkHealth';
import { setTickets } from '../../Redux-Toolkit/ticketSlice';
import { dashboardData } from '../../Redux-Toolkit/ticketSlice/action';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function HealthCharts() {
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [q360Data, setq360Data] = useState({});
  const [systemCapacity, setSystemCapacity] = useState({});
  const [systemAvailability, setSystemAvailability] = useState({});
  const roledId = localStorage.getItem('roleId');
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [types, setTypes] = useState('');
  const [fetchData, setFetchData] = useState('');

  const { apiStatus, chartData } = useSelector((state) => state.ticket);

  useEffect(() => {
    if ((apiStatus !== null && Array.isArray(chartData)) || chartData !== []) {
      if (httpStatusCode.SUCCESS === apiStatus) {
        dispatch(setTickets());
        if (chartData.type === 'q360_data') {
          setq360Data(chartData);
        } else if (chartData.type === 'system_capacity') {
          setSystemCapacity(chartData);
        } else {
          setSystemAvailability(chartData);
        }
        setIsLoading(false);
      }
    }
  }, [apiStatus]);

  const fetchCharts = async () => {
    const keywords = ['q360_data', 'system_capacity', 'system_availability'];
    let customerName = localStorage.getItem('orgName') || '';
    const customerNumber = localStorage.getItem('orgNo') || '';
    const format = 'YYYY-MM-DD HH:mm:ss';
    const date = moment.utc(new Date()).format(format);
    setIsLoading(true);
    let i;
    i = 0;
    keywords.map(async (type) => {
      let url = '';
      if (type === 'q360_data') {
        url = `${APIUrlConstants.GET_CHARTS_BY_TICKETS}`;
      } else {
        url = `${APIUrlConstants.GET_CHARTS_BY_SYSTEM}`;
        customerName = localStorage.getItem('probe') || '';
      }
      dispatch(dashboardData({ url, customerName, customerNumber, type, date }));
      i += 1;
      if (i === keywords.length) {
        setTimeout(() => {
          setReload(!reload);
        }, 300000);
      }
    });
  };

  useEffect(() => {
    if (localStorage.getItem('roleId') === userRoleId.remoteSmartUser) {
      fetchCharts();
    }
  }, [reload]);

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <div className="p-2">
        <p>
          <b>{systemAvailability?.title}</b>
        </p>
        <hr />
        <div className="d-flex justify-content-between bg-lightred p-1">
          <span className="">Percent Downtime</span>
          <span className="">{systemAvailability?.system?.systemAvailabilityDTOs[0]?.percentageDown.toFixed(2)}%</span>
        </div>
        <div className="d-flex justify-content-between bg-lightgreen p-1 mt-2">
          <span className="">Percent Uptime</span>
          <span className="">{systemAvailability?.system?.systemAvailabilityDTOs[0]?.percentageUp.toFixed(2)}%</span>
        </div>
      </div>
    </Tooltip>
  );

  // const renderNoDataFound = () => (
  //   <div className="cardBody d-flex align-items-center justify-content-center w-100">
  //     <span>No data found</span>
  //   </div>
  // );

  const renderSpinner = () => (
    <div className="cardBody d-flex align-items-center justify-content-center w-100">
      <Spinner as="span" animation="border" size="xxl" />
    </div>
  );

  const renderChart = (type, data) => {
    if (
      type === 'ticketByPriority' &&
      data &&
      data?.ticket &&
      data?.ticket?.ticketPrioritys &&
      data?.ticket?.ticketPrioritys.length
    ) {
      return (
        <div className="cardBody">
          <VerticalBarChart data={data?.ticket?.ticketPrioritys} />
          <p className="chartXaxis">Priority</p>
        </div>
      );
    }
    if (type === 'ticketBySite' && data && data?.ticket && data?.ticket?.ticketSites && data?.ticket?.ticketSites.length) {
      return (
        <div className="cardBody mt-4">
          <DoughnutChart data={data?.ticket?.ticketSites} />
        </div>
      );
    }
    if (
      type === 'systemCapacity' &&
      data &&
      data?.system &&
      data?.system?.systemCapacityDTOs &&
      data?.system?.systemCapacityDTOs.length &&
      data?.system?.systemCapacityDTOs.filter((sys) => sys.capacity !== 0).length
    ) {
      return (
        <div className="cardBody">
          <HorizontalBarChart data={data} />
          <p className="chartXaxis">Average Usage</p>
        </div>
      );
    }
    if (
      type === 'systemCapacityCopy' &&
      data &&
      data?.system &&
      data?.system?.systemCapacityDTOs &&
      data?.system?.systemCapacityDTOs.length &&
      data?.system?.systemCapacityDTOs.filter((sys) => sys.capacity !== 0).length
    ) {
      return (
        <div className="cardBody w-100">
          <table className="border-none border-2 w-100 tablebase">
            <thead>
              <tr className="text-center">
                <th className="p-2">System Types</th>
                <th className="p-2">Average Usage</th>
              </tr>
            </thead>
            <tbody>
              {data?.system?.systemCapacityDTOs.map((sys) => (
                <tr key={sys.capacity}>
                  <td className="p-2 text-12"> {sys.key.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase())} </td>
                  <td className="p-2">
                    <ProgressBar className="progressWrap" now={sys.capacity.toFixed()} label={sys.capacity.toFixed() + '%'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    if (
      type === 'systemAvailability' &&
      data &&
      data?.system &&
      data?.system?.systemAvailabilityDTOs &&
      data?.system?.systemAvailabilityDTOs &&
      data?.system?.systemAvailabilityDTOs.length
    ) {
      return (
        <div className="d-flex align-items-center">
          <p className="wrapperProgressTitle">{data?.title}</p>
          <div className="wrapperProgress d-flex flex-column w-100">
            <div className="d-flex align-items-center justify-content-between">
              <span className="capicityInfo mb-1">
                <span className="badge bg-lightgreen text-lightgreen rounded-circle">.</span> Percent Uptime
              </span>
              <span className="capicityInfo mb-1">{data?.system?.systemAvailabilityDTOs[0]?.percentageUp.toFixed(2)}%</span>
              <span className="capicityInfo mb-1">
                <span className="badge bg-lightred text-lightred rounded-circle">.</span> Percent Downtime
              </span>
              <span className="capicityInfo mb-1">{data?.system?.systemAvailabilityDTOs[0]?.percentageDown.toFixed(2)}%</span>
            </div>
            <OverlayTrigger placement="top" delay={{ show: 0, hide: 0 }} overlay={renderTooltip}>
              <ProgressBar now={data.system.systemAvailabilityDTOs[0].percentageUp} />
            </OverlayTrigger>
            <div className="progressPercentage">
              <span>0.00%</span>
              <span>20.00%</span>
              <span>40.00%</span>
              <span>60.00%</span>
              <span>80.00%</span>
              <span>100.00%</span>
            </div>
            <div className="progressBottomTitle">
              <h6>Percentage of Uptime and Downtime</h6>
            </div>
          </div>
        </div>
      );
    }
    if (type === 'numberOfTickets' && data && data?.ticket && data?.ticket?.totalOpenTickets) {
      return (
        <div className="cardBody">
          <div className="text-center  d-flex align-items-center flex-column justify-content-center">
            <img className="ticketImg" src={process.env.REACT_APP_PUBLIC_URL + 'images/OpenTicketsGrey150.png'} alt="Ticket" />
            <span className="totalTxt">Open Tickets</span>
            <h3 className="totalCount">{data?.ticket?.totalOpenTickets}</h3>
          </div>
        </div>
      );
    }
    if (type === 'ticketsByStatus' && data && data?.ticket && data?.ticket?.numberOfTickets) {
      const totalOpenTickets = data?.ticket?.totalOpenTickets || 0;
      const totalClosedTickets = data?.ticket?.totalClosedTickets || 0;
      const totalInprocessTickets = data?.ticket?.totalInprocessTickets || 0;
      const numberOfTickets = data?.ticket?.numberOfTickets || 0;
      return (
        <div className="cardBody w-100">
          {totalOpenTickets > 0 && (
            <div className="chartBase w-100">
              <p className="text-12 progressTitle"> Open Tickets </p>
              <div className="p-2 progressBar">
                <ProgressBar
                  className="progressWrapTicket"
                  variant="success"
                  now={((totalOpenTickets / numberOfTickets) * 100).toFixed()}
                // label={((totalOpenTickets / numberOfTickets) * 100).toFixed() + '%'}
                />
              </div>
              <p className="text-12 progressValue"> {totalOpenTickets} </p>
            </div>
          )}
          {totalInprocessTickets > 0 && (
            <div className="chartBase w-100">
              <p className="text-12 progressTitle"> Inprocess Tickets </p>
              <div className="p-2 progressBar">
                <ProgressBar
                  className="progressWrapTicket"
                  variant="danger"
                  now={((totalInprocessTickets / numberOfTickets) * 100).toFixed()}
                // label={((totalInprocessTickets / numberOfTickets) * 100).toFixed() + '%'}
                />
              </div>
              <p className="text-12 progressValue"> {totalInprocessTickets} </p>
            </div>
          )}
          {totalClosedTickets > 0 && (
            <div className="chartBase w-100">
              <p className="text-12 progressTitle"> Closed Tickets </p>
              <div className="p-2 progressBar">
                <ProgressBar
                  className="progressWrapTicket"
                  variant="warning"
                  now={((totalClosedTickets / numberOfTickets) * 100).toFixed()}
                // label={((totalClosedTickets / numberOfTickets) * 100).toFixed() + '%'}
                />
              </div>
              <p className="text-12 progressValue"> {totalClosedTickets} </p>
            </div>
          )}
        </div>
      );
    }
    return renderSpinner();
  };

  const openModal = (value) => {
    setTypes(value);
    setShow(true);
    if (value === 'systemAvailability') {
      setFetchData(systemAvailability)
    } else if (value === 'systemCapacity' || value === 'systemCapacityCopy') {
      setFetchData(systemCapacity);
    } else {
      setFetchData(q360Data);
    }
  }

  return (
    <div>
      {roledId !== userRoleId.remoteSmartUser ? (
        <NetworkHealth />
      ) : (
        <div className="wrapperBase">
          <div className="wrapHeader mb-4">
            <div className="info">
              <h6>Dashboard</h6>
            </div>
          </div>
          <div>
            <Row>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex">
                    <h6>Tickets by Site</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/ticketBySite' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('ticketBySite', q360Data)} />
                    </div>
                  </div>
                  {isLoading ? renderSpinner() : renderChart('ticketBySite', q360Data)}
                </div>
              </Col>

              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper d-flex flex-column justify-content-between">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>Tickets by Priority</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/ticketByPriority' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('ticketByPriority', q360Data)} />
                    </div>
                  </div>
                  <div className="h-100 d-flex flex-column justify-content-center">
                    {isLoading ? renderSpinner() : renderChart('ticketByPriority', q360Data)}
                  </div>
                </div>
              </Col>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper heightAuto">
                  <div className="cardHeader d-flex align-items-center justify-content-between noBM">
                    <h6>Tickets by Status</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/ticketsByStatus' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('ticketsByStatus', q360Data)} />
                    </div>
                  </div>
                  {isLoading ? renderSpinner() : renderChart('ticketsByStatus', q360Data)}
                </div>
              </Col>
              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>System Availability</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/systemAvailability' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('systemAvailability', systemAvailability)} />
                    </div>
                  </div>
                  {isLoading ? renderSpinner() : renderChart('systemAvailability', systemAvailability)}
                </div>
              </Col>

              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper d-flex flex-column justify-content-between">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>System Capacity</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/systemCapacity' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('systemCapacity', systemCapacity)} />
                    </div>
                  </div>
                  <div className="h-100 d-flex flex-column justify-content-center">
                    {isLoading ? renderSpinner() : renderChart('systemCapacity', systemCapacity)}
                  </div>
                </div>
              </Col>

              <Col lg={6} md={12} sm={12} xs={12} className="mb-4">
                <div className="cardWrapper heightAuto">
                  <div className="cardHeader d-flex align-items-center justify-content-between">
                    <h6>System Capacity (Copy)</h6>
                    <div className='expandIcons'>
                      <Link to='/chartdata/systemCapacityCopy' target='_blank'><img src='/images/expand.svg' alt='' className='mx-3' /></Link>
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/dashboard/expand.svg'} alt="" onClick={() => openModal('systemCapacityCopy', systemCapacity)} />
                    </div>
                  </div>
                  {isLoading ? renderSpinner() : renderChart('systemCapacityCopy', systemCapacity)}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      )}
      <div>
        <Modal show={show} onHide={handleClose}
          size='md'
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton />
          <Modal.Body className='modalData'>
            {renderChart(types, fetchData)}
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DoughnutChart from '../../Charts/DoughnutChart';
import VerticalBarChart from '../../Charts/VerticalBarChart';
import HorizontalBarChart from '../../Charts/HorizontalBarChart';
import { ProgressBar, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap';
import APIUrlConstants from '../../Config/APIUrlConstants';
import moment from 'moment';
import { userRoleId } from '../../Utilities/AppUtilities';
import { dashboardData } from '../../Redux-Toolkit/ticketSlice/action';
import { httpStatusCode } from '../../Constants/TextConstants';
import { setTickets } from '../../Redux-Toolkit/ticketSlice';

import './chartdata.css';

function ChartData() {
    const { chartType } = useParams();

    const [reload, setReload] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [q360Data, setq360Data] = useState({});
    const [systemCapacity, setSystemCapacity] = useState({});
    const [systemAvailability, setSystemAvailability] = useState({});
    const roledId = localStorage.getItem('roleId');
    const dispatch = useDispatch();
    const [types, setTypes] = useState('');
    const [fetchData, setFetchData] = useState('');

    const { apiStatus, chartData } = useSelector((state) => state.ticket);

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
                }, 5000);
            }
        });
    };

    useEffect(() => {
        if (localStorage.getItem('roleId') === userRoleId.remoteSmartUser) {
            fetchCharts();
        }
    }, [reload]);

    useEffect(() => {
        if ((apiStatus !== null && Array.isArray(chartData)) || chartData !== []) {
            if (apiStatus === httpStatusCode.SUCCESS) {
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

    useEffect(() => {
        if (q360Data || systemAvailability || systemCapacity) {
            setTypes(chartType);
            if (chartType === 'systemAvailability') {
                setFetchData(systemAvailability);
            } else if (chartType === 'systemCapacity' || chartType === 'systemCapacityCopy') {
                setFetchData(systemCapacity);
            } else {
                setFetchData(q360Data);
            }
        }
    }, [q360Data, systemAvailability, systemCapacity]);

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

    const renderNoDataFound = () => (
        <div className="cardBody d-flex align-items-center justify-content-center w-100">
            <span>No data found</span>
        </div>
    );

    const renderSpinner = () => (
        <div className="cardBody d-flex align-items-center justify-content-center w-100">
            <Spinner as="span" animation="border" size="xxl" />
        </div>
    );

    const renderChart = (type, data) => {
        switch (true) {
            case (type === 'ticketByPriority'):
                return (
                    data &&
                    data?.ticket &&
                    data?.ticket?.ticketPrioritys &&
                    <div className="cardBody">
                        <VerticalBarChart data={data?.ticket?.ticketPrioritys} />
                        <p className="chartXaxis">Priority</p>
                    </div>
                );
            case (type === 'ticketBySite'):
                return (
                    data &&
                    data?.ticket &&
                    data?.ticket?.ticketSites &&
                    <div className="cardBody mt-4">
                        <DoughnutChart data={data?.ticket?.ticketSites} />
                    </div>
                );
            case (type === 'systemCapacity'):
                return (
                    data &&
                    data?.system &&
                    data?.system?.systemCapacityDTOs &&
                    <div className="cardBody">
                        <HorizontalBarChart data={data} />
                        <p className="chartXaxis">Average Usage</p>
                    </div>
                );
            case (type === 'systemCapacityCopy'):
                return (
                    data &&
                    data?.system &&
                    data?.system?.systemCapacityDTOs &&
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
            case (type === 'systemAvailability'):
                return (
                    data &&
                    data?.system &&
                    data?.system?.systemAvailabilityDTOs &&
                    data?.system?.systemAvailabilityDTOs.length &&
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
            case (type === 'numberOfTickets'):
                return (
                    data &&
                    data?.ticket &&
                    data?.ticket?.totalOpenTickets &&
                    <div className="cardBody">
                        <div className="text-center  d-flex align-items-center flex-column justify-content-center">
                            <img className="ticketImg" src={process.env.REACT_APP_PUBLIC_URL + 'images/OpenTicketsGrey150.png'} alt="Ticket" />
                            <span className="totalTxt">Open Tickets</span>
                            <h3 className="totalCount">{data?.ticket?.totalOpenTickets}</h3>
                        </div>
                    </div>
                );
            case (type === 'ticketsByStatus'):
                return (
                    data &&
                    data?.ticket &&
                    <div className="cardBody w-100">
                        {data?.ticket?.totalOpenTickets > 0 && (
                            <div className="chartBase w-100">
                                <p className="text-12 progressTitle"> Open Tickets </p>
                                <div className="p-2 progressBar">
                                    <ProgressBar
                                        className="progressWrapTicket"
                                        variant="success"
                                        now={((data.ticket.totalOpenTickets / data.ticket.numberOfTickets) * 100).toFixed()}
                                    // label={((totalOpenTickets / numberOfTickets) * 100).toFixed() + '%'}
                                    />
                                </div>
                                <p className="text-12 progressValue"> {data?.ticket?.totalOpenTickets} </p>
                            </div>
                        )}
                        {data?.ticket?.totalInprocessTickets > 0 && (
                            <div className="chartBase w-100">
                                <p className="text-12 progressTitle"> Inprocess Tickets </p>
                                <div className="p-2 progressBar">
                                    <ProgressBar
                                        className="progressWrapTicket"
                                        variant="danger"
                                        now={((data.ticket.totalInprocessTickets / data.ticket.numberOfTickets) * 100).toFixed()}
                                    // label={((totalInprocessTickets / numberOfTickets) * 100).toFixed() + '%'}
                                    />
                                </div>
                                <p className="text-12 progressValue"> {data?.ticket?.totalInprocessTickets} </p>
                            </div>
                        )}
                        {data?.ticket?.totalClosedTickets > 0 && (
                            <div className="chartBase w-100">
                                <p className="text-12 progressTitle"> Closed Tickets </p>
                                <div className="p-2 progressBar">
                                    <ProgressBar
                                        className="progressWrapTicket"
                                        variant="warning"
                                        now={((data.ticket.totalClosedTickets / data.ticket.numberOfTickets) * 100).toFixed()}
                                    // label={((totalClosedTickets / numberOfTickets) * 100).toFixed() + '%'}
                                    />
                                </div>
                                <p className="text-12 progressValue"> {data?.ticket?.totalClosedTickets} </p>
                            </div>
                        )}
                    </div>
                );
            default:
                return renderNoDataFound();
        }
    };

    return (
        <div className="wrapperGraph">
            {fetchData && (
                <div className="graphData">
                    <h3 className="typeData">{types}</h3>
                    <hr />
                    {isLoading ? renderSpinner() : renderChart(types, fetchData)}
                </div>
            )}
        </div>
    );
}

export default ChartData;

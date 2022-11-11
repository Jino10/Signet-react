import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import APIUrlConstants from '../../Config/APIUrlConstants';
import emailValidator from '../../EmailValidator';
import Alerts from '../Widgets/Alerts';
import Loading from '../Widgets/Loading';
import AsyncSelect from 'react-select/async';
import { useNavigate, useLocation } from 'react-router-dom';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, fetchOrg, fetchUserRole, userDetails } from '../../Redux-Toolkit/userSlice/action';
import { setDefault } from '../../Redux-Toolkit/userSlice';

function UserModal({ userId, successCallback }) {
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [showOrgEmail, setShowOrgMail] = useState(false);
  const [userOrgEmail, setOrgMail] = useState('');
  const [userOrg, setUserOrg] = useState('');
  const [userRole, setUserRole] = useState('');
  const [roleValidated, setRoleValidated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [orgNameAlert, setOrgNameAlert] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [orgNameSelected, setOrgNameSelected] = useState({ companyName: '', customerNo: '' });
  const [nameEmailWarn, setNameEmailWarn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const closeAlert = () => setShowAlert(false);
  const changeUserFirstName = (e) => setUserFirstName(e.target.value);
  const changeUserLastName = (e) => setUserLastName(e.target.value);
  const changeUserOrg = (e) => setUserOrg(e.target.value);
  const openCreateUserModal = () => {
    setShowCreateUserModal(true);
    buttonTracker(gaEvents.OPEN_CREATE_USER);
  };

  const dispatch = useDispatch();

  const { apiStatus, userFullData, roleStatus, roleDatas, userDetailStatus, orgData, newUserData, newApiStatus, errMsg } = useSelector((state) => state.user);

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 35,
      border: orgNameAlert && '1px solid red',
    }),
  };

  function userEmailValidator(email) {
    const orgEmail = emailValidator(email);
    setShowOrgMail(orgEmail);
  }

  const changeUserOrgEmail = (e) => {
    setOrgMail(e.target.value);
    userEmailValidator(e.target.value);
  };
  const changeUserRole = (e) => {
    if (e.target.value === '') {
      setRoleValidated(true);
      setUserRole(e.target.value);
    } else {
      setRoleValidated(false);
      setUserRole(e.target.value);
    }
  };

  const clearState = () => {
    setUserFirstName('');
    setUserLastName('');
    setUserOrg('');
    setShowOrgMail('');
    setOrgMail('');
    setRoleValidated(false);
    setUserRole('');
    setValidated(false);
    setSelectedValue('');
  };

  const closeCreateUserModal = () => {
    setShowCreateUserModal(false);
    clearState();
    navigate('/users');
  };

  const loadOptions = async (searchtext) => {
    if (searchtext.length >= 3) {
      dispatch(fetchOrg(searchtext));
      const statusCode = orgData[0];
      const responseData = orgData[1];
      if (httpStatusCode.SUCCESS === statusCode) {
        return responseData.data;
      }
      return responseData.data;
    }
    return null;
  };

  const fetchUserDetails = useCallback(async () => {
    dispatch(userDetails(userId));
  }, [userId]);

  useEffect(() => {
    if (userDetailStatus !== null && Array.isArray(userFullData) || userFullData !== []) {
      if (userDetailStatus === httpStatusCode.SUCCESS && userFullData.status !== 'Active') {
        dispatch(setDefault());
        setShowCreateUserModal(true);
        setUserLastName(userFullData.lastName);
        setUserFirstName(userFullData.firstName);
        setUserOrg(userFullData.organization);
        setOrgMail(userFullData.orgEmail);
      } else if (userDetailStatus === httpStatusCode.SUCCESS && userFullData.status === 'Active') {
        dispatch(setDefault());
        setShowAlert(true);
        setAlertMessage('User already active');
        setAlertVarient('danger');
        setIsLoading(false);
        setTimeout(() => {
          closeCreateUserModal();
          closeAlert();
          clearState();
        }, 5000);
      }
    }
  }, [userDetailStatus]);

  const fetchRoles = async () => {
    dispatch(fetchUserRole());
  };

  useEffect(() => {
    if (roleStatus !== null) {
      if (roleStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefault());
        setRoles(roleDatas);
      }
    }
  }, [roleStatus]);

  useEffect(() => {
    if (userId && location.pathname !== '/users') {
      fetchUserDetails();
    }
    fetchRoles();
  }, [fetchUserDetails, userId]);

  const createNewUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let user = {
      firstName: userFirstName,
      lastName: userLastName,
      orgName: selectedValue?.companyName,
      orgEmail: userOrgEmail,
      roleId: userRole,
      orgNo: selectedValue?.customerNo,
    };
    if (!selectedValue) {
      setOrgNameAlert(true);
    } else {
      setOrgNameAlert(false);
    }

    if (
      e.currentTarget.checkValidity() !== false &&
      selectedValue &&
      userRole.length > 0 &&
      userRole !== '' &&
      userOrgEmail.length > 0
    ) {
      e.stopPropagation();
      setValidated(true);
      let endPoint = `${APIUrlConstants.REGISTRATION}?isAdmin=true`;
      if (userId) {
        endPoint = `${APIUrlConstants.APPROVE_USER_WITH_MAIL}`;
        user = {
          userId,
          roleId: userRole,
          orgName: selectedValue.companyName,
          orgNo: selectedValue.customerNo,
        };
        buttonTracker(gaEvents.APPROVE_USER);
      } else {
        buttonTracker(gaEvents.CREATE_USER);
      }
      dispatch(createUser({ endPoint, user }));

    } else if (userRole.length === 0 || userRole === 'Select Role') {
      setRoleValidated(true);
      localStorage.removeItem('userId');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
    setValidated(true);
  };

  useEffect(() => {
    if (newApiStatus !== null) {
      if (newApiStatus === httpStatusCode.SUCCESS) {
        dispatch(setDefault());
        setShowAlert(true);
        setAlertMessage(newUserData.message);
        setAlertVarient('success');
        successCallback();
        localStorage.removeItem('userId');
        setIsLoading(false);
        closeCreateUserModal();
        setTimeout(() => {
          closeAlert();
          clearState();
        }, 5000);
      } else {
        setShowAlert(true);
        setAlertMessage(errMsg);
        setAlertVarient('danger');
        localStorage.removeItem('userId');
        setIsLoading(false);
        closeCreateUserModal();
        setTimeout(() => {
          closeAlert();
          clearState();
        }, 5000);
      }
    }
  }, [newApiStatus]);

  const handleClose = () => setShowWarning(false);

  const handleChangeOrgName = (value) => {
    if (userFirstName && userLastName && userOrgEmail) {
      setOrgNameSelected(value);
      setShowWarning(true);
    } else {
      setNameEmailWarn(true);
    }
  };

  return (
    <div className="wrapperBase">
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(true);
          }}
          alertshow={alertMessage}
        />
      )}
      <Modal size="md" dialogClassName="modalSize" show={showWarning} onHide={handleClose} centered>
        <Modal.Body className="p-4">
          Important: You are mapping {userOrgEmail?.split('@')[0] || 'user'}@
          <b>{userOrgEmail?.split('@')[1] || 'organization.com'}</b> to <b>{orgNameSelected.companyName || 'Organization'}</b>.
          This will allow {userFirstName || 'User'} {userLastName || ''} access to information related to{' '}
          <b>{orgNameSelected.companyName || 'Organization'}</b>. Are you sure that this is correct ?
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            className="blueBtn"
            onClick={() => {
              setSelectedValue(orgNameSelected);
              setOrgNameAlert(false);
              handleClose();
            }}
          >
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal size="sm" show={nameEmailWarn} onHide={() => setNameEmailWarn(false)} centered>
        <Modal.Body className="p-2">
          <p className="errorColor text-center">Enter Name and Email before selecting Organization</p>
          <div className="d-flex align-items-center justify-content-center">
            <Button variant="primary" className="blueBtn" onClick={() => setNameEmailWarn(false)}>
              Ok
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <Button className="buttonPrimary" onClick={openCreateUserModal} data-testid="userModal">
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/plus.svg'} alt="" /> Create User
      </Button>
      {isLoading && <Loading />}
      <Modal className="userModal" centered show={showCreateUserModal} onHide={closeCreateUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>{location.pathname === '/users' ? 'Create User' : 'Approve User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={createNewUser} data-testid="CNform">
            <Form.Group className="mb-3 input-group">
              <div className="input-container col-6">
                <Form.Label>
                  First Name <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  data-testid="FName"
                  autoFocus
                  value={userFirstName}
                  required
                  name="firstName"
                  onChange={changeUserFirstName}
                />
                <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
              </div>
              <div className="input-container col-6">
                <Form.Label>
                  Last Name <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  data-testid="LName"
                  type="text"
                  placeholder="Last Name"
                  autoFocus
                  value={userLastName}
                  required
                  onChange={changeUserLastName}
                />
                <Form.Control.Feedback type="invalid">Last Name is required</Form.Control.Feedback>
              </div>
            </Form.Group>
            <Form.Group className="mb-3 input-group input-container  bit-1">
              <Form.Label>
                Organization Email <span className="requiredTxt">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Organization Email"
                autoFocus
                value={userOrgEmail}
                required
                onChange={changeUserOrgEmail}
                isInvalid={showOrgEmail}
              />
              <Form.Control.Feedback type="invalid">Organization Email is required</Form.Control.Feedback>
            </Form.Group>
            {location.pathname !== '/users' && (
              <Form.Group className="mb-3 input-group input-container  bit-1">
                <Form.Label>
                  User&apos;s Organization <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  data-testid="userOrg"
                  placeholder="Organization"
                  autoFocus
                  value={userOrg}
                  required
                  onChange={changeUserOrg}
                />
                <Form.Control.Feedback type="invalid">Organization Name is required</Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3 input-group input-container bit-1 zIndex-99">
              <Form.Label>
                Organization <span className="requiredTxt">*</span>
              </Form.Label>
              <AsyncSelect
                value={selectedValue}
                getOptionLabel={(e) => e.companyName}
                getOptionValue={(e) => e.customerNo}
                loadOptions={loadOptions}
                onChange={handleChangeOrgName}
                placeholder="Search for Organization Name"
                styles={customStyles}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
              {orgNameAlert && (
                <Alert key="danger" className="dangerAlert errorColor">
                  Organization Name is required
                </Alert>
              )}
            </Form.Group>
            <Form.Group className="mb-3 input-group input-container bit-1">
              <Form.Label>
                Role <span className="requiredTxt">*</span>
              </Form.Label>
              <Form.Select value={userRole} onChange={changeUserRole} required isInvalid={roleValidated} data-testid="userRole">
                <option value="">Select Role</option>
                {roles?.length > 0 &&
                  roles?.map((roleData) => (
                    <option value={roleData.roleId} key={roleData.roleId}>
                      {roleData?.name}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Role is required</Form.Control.Feedback>
            </Form.Group>
            <Button className="saveBtn" type="submit">
              {location.pathname === '/users' ? 'Create' : 'Approve'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
}

export default UserModal;

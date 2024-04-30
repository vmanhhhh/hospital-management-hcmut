import { mdiAlertCircle, mdiCheckCircle, mdiEye, mdiTrashCan } from '@mdi/js'
import Snackbar from '@mui/material/Snackbar';
import React, { useState, useEffect } from 'react'
import { Patient } from '../../interfaces'
import Button from '../Button'
import Buttons from '../Buttons'
import CardBoxModal from '../CardBox/Modal'
import axios from 'axios'
import { Formik, Form, Field } from 'formik'
import FormField from '../Form/Field'
import DepartmentSelect from '../Form/DepartmentSelect'
import LocationSelect from '../Form/LocationSelect'
import { SERVER_URI } from '../../config'
import { mdiAccount, mdiGithub, mdiMail, mdiUpload } from '@mdi/js'
import CardBox from '../../components/CardBox'
import Divider from '../../components/Divider'
import NotificationBar from '../../components/NotificationBar'
import { useFormikContext } from 'formik'
const TableSamplePatients = () => {
  const [patients, setPatients] = useState([]);
  const [data, setData] = useState([]);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/patients`);

      setPatients(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchData = async () => {
    const result = await axios.get("https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json");
    setData(result.data);
  };
  useEffect(() => {
    fetchPatients();
    fetchData();
  }, []);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const addNotification = (message, type = 'success') => {
    setNotifications(prevNotifications => [
      ...prevNotifications,
      {
        id: Date.now(), // unique id for key
        message,
        type
      }
    ]);
  };
  const perPage = 5

  const [currentPage, setCurrentPage] = useState(0)

  const patientsPaginated = patients.slice(perPage * currentPage, perPage * (currentPage + 1))

  const numPages = patients.length / perPage

  const pagesList = []

  for (let i = 0; i < numPages; i++) {
    pagesList.push(i)
  }

  const [isModalTrashActive, setIsModalTrashActive] = useState(false)
  const [patientTemp, setPatient] = useState(null)
  const handleModalAction = () => {
    setIsModalTrashActive(false)
  }
  const handleDeleteModalAction = async () => {
    try {
      await axios.delete(`${SERVER_URI}/patients/${patientTemp._id}`)
      window.location.reload()
      console.log('Deleted')
    } catch (error) {
      console.log(error)
    }
  }


  const handleEditModalAction = async () => {
    try {
      await axios.post(`${SERVER_URI}/patients/${patientTemp._id}`, patientTemp)
      console.log(patientTemp)
      setIsSubmitted(true);
      fetchPatients();
      addNotification('Cập nhật bác sĩ thành công!');
    } catch (error) {
      console.log(error)
      addNotification('Tìm kiếm bác sĩ thất bại!', 'error');
    }
  }
  {
    notifications.map(notification => (
      <NotificationBar
        key={notification.id}
        color={notification.type === 'error' ? 'danger' : 'success'}
        icon={notification.type === 'error' ? mdiAlertCircle : mdiCheckCircle}
        autoDismiss={true}
      >
        {notification.message}
      </NotificationBar>
    ))
  }

  return (
    <>

      <CardBoxModal
        title="Xóa bác sĩ"
        buttonColor="danger"
        buttonLabel="Xóa"
        style={{}}
        isActive={isModalTrashActive}
        onConfirm={handleDeleteModalAction}
        onCancel={handleModalAction}
      >
        <p>
          Bạn có muốn xóa bác sĩ này không?
        </p>
        <p>Chọn "Xác nhận" nếu có</p>
      </CardBoxModal>

      <table>
        <thead>
          <tr>
            <th>Họ</th>
            <th>Tên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Tỉnh/thành</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {patientsPaginated.map((patient: Patient) => (
            <tr key={patient._id}>
              <td data-label="Last Name">{patient.lastName}</td>
              <td data-label="First Name">{patient.firstName}</td>
              <td data-label="Gender">{patient.gender === 'male' ? 'Nam' : (patient.gender === 'female' ? 'Nữ' : 'Khác')}</td>
              <td data-label="Date of Birth">{new Date(patient.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
              <td data-label="Province">{(data.find(province => province.Id === patient.address.province) || {}).Name}</td>
              <td className="before:hidden lg:w-1 whitespace-nowrap">
                <Buttons type="justify-start lg:justify-end" noWrap>
                  <Button
                    color="info"
                    icon={mdiEye}
                    onClick={() => {
                      setPatient(patient)
                      window.open(`/patients/${patient._id}`, '_blank')
                    }}
                    small
                  />
                  <Button
                    color="danger"
                    icon={mdiTrashCan}
                    onClick={() => {
                      setPatient(patient)
                      setIsModalTrashActive(true)
                    }}
                    small
                  />
                </Buttons>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between py-3 md:py-0">
          <Buttons>
            {pagesList.map((page) => (
              <Button
                key={page}
                active={page === currentPage}
                label={page + 1}
                color={page === currentPage ? 'lightDark' : 'whiteDark'}
                small
                onClick={() => setCurrentPage(page)}
              />
            ))}
          </Buttons>
          <small className="mt-6 md:mt-0">
            Page {currentPage + 1} of {numPages}
          </small>
        </div>
      </div>
    </>
  )
}

export default TableSamplePatients

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"

import cityList from '../../cityList'
import doctorsList from '../../doctorsList'
import doctorSpecialtyList from '../../doctorSpecialtyList'

const Form = () => {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdayDate, setBirthdayDate] = useState("")
  const [userAge, setUserAge] = useState('')
  const [cityId, setCityId] = useState('')
  const [sex, setSex] = useState('')
  const [doctorId, setDoctorId] = useState('')
  const [doctorSpecialtyId, setDoctorSpecialtyId] = useState('')
  const [filteredDoctorsList, setFilteredDoctorsList] = useState(doctorsList)
  const [filteredDoctorSpecialtyList, setFilteredDoctorSpecialtyList] = useState(doctorSpecialtyList)

  const schema = yup
  .object({
    name: yup.string().matches(/^[A-Za-z]+$/i, { message: 'Invalid format'}).required('Required'),
    birthdayDate: yup.string().required('Required'),
    sex: yup.string().required('Required'),
    city: yup.string().required('Required'),
    doctorSpecialty: yup.string(),
    doctor: yup.string().required('Required'),
    email: phone ? yup.string().email('Invalid Email') : yup.string().email('Invalid Email').required('Email or Mobile Number is Required'),
    mobileNumber: email ? yup.string() : yup.string().matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/, { message: 'Invalid format'}).required('Email or Mobile Number is Required')})


  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const getAge = (birthdayDate) => {
    const birthdate =  new Date(birthdayDate)
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear() - (today.getMonth() < birthdate.getMonth() || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
  setUserAge(age);
  }
  
  useEffect(() => {
      if (doctorId) {
        const doctorData = doctorsList.find(doctor => doctor.id === doctorId)
        setCityId(doctorData.cityId)
        setDoctorSpecialtyId(doctorData.specialityId)
    }
  }, [doctorId])

  useEffect(() => {
    if (cityId) {
      setFilteredDoctorsList(doctorsList.filter(doctor => doctor.cityId === cityId))
    }
  }, [cityId])

  useEffect(() => {
    if (doctorSpecialtyId) {
      setFilteredDoctorsList(doctorsList.filter(doctor => doctor.specialityId === doctorSpecialtyId))
    }
  }, [doctorSpecialtyId])
  
  useEffect(() => {
    getAge(birthdayDate)
  }, [birthdayDate])
  
  
  useEffect(() => {
    if (sex) { 
      setFilteredDoctorSpecialtyList(doctorSpecialtyList.filter(doctorSpecialty => doctorSpecialty.params?.gender === sex || !doctorSpecialty.params) )
    }
  }, [sex])
  
  useEffect(() => {
    if (userAge && userAge < 16) {
      setFilteredDoctorsList(doctorsList.filter(doctor => doctor.isPediatrician))
    }
  }, [userAge])
  
  const onSubmit = (formData) => console.log(formData)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name
        <input {...register("name")} />
      <p>{errors.name?.message}</p>
      </label>
      <label>
        Birthday Date
        <input type="date" value={birthdayDate} {...register("birthdayDate")} onChange={(e) => {
          setBirthdayDate(e.target.value);
      }}/>
      <p>{errors.birthdayDate?.message}</p>
      </label>
      <label>
        Sex
        <select {...register("sex")} onChange={(e) => {
          setSex(e.target.value);
      }}>
            <option value="" disabled selected>Select Sex</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
      </select>
      <p>{errors.sex?.message}</p>
      </label>
      <label>
        City
        <select value={cityId} {...register("city")} onChange={(e) => {
          setCityId(e.target.value);
        }}>
          <option value="" disabled selected>Select City</option>
          {cityList.map(city => <option key={city.id} value={city.id}>{city.name}</option>) }
      </select>
      <p>{errors.city?.message}</p>
      </label>
      <label>
        Doctor
        <select value={doctorId} {...register("doctor")} onChange={(e) => {
          setDoctorId(e.target.value);
        }}>
          <option value="" disabled selected>Select Doctor</option>
          {filteredDoctorsList.map(doctor => <option key={doctor.id} value={doctor.id}>{doctor.name + ' ' + doctor.surname}</option>) }
      </select>
      <p>{errors.doctor?.message}</p>
      </label>
      <label>
        Doctor Specialty
        <select value={doctorSpecialtyId} {...register("doctorSpecialty")} onChange={(e) => {
          setDoctorSpecialtyId(e.target.value);
        }}>
          <option value="" disabled selected>Select Doctor Specialty</option>
          {filteredDoctorSpecialtyList.map(doctorSpecialty => <option key={doctorSpecialty.id} value={doctorSpecialty.id}>{doctorSpecialty.name}</option>) }
      </select>
      <p>{errors.doctorSpecialty?.message}</p>
      </label>
      <label>
        Email
      <input {...register("email")} onChange={(e) => {
          setEmail(e.target.value);
      }}/>
      <p>{errors.email?.message}</p>
      </label>
      <label>
        Mobile Number
      <input {...register("mobileNumber")} onChange={(e) => {
          setPhone(e.target.value);
      }}/>
      <p>{errors.mobileNumber?.message}</p>
      </label>
      <button type="submit">Send</button>
    </form>
  )
}

export default Form
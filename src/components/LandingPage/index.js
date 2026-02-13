import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { CiSearch } from "react-icons/ci";

import "./index.css"
import JobsInfoCard from '../JobsInfoCard';
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DefaultSkill from '../DefaultSkill';
import ProfileCustomHook from '../ProfileCustomHook';

const skillSet = [
    {
        id:1,
        skillName:"HTML"
    },
    {
        id:2,
        skillName:"CSS"
    },
    {
        id:3,
        skillName:"Javascript"
    },
    {
        id:4,
        skillName:"ReactJs"
    },
    {
        id:5,
        skillName:"NodeJs"
    },
    {
        id:6,
        skillName:"MongoDB"
    },
]

const LandingPage =  () => {
    const [defaultSkills,setDefaultSkill] = useState([{id:1,skillName:'HTML'},{id:2,skillName:'CSS'},{id:3,skillName:'Javascript'}])
    const [selectedSkills,setSelectedSkills] = useState([skillSet[0].skillName])
    const [sampleJobsListInfo,setSampleJobsListInfo] = useState([])
    const [deleteJobFormList,setDeleteJob] = useState(true)
    const [searchInput,setSearchInput] = useState('')

    const jwtToken = Cookies.get('jwtToken')

    const changeInInput = event => {
        setSearchInput(event.target.value)
    }
    
    const userProfile = ProfileCustomHook()

    useEffect(()=>{
        const getJobsList = async() => {
            if(deleteJobFormList){
                setDeleteJob(false)
            const response = await axios.get('https://jobs-find-platform-backend.onrender.com/api/jobs')
            console.log("Response:",response.data)
            setSampleJobsListInfo(response.data)
        }
    }
      getJobsList()  
    },[deleteJobFormList])

    const deleteJob = async(id) => {
    // console.log("delete Id:",id)
    const response = await axios.delete(`https://jobs-find-platform-backend.onrender.com/api/jobs/${id}`)
    
      if(response.data.success){
        toast.success("Delete Job Successfully")
        setDeleteJob(true)
      }
      else{
        toast.error(response.data.message)
      }
  }

  const deleteDefaultSkill = (id)=>{
    const filterDeleteSkills = defaultSkills.filter(skill=>skill.id !== id)
    setDefaultSkill(filterDeleteSkills)
  }

    const onChangeDefaultSkill = event => {
        const selectedValue =event.target.value
        setSearchInput(selectedValue)
    }
    const filterJobs = sampleJobsListInfo.filter(skill => 
        skill.companyName.toLowerCase().includes(searchInput.toLowerCase()) || 
        skill.jobPosition.toLowerCase().includes(searchInput.toLowerCase()) ||
        skill.jobType.toLowerCase().includes(searchInput.toLowerCase()) ||
        skill.location.toLowerCase().includes(searchInput.toLowerCase())||
        skill.remoteOrOffice.toLowerCase().includes(searchInput.toLowerCase())||
        skill.selectedSkills.toLowerCase().includes(searchInput.toLowerCase())
    )
    
    const clickOnClear = () => {   
        setSearchInput("")
    }

    const clickOnSelectedSkill = (skill) => {
        setSearchInput(skill)
    }

    //console.log("sampleJobsListInfo:",sampleJobsListInfo)

  return (
    <div>
        <Header userProfile={userProfile}/>
        <div className='main_landing_page_container'>
        <div className='search_jobs_main_container'>
            <div className='search_container'>
            <div className='search_inside_container'>
                <CiSearch className='search_icon'/>
                <input type='search' value={searchInput} placeholder='Type any job title' onChange={changeInInput} className='input_search'/>
            </div>
            <div className='select_skills_filter_cancel_button_container'>
            <select onChange={onChangeDefaultSkill} className='select_skills_container'>
                {skillSet.map(eachSkill => (
                    <option key={eachSkill.id}>{eachSkill.skillName}</option>
                ))}
            </select>
            <ul className='default_skill_set_list'>
                {defaultSkills.map((skill) => (
                    <DefaultSkill skillInfo={skill} key={skill.id} deleteDefaultSkill={deleteDefaultSkill} clickOnSelectedSkill={clickOnSelectedSkill}/>
                ))}
            </ul>
            <div className="apply_filter_cancel_buttons_container">
            {jwtToken===undefined || userProfile.role ==="user" ?
                <>
                    <button type='button' className='apply_filer_button'>Apply Filter</button>
                    <button type='button' className='clear_filter_button' onClick={clickOnClear}>Clear</button>
                </>
                :
                <>
                    {userProfile.role==="admin" && 
                <>
                <Link to="/addJob">
                    <button type='button' className='apply_filer_button'>+Add Job</button>
                </Link>
                    <button type='button' className='clear_filter_button' onClick={clickOnClear}>Clear</button>
                </>
                    }
                </>
                   
            }
                </div>
              </div>
            </div>
        </div>
        {filterJobs.length > 0 ? 
        <ul className='job_info_card_container'>
            {filterJobs.map(eachJob => (
                <JobsInfoCard jobInfoDetails={eachJob} key={eachJob.id} userProfile={userProfile} deleteJob={deleteJob}/>
            ))}
        </ul>
        :
            <div className='no_jobs_container'>
                <h3>No Jobs</h3>
            </div>
        }
        </div>
    </div>
  )
}

export default LandingPage

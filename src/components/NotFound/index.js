import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../Header'
import ProfileCustomHook from '../ProfileCustomHook'

import "./index.css"

const NotFound = () =>  {
    const userProfile = ProfileCustomHook();
    return(
    <>
    <Header userProfile={userProfile}/>
    <div className='not_found_container'>
        <img src='https://res.cloudinary.com/dksgsqhdk/image/upload/v1743151479/not-found-blog-img_eefok5.png' alt='Not Found' className='not_found_image'/> 
        <h4>Page Not Found.Please click here to dashboard.</h4>
        <Link to="/">
            <button type='button' className='dashboard_button'>Dashboard</button>
        </Link>
    </div>
    </>
  )
}

export default NotFound
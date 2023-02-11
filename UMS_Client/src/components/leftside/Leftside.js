import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftSingle from './LeftSingle';
import '../../assets/css/Leftside.css'
import React, { Component }  from 'react';

const sidebarNavItems = [
    {
        display: 'Homepage',
        icon: <i className='bx bx-home'></i>,
        to: '/',
        section: ''
    },
    {
        display: 'Profile',
        icon: <i class='bx bxs-user-circle'></i>,
        to: '/profile',
        section: 'profile'
    },
    {
        display: 'Registration',
        icon: <i class='bx bxs-registered' ></i>,
        to: '/registration',
        section: 'registration'
    },
    {
        display: 'View Grades',
        icon: <i class='bx bx-book' ></i>,
        to: '/grades',
        section: 'View Grades'
    },
    {
        display: 'Apply for Scholarship',
        icon: <i class='bx bxs-graduation' ></i>,
        to: '/scholarship',
        section: 'Apply for Scholarship'
    },
    {
        display: 'Dues Status',
        icon: <i class='bx bx-wallet' ></i>,
        to: '/dues',
        section: 'Apply for Scholarship'
    },
    {
        display: 'Feedback',
        icon: <i class='bx bx-bookmark-alt' ></i>,
        to: '/upload_feedback',
        section: 'Feedback'
    },
    {
        display: 'Library',
        icon: <i class='bx bx-library' ></i>,
        to: '/library_student_home',
        section: 'Library'
    },
    {
        display: 'My Advisor',
        icon: <i class='bx bxs-user-voice' ></i>,
        to: '/advisor',
        section: 'Advisor'
    },
    {
        display: 'Medical Center',
        icon: <i class='bx bx-color' ></i>,
        to: '/medical_student_home',
        section: 'Medical Center'
    },
    {
        display: 'Logout',
        icon: <i class='bx bx-exit' ></i>,
        to: '/logout',
        section: 'Logout'
    },
]

const LeftSide = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [stepHeight, setStepHeight] = useState(0);
    const sidebarRef = useRef();
    const indicatorRef = useRef();
    const location = useLocation();

    useEffect(() => {
        setTimeout(() => {
            const sidebarItem = sidebarRef.current.querySelector('.sidebar__menu__item');
            indicatorRef.current.style.height = `${sidebarItem.clientHeight}px`;
            setStepHeight(sidebarItem.clientHeight);
        }, 50);
    }, []);

    //change active index
    useEffect(() => {
        const curPath = window.location.pathname.split('/')[1];
        const activeItem = sidebarNavItems.findIndex(item => item.section === curPath);
        setActiveIndex(curPath.length === 0 ? 0 : activeItem);
    }, [location]);

    return <div className='sidebar'>
        <div className="sidebar__logo">
            UMS
        </div>
        <div ref={sidebarRef} className="sidebar__menu">
            <div
                ref={indicatorRef}
                className="sidebar__menu__indicator"
                style={{
                    transform: `translateX(-50%) translateY(${activeIndex * stepHeight}px)`
                }}
            ></div>
            {
                sidebarNavItems.map((item, index) => (
                    <LeftSingle index={index} activeIndex={activeIndex} item={item} />
                ))
            }
        </div>
    </div>;
};

export default LeftSide;
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LeftSingle from './LeftSingle';
import '../../assets/css/Leftside.css'
import React, { Component }  from 'react';

const sidebarNavItems = [
    {
        display: 'Homepage',
        icon: <i className='bx bx-home'></i>,
        to: '/medical_admin_home',
        section: 'Homepage'
    },
    {
        display: 'Add Doctor',
        icon: <i class='bx bxs-user-circle'></i>,
        to: '/medical_add_doctor',
        section: 'Add Doctor'
    },
    {
        display: 'Schedule',
        icon: <i class='bx bxs-registered' ></i>,
        to: '/medical_admin_show_schedule',
        section: 'Doctors` Schedule'
    },
    ,
    {
        display: 'Appointment Requests',
        icon: <i class='bx bx-color' ></i>,
        to: '/medical_app_request',
        section: 'Appointment Requests'
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
import React from 'react'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import '../../assets/css/SideBar.css'
import { useNavigate, useLocation } from "react-router-dom";
import {CgHomeAlt} from "react-icons/cg";
import {CgProfile} from "react-icons/cg";
import {MdAppRegistration} from "react-icons/md";
import {CgList} from "react-icons/cg";
import {CgLogOut} from "react-icons/cg";
import {GrMoney} from "react-icons/gr";
import {TbSchool} from "react-icons/tb";
import {MdOutlineFeedback} from "react-icons/md";
import {MdOutlineMedicalServices} from "react-icons/md";
import {IoLibraryOutline} from "react-icons/io5";
import SidebarLibraryAdmin from './SidebarLibraryAdmin';


const SidebarAdmin= () => { 
  const navigate = useNavigate();
    const location = useLocation();
  return (
    <div className='sidebar'>
      {/* div with className title */}
      <div className='title'>
        <h1>UMS</h1>
        <div className='whoosePortal'>
          <h4>Admin</h4>
        </div>
      
      </div>
      <hr />
      <div className='navigationUpper'>
      <Navigation
            activeItemId={location.pathname}
            onSelect={({ itemId }) => {
              // go to that location
              navigate(itemId);
            }}
            items={[
              {
                title: "Add Student",
                itemId: "/admin/add_student",
                elemBefore: () => <CgHomeAlt />,
                
              },
              // {
              //   title: "Upload Result",
              //   itemId: "/teacher/upload_result",
              //   activeColor: '#0069d9',
              //   elemBefore: () => <CgProfile/>,
                
              // },
              
            ]}
            />
      </div>
      
      <hr />
      <div className='navigationBottom'>
      <Navigation
            activeItemId={location.pathname}
            onSelect={({ itemId }) => {
              // go to that location
              navigate(itemId);
            }}
            items={[
              {
                  title: "Logout",
                  itemId: "/logout",
                  // Optional
                  elemBefore: () => <CgLogOut />,
                  
              },
            ]}
          />
        </div>
      </div>
  )
}



export default SidebarAdmin;
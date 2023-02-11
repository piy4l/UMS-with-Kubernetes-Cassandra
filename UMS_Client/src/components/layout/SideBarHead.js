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


const SidebarHead= () => { 
  const navigate = useNavigate();
    const location = useLocation();
  return (
    <div className='sidebar'>
      {/* div with className title */}
      <div className='title'>
        <h1>UMS</h1>
        <div className='whoosePortal'>
          <h4>Head</h4>
        </div>
      
      </div>
      <hr />
      <div className='navigationUpper'>
      <Navigation
            activeItemId={location.pathname}
            onSelect={({ itemId }) => {
              // go to that location
              if(itemId != undefined) navigate(itemId);
            }}
            items={[
              {
                title: "Add new course",
                itemId: "/head/addcourse",
                elemBefore: () => <CgHomeAlt />,
                
              },
              {
                title: "Course List",
                itemId: "/head/courselist",
                activeColor: '#0069d9',
                elemBefore: () => <CgProfile/>,
                
              },
              {
                title: "Offer Course",
                itemId: "/head/offercourse",
                elemBefore: () => <MdAppRegistration/>,
                
              },
              {
                  title: "Offer Course List",
                  itemId: "/head/showofferlist",
                  // Optional
                  elemBefore: () => <CgList />,
                  
              },
              {
                  title: "Feedback",
                  itemId: "/head/show_feedbacks",
                  // Optional
                  elemBefore: () => <GrMoney />,
                  
              },
              {
                title: "Scholarship",
                //itemId: "/student/card?student_id=" + loggedInName,
                elemBefore: () => <GrMoney />,
                // Optional
                subNav: [
                  {
                    title: "Scholarship List",
                    itemId: "/head/scholarship_list",
                    elemBefore: () => <CgList />,
                  },
                  {
                      title: "Applied Scholarship List",
                      itemId: "/head/applied_scholarship_list",
                      elemBefore: () => <CgList />,
                  },
                  {
                      title: "Pending Scholarship List",
                      itemId: "/head/pending_scholarship_list",
                      elemBefore: () => <CgList />,
                  }
                ]   
              }
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



export default SidebarHead
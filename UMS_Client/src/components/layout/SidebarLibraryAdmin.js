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


const SidebarLibraryAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <div className='sidebar'>
      {/* div with className title */}
      <div className='title'>
        <h1>UMS</h1>
        <div className='whoosePortal'>
          <h4>Librarian</h4>
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
                title: "HomePage",
                itemId: "/library/admin_home",
                elemBefore: () => <CgHomeAlt />,
                
              },
              {
                title: "Add Book",
                itemId: "/library/add_book",
                activeColor: '#0069d9',
                elemBefore: () => <CgProfile/>,
                
              },
              {
                title: "Grant Book",
                itemId: "/library/grant_book",
                elemBefore: () => <MdAppRegistration/>,
                
              },
              {
                  title: "Show Books",
                  itemId: "/library/admin_show_books",
                  // Optional
                  elemBefore: () => <CgList />,
                  
              },
              {
                  title: "Show Borrow Info",
                  itemId: "/library/admin_show_borrow_info",
                  // Optional
                  elemBefore: () => <TbSchool />,
                  
              },
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


export default SidebarLibraryAdmin;
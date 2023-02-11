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


const SidebarFinancialAdmin = () => {
    const navigate = useNavigate();
    const location = useLocation();
  return (
    <div className='sidebar'>
      {/* div with className title */}
      <div className='title'>
        <h1>UMS</h1>
        <div className='whoosePortal'>
          <h4>Financial Admin</h4>
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
                title: "HomePage",
                itemId: "/financial_admin/dashboard ",
                elemBefore: () => <CgHomeAlt />,
                
              },
              {
                title: "Smart Card List",
                itemId: "/financial_admin/smart_card_list",
                activeColor: '#0069d9',
                elemBefore: () => <CgProfile/>,
                
              },
              {
                title: "Add Smart Card",
                itemId: "/financial_admin/addcard",
                elemBefore: () => <MdAppRegistration/>,
                
              },
              {
                  title: "Payment List",
                  itemId: "/financial_admin/payment_list",
                  // Optional
                  elemBefore: () => <CgList />,
                  
              },
              {
                  title: "Add Payment",
                  itemId: "/financial_admin/addpayment",
                  elemBefore: () => <GrMoney />,
              },
              {
                  title: "Transaction List",
                  itemId: "/financial_admin/transaction_list",
                  elemBefore: () => <CgList />,
              },
              {
                  title: "Add Transaction",
                  itemId: "/financial_admin/addtransaction",
                  elemBefore: () => <CgLogOut />,
              },
            ]}
          />
          <hr />
          <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            // go to that location
            if(itemId != undefined) navigate(itemId);
          }}
          items={[
            
            {
                title: "Scholarship List",
                itemId: "/financial_admin/scholarship_list",
                elemBefore: () => <CgList />,
            },
            {
                title: "Add Scholarship",
                itemId: "/financial_admin/add_scholarship",
                elemBefore: () => <CgLogOut />,
            },
            {
                title: "Applied Scholarship List",
                itemId: "/financial_admin/applied_scholarship_list",
                elemBefore: () => <CgList />,
            },
            {
                title: "Pending Scholarship List",
                itemId: "/financial_admin/pending_scholarship_list",
                elemBefore: () => <CgList />,
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



export default SidebarFinancialAdmin;
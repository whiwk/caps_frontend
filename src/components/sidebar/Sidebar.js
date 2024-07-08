import React from 'react';
import './Sidebar.css';
import { Nav, NavList, NavItem, PageSidebar, PageSidebarBody } from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {

    return (
        <div style={{ width: '250px' }} className='sidebar-container'> {/* Adjust width as needed */}
          {/* <button onClick={toggleSidebar}>{isSidebarOpen ? 'Hide' : 'Show'}</button> */}
        <PageSidebar theme="light" style={{ width: '250px' }} className="custom-sidebar">
            <PageSidebarBody>
            <Nav id="nav-primary-simple" theme="light">
                <NavList id="nav-list-simple">
                    <NavItem>
                        <NavLink to="/introduction/orca" exact activeClassName="pf-m-current"> ORCA Introduction </NavLink>
                    </NavItem>
                    <NavItem> 
                        <NavLink to="/introduction/5g-overview" activeClassName="pf-m-current">5G Overview</NavLink>
                    </NavItem>
                    <NavItem> 
                        <NavLink to="/introduction/lab-guidance"  activeClassName="pf-m-current">Lab Guidance</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/introduction/monitoring-and-logging" activeClassName="pf-m-current">Monitoring and Logging</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/introduction/behind-the-technology" activeClassName="pf-m-current">Behind the Technology</NavLink>
                    </NavItem>
                </NavList>
            </Nav>
            </PageSidebarBody>
            </PageSidebar>
        </div>
    );
};

export default Sidebar;

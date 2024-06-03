import React, {useState} from 'react';
import { Nav, NavList, NavItem,  } from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ width: '200px' }}> {/* Adjust width as needed */}
          <button onClick={toggleSidebar}>{isSidebarOpen ? 'Hide' : 'Show'}</button>
          {isSidebarOpen && (
            <Nav theme="dark">
                <NavList>
                    <NavItem>
                        <NavLink to="/introduction" exact activeClassName="pf-m-current"> About Open Netra</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/5g-implementation-overview" activeClassName="pf-m-current">5G Implementation Overview</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/lab-one-guidance" activeClassName="pf-m-current">Lab 1 Guidance</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/lab-two-guidance" activeClassName="pf-m-current">Lab 2 Guidance</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/lab-three-guidance" activeClassName="pf-m-current">Lab 3 Guidance</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/behind-the-technology" activeClassName="pf-m-current">Behind the Technology</NavLink>
                    </NavItem>
                </NavList>
            </Nav>
          )}
        </div>
    );
};

export default Sidebar;

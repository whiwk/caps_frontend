import React, {useState} from 'react';
import './Sidebar.css';
import { Nav, NavList, NavItem, NavExpandable, PageSidebar, PageSidebarBody } from '@patternfly/react-core';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [activeGroup, setActiveGroup] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const onToggle = (groupId, isExpanded) => {
        setExpandedGroups(prevState => ({
            ...prevState,
            [groupId]: isExpanded
        }));
    };    

    return (
        <div style={{ width: '200px' }} className="sidebar-container"> {/* Adjust width as needed */}
          {/* <button onClick={toggleSidebar}>{isSidebarOpen ? 'Hide' : 'Show'}</button> */}
          {isSidebarOpen && (
            <PageSidebar theme="light" style={{ width: '200px' }} className="custom-sidebar">
            <PageSidebarBody>
            <Nav id="nav-primary-simple" theme="light" onSelect={({ groupId }) => setActiveGroup(groupId)}>
                <NavList id="nav-list-simple">
                    <NavItem>
                        <NavLink to="/introduction" exact activeClassName="pf-m-current"> ORCA Introduction </NavLink>
                    </NavItem>
                    <NavItem> 
                        <NavLink to="/5g-implementation-overview" activeClassName="pf-m-current">5G Implementation Overview</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/lab-one-guidance" activeClassName="pf-m-current">Lab 1 Guidance </NavLink>
                    </NavItem>
                    <NavExpandable
                        title="Behind the Technology"
                        groupId="tech"
                        isActive={activeGroup === 'tech'}
                        isExpanded={expandedGroups['tech']}
                        onToggle={isExpanded => onToggle('tech', isExpanded)}
                    >
                    <NavItem>
                        <NavLink to="/cluster-topology" activeClassName="pf-m-current">Cluster Topology</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/management-subscriber" activeClassName="pf-m-current">Management Subscriber</NavLink>
                    </NavItem>
                    </NavExpandable>
                </NavList>
            </Nav>
            </PageSidebarBody>
            </PageSidebar>
          )}
        </div>
    );
};

export default Sidebar;

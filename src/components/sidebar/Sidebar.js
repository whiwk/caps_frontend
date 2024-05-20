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
        <div style={{ width: '200px' }}> {/* Adjust width as needed */}
          <button onClick={toggleSidebar}>{isSidebarOpen ? 'Hide' : 'Show'}</button>
          {isSidebarOpen && (
            <PageSidebar theme="dark" style={{ width: '200px' }}>
            <PageSidebarBody>
            <Nav id="nav-primary-simple" theme="dark" onSelect={({ groupId }) => setActiveGroup(groupId)}>
                <NavList id="nav-list-simple">
                    <NavItem>
                        <NavLink to="/introduction" exact activeClassName="pf-m-current"> About Open Netra</NavLink>
                    </NavItem>
                    <NavItem> 
                        <NavLink to="/5g-implementation-overview" activeClassName="pf-m-current">5G Implementation Overview</NavLink>
                    </NavItem>
                    <NavExpandable
                        title="Lab 1 Guidance"
                        groupId="labs"
                        isActive={activeGroup === 'labs'}
                        isExpanded={expandedGroups['labs']}
                        onToggle={isExpanded => onToggle('labs', isExpanded)}
                    >
                    <NavItem>
                        <NavLink to="/lab-one-guidance-part-one" activeClassName="pf-m-current">Lab 1 Guidance: Gather All 7 Dragon Balls</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink to="/lab-one-guidance-part-two" activeClassName="pf-m-current">Lab 1 Guidance: Find One Piece</NavLink>
                    </NavItem>
                    </NavExpandable>
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
            </PageSidebarBody>
            </PageSidebar>
          )}
        </div>
    );
};

export default Sidebar;

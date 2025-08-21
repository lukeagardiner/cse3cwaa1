// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import styles from './TabMenu.module.css';
import Link from 'next/link';

// Define menu behaviour
const TabMenu = () => {
    const [selectedTab, setSelectedTab] = useState('Home');

    const tabs = [
        { id: 'Home', label: '1. Home', path: "/"},
        { id: 'About', label: '2. About', path: "/about"},
        { id: 'CodingRaces', label: '3. Coding Races', path: "/coding-races" },
        { id: 'CourtRoom', label: '4. Court Room', path: "/court-room"},
        { id: 'EscapeRoom', label: '5. Escape Room', path: "/escape-room"},
    ];

    // Basically on-click event that makes sure the string id of the selected tab is updated in the control method
    const handleTabClick = (TabId: string) => {
        setSelectedTab(TabId);
    }

    return (
       <div className={styles.container}>
           <div className={styles.tabContainer}>
               {tabs.map(tab => (
                   <Link
                       key={tab.id}
                       href={tab.path}
                       className={`${styles.tablinks} ${
                           selectedTab === tab.id ? styles.active : ''
                       }`}
                       onClick={() => handleTabClick(tab.id)}
                   >
                       {tab.label}
                   </Link>
               ))}
           </div>
       </div>
    );
};

export default TabMenu;
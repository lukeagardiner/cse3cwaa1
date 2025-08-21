// components/Navigation.tsx
// standardises navigation app-wide

'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './Navigation.module.css';

// ***STUDY - syntax
const Navigation = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    // shortlabel for mobile device
    const tabs = [
        { id: 'Home', label: 'Home', shortlabel: '1', path: "/"},
        { id: 'About', label: 'About', shortlabel: '2', path: "/about"},
        { id: 'CodingRaces', label: 'Coding Races', shortlabel: '3', path: "/coding-races" },
        { id: 'CourtRoom', label: 'Court Room', shortlabel: '4', path: "/court-room"},
        { id: 'EscapeRoom', label: 'Escape Room', shortlabel: '5', path: "/escape-room"},
    ];

    return (
        <div className={styles.navContainer}>

            {/* Buttons Menu */}
            <div className={styles.tabContainer}>
                {tabs.map((tab) => (
                    <Link
                      key={tab.id}
                      href={tab.path}
                      className={styles.tabButton}
                      aria-label={tab.label}
                    >
                        <span className={styles.fullLabel}> {tab.shortlabel}. {tab.label} </span>
                        <span className={styles.shortLabel}>{tab.shortlabel} |</span>
                        {/* Consider replacing shortlabel with icon for mobile devices*/}
                    </Link>
                ))}
            </div>

            {/* Hamburger Menu */}
            <div className={styles.hamburgerWrapper}>
                <button
                    className={styles.hamburger}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {/* *** STUDY syntax aria label */}
                    <div className={`${styles.bar} ${menuOpen ? styles.bar1Open : ''}`} />
                    <div className={`${styles.bar} ${menuOpen ? styles.bar2Open : ''}`} />
                    <div className={`${styles.bar} ${menuOpen ? styles.bar3Open : ''}`} />
                </button>
            </div>

            { /* Dropdown menu for mobile devices */ }
            <div className={`${styles.mobileMenu} ${menuOpen ? styles.open : ''}`}>
                {tabs.map((tab) => (
                    <Link
                      key={tab.id}
                      href={tab.path}
                      className={styles.mobileLink}
                      onClick={() => setMenuOpen(false)}>
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Navigation;
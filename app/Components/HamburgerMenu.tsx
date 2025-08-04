// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import styles from './HamburgerMenu.module.css';

// Define menu behaviour
const HamurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <div className={styles.hamburger} onClick={toggleMenu}>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
            </div>
            <nav className={isOpen ? styles.menuOpen : styles.menu}>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About</a></li>
                    <li><a href="/contact">Contact</a></li>
                    <li><a href="/coding-races/page">Coding Races</a></li>
                    <li><a href="/court-room/page">Court Room</a></li>
                    <li><a href="/escape-room/page">Court Room</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default HamurgerMenu;
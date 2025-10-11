// components/HamburgerMenu.tsx
'use client'
import { useState } from 'react';
import Link from 'next/link';
import styles from './HamburgerMenu.module.css';

// Define menu behaviour
const HamurgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={styles.container}>
            <button type="button" className={styles.hamburger} onClick={toggleMenu} aria-label="Toggle menu" aria-expanded={isOpen}>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
                <div className={isOpen ? styles.barOpen : styles.bar}></div>
            </button>
            <nav className={isOpen ? styles.menuOpen : styles.menu}>
                <ul>
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/about">About</Link></li>
                    <li><Link href="/contact">Contact</Link></li>
                    <li><Link href="/app/(client)/coding-races/page">Coding Races</Link></li>
                    <li><Link href="/app/(client)/court-room/page">Court Room</Link></li>
                    <li><Link href="/app/(client)/escape-room/page">Court Room</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default HamurgerMenu;
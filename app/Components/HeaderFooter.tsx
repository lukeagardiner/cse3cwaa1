import { ReactNode } from 'react';
import Navigation from './Navigation';
import styles from './HeaderFooter.module.css';

interface HeaderFooterProps {
    children: ReactNode;
}

// Date logic
const getFormattedDateUTC = () => {
    const date = new Date();
    const day = date.getUTCDate().toString().padStart(2, '0');
    // Apparently have to add 1 to month for zero-based indexing
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();

    // Define the output format
    return `${day}/${month}/${year}`;
}

// Presentation
const HeaderFooter = ({ children } : HeaderFooterProps) => {
    return  (
        <div className={styles.container}>
            {/* Header */}
            <header className={styles.header}>
                {/* Header - Title Content */}
                <div className={styles.headerContent}>
                    <div className={styles.headerContainer}>
                        <h1 className={styles.title}>CSE3CWA - Assessment 1</h1>
                        <span className={styles.studentId}>20219568</span>
                    </div>
                    <div className={styles.headerDivider}></div>
                </div>
                {/* Header - Navigation Element */}
                <Navigation />
            </header>

            {/* Body Content */}
            <main className={styles.body}>
                { children }
            </main>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerDivider}></div>
                <div className={styles.footerContent}>
                    <p>&copy;  Luke Gardiner, 20219568, {getFormattedDateUTC()} </p>
                </div>
            </footer>
        </div>
    );
};

export default HeaderFooter;
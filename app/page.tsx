"use client"

import React, { useState } from 'react';
import TabsHeaders from './Components/TabsHeaders';
import styles from './Components/TabsPage.module.css';

export default function Tabs() {
    // setup 3 placeholder tabs - up to 15 tabs with editable label
    const [ tabs, setTabs ] = useState([
        { id: 1, label: 'Step 1' },
        { id: 2, label: 'Step 2' },
        { id: 3, label: 'Step 3' },
    ]);
    const [ activeTab, setActiveTab ] = useState(1);

    // Caching for content -- tab object > tab id > content
    const [ tabContents, setTabContents ] = useState<{[key: number]: string}>({});

    // Pickup any changes in the text area
    function handleTabContentChange(tabId: number, value: string) {
        setTabContents(prev => ({
            ...prev,
            [tabId]: value
        }));
    }

    // Find correct tab label and content
    const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || "";
    const activeContent = tabContents[activeTab] || "";

    return (
        <div className={styles.tabsPageLayout}>
            {/* Tabs Headers */}
            <div className={styles.tabsHeaders}>
                <TabsHeaders
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tabs={tabs}
                    setTabs={setTabs}
                />
            </div>
            {/* Tabs Content */}
            <div className={styles.tabsContents}>
                <h2>Tabs Content</h2>
                <p>Content for tab <strong>{activeTabLabel}</strong> : </p>
                <textarea
                    value={activeContent}
                    onChange={e => handleTabContentChange(activeTab, e.target.value)}
                    rows={10}
                    style={{width: '100%', marginTop: '0.5rem'}}
                    placeholder={`Add content here for ${activeTabLabel}...`}
                />
            </div>

            {/* Code Generation */}
            <div className={styles.tabsOutput}>
                <h2>Output</h2>
                {/* TODO */}
            </div>
        </div>
    )

}
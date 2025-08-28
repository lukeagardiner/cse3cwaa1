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
    // Find correct tab label and content
    const activeTabLabel = tabs.find(t => t.id === activeTab)?.label || "";
    const activeContent = tabContents[activeTab] || "";
    // CodeGen
    const [ generatedHTML, setGeneratedHTML ] = useState('');

    // Pickup any changes in the text area
    function handleTabContentChange(tabId: number, value: string) {
        setTabContents(prev => ({
            ...prev,
            [tabId]: value
        }));
    }

    // Generation of html output
    function handleGenerateHTML(){
        const tabIds = tabs.map(tab => tab.id);
        const tabLabels = tabs.map(tab => tab.label);
        const html =  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Generated Tabs Webpage</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #fafafa;
            color: #222;
        }
        .tabs-container {
            width: 80%;
            margin: 2em auto;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,0.8);
        }
        .tab-headers {
            display: flex;
            border-bottom: 2px solid #0070f3;
            gap: 0.5em;
        }
        .tab-button {
            background: #eee;
            border: none;
            border-radius: 4px 4px 0 0;
            padding: 0.75em 1.25em;
            cursor: pointer;
            font-size: 1em;
            font-weight: bold;
            color: #222;
            margin-bottom: -2px;
            transition: background 0.2s;
        }
        .tab-button.active {
            background: #0070f3;
            color: #fff;
            border-bottom: 3px solid #0070f3;
        }
        .tab-content {
            display: none;
            padding: 1.5em 0 0 0;
            font-size: 1.05em;
            min-height: 120px;
        }
        .tab-content.active {
            display: block;
        }
    </style>
</head>
<body>
    <div class="tabs-container">
        <div class="tab-headers">
            ${tabs.map((tab, idx) => `
                <button class="tab-button${idx === 0 ? ' active' : ''}" onclick="showTab(${idx})" id="tab-button-${idx}">
                    ${tab.label}
                </button>
            `).join('')}
        </div>
        ${tabs.map((tab, idx) => `
            <div class="tab-content${idx === 0 ? ' active' : ''}" id="tab-content-${idx}">
                ${tabContents[tab.id] ? tabContents[tab.id].replace(/\n/g, "<br/>") : "<em>no content provided.</em>"}
            </div>
        `).join('')}
    </div>
    <script>
        function showTab(idx) {
            var tabButtons = document.querySelectorAll('.tab-button');
            var tabContents = document.querySelectorAll('.tab-content');
            tabButtons.forEach(function(btn, i) {
                btn.classList.toggle('active', i === idx);
            });
            tabContents.forEach(function(content, i) {
                content.classList.toggle('active', i === idx);
            });
        }
    </script>
          
</body>
</html>
`.trim()
        setGeneratedHTML(html);
    }


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
                <button onClick={handleGenerateHTML}>Generate HTML</button>
                {generatedHTML && (
                    <textarea
                        readOnly
                        value={generatedHTML}
                        rows={15}
                        style={{width: '100%', fontFamily: 'monospace', marginTop: '1em', overflowX: 'auto'}}
                    />
                )}
            </div>
        </div>
    )
}
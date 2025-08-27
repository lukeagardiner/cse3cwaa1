"use client"

import React, { useState } from 'react';
import TabsHeaders from './Components/TabsHeaders';

export default function Tabs() {
    // setup placeholder tabs - up to 15 tabs with editable label
    const [ tabs, setTabs ] = useState([
        { id: 1, label: 'Step 1' },
        { id: 2, label: 'Step 2' },
        { id: 3, label: 'Step 3' },
    ]);
    const [ activeTab, setActiveTab ] = useState(1);

    return (
        <div>
            {/* Tabs Headers */}
            <TabsHeaders
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                tabs={tabs}
                setTabs={setTabs}
            />

            {/* Tabs Content */}
            <div>
                <h2>Tabs Content</h2>
                <p>Content for tab <strong>{tabs.find(t => t.id === activeTab)?.label}</strong>goes here.</p>
                {/* TODO */}
            </div>

            {/* Code Generation */}
            <div>
                <h2>Output</h2>
                {/* TODO */}
            </div>
        </div>
    )

}
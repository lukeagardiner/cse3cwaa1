import React, { useState } from 'react';

// Set upper tab limit
const MAX_TABS = 15;

// Tab fields
type Tab = {
    id: number;
    label: string;
}

export default function TabsHeaders({
    activeTab,
    setActiveTab,
    tabs,
    setTabs,
} : {
    activeTab: number;
    setActiveTab: (id: number) => void;
    tabs: Tab[];
    setTabs:  (tabs: Tab[]) => void;
}) {
    // Add a tab if less than configured max
    function addTab() {
        if (tabs.length < MAX_TABS) {
            // Dynamically name the tab based on the length of the tabs collection
            const newId = tabs.length ? tabs[tabs.length -1].id +1 : 1;
            setTabs([...tabs, { id: newId, label: `Step ${newId}` }]);
        }
    }

    // Remove a tab if more than 1 tab data present
    function removeTab() {
        if (tabs.length > 1)
        {
            const newTabs = tabs.slice(0, -1);
            setTabs(newTabs);
            // If the active tab is the tab we're currently accessing - should switch to last tab in new collection
            if (activeTab === tabs[tabs.length -1].id) {
                setActiveTab(newTabs[newTabs.length -1].id);
            }
        }
    }

    // Allows tab label updates via UI
    function handleLabelChange(id: number, label: string) {
        setTabs(
            tabs.map((tab) => (tab.id === id ? {...tab, label } : tab))
        );
    }

    /****** FORMAT OUTPUT ******/
    return(
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span>Tabs Headers:</span>
                {/* Add and Remove controls */}
                <button onClick={addTab} disabled={tabs.length >= MAX_TABS}>[+]</button>
                <button onClick={removeTab} disabled={tabs.length <= 1}>[-]</button>
            </div>
            <div style={{ marginTop : '1em' }}>
                {tabs.map((tab) => (
                    <div key={tab.id} style={{ margin: '0.5em 0'}}>
                        <button
                            style={{
                                fontWeight: tab.id === activeTab ? 'bold' : 'normal',
                                background: tab.id === activeTab ? '#eee' : 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.2em',
                                padding: '0.2em 0.3em'
                            }}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.id === activeTab ? (
                                <input
                                    type="text"
                                    value={tab.label}
                                    onChange={(e) => handleLabelChange(tab.id, e.target.value)}
                                    style={{
                                        fontWeight: 'bold',
                                        fontSize: '1em',
                                        border: '1px solid #ddd',
                                        padding: '0.1em 0.3em'
                                    }}
                                />
                            ) : (
                                tab.label
                            )}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}





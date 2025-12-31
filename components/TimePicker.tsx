'use client';

import React, { useRef } from 'react';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
}

/**
 * TimePicker HYBRID v2
 * 
 * Menggunakan satu input yang VISIBLE tapi styled transparan
 * Input benar-benar di atas, tapi onClick juga memanggil showPicker untuk desktop
 */
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        const input = inputRef.current;
        if (!input) return;

        // Desktop browsers: panggil showPicker
        try {
            input.showPicker();
        } catch (e) {
            // iOS/old browsers: tidak perlu - tap sudah handled native
        }
    };

    return (
        <div style={{ position: 'relative', height: '48px', width: '100%' }}>
            {/* Visual layer - hanya untuk display */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 1
            }}>
                {value ? (
                    <span style={{ fontWeight: 'bold', color: '#1f2937', fontSize: '16px' }}>{value}</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                )}
            </div>

            {/* Input - di atas, terima click/tap, panggil showPicker untuk desktop */}
            <input
                ref={inputRef}
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClick={handleClick}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    opacity: 0.01,  // Slightly visible to ensure browser treats it as interactive
                    zIndex: 2,
                    cursor: 'pointer',
                    fontSize: '16px',
                    WebkitAppearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    margin: 0,
                    padding: 0
                }}
            />
        </div>
    );
};

export default TimePicker;

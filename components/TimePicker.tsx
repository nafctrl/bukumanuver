'use client';

import React, { useRef } from 'react';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
}

const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        const input = inputRef.current;
        if (!input) return;

        // Focus first
        input.focus();

        // Try showPicker if available (Chrome, Edge, etc.)
        try {
            if (typeof input.showPicker === 'function') {
                input.showPicker();
            }
        } catch (e) {
            // showPicker may throw on some browsers, ignore
        }
    };

    return (
        <div className="relative h-12 w-full">
            {/* Clickable overlay that triggers the input */}
            <div
                onClick={handleClick}
                className="absolute inset-0 z-[5] cursor-pointer hover:bg-orange-50 rounded-md transition-colors flex items-center justify-center"
            >
                {value ? (
                    <span className="font-bold text-gray-800 text-base">{value}</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                )}
            </div>

            {/* Native time input - positioned behind the overlay but still accessible */}
            <input
                ref={inputRef}
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="absolute inset-0 w-full h-full opacity-0"
                style={{ fontSize: '16px' }}
            />
        </div>
    );
};

export default TimePicker;

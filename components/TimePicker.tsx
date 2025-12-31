'use client';

import React, { useRef } from 'react';

interface TimePickerProps {
    value: string;
    onChange: (time: string) => void;
}

/**
 * TimePicker sederhana - tombol bulat oranye muda
 * Klik langsung trigger native time picker
 * Tampilan konsisten: circle oranye muda + teks/icon oranye
 */
const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        const input = inputRef.current;
        if (!input) return;

        input.focus();
        try {
            input.showPicker?.();
        } catch (e) {
            // Fallback: just focus, mobile will show picker automatically
        }
    };

    return (
        <div className="relative flex items-center justify-center h-12">
            {/* Visible Button */}
            <button
                type="button"
                onClick={handleClick}
                className="cursor-pointer inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-600 border border-orange-200 hover:bg-orange-200 transition-all"
                title={value ? `Waktu: ${value}` : 'Pilih waktu'}
            >
                {value ? (
                    <span className="text-xs font-bold">{value}</span>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                )}
            </button>

            {/* Hidden native input - triggered by button click */}
            <input
                ref={inputRef}
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="absolute opacity-0 w-0 h-0"
                style={{ fontSize: '16px' }}
                tabIndex={-1}
            />
        </div>
    );
};

export default TimePicker;

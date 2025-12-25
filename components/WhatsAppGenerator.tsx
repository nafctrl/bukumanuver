'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { LogRow } from './LogTable';

interface WhatsAppGeneratorProps {
    header: {
        judul_manuver: string;
        tanggal: string;
        gardu_induk: string;
        pengawas_pekerjaan: string;
        pengawas_k3: string;
        pengawas_manuver: string;
        pelaksana_manuver: string;
        dispa: string;
    };
    rows: LogRow[];
}

// Normalize GI name: remove "GI", "GARDU INDUK", extra spaces, then format consistently
function normalizeGIName(input: string): string {
    let name = input.trim().toUpperCase();
    // Remove common prefixes
    name = name.replace(/^(GARDU\s*INDUK|GI)\s*/i, '');
    // Remove extra spaces
    name = name.replace(/\s+/g, ' ').trim();
    return name;
}

const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({ header, rows }) => {
    const [text, setText] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const [isVoltageOpen, setIsVoltageOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const formattedDate = header.tanggal ? new Date(header.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-';

        // Normalize GI name to prevent "GI GI BATANG" issue
        const giName = normalizeGIName(header.gardu_induk) || '...';

        // Format rows: PMS BUS A BREBES 1 # 12.55 (R.ACC)
        // Separators output as dashed line
        const manuverRows = rows
            .map(r => {
                if (r.isSeparator) {
                    return '\n-----------------------------------------------------------\n';
                }
                const symbol = r.posisi_switch ? '//' : '#';
                const name = r.nama_peralatan || '[Alat belum dipilih]';
                const time = r.waktu || '--:--';
                const via = r.via || '-';
                return `${name} ${symbol} ${time} (${via})`;
            }).join('\n');

        // Build pengawas section - only include non-empty fields
        const pengawasLines: string[] = [];
        if (header.pengawas_pekerjaan?.trim()) pengawasLines.push(`PP: ${header.pengawas_pekerjaan.trim()}`);
        if (header.pengawas_k3?.trim()) pengawasLines.push(`PK3: ${header.pengawas_k3.trim()}`);
        if (header.pengawas_manuver?.trim()) pengawasLines.push(`PM: ${header.pengawas_manuver.trim()}`);
        if (header.pelaksana_manuver?.trim()) pengawasLines.push(`Pelaksana: ${header.pelaksana_manuver.trim()}`);
        if (header.dispa?.trim()) pengawasLines.push(`Dispatcher: ${header.dispa.trim()}`);
        const pengawasSection = pengawasLines.join('\n');

        // Judul manuver with default
        const judulManuver = header.judul_manuver?.trim() || 'JUDUL MANUVER';

        const template = `*INFO MANUVER GI ${giName}*
Hari/Tanggal : ${formattedDate}

${judulManuver}

Uraian Manuver:
${manuverRows}

Sebelum
Tegangan Bus A : 
Tegangan Bus B : 

Setelah
Tegangan Bus A : 
Tegangan Bus B : 

Catatan:

${pengawasSection}`;

        setText(template);
    }, [header, rows]);

    const handleCopy = async () => {
        try {
            // Modern clipboard API (requires HTTPS or localhost)
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
            } else {
                // Fallback for mobile/older browsers
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
            // Last resort fallback
            alert('Gagal menyalin. Silakan pilih teks dan salin secara manual.');
        }
    };

    // Formatting helpers
    const wrapSelection = (prefix: string, suffix: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = text.substring(start, end);

        if (selectedText) {
            const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
            setText(newText);
            // Restore selection
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + prefix.length, end + prefix.length);
            }, 0);
        }
    };

    // Voltage quick-fill helper
    // Order: Bus A sebelum > Bus B sebelum > Bus A sesudah > Bus B sesudah
    const fillVoltage = (value: string) => {
        let newText = text;

        // Split by sections to find correct order
        const sebelumMatch = newText.match(/Sebelum\nTegangan Bus A : (.*)\nTegangan Bus B : (.*)\n/);
        const setelahMatch = newText.match(/Setelah\nTegangan Bus A : (.*)\nTegangan Bus B : (.*)\n/);

        // Check in order: Sebelum A > Sebelum B > Setelah A > Setelah B
        if (sebelumMatch && sebelumMatch[1].trim() === '') {
            // Fill Sebelum Bus A
            newText = newText.replace(
                /Sebelum\nTegangan Bus A : \n/,
                `Sebelum\nTegangan Bus A : ${value} kV\n`
            );
        } else if (sebelumMatch && sebelumMatch[2].trim() === '') {
            // Fill Sebelum Bus B
            newText = newText.replace(
                /(Sebelum\nTegangan Bus A : .+\n)Tegangan Bus B : \n/,
                `$1Tegangan Bus B : ${value} kV\n`
            );
        } else if (setelahMatch && setelahMatch[1].trim() === '') {
            // Fill Setelah Bus A
            newText = newText.replace(
                /Setelah\nTegangan Bus A : \n/,
                `Setelah\nTegangan Bus A : ${value} kV\n`
            );
        } else if (setelahMatch && setelahMatch[2].trim() === '') {
            // Fill Setelah Bus B
            newText = newText.replace(
                /(Setelah\nTegangan Bus A : .+\n)Tegangan Bus B : \n/,
                `$1Tegangan Bus B : ${value} kV\n`
            );
        }

        setText(newText);
    };

    // Clear last filled voltage (reverse order: Setelah B > Setelah A > Sebelum B > Sebelum A)
    const clearLastVoltage = () => {
        let newText = text;

        const sebelumMatch = newText.match(/Sebelum\nTegangan Bus A : (.*)\nTegangan Bus B : (.*)\n/);
        const setelahMatch = newText.match(/Setelah\nTegangan Bus A : (.*)\nTegangan Bus B : (.*)\n/);

        // Check in reverse order
        if (setelahMatch && setelahMatch[2].trim() !== '') {
            newText = newText.replace(
                /(Setelah\nTegangan Bus A : .+\n)Tegangan Bus B : .+\n/,
                `$1Tegangan Bus B : \n`
            );
        } else if (setelahMatch && setelahMatch[1].trim() !== '') {
            newText = newText.replace(
                /Setelah\nTegangan Bus A : .+\n/,
                `Setelah\nTegangan Bus A : \n`
            );
        } else if (sebelumMatch && sebelumMatch[2].trim() !== '') {
            newText = newText.replace(
                /(Sebelum\nTegangan Bus A : .+\n)Tegangan Bus B : .+\n/,
                `$1Tegangan Bus B : \n`
            );
        } else if (sebelumMatch && sebelumMatch[1].trim() !== '') {
            newText = newText.replace(
                /Sebelum\nTegangan Bus A : .+\n/,
                `Sebelum\nTegangan Bus A : \n`
            );
        }

        setText(newText);
    };

    // Check if cursor is near voltage fields and auto-expand
    const checkCursorPosition = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPos = textarea.selectionStart;
        const textBeforeCursor = text.substring(0, cursorPos);
        const textAfterCursor = text.substring(cursorPos);

        // Check if cursor is near any voltage field
        const nearVoltageField =
            /Tegangan Bus [AB] : .{0,10}$/.test(textBeforeCursor) ||
            /^.{0,10}Tegangan Bus [AB]/.test(textAfterCursor) ||
            /Sebelum\n/.test(textBeforeCursor.slice(-30)) ||
            /Setelah\n/.test(textBeforeCursor.slice(-30));

        setIsVoltageOpen(nearVoltageField);
    };

    return (
        <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-green-800 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
                    WhatsApp Generator
                </h3>
                <button
                    onClick={handleCopy}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${isCopied ? 'bg-green-600 text-white' : 'bg-white text-green-700 border border-green-200 hover:bg-green-100'}`}
                >
                    {isCopied ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            Copied!
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                            Copy Text
                        </>
                    )}
                </button>
            </div>

            {/* Textarea Container with Toolbar Inside */}
            <div className="relative bg-white/80 border border-green-200 rounded-md shadow-inner overflow-hidden">
                {/* Formatting Toolbar - Small floating container */}
                <div className="absolute top-2 left-2 flex gap-1 p-1 bg-white/95 rounded-lg border border-gray-200 shadow-sm z-10">
                    <button
                        onClick={() => wrapSelection('*', '*')}
                        className="w-8 h-8 text-sm font-bold text-gray-500 hover:text-green-700 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-md transition-all"
                        title="Bold (*text*)"
                    >
                        B
                    </button>
                    <button
                        onClick={() => wrapSelection('_', '_')}
                        className="w-8 h-8 text-sm italic text-gray-500 hover:text-green-700 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-md transition-all"
                        title="Italic (_text_)"
                    >
                        I
                    </button>
                    <button
                        onClick={() => wrapSelection('~', '~')}
                        className="w-8 h-8 text-sm line-through text-gray-500 hover:text-green-700 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-md transition-all"
                        title="Strikethrough (~text~)"
                    >
                        S
                    </button>
                    <button
                        onClick={() => wrapSelection('```', '```')}
                        className="w-8 h-8 text-sm font-mono text-gray-500 hover:text-green-700 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-md transition-all"
                        title="Monospace (```text```)"
                    >
                        {'</>'}
                    </button>
                </div>

                {/* Voltage Quick-Fill - Top right */}
                <div className="absolute top-2 right-2 z-10">
                    {(isVoltageOpen) ? (
                        // Expanded panel - all values 145-155
                        <div className="flex items-start gap-1 p-1.5 bg-white/95 rounded-lg border border-green-300 shadow-md">
                            {/* All voltage values in grid */}
                            <div className="grid grid-cols-6 gap-1">
                                <span className="col-span-1 px-1 text-sm text-green-600 font-bold flex items-center">kV:</span>
                                {[145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155].map(v => (
                                    <button
                                        key={v}
                                        onClick={() => fillVoltage(String(v))}
                                        className="w-8 h-8 text-sm text-gray-500 hover:text-green-700 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-md transition-all"
                                        title={`Insert ${v} kV`}
                                    >
                                        {v}
                                    </button>
                                ))}
                            </div>
                            {/* Close & Backspace buttons */}
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setIsVoltageOpen(false)}
                                    className="w-8 h-8 text-xs text-green-500 hover:text-green-700 hover:bg-green-100 active:scale-95 active:bg-green-200 rounded-md transition-all flex-shrink-0"
                                    title="Close"
                                >
                                    ✕
                                </button>
                                <button
                                    onClick={clearLastVoltage}
                                    className="w-8 h-8 text-sm text-green-500 hover:text-green-700 hover:bg-green-100 active:scale-95 active:bg-green-200 rounded-md transition-all flex-shrink-0"
                                    title="Undo last voltage"
                                >
                                    ⌫
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Collapsed KV button
                        <button
                            onClick={() => setIsVoltageOpen(true)}
                            className="px-3 py-2 text-sm font-bold text-green-600 bg-white/95 hover:bg-green-50 active:scale-95 active:bg-green-100 rounded-lg border border-green-300 shadow-sm transition-all"
                            title="Quick-fill voltage values"
                        >
                            kV
                        </button>
                    )}
                </div>
                <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onSelect={checkCursorPosition}
                    onClick={checkCursorPosition}
                    className="w-full h-72 p-4 pt-14 bg-transparent focus:outline-none font-mono text-sm text-gray-700 resize-none"
                />
            </div>
        </div >
    );
};

export default WhatsAppGenerator;

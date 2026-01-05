'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    usePeralatan,
    getUniqueLevel1,
    getLevel2ByLevel1,
    getLevel3ByLevel1And2,
    getEquipmentByLevels,
    getEquipmentByFullLabel,
} from '@/utils/hooks/usePeralatan';

interface CascadingDropdownProps {
    value?: string;
    onSelect: (val: string) => void;
    className?: string;
}

const CascadingDropdown: React.FC<CascadingDropdownProps> = ({ value, onSelect, className }) => {
    // Use global SWR hook for equipment data (cached, no duplicate requests)
    const { equipmentList: equipmentData, isLoading: isLoadingData } = usePeralatan();

    // Modal Visibility State
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Selection Flow State
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1); // Step 4 is Confirmation
    const [level1, setLevel1] = useState<string | null>(null);
    const [level2, setLevel2] = useState<string | null>(null);
    const [level3, setLevel3] = useState<string | null>(null);

    // Initial Trigger Render
    const openModal = () => {
        setIsModalOpen(true);
        reset();
    };

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    const handleEdit = () => {
        if (value) {
            const item = getEquipmentByFullLabel(equipmentData, value);
            if (item) {
                setLevel1(item.level_1);
                setLevel2(item.level_2);
                setLevel3(item.level_3);
                setStep(4);
                setIsModalOpen(true);
            } else {
                // Fallback if not found (e.g. data changed), just open fresh
                openModal();
            }
        }
    };

    const reset = () => {
        setStep(1);
        setLevel1(null);
        setLevel2(null);
        setLevel3(null);
    };

    const handleLevel1Click = (val: string) => {
        setLevel1(val);
        setTimeout(() => setStep(2), 100);
    };

    const handleLevel2Click = (val: string) => {
        setLevel2(val);
        setTimeout(() => setStep(3), 100);
    };

    const handleLevel3Click = (val: string) => {
        setLevel3(val);
        setTimeout(() => setStep(4), 100); // Move to Confirmation
    };

    const handleFinalConfirmation = () => {
        if (level1 && level2 && level3) {
            const fullItem = getEquipmentByLevels(equipmentData, level1, level2, level3);
            if (fullItem) {
                onSelect(fullItem.full_label);
                setIsModalOpen(false);
            }
        }
    };

    // --- Render Helpers ---

    const renderBreadcrumbs = () => {
        return (
            <div className="flex flex-wrap items-center gap-2 mb-6 font-mono tracking-wide uppercase">
                {/* Level 1 - TYPE */}
                {step === 1 ? (
                    <motion.span
                        key={`level1-active`}
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-blue-500/30 border border-blue-400/50 text-blue-100 font-bold text-sm tracking-wide rounded-full px-4 py-1.5"
                    >
                        {level1 || 'TYPE'}
                    </motion.span>
                ) : level1 && (
                    <button
                        onClick={() => { setStep(1); setLevel1(null); setLevel2(null); setLevel3(null); }}
                        className="bg-white/10 border border-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm text-white/80 transition-colors"
                    >
                        {level1}
                    </button>
                )}

                {step > 1 && <span className="text-white/30">/</span>}

                {/* Level 2 - SECTION */}
                {step >= 2 && (
                    step === 2 ? (
                        <motion.span
                            key={`level2-active`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className="bg-purple-500/30 border border-purple-400/50 text-purple-100 font-bold text-sm tracking-wide rounded-full px-4 py-1.5"
                        >
                            {level2 || 'SECTION'}
                        </motion.span>
                    ) : level2 && (
                        <button
                            onClick={() => { setStep(2); setLevel2(null); setLevel3(null); }}
                            className="bg-white/10 border border-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm text-white/80 transition-colors"
                        >
                            {level2}
                        </button>
                    )
                )}

                {step > 2 && <span className="text-white/30">/</span>}

                {/* Level 3 - BAY */}
                {step >= 3 && (
                    step === 3 ? (
                        <motion.span
                            key={`level3-active`}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                            className="bg-orange-500/30 border border-orange-400/50 text-orange-100 font-bold text-sm tracking-wide rounded-full px-4 py-1.5"
                        >
                            {level3 || 'BAY'}
                        </motion.span>
                    ) : level3 && (
                        <button
                            onClick={() => { setStep(3); setLevel3(null); }}
                            className="bg-white/10 border border-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm text-white/80 transition-colors"
                        >
                            {level3}
                        </button>
                    )
                )}
            </div>
        );
    };

    const renderStepContent = () => {
        // Show loading state
        if (isLoadingData) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="text-white/60 text-sm">Memuat data peralatan...</div>
                </div>
            );
        }

        // Show empty state if no data
        if (equipmentData.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-white/60 text-sm mb-2">Belum ada data peralatan</div>
                    <div className="text-white/40 text-xs">Tambahkan peralatan di menu Data Alat</div>
                </div>
            );
        }

        if (step === 1) {
            const options = getUniqueLevel1(equipmentData);
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleLevel1Click(opt)}
                                className="group relative overflow-hidden bg-white/25 backdrop-blur-sm border border-blue-400/60 shadow-[0_0_15px_rgba(96,165,250,0.4)] hover:bg-white/35 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(96,165,250,0.7)] hover:scale-105 active:scale-[0.89] active:brightness-110 transition-all duration-300 ease-out rounded-xl p-6 flex flex-col items-center justify-center gap-2 min-h-[100px]"
                            >
                                <span className="font-semibold text-slate-100 group-hover:text-white transition-colors tracking-wide capitalize">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (step === 2 && level1) {
            const options = getLevel2ByLevel1(equipmentData, level1);
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleLevel2Click(opt)}
                                className="group relative overflow-hidden bg-white/25 backdrop-blur-sm border border-purple-400/60 shadow-[0_0_15px_rgba(192,132,252,0.4)] hover:bg-white/35 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(192,132,252,0.7)] hover:scale-105 active:scale-[0.89] active:brightness-110 transition-all duration-300 ease-out rounded-xl p-6 min-h-[80px] flex items-center justify-center text-center"
                            >
                                <span className="font-semibold text-slate-100 group-hover:text-white transition-colors tracking-wide text-sm capitalize">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (step === 3 && level1 && level2) {
            const options = getLevel3ByLevel1And2(equipmentData, level1, level2);
            return (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="grid grid-cols-2 gap-3">
                        {options.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => handleLevel3Click(opt)}
                                className="group relative overflow-hidden bg-white/25 backdrop-blur-sm border border-orange-400/60 shadow-[0_0_15px_rgba(251,146,60,0.4)] hover:bg-white/35 hover:border-orange-400 hover:shadow-[0_0_30px_rgba(251,146,60,0.7)] hover:scale-105 active:scale-[0.89] active:brightness-110 transition-all duration-300 ease-out rounded-xl p-6 min-h-[80px] flex items-center justify-center text-center"
                            >
                                <span className="font-semibold text-slate-100 group-hover:text-white transition-colors tracking-wide text-sm capitalize">{opt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            );
        }

        if (step === 4 && level1 && level2 && level3) {
            const fullLabel = `${level1} ${level2} ${level3}`;
            return (
                <div className="animate-in zoom-in-95 duration-300 flex flex-col items-center justify-center py-6 text-center">
                    <h3 className="text-white/80 font-medium mb-1">Konfirmasi Pilihan</h3>
                    <div className="text-2xl font-black mb-8 max-w-md leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]" style={{ color: '#01d335ff' }}>
                        {fullLabel}
                    </div>

                    <button
                        onClick={handleFinalConfirmation}
                        className="group relative w-24 h-24 rounded-full border-4 shadow-[0_0_40px_rgba(1,211,53,0.6)] flex items-center justify-center hover:scale-110 hover:shadow-[0_0_60px_rgba(1,211,53,0.8)] transition-all duration-300 cursor-pointer mb-2"
                        style={{ backgroundColor: '#e8fbe8', borderColor: '#01d335' }}
                        title="Confirm & Insert"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#01d335" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>

                        {/* Outer ripple - slower, larger */}
                        <div className="absolute -inset-2 rounded-full border-4 opacity-40 animate-ping" style={{ borderColor: '#01d335', animationDuration: '1s' }}></div>
                        {/* Inner ripple - faster */}
                        <div className="absolute inset-0 rounded-full border-4 opacity-50 animate-ping" style={{ borderColor: '#01d335', animationDuration: '0.8s' }}></div>
                    </button>
                    <span className="text-sm font-bold mt-4 opacity-0 animate-in fade-in slide-in-from-bottom-2 delay-200 fill-mode-forwards" style={{ color: '#01d335' }}>Click Checkmark to Confirm</span>
                </div>
            )
        }
    };


    return (
        <div className={className}>
            {value ? (
                // Display Mode (Value + Edit Button)
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{value}</span>
                    <button
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-orange-500 transition-colors"
                        title="Edit Equipment"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                    </button>
                </div>
            ) : (
                // Initial Trigger (Select Placeholder)
                <div
                    onClick={openModal}
                    className="cursor-pointer text-gray-500 border-b border-dashed border-gray-300 hover:border-orange-400 hover:text-orange-600 transition-colors py-1 min-h-[28px] flex items-center w-full"
                >
                    <span className="italic text-xs">Pilih peralatan...</span>
                </div>
            )}

            {/* Immersive Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/33 backdrop-blur-[2px] p-4"
                    >
                        {/* Click backdrop to close */}
                        <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>

                        {/* Transparent Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="relative w-full max-w-2xl mx-auto z-10"
                        >
                            {/* Header/Close */}
                            <div className="absolute -top-12 right-0">
                                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors p-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                            </div>

                            {/* Progress Breadcrumbs (Floating) */}
                            <div className="mb-4 flex justify-center">
                                {renderBreadcrumbs()}
                            </div>

                            {/* Content Area (Floating Grid) - Scrollable */}
                            <div className="w-full max-h-[60vh] overflow-y-auto p-3 -m-3">
                                {renderStepContent()}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CascadingDropdown;

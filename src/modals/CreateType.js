import React, { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, TagIcon } from '@heroicons/react/24/outline';
import { createType } from "../http/deviceApi.js";

const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const labelClass =
  "mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]";

const CreateType = ({ show, onHide }) => {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setName('');
    };

    const addType = () => {
        if (!name.trim()) {
            return alert("Пожалуйста, введите название категории.");
        }

        setIsSubmitting(true);
        createType({ name: name.trim() })
            .then(() => {
                resetForm();
                onHide();
            })
            .catch((e) => alert(e.response?.data?.message || "Ошибка при создании типа"))
            .finally(() => setIsSubmitting(false));
    };

    const handleClose = () => {
        resetForm();
        onHide();
    };

    return (
        <Transition.Root show={show} as={Fragment}>
            <Dialog as="div" className="relative z-[100] font-sans" onClose={handleClose}>
                
                {/* --- BACKDROP --- */}
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                >
                    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                        >
                            {/* Сделали max-w-md, так как поле всего одно — так выглядит аккуратнее */}
                            <Dialog.Panel className="relative flex w-full max-w-md flex-col overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] text-left outline-none sm:h-auto max-h-[90vh]">
                                
                                {/* --- HEADER --- */}
                                <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-8 bg-white/50">
                                    <div>
                                        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
                                            Новая категория
                                        </h2>
                                    </div>
                                    <button
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95"
                                        onClick={handleClose}
                                    >
                                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                                    </button>
                                </div>

                                {/* --- BODY --- */}
                                <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                                    
                                    <div className="mb-6 flex items-center gap-4 rounded-2xl bg-[var(--color-accent-soft)]/10 p-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-accent)] shadow-sm border border-[var(--color-accent)]/20">
                                            <TagIcon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-bold text-[var(--color-text-primary)]">Тип устройства</h3>
                                            <p className="text-[12px] text-[var(--color-text-muted)] mt-0.5">
                                                Используется для классификации товаров в каталоге
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label htmlFor="name" className={labelClass}>
                                                Название категории
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={name}
                                                autoComplete="off"
                                                onChange={e => setName(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') addType();
                                                }}
                                                placeholder="Например: Смартфоны, Ноутбуки..."
                                                className={inputClass}
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* --- FOOTER ACTIONS --- */}
                                <div className="flex shrink-0 flex-col-reverse items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                                    <button
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                        className="w-full rounded-full border border-[var(--color-border)] bg-white px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] shadow-sm transition-all hover:bg-gray-50 active:scale-95 sm:w-auto"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        onClick={addType}
                                        disabled={isSubmitting}
                                        className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-pulse">Сохранение...</span>
                                        ) : (
                                            "Добавить категорию"
                                        )}
                                    </button>
                                </div>

                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default CreateType;
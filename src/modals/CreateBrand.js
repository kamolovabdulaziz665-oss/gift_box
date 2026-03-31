import React, { Fragment, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  SwatchIcon, 
  DocumentTextIcon, 
  PhotoIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { createBrand } from "../http/deviceApi.js";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const labelClass =
  "mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]";

const CreateBrand = ({ show, onHide }) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-black text-white");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setName("");
    setColor("bg-black text-white");
    setDescription("");
    setFile(null);
  };

  const addBrand = () => {
    if (!name) {
      return alert("Пожалуйста, введите название бренда.");
    }

    setIsSubmitting(true);
    
    // Подготовка данных для отправки
    const formData = new FormData();
    formData.append("name", name);
    formData.append("color", color);
    formData.append("description", description);
    if (file) {
      formData.append("cover_image", file);
    }

    createBrand(formData)
      .then(() => {
        resetForm();
        onHide();
      })
      .catch((e) => alert(e.response?.data?.message || "Ошибка при создании бренда"))
      .finally(() => setIsSubmitting(false));
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[100] font-sans" onClose={onHide}>
        
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
              <Dialog.Panel className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] text-left outline-none sm:h-auto max-h-[90vh]">
                
                {/* --- HEADER --- */}
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-8 bg-white/50">
                  <div>
                    <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
                      Новый бренд
                    </h2>
                    <p className="mt-1 text-[13px] text-[var(--color-text-muted)]">
                      Регистрация производителя в каталоге
                    </p>
                  </div>
                  <button
                    type="button"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95"
                    onClick={onHide}
                  >
                    <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                {/* --- BODY (SCROLLABLE) --- */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                  <div className="space-y-6">
                    
                    {/* --- NAME INPUT --- */}
                    <div>
                      <label className={labelClass}>Название бренда</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Например: Apple, Samsung..."
                        className={inputClass}
                      />
                    </div>

                    {/* --- DESCRIPTION TEXTAREA --- */}
                    <div>
                      <label className={labelClass}>
                        <DocumentTextIcon className="h-4 w-4 text-[var(--color-accent)]" /> 
                        Описание (Опционально)
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Краткая информация о бренде..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* --- COLOR INPUT --- */}
                      <div>
                        <label className={labelClass}>
                          <SwatchIcon className="h-4 w-4 text-[var(--color-accent)]" /> 
                          Цветовая схема (Tailwind)
                        </label>
                        <input
                          type="text"
                          value={color}
                          onChange={(e) => setColor(e.target.value)}
                          placeholder="Например: bg-white text-black"
                          className={inputClass}
                        />

                        {/* --- LIVE PREVIEW --- */}
                        {name && (
                          <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-center">
                            <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                              Предпросмотр бейджа
                            </span>
                            <div className="flex items-center justify-center">
                              <span 
                                className={classNames(
                                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[13px] font-bold shadow-sm transition-all",
                                  color
                                )}
                              >
                                {name}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* --- FILE UPLOAD --- */}
                      <div>
                        <label className={labelClass}>
                          <PhotoIcon className="h-4 w-4 text-[var(--color-accent)]" /> 
                          Логотип / Обложка
                        </label>
                        <div className="group relative flex h-[140px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:bg-blue-50/50">
                          <input
                            type="file"
                            onChange={selectFile}
                            accept="image/*"
                            className="absolute inset-0 z-10 cursor-pointer opacity-0"
                          />
                          {file ? (
                            <div className="flex flex-col items-center text-center animate-fade-in">
                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                                <CheckIcon className="h-5 w-5" />
                              </div>
                              <span className="max-w-[150px] truncate text-[12px] font-bold text-[var(--color-text-primary)]">
                                {file.name}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center opacity-70 transition-opacity group-hover:opacity-100">
                              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[var(--color-text-muted)] shadow-sm group-hover:text-[var(--color-accent)]">
                                <PhotoIcon className="h-5 w-5" />
                              </div>
                              <span className="text-[12px] font-bold text-[var(--color-text-primary)]">
                                Загрузить лого
                              </span>
                              <span className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                                PNG или WEBP
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

                {/* --- FOOTER ACTIONS --- */}
                <div className="flex shrink-0 flex-col-reverse items-center gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-5 sm:flex-row sm:justify-end sm:px-8">
                  <button
                    onClick={onHide}
                    disabled={isSubmitting}
                    className="w-full rounded-full border border-[var(--color-border)] bg-white px-6 py-3.5 text-[13px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] shadow-sm transition-all hover:bg-gray-50 active:scale-95 sm:w-auto"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={addBrand}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Сохранение...</span>
                    ) : (
                      "Добавить бренд"
                    )}
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateBrand;
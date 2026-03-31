import React, { Fragment, useState, useContext, useEffect } from "react";
import { convertToRaw, EditorState } from "draft-js";
import { Context } from "../index.js";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { XMarkIcon, ChevronDownIcon, CloudArrowUpIcon, TrashIcon, PlusIcon, CheckIcon } from "@heroicons/react/24/outline";
import { createDevice, fetchBrands, fetchTypes } from "../http/deviceApi.js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const labelClass =
  "block mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]";

const CreateDevice = ({ show, onHide }) => {
  const { device } = useContext(Context);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [brandField, setBrand] = useState(null);
  const [typeField, setType] = useState(null);
  const [info, setInfo] = useState([]);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBrands().then((data) => device.setBrands(data));
    fetchTypes().then((data) => device.setTypes(data));
  }, [device]);

  const addInfo = () => {
    setInfo([...info, { title: "", description: "", number: Date.now() }]);
  };

  const handleInputChange = (key, value, number) => {
    setInfo(info.map((i) => (i.number === number ? { ...i, [key]: value } : i)));
  };

  const handleDelete = (number) => {
    setInfo(info.filter((i) => i.number !== number));
  };

  const selectFile = (e) => {
    setFile(e.target.files[0]);
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFile(null);
    setBrand(null);
    setType(null);
    setInfo([]);
    setEditorState(EditorState.createEmpty());
  };

  const addDevice = () => {
    if (!name || !price || !file || !brandField || !typeField) {
      return alert("Пожалуйста, заполните все обязательные поля (Имя, Цена, Фото, Бренд, Тип).");
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("img", file);
    formData.append("brandId", brandField.id);
    formData.append("typeId", typeField.id);
    formData.append("info", JSON.stringify(info));

    const contentState = editorState.getCurrentContent();
    const descriptionHtml = draftToHtml(convertToRaw(contentState));
    formData.append("description", descriptionHtml);

    createDevice(formData)
      .then(() => {
        resetForm();
        onHide();
      })
      .catch(e => alert(e.response?.data?.message || e.message))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="relative z-[100] font-sans" onClose={onHide}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
        >
          {/* Размытый фон (Glassmorphism overlay) */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
            >
              <Dialog.Panel className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(15,23,42,0.12)] outline-none sm:h-auto max-h-[90vh]">
                
                {/* --- HEADER --- */}
                <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-8">
                  <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
                    Добавление товара
                  </h2>
                  <button 
                    onClick={onHide} 
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* --- BODY (SCROLLABLE) --- */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
                  <div className="space-y-8">
                    
                    {/* Basic Info & Image Upload Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
                      
                      {/* Left: Selectors & Inputs */}
                      <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Type Select */}
                          <div>
                            <label className={labelClass}>Тип устройства</label>
                            <Menu as="div" className="relative">
                              <Menu.Button className={`${inputClass} flex items-center justify-between`}>
                                <span className="truncate">{typeField?.name || "Выберите..."}</span>
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                              >
                                <Menu.Items className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-[var(--color-border)] bg-white p-1.5 shadow-xl outline-none custom-scrollbar">
                                  {device.types.map((type) => (
                                    <Menu.Item key={type.id}>
                                      {({ active }) => (
                                        <button
                                          onClick={() => setType(type)}
                                          className={classNames(
                                            active ? "bg-[var(--color-surface-muted)] text-[var(--color-accent)]" : "text-[var(--color-text-primary)]",
                                            "flex w-full items-center rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors"
                                          )}
                                        >
                                          {type.name}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>

                          {/* Brand Select */}
                          <div>
                            <label className={labelClass}>Бренд</label>
                            <Menu as="div" className="relative">
                              <Menu.Button className={`${inputClass} flex items-center justify-between`}>
                                <span className="truncate">{brandField?.name || "Выберите..."}</span>
                                <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 text-[var(--color-text-muted)]" />
                              </Menu.Button>
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                              >
                                <Menu.Items className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-[var(--color-border)] bg-white p-1.5 shadow-xl outline-none custom-scrollbar">
                                  {device.brands.map((brand) => (
                                    <Menu.Item key={brand.id}>
                                      {({ active }) => (
                                        <button
                                          onClick={() => setBrand(brand)}
                                          className={classNames(
                                            active ? "bg-[var(--color-surface-muted)] text-[var(--color-accent)]" : "text-[var(--color-text-primary)]",
                                            "flex w-full items-center rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors"
                                          )}
                                        >
                                          {brand.name}
                                        </button>
                                      )}
                                    </Menu.Item>
                                  ))}
                                </Menu.Items>
                              </Transition>
                            </Menu>
                          </div>
                        </div>

                        <div>
                          <label className={labelClass}>Название товара</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            placeholder="Например: iPhone 15 Pro"
                          />
                        </div>

                        <div>
                          <label className={labelClass}>Стоимость (₽)</label>
                          <input
                            type="number"
                            min="0"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={inputClass}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      {/* Right: Image Upload */}
                      <div>
                        <label className={labelClass}>Фотография</label>
                        <div className="group relative flex h-[160px] md:h-[220px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 transition-all duration-300 hover:border-[var(--color-accent)]/50 hover:bg-blue-50/50">
                          <input 
                            type="file" 
                            onChange={selectFile} 
                            className="absolute inset-0 z-10 cursor-pointer opacity-0" 
                            accept="image/*"
                          />
                          {file ? (
                            <div className="flex flex-col items-center text-center">
                              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                                <CheckIcon className="h-7 w-7" />
                              </div>
                              <span className="max-w-[200px] truncate text-[14px] font-bold text-[var(--color-text-primary)]">
                                {file.name}
                              </span>
                              <span className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                                Нажмите, чтобы изменить
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center text-center opacity-70 transition-opacity group-hover:opacity-100">
                              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[var(--color-text-muted)] shadow-sm group-hover:text-[var(--color-accent)]">
                                <CloudArrowUpIcon className="h-7 w-7" />
                              </div>
                              <span className="text-[14px] font-bold text-[var(--color-text-primary)]">
                                Загрузить изображение
                              </span>
                              <span className="mt-1 text-[12px] text-[var(--color-text-muted)]">
                                PNG, JPG или WEBP
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Rich Text Editor */}
                    <div>
                      <label className={labelClass}>Подробное описание</label>
                      <div className="modern-editor-wrapper">
                        <Editor
                          editorState={editorState}
                          onEditorStateChange={setEditorState}
                          toolbar={{
                            options: ['inline', 'list', 'textAlign', 'history'],
                            inline: { inDropdown: false, options: ['bold', 'italic', 'underline'] },
                            list: { inDropdown: true },
                          }}
                        />
                      </div>
                    </div>

                    {/* Dynamic Parameters (Info) */}
                    <div>
                      <div className="mb-4 flex items-center justify-between">
                        <label className={`${labelClass} mb-0`}>Характеристики устройства</label>
                        <button 
                          onClick={addInfo}
                          className="flex items-center gap-2 rounded-full bg-[var(--color-surface-muted)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] active:scale-95"
                        >
                          <PlusIcon className="h-4 w-4" /> Добавить
                        </button>
                      </div>

                      {info.length === 0 ? (
                         <div className="rounded-2xl border border-dashed border-[var(--color-border)] py-8 text-center text-sm text-[var(--color-text-muted)]">
                            Характеристики пока не добавлены
                         </div>
                      ) : (
                        <div className="space-y-3">
                          {info.map((item) => (
                            <div key={item.number} className="flex flex-col gap-2 sm:flex-row sm:items-center animate-slide-up">
                              <input
                                placeholder="Название (напр. Память)"
                                value={item.title}
                                onChange={(e) => handleInputChange("title", e.target.value, item.number)}
                                className={`${inputClass} sm:flex-1`}
                              />
                              <input
                                placeholder="Значение (напр. 256 ГБ)"
                                value={item.description}
                                onChange={(e) => handleInputChange("description", e.target.value, item.number)}
                                className={`${inputClass} sm:flex-[2]`}
                              />
                              <button
                                onClick={() => handleDelete(item.number)}
                                title="Удалить характеристику"
                                className="group flex h-12 w-full shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-all hover:bg-red-50 hover:text-red-500 sm:w-12"
                              >
                                <TrashIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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
                    onClick={addDevice}
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] px-8 py-3.5 text-[13px] font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <span className="animate-pulse">Загрузка...</span>
                    ) : (
                      "Сохранить товар"
                    )}
                  </button>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        {/* CSS Переопределения для react-draft-wysiwyg под новый стиль */}
        <style jsx global>{`
          .modern-editor-wrapper {
            border: 1px solid var(--color-border);
            border-radius: 1rem;
            overflow: hidden;
            background: var(--color-surface-muted);
            transition: all 0.3s ease;
          }
          .modern-editor-wrapper:focus-within {
            background: #ffffff;
            border-color: rgba(59, 130, 246, 0.4);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          .modern-editor-wrapper .rdw-editor-toolbar {
            background: transparent !important;
            border: none !important;
            border-bottom: 1px solid var(--color-border) !important;
            padding: 10px 16px !important;
            display: flex;
            gap: 4px;
          }
          .modern-editor-wrapper .rdw-option-wrapper {
            border: none !important;
            border-radius: 8px !important;
            background: transparent !important;
            box-shadow: none !important;
            color: var(--color-text-muted) !important;
            transition: all 0.2s !important;
          }
          .modern-editor-wrapper .rdw-option-wrapper:hover {
            background: var(--color-surface-muted) !important;
            color: var(--color-text-primary) !important;
          }
          .modern-editor-wrapper .rdw-option-active {
            background: rgba(59, 130, 246, 0.1) !important;
            color: var(--color-accent) !important;
          }
          .modern-editor-wrapper .rdw-editor-main {
            padding: 0 16px 16px !important;
            min-height: 180px;
            font-family: inherit;
            font-size: 14px;
            color: var(--color-text-primary);
            background: transparent;
          }
          
          /* Custom Scrollbar for Modal content */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: var(--color-border);
            border-radius: 10px;
          }
          .custom-scrollbar:hover::-webkit-scrollbar-thumb {
            background-color: #cbd5e1;
          }
        `}</style>
      </Dialog>
    </Transition.Root>
  );
};

export default CreateDevice;
import { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  CommandLineIcon,
  CpuChipIcon,
  ServerStackIcon,
  ChevronRightIcon,
  UsersIcon,
  RectangleStackIcon
} from "@heroicons/react/24/outline";
import CreateBrand from "../modals/CreateBrand.js";
import CreateType from "../modals/CreateType.js";
import CreateDevice from "../modals/CreateDevice.js";
import ParticipantsList from '../components/admin/ParticipantsList.js';
import DeviceListAdmin from '../components/admin/DeviceListAdmin.js';

// --- ELEGANT ACCORDION COMPONENT ---
const AdminSectionAccordion = ({ title, icon: Icon, isOpen, onToggle, children }) => {
  return (
    <div className={`overflow-hidden rounded-[24px] border transition-all duration-300 ${
      isOpen 
        ? "border-[var(--color-accent)]/30 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)]" 
        : "border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-white hover:shadow-sm"
    }`}>
      <button 
        onClick={onToggle}
        className="flex w-full items-center justify-between p-5 sm:p-6 outline-none transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
            isOpen ? "bg-[var(--color-accent)] text-white shadow-md shadow-[var(--color-accent)]/20" : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
          }`}>
            <Icon className="h-6 w-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)] sm:text-xl">
            {title}
          </h3>
        </div>
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-surface-muted)] transition-transform duration-300 ${
          isOpen ? "rotate-90 bg-[var(--color-accent)]/10 text-[var(--color-accent)]" : "text-[var(--color-text-muted)]"
        }`}>
          <ChevronRightIcon className="h-4 w-4" />
        </div>
      </button>

      <div className={`grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
      }`}>
        <div className="overflow-hidden">
          <div className="border-t border-[var(--color-border)] bg-[var(--color-surface)]/30 p-5 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- QUICK ACTION CARD COMPONENT ---
const ActionCard = ({ title, description, icon: Icon, onClick, gradient }) => (
  <button
    onClick={onClick}
    className="group relative flex w-full flex-col items-start overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white p-6 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-accent)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] active:translate-y-0"
  >
    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${gradient} text-white shadow-inner`}>
      <Icon className="h-7 w-7" />
    </div>
    <h4 className="font-display text-lg font-bold text-[var(--color-text-primary)]">{title}</h4>
    <p className="mt-1 text-sm text-[var(--color-text-muted)] line-clamp-2">{description}</p>
    
    <div className="absolute right-6 top-6 rounded-full bg-[var(--color-surface-muted)] p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
      <ChevronRightIcon className="h-4 w-4 text-[var(--color-text-primary)]" />
    </div>
  </button>
);

const Admin = observer(() => {
  const [brandVisible, setBrandVisible] = useState(false);
  const [typeVisible, setTypeVisible] = useState(false);
  const [deviceVisible, setDeviceVisible] = useState(false);

  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [devicesOpen, setDevicesOpen] = useState(true); // Open by default for better UX

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-hidden px-4 py-12 font-sans text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      
      {/* BACKGROUND DECORATIONS */}
      <div className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full border border-[var(--color-accent)]/15 opacity-90 animate-slide-up sm:h-96 sm:w-96" aria-hidden />
      <div className="pointer-events-none absolute -left-24 bottom-20 h-64 w-64 rounded-full bg-[var(--color-accent-soft)] blur-3xl animate-fade-in sm:h-80 sm:w-80" aria-hidden />
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply luxury-noise" aria-hidden />

      <div className="relative z-10 w-full max-w-[1000px] space-y-10">
        
        {/* HEADER */}
        <div className="text-center sm:text-left text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-4xl">
            Панель управления
          </h1>
          <p className="mt-2 text-[15px] text-[var(--color-text-muted)]">
            Управление каталогом, категориями и пользователями системы
          </p>
        </div>

        {/* QUICK ACTIONS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ActionCard 
            title="Добавить тип" 
            description="Создание новой категории товаров" 
            icon={CommandLineIcon} 
            onClick={() => setTypeVisible(true)} 
            gradient="from-blue-500 to-indigo-600"
          />
          <ActionCard 
            title="Добавить бренд" 
            description="Регистрация нового производителя" 
            icon={ServerStackIcon} 
            onClick={() => setBrandVisible(true)} 
            gradient="from-emerald-400 to-teal-500"
          />
          <ActionCard 
            title="Добавить товар" 
            description="Публикация нового устройства в каталог" 
            icon={CpuChipIcon} 
            onClick={() => setDeviceVisible(true)} 
            gradient="from-[var(--color-accent)] to-[var(--color-accent-deep)]"
          />
        </div>

        {/* MANAGEMENT ACCORDIONS */}
        <div className="space-y-4">
          <AdminSectionAccordion 
            title="Реестр товаров" 
            icon={RectangleStackIcon}
            isOpen={devicesOpen}
            onToggle={() => setDevicesOpen(!devicesOpen)}
          >
            <DeviceListAdmin />
          </AdminSectionAccordion>

          <AdminSectionAccordion 
            title="Пользователи системы" 
            icon={UsersIcon}
            isOpen={participantsOpen}
            onToggle={() => setParticipantsOpen(!participantsOpen)}
          >
            <ParticipantsList />
          </AdminSectionAccordion>
        </div>

        {/* MODALS */}
        <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)} />
        <CreateType show={typeVisible} onHide={() => setTypeVisible(false)} />
        <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)} />
        
      </div>
    </div>
  );
});

export default Admin;
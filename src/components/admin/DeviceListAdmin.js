import React, { useContext, useEffect, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index.js";
import { fetchDevices, deleteDevice } from "../../http/deviceApi.js";
import { PencilSquareIcon, TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import UpdateDevice from "../../modals/UpdateDevice.js";
import { getImgSrc } from "../../utils/getImgSrc.js";

const DeviceListAdmin = observer(() => {
  const { device } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);

  const loadDevices = useCallback(() => {
    setLoading(true);
    fetchDevices(null, null, 1, 100).then((data) => {
      device.setDevices(data);
    }).finally(() => setLoading(false));
  }, [device]);

  useEffect(() => {
    loadDevices();
  },[device, loadDevices]);

  const handleDelete = async (id) => {
    if (window.confirm("Вы уверены, что хотите удалить этот товар? Это действие нельзя отменить.")) {
      try {
        await deleteDevice(id);
        loadDevices();
      } catch (e) {
        alert(e.response?.data?.message || "Ошибка при удалении товара");
      }
    }
  };

  const openUpdateModal = (id) => {
    setSelectedDeviceId(id);
    setUpdateModalVisible(true);
  };

  if (loading) {
    return (
      <div className="flex animate-pulse flex-col gap-3 py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 w-full rounded-2xl bg-[var(--color-surface-muted)]"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="animate-fade-in w-full">
      
      {device.devices.rows?.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-muted)] py-12 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-[var(--color-text-muted)] shadow-sm">
            <ExclamationTriangleIcon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">Товары не найдены</h3>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">Каталог пока пуст. Добавьте первый товар.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 sm:gap-3">
          {device.devices.rows?.map((d) => (
            <div 
              key={d.id} 
              className="group flex items-center justify-between rounded-[20px] bg-[var(--color-surface)] p-3 shadow-sm transition-all hover:bg-white hover:shadow-md sm:p-4"
            >
              {/* Левая часть: Фото + Информация */}
              <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                
                {/* Изображение */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-white shadow-sm sm:h-14 sm:w-14">
                  <img
                    src={getImgSrc(d.img)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={d.name}
                  />
                </div>

                {/* Текст */}
                <div className="flex min-w-0 flex-col">
                  <div className="flex items-center gap-2">
                    <h4 className="truncate font-bold text-[var(--color-text-primary)] text-[14px] sm:text-[16px]">
                      {d.name}
                    </h4>
                    <span className="hidden shrink-0 rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 font-mono text-[10px] font-medium text-[var(--color-text-muted)] sm:inline-block">
                      #{d.id.toString().padStart(4, "0")}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {/* Цена */}
                    <span className="font-semibold tracking-wide text-[var(--color-accent)] text-[13px] sm:text-[14px]">
                      {Number.isFinite(Number(d.price)) ? `${Number(d.price).toLocaleString()} ₽` : "—"}
                    </span>
                    
                    {/* Бейджи Брендов и Типов (адаптивно скрываются на совсем мелких экранах) */}
                    <div className="hidden items-center gap-1.5 xs:flex">
                      <span className="text-[10px] text-[var(--color-border)]">•</span>
                      <span className="truncate rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 ring-1 ring-inset ring-emerald-500/20 max-w-[80px]">
                        {device.brands.find(b => b.id === d.brandId)?.name || `B${d.brandId}`}
                      </span>
                      <span className="truncate rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600 ring-1 ring-inset ring-blue-500/20 max-w-[80px]">
                        {device.types.find(t => t.id === d.typeId)?.name || `T${d.typeId}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Правая часть: Кнопки действий */}
              <div className="ml-2 flex shrink-0 items-center gap-1 sm:gap-2">
                <button
                  onClick={() => openUpdateModal(d.id)}
                  title="Редактировать"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-all hover:bg-blue-50 hover:text-blue-600 active:scale-95 sm:h-10 sm:w-10"
                >
                  <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => handleDelete(d.id)}
                  title="Удалить"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)] transition-all hover:bg-red-50 hover:text-red-500 active:scale-95 sm:h-10 sm:w-10"
                >
                  <TrashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <UpdateDevice 
         show={updateModalVisible} 
         onHide={() => setUpdateModalVisible(false)} 
         deviceId={selectedDeviceId}
         onUpdated={loadDevices}
      />
    </div>
  );
});

export default DeviceListAdmin;
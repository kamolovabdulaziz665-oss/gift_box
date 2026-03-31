import React, { useContext } from "react";
import { Context } from "../index.js";
import { observer } from "mobx-react-lite";
import { getImgSrc } from "../utils/getImgSrc.js";

const Basket = observer(() => {
  const { basket } = useContext(Context);

  const handleRemove = (deviceId) => {
    basket.removeItem(deviceId);
  };

  const handleDecrease = (deviceId) => {
    basket.decreaseQuantity(deviceId);
  };

  const handleIncrease = (device) => {
    basket.addItem(device);
  };

  const handleClear = () => {
    basket.clearBasket();
  };

  return (
    <div className="relative flex min-h-screen items-start justify-center overflow-x-hidden px-5 py-12 font-sans text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      
      {/* BACKGROUND DECORATIONS */}
      <div
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full border border-[var(--color-accent)]/10 opacity-[0.08] sm:h-96 sm:w-96"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-20 h-64 w-64 rounded-full bg-[var(--color-accent-soft)] blur-3xl opacity-[0.08] sm:h-80 sm:w-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-multiply luxury-noise"
        aria-hidden
      />

      {/* BASKET CARD */}
      <div className="relative z-10 w-full max-w-[800px] mt-8 sm:mt-12">
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
          
          {/* HEADER */}
          <div className="mb-10 flex flex-col items-center text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
              Savatcha
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {basket.items.length > 0 ? "Проверьте выбранные товары перед оформлением" : "Здесь пока ничего нет"}
            </p>
          </div>

          {basket.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-[14px] font-medium text-[var(--color-text-muted)]">
                Savatcha bo‘sh
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              {/* ITEM LIST */}
              <div className="space-y-4">
                {basket.items.map((item) => (
                  <div 
                    key={item.device.id} 
                    className="flex flex-col justify-between gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition-all hover:border-[var(--color-accent)]/30 hover:bg-white sm:flex-row sm:items-center sm:p-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[16px] border border-[var(--color-border)] bg-white shadow-sm">
                        <img 
                          src={getImgSrc(item.device.img)} 
                          alt={item.device.name} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <h2 className="text-[16px] font-bold text-[var(--color-text-primary)] line-clamp-2">
                          {item.device.name}
                        </h2>
                        <p className="mt-1 text-[14px] font-semibold tracking-wide text-[var(--color-accent)]">
                          {Number(item.device.price).toLocaleString()} руб.
                        </p>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between gap-4 sm:mt-0 sm:justify-end sm:gap-6">
                      
                      {/* QUANTITY CONTROLS */}
                      <div className="flex items-center rounded-2xl border border-[var(--color-border)] bg-white p-1.5 shadow-sm">
                        <button 
                          onClick={() => handleDecrease(item.device.id)} 
                          className="flex h-11 w-11 items-center justify-center rounded-[10px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] active:scale-95"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                        </button>
                        <span className="w-10 text-center text-[14px] font-bold text-[var(--color-text-primary)]">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleIncrease(item.device)} 
                          className="flex h-11 w-11 items-center justify-center rounded-[10px] text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-muted)] hover:text-[var(--color-text-primary)] active:scale-95"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>

                      {/* REMOVE BUTTON */}
                      <button 
                        onClick={() => handleRemove(item.device.id)} 
                        className="group flex h-11 w-11 items-center justify-center rounded-2xl border border-transparent bg-white text-[var(--color-text-muted)] shadow-sm transition-all hover:border-red-500/20 hover:bg-red-50 hover:text-red-500 active:scale-95"
                        title="Удалить"
                      >
                        <svg className="h-5 w-5 transition-transform group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL & ACTIONS */}
              <div className="mt-8 border-t border-[var(--color-border)] pt-8">
                <div className="mb-8 flex items-end justify-between">
                  <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                    To‘lovga jami
                  </span>
                  <span className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
                    {basket.total.toLocaleString()} руб.
                  </span>
                </div>
                
                <div className="flex flex-col-reverse gap-4 sm:flex-row">
                  <button 
                    onClick={handleClear} 
                    className="flex w-full min-h-[48px] items-center justify-center rounded-full border border-[var(--color-border)] bg-white py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-red-400/50 hover:text-red-500 active:scale-[0.98] sm:w-1/3"
                  >
                    Tozalash
                  </button>
                  <button 
                    className="flex w-full min-h-[48px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] py-4 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] sm:w-2/3"
                  >
                    Buyurtma berish
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default Basket;
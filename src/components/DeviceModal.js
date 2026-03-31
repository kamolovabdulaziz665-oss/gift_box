import React, { useEffect, useState, Fragment, useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { Context } from "../index.js";
import { XMarkIcon, EyeIcon, ChatBubbleLeftIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

// API imports
import { 
  fetchOneDevices, 
  fetchDeviceComments, 
  createDeviceComment 
} from "../http/deviceApi.js";

import { getImgSrc } from "../utils/getImgSrc.js";
import { toast } from "react-toastify";

const inputClass =
  "w-full rounded-full border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:ring-2 focus:ring-[var(--color-accent)]/15";

const DeviceModal = observer(({ show, onHide, deviceId }) => {
  const { user, device: deviceStore, basket } = useContext(Context);
  const navigate = useNavigate();

  const [device, setDevice] = useState(null);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState({});
  const [commentTexts, setCommentTexts] = useState({});

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  useEffect(() => {
    if (show && deviceId) {
      setLoading(true);
      
      fetchOneDevices(deviceId).then((data) => {
        setDevice(data);
        setLoading(false);
      });

      fetchDeviceComments(deviceId).then((data) => {
        setComments((prev) => ({
          ...prev,
          [deviceId]: data,
        }));
      });

    } else {
      setDevice(null);
    }
  },[show, deviceId]);

  const handleAddToBasket = () => {
    if (device && !loading && device.price !== undefined) {
      basket.addItem(device);
      toast.success(`${device.name} added to cart!`);
    }
  };

  const handleFormSubmit = async (event, currentDeviceId) => {
    event.preventDefault();
    const text = commentTexts[currentDeviceId] || "";
    
    if (text.trim() !== "") {
      try {
        await createDeviceComment(currentDeviceId, text.trim());
        const updatedComments = await fetchDeviceComments(currentDeviceId);
        
        setComments((prev) => ({
          ...prev,
          [currentDeviceId]: updatedComments,
        }));
        
        setCommentTexts((prev) => ({ ...prev,[currentDeviceId]: "" }));
      } catch (error) {
        console.error("Error sending comment:", error);
      }
    }
  };

  const brandName = device ? (deviceStore.brands.find(b => b.id === device.brandId)?.name || "Unknown Brand") : "";
  const typeName = device ? (deviceStore.types.find(t => t.id === device.typeId)?.name || "Unknown Type") : "";

  return (
    <Transition.Root show={show} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onHide}>
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          
          <Transition.Child 
            as={Fragment} 
            enter="ease-out duration-300" 
            enterFrom="opacity-0" 
            enterTo="opacity-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100" 
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

          <Transition.Child 
            as={Fragment} 
            enter="ease-out duration-300" 
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" 
            enterTo="opacity-100 translate-y-0 sm:scale-100" 
            leave="ease-in duration-200" 
            leaveFrom="opacity-100 translate-y-0 sm:scale-100" 
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block w-full max-w-4xl transform overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-white text-left align-middle shadow-[0_24px_80px_rgba(15,23,42,0.15)] transition-all sm:my-8 relative">
              
              {/* Close Button */}
              <button 
                onClick={onHide} 
                className="absolute right-5 top-5 z-20 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-2 text-[var(--color-text-muted)] shadow-sm transition-all hover:border-[var(--color-accent)]/35 hover:text-[var(--color-text-primary)] focus:outline-none"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>

              <div className="flex max-h-[85vh] flex-col p-6 sm:p-8">
                {loading || !device ? (
                  <div className="flex flex-col items-center justify-center py-32">
                     <ArrowPathIcon className="h-10 w-10 animate-spin text-[var(--color-accent)] mb-4" />
                     <div className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[var(--color-text-muted)]">Loading details...</div>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
                    
                    {/* Top Row: Image & Core Info */}
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Image Section */}
                      <div className="w-full shrink-0 lg:w-1/2">
                         <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-8 shadow-inner">
                            <img
                              src={getImgSrc(device.img)}
                              alt={device.name}
                              className="h-full w-full object-contain mix-blend-multiply transition-transform duration-700 hover:scale-105"
                            />
                         </div>
                      </div>

                      {/* Details Section */}
                      <div className="flex w-full flex-col lg:w-1/2">
                        {/* Badges */}
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                             <span>{brandName}</span>
                             <span className="h-1 w-1 rounded-full bg-[var(--color-border)]" />
                             <span>{typeName}</span>
                          </div>
                          
                          {/* Stats */}
                          <div className="flex gap-3 text-[12px] font-medium text-[var(--color-text-muted)]">
                              <div className="flex items-center gap-1.5">
                                <EyeIcon className="h-4 w-4" />
                                <span>{device.views || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <ChatBubbleLeftIcon className="h-4 w-4" />
                                <span>{comments[deviceId]?.length || 0}</span>
                              </div>
                          </div>
                        </div>

                        {/* Title & Price */}
                        <h2 className="font-display text-3xl font-bold text-[var(--color-text-primary)]">
                          {device.name}
                        </h2>
                        
                        <div className="mt-4 flex items-end justify-between border-b border-[var(--color-border)] pb-6">
                           <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                              {Number.isFinite(Number(device.price)) ? `$${Number(device.price)}` : "TBD"}
                           </div>
                           {device.createdAt && (
                             <div className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text-muted)]">
                                Listed: {new Date(device.createdAt).toLocaleDateString("en-US", options)}
                             </div>
                           )}
                        </div>

                        {/* Description */}
                        {device.description && (
                          <div className="mt-6 text-sm leading-relaxed text-[var(--color-text-muted)]">
                             <div dangerouslySetInnerHTML={{ __html: device.description }} />
                          </div>
                        )}

                        {/* Specs */}
                        {device.info && device.info.length > 0 && (
                           <div className="mt-8 rounded-[16px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
                              <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                                Specifications
                              </h3>
                              <div className="space-y-3">
                                {device.info.map((info, index) => (
                                   <div key={info.id || index} className="flex justify-between border-b border-[var(--color-border)] pb-2 text-sm last:border-0 last:pb-0">
                                      <span className="text-[var(--color-text-muted)]">{info.title}</span>
                                      <span className="font-semibold text-[var(--color-text-primary)] ml-4 text-right">{info.description}</span>
                                   </div>
                                ))}
                              </div>
                           </div>
                        )}

                        {/* Savatchaga qo‘shish */}
                        <div className="mt-auto pt-8">
                            <button 
                              onClick={handleAddToBasket}
                              className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] py-4 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none"
                            >
                              Savatchaga qo‘shish
                            </button>
                        </div>
                      </div>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-10 rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6 lg:p-8">
                        <h3 className="mb-6 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-primary)]">
                          Sharhlar va izohlar
                        </h3>
                        
                        <div className="mb-6 max-h-[250px] space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                          {comments[deviceId]?.length > 0 ? (
                            comments[deviceId].map((comment, index) => (
                              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm" key={index}>
                                <div className="mb-1.5 flex items-center justify-between">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-primary)]">Customer</span>
                                  <span className="text-[10px] text-[var(--color-text-muted)]">
                                    {new Date(comment.createdAt).toLocaleDateString("en-US", options)}
                                  </span>
                                </div>
                                <p className="text-sm text-[var(--color-text-primary)]">
                                  {comment.text}
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="rounded-2xl border border-[var(--color-border)] border-dashed bg-white p-6 text-center text-sm text-[var(--color-text-muted)]">
                              Hali sharhlar yo‘q. Fikrlaringizni birinchilardan bo‘lib qoldiring.
                            </div>
                          )}
                        </div>

                        {/* Comment Input */}
                        <div className="border-t border-[var(--color-border)] pt-6">
                          {user.isAuth ? (
                            <form
                              onSubmit={(event) => handleFormSubmit(event, deviceId)}
                              className="flex gap-3"
                            >
                              <input
                                type="text"
                                value={commentTexts[deviceId] || ""}
                                placeholder="Izoh qoldiring..."
                                className={inputClass}
                                onChange={(e) =>
                                  setCommentTexts((prev) => ({
                                    ...prev,
                                    [deviceId]: e.target.value,
                                  }))
                                }
                              />
                              <button
                                type="submit"
                                disabled={!(commentTexts[deviceId]?.length > 0)}
                                className="shrink-0 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all hover:border-[var(--color-accent)]/35 hover:text-[var(--color-accent)] focus:outline-none disabled:opacity-50 disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-primary)]"
                              >
                                Post
                              </button>
                            </form>
                          ) : (
                            <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-white p-4">
                              <span className="text-sm text-[var(--color-text-muted)]">
                                Please log in to leave a review.
                              </span>
                              <button
                                onClick={() => navigate("/login")}
                                className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] transition-all hover:border-[var(--color-accent)]/35"
                              >
                                Log In
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Transition.Child>
        </div>

        {/* Updated light-theme scrollbar styles */}
        <style dangerouslySetInnerHTML={{__html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}} />
      </Dialog>
    </Transition.Root>
  );
});

export default DeviceModal;
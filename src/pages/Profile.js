import React, { useContext, useState, useEffect } from "react";
import { Context } from "../index.js";
import {
  UserIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  PencilSquareIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import Modal from "../elements/Modal";
import { observer } from "mobx-react-lite";
import { updateProfile } from "../http/userApi.js";
import { toast } from "react-toastify";

const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const labelClass =
  "block mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]";

const Profile = observer(() => {
  const { user } = useContext(Context);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Initialize state from store
  const [newName, setNewName] = useState(user.user?.first_name || "");
  const[newImage, setNewImage] = useState(user.user?.profile_image || "");
  const[newRole, setNewRole] = useState(user.user?.role || "USER");

  useEffect(() => {
    if (isModalOpen) {
      setNewName(user.user?.first_name || "");
      setNewImage(user.user?.profile_image || "");
      setNewRole(user.user?.role || "USER");
    }
  }, [isModalOpen, user.user]);

  const handleUpdate = async () => {
    try {
      const response = await updateProfile(
        user.user.id,
        newName,
        newImage,
        newRole,
        user
      );

      if (response.success) {
        toast.success("Profile updated successfully");
        setIsModalOpen(false);
      } else {
        toast.error(`Update failed: ${response.message}`);
      }
    } catch (e) {
      toast.error("Network or server error occurred");
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[var(--color-bg)] pb-20 font-sans text-[var(--color-text-primary)]">
      
      {/* BACKGROUND DECORATIONS */}
      <div
        className="pointer-events-none absolute -right-32 top-10 h-[500px] w-[500px] rounded-full border border-[var(--color-accent)]/15 opacity-90 animate-slide-up sm:h-[600px] sm:w-[600px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-40 h-[400px] w-[400px] rounded-full bg-[var(--color-accent-soft)] blur-[100px] animate-fade-in sm:h-[500px] sm:w-[500px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply luxury-noise"
        aria-hidden
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 pt-12 sm:px-6 lg:px-8">
        
        {/* PROFILE CARD */}
        <div className="overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[0_24px_80px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          
          {/* BANNER */}
          <div className="relative h-40 w-full bg-gradient-to-r from-[var(--color-accent-soft)] via-blue-50/50 to-transparent sm:h-52">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
          </div>

          <div className="px-6 pb-8 sm:px-10">
            <div className="relative -mt-16 sm:-mt-20 sm:flex sm:items-end sm:space-x-6">
              
              {/* AVATAR */}
              <div className="relative flex">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-[var(--color-surface-muted)] shadow-lg sm:h-40 sm:w-40">
                  {user.user?.profile_image ? (
                    <img
                      className="h-full w-full object-cover"
                      src={user.user.profile_image}
                      alt="Profile Avatar"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-surface-muted)]">
                      <span className="font-display text-5xl font-bold text-[var(--color-text-muted)]">
                        {getInitials(user.user?.first_name)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* USER INFO BAR */}
              <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-between sm:pb-2">
                <div className="min-w-0 flex-1">
                  <h1 className="truncate font-display text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
                    {user.user?.first_name || "Guest Member"}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-[12px] font-semibold uppercase tracking-[0.15em] text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheckIcon className="h-4 w-4 text-[var(--color-accent)]" />
                      Role: {user.user?.role || "GUEST"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <IdentificationIcon className="h-4 w-4" />
                      ID: {user.user?.id ? user.user.id.toString().padStart(5, "0") : "00000"}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex flex-col justify-stretch sm:mt-0 sm:flex-row">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-white px-6 py-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/35 active:scale-[0.98]"
                  >
                    <PencilSquareIcon className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* SYSTEM STATS / DETAILS SECTION */}
            <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
              
              {/* MEMBERSHIP STATUS CARD */}
              <div className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-6">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  <UserIcon className="h-4 w-4" />
                  Account Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Membership</span>
                    <span className="font-semibold text-[var(--color-accent)]">Active</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-border)]">
                    <div className="h-full w-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[#3b82f6]" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Your account is in good standing.
                  </p>
                </div>
              </div>

              {/* RECENT ACTIVITY CARD */}
              <div className="rounded-[24px] border border-[var(--color-border)] bg-white p-6 shadow-sm md:col-span-2">
                <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                  <ClockIcon className="h-4 w-4" />
                  Recent Activity
                </h3>
                <div className="space-y-3 text-sm text-[var(--color-text-muted)]">
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-3">
                    <span>Last Login</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--color-border)] pb-3">
                    <span>Account Security</span>
                    <span className="font-medium text-emerald-500">Secured</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span>Registered Phone</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {user.user?.phone_number || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* EDIT INFORMATION MODAL */}
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <div className="p-2">
          <div className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
              Edit Profile
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              Update your personal information
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className={labelClass}>First Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className={inputClass}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className={labelClass}>Profile Image URL</label>
              <input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className={inputClass}
                placeholder="https://example.com/image.png"
              />
            </div>

            <div>
              <label className={labelClass}>System Role</label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className={inputClass}
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Static Phone Display */}
            <div className="pt-2">
              <label className={labelClass}>Phone Identifier</label>
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-3.5 text-[14px] text-[var(--color-text-muted)]">
                {user.user?.phone_number || "No number attached"}{" "}
                <span className="ml-2 text-[10px] uppercase tracking-wider text-red-400">
                  (Locked)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleUpdate}
              className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] py-4 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Save Changes
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full rounded-full py-4 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
});

export default Profile;
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../index.js";
import {
  Bars2Icon,
  XMarkIcon,
  ChevronLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  NEWS_ROUTE,
  PROFILE_ROUTE,
  ADMIN_ROUTE,
  BASKET_ROUTE,
} from "../utils/consts.js";
import { fetchTypes } from "../http/deviceApi.js";
import { logout } from "../http/userApi.js";
import logo from "./logo.png";
import TopBanner from "./TopBanner.js";

const NavBar = observer(() => {
  const { user, device, basket } = useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Надежное состояние для открытия меню вместо Popover
  const[isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchTypes().then((data) => device.setTypes(data));
  }, [device]);

  // Закрываем остров при смене роута
  useEffect(() => {
    setIsExpanded(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout(user);
    setIsExpanded(false);
    navigate(NEWS_ROUTE);
  };

  const showBack = location.pathname !== NEWS_ROUTE && location.pathname !== "/";
  const title =
    location.pathname === NEWS_ROUTE
      ? "Gift Vault · PREMIUM"
      : location.pathname === "/"
        ? "Kolleksiya"
        : location.pathname.replace(/^\//, "").slice(0, 18) || "Katalog";

  return (
    <>
      <TopBanner />
      
      {/* 
        Оболочка Динамического Острова 
        Парит по центру (left-1/2 -translate-x-1/2)
      */}
      <header className="mt-3 fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 md:px-8 font-sans">
        
        {/* Сам Остров */}
        <div
          className={`mx-auto w-full max-w-[1440px] overflow-hidden border border-[var(--color-border)] shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            isExpanded
              ? "rounded-[32px] bg-white/95"
              : "rounded-[32px] bg-white/75 hover:bg-white/85 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
          }`}
        >
          {/* Верхняя панель острова (Всегда видна) */}
          <div className="flex h-14 items-center justify-between px-3 md:px-4">
            
            {/* Левая часть: Назад или Логотип */}
            <div className="flex min-w-0 items-center gap-3">
              {showBack ? (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="group flex h-9 w-9 items-center justify-center rounded-[32px] bg-[var(--color-surface-muted)] transition-all hover:bg-[var(--color-accent)]/10"
                >
                  <ChevronLeftIcon className="h-5 w-5 text-[var(--color-text-primary)] transition-transform group-hover:-translate-x-0.5 group-hover:text-[var(--color-accent)]" />
                </button>
              ) : (
                <Link
                  to={NEWS_ROUTE}
                  className="flex shrink-0 items-center transition-transform duration-300 hover:scale-[1.05] active:scale-[0.95]"
                >
                  <img
                    className="h-16 w-16 object-cover"
                    src={logo}
                    alt="Logo"
                  />
                </Link>
              )}

              {/* Динамический заголовок */}
              <div className="flex min-w-0 flex-col justify-center overflow-hidden">
                <span className="truncate font-display text-[18px] font-bold tracking-tight text-[var(--color-text-primary)] leading-tight">
                  {title}
                </span>
                <span className="truncate text-[12px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)] leading-tight">
                  Sovg'alar do'koni
                </span>
              </div>
            </div>

            {/* Правая часть: Меню для Desktop */}
            <div className="hidden items-center gap-2 md:flex">
              {user.isAuth ? (
                <>
                  {user.user.role === "ADMIN" && (
                    <Link
                      to={ADMIN_ROUTE}
                      className="rounded-[32px] bg-[var(--color-accent)]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-accent)] transition-all hover:bg-[var(--color-accent)]/20"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to={PROFILE_ROUTE}
                    className="rounded-[32px] border border-[var(--color-border)] bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all hover:border-[var(--color-accent)]/40 hover:text-[var(--color-accent)]"
                  >
                    Profil
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="rounded-[32px] bg-[var(--color-surface-muted)] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] transition-all hover:bg-red-50 hover:text-red-500"
                  >
                    Chiqish
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={REGISTRATION_ROUTE}
                    className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
                  >
                    Join
                  </Link>
                  <Link
                    to={LOGIN_ROUTE}
                    className="rounded-[32px] bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-deep)] px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-white shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>

            {/* Кнопка открытия/закрытия острова (Mobile + Tablet) */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex h-9 w-9 items-center justify-center rounded-[32px] bg-[var(--color-surface-muted)] text-[var(--color-text-primary)] transition-all hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] md:hidden"
            >
              {isExpanded ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars2Icon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* 
            Разворачивающаяся часть острова (Mobile Menu)
            Используем grid для плавного слайда высоты 
          */}
          <div
            className={`grid transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] md:hidden ${
              isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-2 px-4 pb-5 pt-2">
                <div className="mb-2 h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--color-border)] to-transparent" />
                
                {user.isAuth ? (
                  <>
                    <div className="mb-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      <UserCircleIcon className="h-4 w-4" />
                      {user.user.first_name || "Member"}
                    </div>

                    {user.user.role === "ADMIN" && (
                      <Link
                        to={ADMIN_ROUTE}
                        className="w-full rounded-2xl bg-[var(--color-accent)]/10 py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-accent)]"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to={PROFILE_ROUTE}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm"
                    >
                      Profilim
                    </Link>
                    <Link
                      to={BASKET_ROUTE}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm relative"
                    >
                      Savatcha
                      {basket.itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {basket.itemCount}
                        </span>
                      )}
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-2xl bg-[var(--color-surface-muted)] py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-red-500 transition-colors hover:bg-red-50"
                    >
                      Chiqish
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to={REGISTRATION_ROUTE}
                      className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm"
                    >
                      Ro‘yxatdan o‘tish
                    </Link>
                    <Link
                      to={LOGIN_ROUTE}
                      className="w-full rounded-2xl bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-deep)] py-3.5 text-center text-[11px] font-extrabold uppercase tracking-[0.15em] text-white shadow-md"
                    >
                      Kirish
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Пространство сверху, чтобы контент не заезжал под плавающий остров */}
      <div className="h-28 md:h-24" />
    </>
  );
});

export default NavBar;
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from "../routes.js";
import { NEWS_ROUTE } from "../utils/consts.js";
import RequireAuth from "./RequireAuth.js";

const AppRouter = () => {
  return (
    <Suspense fallback={<div className="flex min-h-screen w-full items-center justify-center font-sans">
      <div className="relative flex max-w-[240px] flex-col items-center gap-6 text-center animate-fade-in">
        <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
          Loading page
        </p>
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/2 animate-loading-shimmer bg-gradient-to-r from-[var(--color-accent-soft)] to-[var(--color-accent)]" />
        </div>
      </div>
    </div>}>
      <Routes>
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={
            <RequireAuth>{element}</RequireAuth>
          } />
        ))}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path="*" element={<Navigate to={NEWS_ROUTE} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;

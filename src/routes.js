import React, { lazy } from 'react';
import { ADMIN_ROUTE, BASKET_ROUTE, SETTINGS_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE, NEWS_ROUTE, PROFILE_ROUTE, ABOUT_ROUTE, PARTICIPANT_ROUTE } from './utils/consts.js';

// Lazy load components
const Admin = lazy(() => import('./pages/Admin.js'));
const Auth = lazy(() => import('./pages/Auth.js'));
const Basket = lazy(() => import('./pages/Basket.js'));
const News = lazy(() => import('./pages/Shop.js'));
const Settings = lazy(() => import('./pages/Settings.js'));
const Profile = lazy(() => import('./pages/Profile.js'));
const About = lazy(() => import('./pages/About.js'));
const Participate = lazy(() => import('./pages/Participant.js'));

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    element: <Admin />,
  },
  {
    path: BASKET_ROUTE,
    element: <Basket />,
  },
  {
    path: SETTINGS_ROUTE,
    element: <Settings />,
  },
  {
    path: PROFILE_ROUTE,
    element: <Profile />,
  },
];

export const publicRoutes = [
  {
    path: NEWS_ROUTE,
    element: <News />,
  },
  {
    path: PARTICIPANT_ROUTE,
    element: <Participate />,
  },
  {
    path: ABOUT_ROUTE,
    element: <About />,
  },
  {
    path: LOGIN_ROUTE,
    element: <Auth />,
  },
  {
    path: REGISTRATION_ROUTE,
    element: <Auth />,
  },
];
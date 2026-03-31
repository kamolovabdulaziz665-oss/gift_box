import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, NEWS_ROUTE } from "../utils/consts.js";
import logo from "../components/logo.png";
import {
  login,
  registration,
  sendVerificationSms,
  verifyCodeSms,
  googleAuth
} from "../http/userApi.js";
import { observer } from "mobx-react-lite";
import { Context } from "../index.js";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";

const inputClass =
  "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 py-3.5 text-[14px] text-[var(--color-text-primary)] outline-none transition-all focus:border-[var(--color-accent)]/50 focus:bg-white focus:ring-2 focus:ring-[var(--color-accent)]/15";

const labelClass =
  "block mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;
  const codeInputRef = useRef(null);

  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
    firstName: "",
    code: ""
  });

  const [isValidPhone, setIsValidPhone] = useState(true);
  const[isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timeout = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timeout);
  }, [timeLeft]);

  useEffect(() => {
    if (isCodeSent && codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, [isCodeSent]);

  const formatPhoneNumber = (input) => {
    const digits = input.replace(/\D/g, "");
    const match = digits.match(/^(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})$/);
    if (!match) return "";
    return [match[1], match[2], match[3], match[4]].filter(Boolean).join("-");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const formatted = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formatted }));
      setIsValidPhone(/^\d{2}-\d{3}-\d{2}-\d{2}$/.test(formatted));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        const res = await googleAuth(tokenResponse.access_token, user);
        if (res.success) {
          toast.success("Google Auth Successful");
          navigate(NEWS_ROUTE);
        } else {
          toast.error(`Error: ${res.message}`);
        }
      } catch (e) {
        toast.error("Connection Failed");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => toast.error("User rejected Google Auth"),
  });

  const handleSubmit = async () => {
    if (!isValidPhone || !formData.phoneNumber || !formData.password) {
      return toast.warning("Invalid credentials provided.");
    }

    const fullPhone = "+998" + formData.phoneNumber.replace(/-/g, "");
    setIsLoading(true);

    try {
      if (!isCodeSent) {
        let res;
        if (isLogin) {
          res = await login(fullPhone, formData.password, user);
          if (res.success) navigate(NEWS_ROUTE);
        } else {
          res = await registration(fullPhone, formData.password, formData.firstName, user);
          if (res.success) {
            const sms = await sendVerificationSms(fullPhone);
            if (sms.success) {
              setIsCodeSent(true);
              setTimeLeft(user.timerSms || 60);
            }
          }
        }
        res.success ? toast.success(res.message) : toast.error(res.message);
      } else {
        const res = await verifyCodeSms(fullPhone, formData.code, user);
        if (res.success) {
          toast.success("Authentication Complete");
          navigate(NEWS_ROUTE);
        } else {
          toast.error(`Invalid Code: ${res.message}`);
        }
      }
    } catch (err) {
      toast.error("Internal System Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-x-hidden px-4 py-12 font-sans text-[var(--color-text-primary)] sm:px-6 lg:px-8">
      
      {/* BACKGROUND DECORATIONS (Matches Shop Component) */}
      <div
        className="pointer-events-none absolute -right-16 top-10 h-72 w-72 rounded-full border border-[var(--color-accent)]/15 opacity-90 animate-slide-up sm:h-96 sm:w-96"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-20 h-64 w-64 rounded-full bg-[var(--color-accent-soft)] blur-3xl animate-fade-in sm:h-80 sm:w-80"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-multiply luxury-noise"
        aria-hidden
      />

      {/* AUTH CARD */}
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-12">
          
          {/* HEADER / LOGO */}
          <div className="mb-10 flex flex-col items-center text-center">
            <img
              className={`mb-6 h-16 w-auto transition-all duration-700 ${
                isLoading ? "scale-95 opacity-70 blur-[1px]" : "scale-100 opacity-100"
              }`}
              src={logo}
              alt="Logo"
            />
            <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] md:text-3xl">
              {isLoading ? "Processing..." : isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              {isLogin ? "Sign in to access your node" : "Register to join the network"}
            </p>
          </div>

          <div className="space-y-5">
            {/* MAIN FORM FIELDS */}
            <div
              className={`space-y-5 transition-all duration-500 ${
                isCodeSent ? "pointer-events-none select-none opacity-40 blur-[2px]" : "opacity-100"
              }`}
            >
              {!isLogin && (
                <div>
                  <label className={labelClass}>First Name</label>
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={inputClass}
                  />
                </div>
              )}

              <div>
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <span className="text-[14px] font-medium text-[var(--color-text-muted)]">
                      +998
                    </span>
                  </div>
                  <input
                    name="phoneNumber"
                    type="text"
                    placeholder="00-000-00-00"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={`${inputClass} pl-14 tracking-widest ${
                      !isValidPhone && formData.phoneNumber ? "border-red-400 focus:border-red-500 focus:ring-red-400/20" : ""
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={inputClass}
                />
              </div>
            </div>

            {/* VERIFICATION CODE MODAL (Inline) */}
            {isCodeSent && (
              <div className="animate-fade-in mt-2 rounded-[24px] border border-[var(--color-accent)]/20 bg-[var(--color-accent-soft)]/5 p-6 shadow-inner">
                <div className="mb-4 flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                    Verification Code
                  </label>
                  {timeLeft > 0 && (
                    <span className="text-[11px] font-semibold text-[var(--color-text-muted)]">
                      00:{timeLeft.toString().padStart(2, "0")}
                    </span>
                  )}
                </div>
                
                <input
                  ref={codeInputRef}
                  type="text"
                  placeholder="0000"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.replace(/\D/g, "").slice(0, 4),
                    }))
                  }
                  className="w-full rounded-2xl border border-[var(--color-border)] bg-white py-4 text-center text-3xl font-bold tracking-[0.5em] text-[var(--color-text-primary)] shadow-sm outline-none transition-all focus:border-[var(--color-accent)] focus:ring-4 focus:ring-[var(--color-accent)]/15"
                />
                
                <div className="mt-4 text-center text-[12px]">
                  {timeLeft <= 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCodeSent(false);
                        setFormData((p) => ({ ...p, code: "" }));
                      }}
                      className="font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-deep)] hover:underline transition-colors"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="pt-4">
              <button
                disabled={isLoading}
                onClick={handleSubmit}
                className="flex w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-accent)] via-[#3b82f6] to-[var(--color-accent-deep)] py-4 text-[13px] font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_20px_50px_rgba(37,99,235,0.35)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : isCodeSent ? (
                  "Verify & Complete"
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </button>

              {!isCodeSent && (
                <>
                  <div className="relative my-6 flex items-center py-2">
                    <div className="flex-grow border-t border-[var(--color-border)]"></div>
                    <span className="mx-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                      Or continue with
                    </span>
                    <div className="flex-grow border-t border-[var(--color-border)]"></div>
                  </div>

                  <button
                    disabled={isLoading}
                    onClick={() => loginWithGoogle()}
                    className="flex w-full items-center justify-center gap-3 rounded-full border border-[var(--color-border)] bg-white py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-primary)] shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/35 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-70"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Google
                  </button>
                </>
              )}
            </div>
          </div>

          {/* FOOTER LINK */}
          <div className="mt-8 text-center">
            <Link
              to={isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE}
              className="text-[13px] font-medium text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-accent)]"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Auth;
import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { validateEmailStrict } from '../../utils/validation';

interface AdminLoginFormProps {
  onSuccessLogin: (adminInfo: { email: string; name: string; role: string; token?: string }) => void;
  onBackToLanding?: () => void;
}

export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccessLogin,
  onBackToLanding,
}) => {
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Field touch states for on-blur validation
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });

  // Client-side field errors
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  // Form submission & authentication status
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  // Keyboard indicators
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Forgot password modal state & validation
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotTouched, setForgotTouched] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Lockout countdown timer
  const lockoutIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (lockoutSeconds > 0) {
      lockoutIntervalRef.current = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(lockoutIntervalRef.current);
            setAuthError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (lockoutIntervalRef.current) {
        clearInterval(lockoutIntervalRef.current);
      }
    };
  }, [lockoutSeconds]);

  // Strict email format validation (RFC 5322 standard, disallowing consecutive dots like '..', leading/trailing dots, invalid domains)
  const validateEmailFormat = (val: string): string | null => {
    const res = validateEmailStrict(val);
    return res.isValid ? null : (res.error || 'Invalid email format.');
  };

  // Password validation
  const validatePasswordFormat = (val: string): string | null => {
    if (!val) {
      return 'Password is required.';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    return null;
  };

  // Handle email change & live validation if touched
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (authError) setAuthError(null);

    if (touched.email) {
      const err = validateEmailFormat(val);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    }
  };

  // Handle password change & live validation if touched
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (authError) setAuthError(null);

    if (touched.password) {
      const err = validatePasswordFormat(val);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  // Field Blur handlers
  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmailFormat(email);
      setFieldErrors((prev) => ({ ...prev, email: err || undefined }));
    } else if (field === 'password') {
      const err = validatePasswordFormat(password);
      setFieldErrors((prev) => ({ ...prev, password: err || undefined }));
    }
  };

  // Caps Lock detection
  const handleKeyEvent = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isCaps = e.getModifierState && e.getModifierState('CapsLock');
    setCapsLockActive(Boolean(isCaps));
  };

  // Submit and Authenticate
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (lockoutSeconds > 0) {
      return;
    }

    // Full Form Validation on submission
    const emailErr = validateEmailFormat(email);
    const passwordErr = validatePasswordFormat(password);

    setTouched({ email: true, password: true });
    setFieldErrors({
      email: emailErr || undefined,
      password: passwordErr || undefined,
    });

    if (emailErr || passwordErr) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.adminLogin(email.trim(), password);

      if (response.success && response.user) {
        const sessionPayload = {
          ...response.user,
          token: response.token,
          expiresAt: response.expiresAt,
        };

        if (rememberMe) {
          try {
            localStorage.setItem('medicare_admin_session', JSON.stringify(sessionPayload));
          } catch (storageErr) {
            console.warn('Storage quota exceeded:', storageErr);
          }
        } else {
          try {
            sessionStorage.setItem('medicare_admin_session', JSON.stringify(sessionPayload));
            localStorage.removeItem('medicare_admin_session');
          } catch (storageErr) {
            console.warn('Storage quota exceeded:', storageErr);
          }
        }

        onSuccessLogin(sessionPayload);
      } else {
        setAuthError(response.error || 'Access denied: Invalid administrator credentials.');
      }
    } catch (err: any) {
      if (err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      if (err.lockoutSeconds) {
        setLockoutSeconds(err.lockoutSeconds);
      }
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }
      setAuthError(err.message || 'Access denied: Invalid administrator credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password modal submission
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotTouched(true);
    const err = validateEmailFormat(forgotEmail);
    if (err) {
      setForgotError(err);
      return;
    }
    setForgotError(null);
    setForgotSubmitted(true);
  };

  // Form validity status
  const isEmailValid = touched.email && !fieldErrors.email && email.trim().length > 0;
  const isPasswordValid = touched.password && !fieldErrors.password && password.length >= 6;
  const isLocked = lockoutSeconds > 0;

  return (
    <div className="w-full h-full bg-white flex flex-col justify-between p-6 sm:p-10 xl:p-14 relative text-left">
      {/* Top Bar: Back to Patient Portal + Top-Right Shield Badge */}
      <div className="flex items-center justify-between w-full">
        {onBackToLanding ? (
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-[13px] font-semibold text-[#5577A6] hover:text-[#0878F9] transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Patient Portal</span>
          </button>
        ) : (
          <div />
        )}

        {/* Top-Right Badge: Shield icon + Admin Login */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EAF5FF] border border-[#D0E6FC] text-[#0878F9] text-[13px] font-semibold shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#0878F9]" />
          <span>Admin Login</span>
        </div>
      </div>

      {/* Centered Login Form Container (Max-w 480px) */}
      <div className="max-w-[480px] w-full mx-auto my-auto py-4 sm:py-6">
        {/* Welcome Headings */}
        <div className="mb-6">
          <h2 className="text-[30px] sm:text-[34px] font-extrabold text-[#102A52] tracking-tight leading-tight">
            Welcome Back
          </h2>
          <p className="text-[14.5px] sm:text-[15.5px] text-[#5577A6] mt-1.5 font-normal">
            Sign in to your hospital administrator account to continue
          </p>
        </div>

        {/* Security Lockout Banner */}
        {isLocked && (
          <div className="mb-5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[13.5px] flex items-start gap-3 animate-fadeIn">
            <Clock className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-[14px]">Security Lockout Active</p>
              <p className="text-amber-800 text-[13px] mt-0.5 leading-relaxed">
                Too many failed attempts. Login is temporarily disabled for{' '}
                <span className="font-bold text-amber-950 underline">{lockoutSeconds} seconds</span>.
              </p>
            </div>
          </div>
        )}

        {/* Authentication Error Banner */}
        {authError && !isLocked && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px] flex items-start gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold text-red-900">{authError}</p>
              {remainingAttempts !== null && remainingAttempts > 0 && remainingAttempts <= 3 && (
                <p className="text-red-700 text-[12px] mt-1">
                  Caution: {remainingAttempts} login {remainingAttempts === 1 ? 'attempt' : 'attempts'} remaining before a temporary 45-second security lockout.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-4.5">
          {/* Email Address Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-email"
                className="block text-[13.5px] sm:text-[14px] font-bold text-[#102A52]"
              >
                Email Address
              </label>
              {isEmailValid && (
                <span className="text-[11.5px] font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Valid Format
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <div
                className={`absolute left-4 pointer-events-none transition-colors ${
                  fieldErrors.email && touched.email
                    ? 'text-red-500'
                    : isEmailValid
                    ? 'text-emerald-500'
                    : 'text-[#5577A6]'
                }`}
              >
                <Mail className="w-5 h-5 stroke-[1.9]" />
              </div>

              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="email"
                disabled={isLoading || isLocked}
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your admin email"
                aria-invalid={Boolean(fieldErrors.email && touched.email)}
                aria-describedby={fieldErrors.email && touched.email ? 'email-error' : undefined}
                className={`w-full h-[54px] sm:h-[56px] pl-12 pr-10 bg-white rounded-[12px] text-[#102A52] placeholder-[#94A3B8] text-[15px] transition-all shadow-2xs ${
                  fieldErrors.email && touched.email
                    ? 'border border-red-400 bg-red-50/15 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : isEmailValid
                    ? 'border border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    : 'border border-[#D9E9FA] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />

              {/* Status checkmark */}
              {isEmailValid && (
                <div className="absolute right-3.5 pointer-events-none text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Email Field Error Message */}
            {fieldErrors.email && touched.email && (
              <p
                id="email-error"
                className="text-[12.5px] text-red-600 font-medium mt-1.5 flex items-center gap-1.5 animate-fadeIn"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.email}</span>
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="admin-password"
                className="block text-[13.5px] sm:text-[14px] font-bold text-[#102A52]"
              >
                Password
              </label>

              {capsLockActive && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                  Caps Lock is ON
                </span>
              )}
            </div>

            <div className="relative flex items-center">
              <div
                className={`absolute left-4 pointer-events-none transition-colors ${
                  fieldErrors.password && touched.password
                    ? 'text-red-500'
                    : isPasswordValid
                    ? 'text-emerald-500'
                    : 'text-[#5577A6]'
                }`}
              >
                <Lock className="w-5 h-5 stroke-[1.9]" />
              </div>

              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                disabled={isLoading || isLocked}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                onKeyDown={handleKeyEvent}
                onKeyUp={handleKeyEvent}
                placeholder="Enter your password"
                aria-invalid={Boolean(fieldErrors.password && touched.password)}
                aria-describedby={fieldErrors.password && touched.password ? 'password-error' : undefined}
                className={`w-full h-[54px] sm:h-[56px] pl-12 pr-12 bg-white rounded-[12px] text-[#102A52] placeholder-[#94A3B8] text-[15px] transition-all shadow-2xs ${
                  fieldErrors.password && touched.password
                    ? 'border border-red-400 bg-red-50/15 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100'
                    : isPasswordValid
                    ? 'border border-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100'
                    : 'border border-[#D9E9FA] focus:outline-none focus:border-[#0878F9] focus:ring-2 focus:ring-[#0878F9]/10'
                } disabled:bg-gray-50 disabled:cursor-not-allowed`}
              />

              <button
                type="button"
                disabled={isLoading || isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#5577A6] hover:text-[#0878F9] p-1 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5 stroke-[1.8]" />
                ) : (
                  <EyeOff className="w-5 h-5 stroke-[1.8]" />
                )}
              </button>
            </div>

            {/* Password Field Error Message */}
            {fieldErrors.password && touched.password && (
              <p
                id="password-error"
                className="text-[12.5px] text-red-600 font-medium mt-1.5 flex items-center gap-1.5 animate-fadeIn"
              >
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{fieldErrors.password}</span>
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between pt-0.5">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#C4DCF6] text-[#0878F9] focus:ring-[#0878F9] cursor-pointer accent-[#0878F9]"
              />
              <span className="text-[13.5px] font-medium text-[#5577A6]">
                Remember me
              </span>
            </label>

            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(true);
                setForgotEmail(email);
                setForgotTouched(false);
                setForgotError(null);
                setForgotSubmitted(false);
              }}
              className="text-[13.5px] font-semibold text-[#0878F9] hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading || isLocked}
            id="admin-sign-in-button"
            className="w-full h-[54px] sm:h-[58px] bg-[#0878F9] hover:bg-[#0768D6] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[16px] rounded-[12px] flex items-center justify-center px-6 shadow-md shadow-[#0878F9]/20 transition-all cursor-pointer mt-1"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying Credentials...</span>
              </div>
            ) : isLocked ? (
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Locked ({lockoutSeconds}s)</span>
              </div>
            ) : (
              <span className="text-[16px] font-bold text-center">Sign In</span>
            )}
          </button>
        </form>

        {/* Secure Login Divider */}
        <div className="mt-6 flex items-center gap-4">
          <div className="flex-1 h-px bg-[#EAF1F8]" />
          <span className="text-[12px] font-semibold text-[#7A93B4] tracking-wide uppercase">
            Secure Authentication
          </span>
          <div className="flex-1 h-px bg-[#EAF1F8]" />
        </div>

        {/* Security Info Footnote */}
        <div className="mt-3.5 flex items-center justify-center gap-2 text-[13px] text-[#5577A6] font-medium text-center">
          <Lock className="w-4 h-4 text-[#5577A6] shrink-0 stroke-[2]" />
          <span>Protected with 256-bit encryption and brute-force rate limiting.</span>
        </div>
      </div>

      {/* Empty bottom spacer for symmetrical vertical balance */}
      <div className="hidden sm:block h-6" />

      {/* Forgot Password Modal with Form Validation */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#102A52]/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl border border-[#D9E9FA] max-w-md w-full p-6 sm:p-7 shadow-xl space-y-4 text-left">
            <div className="flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-[#102A52]">Reset Admin Password</h3>
              <div className="p-2 rounded-lg bg-[#EAF5FF] text-[#0878F9]">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[14px] text-[#5577A6] leading-relaxed">
              Enter your registered administrator email address. We will verify and send a secure password reset link.
            </p>

            {forgotSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13.5px] flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-emerald-900">Reset instructions dispatched</p>
                  <p className="text-emerald-700 mt-1 leading-relaxed">
                    Check your administrator inbox (<strong>{forgotEmail}</strong>) for your verification code and password recovery instructions.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} noValidate className="space-y-3 pt-1">
                <div>
                  <label htmlFor="forgot-email" className="block text-[13px] font-bold text-[#102A52] mb-1">
                    Registered Admin Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      if (forgotTouched) {
                        setForgotError(validateEmailFormat(e.target.value));
                      }
                    }}
                    placeholder="e.g. name@hospital.com"
                    className={`w-full h-12 px-4 rounded-xl border text-[14px] text-[#102A52] placeholder-[#94A3B8] transition-all ${
                      forgotError && forgotTouched
                        ? 'border-red-400 focus:border-red-500 focus:outline-none'
                        : 'border-[#D9E9FA] focus:border-[#0878F9] focus:outline-none'
                    }`}
                  />
                  {forgotError && forgotTouched && (
                    <p className="text-[12px] text-red-600 font-medium mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{forgotError}</span>
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#0878F9] hover:bg-[#0768D6] text-white font-bold text-[14px] transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setForgotModalOpen(false);
                  setForgotSubmitted(false);
                }}
                className="px-4 py-2 text-[13.5px] font-semibold text-[#5577A6] hover:text-[#102A52] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

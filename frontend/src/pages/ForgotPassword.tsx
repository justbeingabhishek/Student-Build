import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../Services/api";

type Step = "email" | "verify" | "complete";

const getErrorMessage = (error: unknown) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || "Something went wrong. Please try again."
    : "Something went wrong. Please try again.";

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("verify");
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords don’t match.");
      return;
    }

    setBusy(true);
    try {
      await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });
      setStep("complete");
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F2] px-4 py-8">
      <section className="w-full max-w-md rounded-3xl border border-[#E4E1D9] bg-white p-6 shadow-[0_12px_40px_rgba(22,21,26,0.06)] sm:p-8">
        <Link
          to="/login"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-2 text-sm font-medium text-[#5C5964] transition hover:bg-[#F7F6F2] hover:text-[#16151A]"
        >
          <ArrowLeft size={16} />
          Back to login
        </Link>

        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEF1FF] text-[#3048E8]">
          {step === "complete" ? (
            <CheckCircle2 size={23} />
          ) : step === "verify" ? (
            <KeyRound size={23} />
          ) : (
            <LockKeyhole size={23} />
          )}
        </div>

        {step === "complete" ? (
          <>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#16151A]">
              Password updated
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6B6872]">
              Your password has been changed. You can now sign in with your new
              password.
            </p>
            <Link
              to="/login"
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#3048E8] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5]"
            >
              Return to login
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-[#16151A]">
              {step === "verify" ? "Check your email" : "Forgot your password?"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#6B6872]">
              {step === "verify"
                ? `If an account exists for ${email}, a 6-digit code has been sent. Enter it below to set a new password.`
                : "Enter the email address linked to your account. We’ll send you a one-time verification code."}
            </p>

            {step === "email" ? (
              <form className="mt-6 space-y-4" onSubmit={requestCode}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#25232A]">
                    Email address
                  </span>
                  <span className="relative block">
                    <Mail
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#77747C]"
                    />
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="min-h-12 w-full rounded-xl border border-[#DAD7CF] bg-white pl-10 pr-3.5 text-sm text-[#16151A] outline-none transition placeholder:text-[#A19EA5] focus:border-[#3048E8] focus:ring-2 focus:ring-[#3048E8]/10"
                    />
                  </span>
                </label>
                {error && (
                  <p role="alert" className="text-sm text-[#B42318]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3048E8] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy && <LoaderCircle size={17} className="animate-spin" />}
                  {busy ? "Sending code..." : "Send verification code"}
                </button>
              </form>
            ) : (
              <form className="mt-6 space-y-4" onSubmit={resetPassword}>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#25232A]">
                    6-digit verification code
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="000000"
                    className="min-h-12 w-full rounded-xl border border-[#DAD7CF] bg-white px-3.5 text-center text-lg font-semibold tracking-[0.3em] text-[#16151A] outline-none transition placeholder:text-[#C7C4CC] focus:border-[#3048E8] focus:ring-2 focus:ring-[#3048E8]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#25232A]">
                    New password
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className="min-h-12 w-full rounded-xl border border-[#DAD7CF] bg-white px-3.5 text-sm text-[#16151A] outline-none transition placeholder:text-[#A19EA5] focus:border-[#3048E8] focus:ring-2 focus:ring-[#3048E8]/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-[#25232A]">
                    Confirm new password
                  </span>
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter your new password again"
                    className="min-h-12 w-full rounded-xl border border-[#DAD7CF] bg-white px-3.5 text-sm text-[#16151A] outline-none transition placeholder:text-[#A19EA5] focus:border-[#3048E8] focus:ring-2 focus:ring-[#3048E8]/10"
                  />
                </label>
                {error && (
                  <p role="alert" className="text-sm text-[#B42318]">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#3048E8] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {busy && <LoaderCircle size={17} className="animate-spin" />}
                  {busy ? "Updating password..." : "Set new password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setOtp("");
                    setPassword("");
                    setConfirmPassword("");
                    setStep("email");
                  }}
                  className="min-h-10 w-full rounded-xl px-4 text-sm font-medium text-[#5C5964] transition hover:bg-[#F7F6F2]"
                >
                  Use a different email
                </button>
              </form>
            )}
          </>
        )}
      </section>
    </main>
  );
}

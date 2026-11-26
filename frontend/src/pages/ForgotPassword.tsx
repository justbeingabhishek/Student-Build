import { useState, type FormEvent } from "react";
import { isAxiosError } from "axios";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../Services/api";

type Step = "email" | "otp" | "password" | "complete";

const getErrorMessage = (error: unknown) =>
  isAxiosError<{ message?: string }>(error)
    ? error.response?.data?.message || "Something went wrong. Please try again."
    : "Something went wrong. Please try again.";

const inputClass =
  "h-12 w-full rounded-xl border-0 bg-white px-4 text-sm text-[#16151A] shadow-sm outline-none transition placeholder:text-[#92909A] focus:ring-2 focus:ring-[#3048E8]/30";
const buttonClass =
  "flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#3048E8] px-4 text-sm font-semibold text-white transition hover:bg-[#263FC5] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3048E8]";

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
      const normalizedEmail = email.trim();
      await api.post("/auth/forgot-password", { email: normalizedEmail });
      setEmail(normalizedEmail);
      setStep("otp");
    } catch (requestError: unknown) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusy(false);
    }
  };

  const continueWithOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    if (otp.length !== 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setStep("password");
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Use at least 8 characters for your password.");
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
      const message = getErrorMessage(requestError);
      setError(message);
      if (
        isAxiosError<{ message?: string }>(requestError) &&
        requestError.response?.data?.message
          ?.toLowerCase()
          .includes("verification code")
      ) {
        setStep("otp");
      }
    } finally {
      setBusy(false);
    }
  };

  const stepIndex =
    step === "email" ? 0 : step === "otp" ? 1 : step === "password" ? 2 : 2;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F7F6F3] px-4 py-10 sm:px-6">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex gap-2" aria-label={`Step ${stepIndex + 1} of 3`}>
          {[0, 1, 2].map((index) => (
            <span
              key={index}
              className={`h-1 flex-1 rounded-full ${
                index <= stepIndex ? "bg-[#3048E8]" : "bg-[#E3E0D9]"
              }`}
            />
          ))}
        </div>

        {step === "complete" ? (
          <section className="text-center">
            <CheckCircle2
              size={36}
              aria-hidden="true"
              className="mx-auto mb-4 text-[#3048E8]"
            />
            <h1 className="text-2xl font-bold tracking-tight text-[#16151A]">
              Password updated
            </h1>
            <p className="mt-2 text-sm text-[#6B6872]">
              You can now sign in with your new password.
            </p>
            <Link to="/login" className={`${buttonClass} mt-6`}>
              Sign in
              <ArrowRight size={16} />
            </Link>
          </section>
        ) : (
          <section>
            <h1 className="text-2xl font-bold tracking-tight text-[#16151A] sm:text-[28px]">
              {step === "email"
                ? "Forgot password?"
                : step === "otp"
                  ? "Enter your OTP"
                  : "Set a new password"}
            </h1>
            {step === "otp" && (
              <p className="mt-2 text-sm text-[#6B6872]">
                OTP sent to this email: <span className="font-medium">{email}</span>
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-xl bg-[#FFF1EF] px-3.5 py-3 text-sm text-[#9F2D23]"
              >
                {error}
              </p>
            )}

            {step === "email" && (
              <form className="mt-6 space-y-4" onSubmit={requestCode}>
                <label className="block" htmlFor="recovery-email">
                  <span className="mb-2 block text-sm font-medium text-[#25232A]">
                    Email address
                  </span>
                  <input
                    id="recovery-email"
                    type="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck={false}
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>
                <button type="submit" disabled={busy} className={buttonClass}>
                  {busy ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Sending OTP…
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form className="mt-6 space-y-4" onSubmit={continueWithOtp}>
                <label className="block" htmlFor="recovery-otp">
                  <span className="mb-2 block text-sm font-medium text-[#25232A]">
                    6-digit OTP
                  </span>
                  <input
                    id="recovery-otp"
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
                    className={`${inputClass} text-center text-xl font-semibold tracking-[0.35em]`}
                  />
                </label>
                <button type="submit" className={buttonClass}>
                  Continue
                  <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setOtp("");
                    setStep("email");
                  }}
                  className="w-full py-2 text-sm font-medium text-[#5C5964] hover:text-[#3048E8]"
                >
                  Change email
                </button>
              </form>
            )}

            {step === "password" && (
              <form className="mt-6 space-y-4" onSubmit={resetPassword}>
                <label className="block" htmlFor="new-password">
                  <span className="mb-2 block text-sm font-medium text-[#25232A]">
                    New password
                  </span>
                  <input
                    id="new-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    className={inputClass}
                  />
                </label>
                <label className="block" htmlFor="confirm-password">
                  <span className="mb-2 block text-sm font-medium text-[#25232A]">
                    Confirm new password
                  </span>
                  <input
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Enter it again"
                    className={inputClass}
                  />
                </label>
                <button type="submit" disabled={busy} className={buttonClass}>
                  {busy ? (
                    <>
                      <LoaderCircle size={17} className="animate-spin" />
                      Updating…
                    </>
                  ) : (
                    <>
                      Update password
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setStep("otp");
                  }}
                  className="w-full py-2 text-sm font-medium text-[#5C5964] hover:text-[#3048E8]"
                >
                  Back to OTP
                </button>
              </form>
            )}
          </section>
        )}

        {step !== "complete" && (
          <p className="mt-8 text-center text-sm text-[#6B6872]">
            New here?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#3048E8] hover:underline"
            >
              Sign up
            </Link>
          </p>
        )}
      </div>
    </main>
  );
}

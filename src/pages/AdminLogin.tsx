import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setToken, setSessionId, setUser } = useAuthStore();

  const [step, setStep] = useState<"login" | "2fa">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [devOtp, setDevOtp] = useState(""); // For development
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://atoile-micro-naija-backend-production2.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Login failed");
      }

      const data = await response.json();
      setOtpId(data.otpId);
      setDevOtp(data.devOtp || "");
      setStep("2fa");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://atoile-micro-naija-backend-production2.up.railway.app/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otpId, otp }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Verification failed");
      }

      const data = await response.json();
      setToken(data.token);
      setSessionId(data.sessionId);
      setUser(data.user);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };
 */
const handleVerify2FA = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    if (!otpId) throw new Error("OTP ID missing");

    // 1. Fetch CSRF token
    const csrfRes = await fetch("https://atoile-micro-naija-backend-production2.up.railway.app/api/csrf-token", {
      credentials: "include", // important to include cookie
    });
    const { csrfToken } = await csrfRes.json();

    // 2. Send OTP + CSRF token
    const response = await fetch("https://atoile-micro-naija-backend-production2.up.railway.app/api/auth/verify-2fa", {
      method: "POST",
      credentials: "include", // include session cookie
      headers: {
        "Content-Type": "application/json",
        "X-Csrf-Token": csrfToken,
      },
      body: JSON.stringify({ otpId, otp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Verification failed");
    }

    const data = await response.json();
    setToken(data.token);
    setSessionId(data.sessionId);
    setUser(data.user);
    navigate("/admin/dashboard");
  } catch (err: any) {
    setError(err.message || "Verification failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Atoile Naija</h1>
        <p className="text-center text-gray-600 mb-8">Admin Dashboard</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {step === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("login");
                setOtp("");
                setOtpId("");
              }}
              className="w-full text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

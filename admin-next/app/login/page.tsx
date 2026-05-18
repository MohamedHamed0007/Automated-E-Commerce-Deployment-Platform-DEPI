"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, clearError } from "@/store/authSlice";

export default function LoginPage() {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr",
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif", background: "#0a0a0f",
    }}>
      {/* LEFT */}
      <div style={{
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        padding: "48px", background: "linear-gradient(135deg, #0f172a 0%, #0a0a0f 60%)",
        borderRight: "1px solid #1e293b",
      }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />
        <div style={{
          position: "absolute", top: "20%", left: "10%",
          width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />

        {/* logo */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 8h14M5 8a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v0a2 2 0 01-2 2M5 8l1 10a2 2 0 002 2h8a2 2 0 002-2L19 8"/>
              <circle cx="9" cy="20" r="1"/><circle cx="15" cy="20" r="1"/>
            </svg>
          </div>
          <span style={{ color: "#f8fafc", fontSize: 16, fontWeight: 600, letterSpacing: "-0.02em" }}>ShipSphere</span>
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-block",
            background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)",
            borderRadius: 20, padding: "4px 14px",
            color: "#93c5fd", fontSize: 12, fontWeight: 500, marginBottom: 24, letterSpacing: "0.04em",
          }}>ADMIN PANEL</div>
          <h1 style={{
            color: "#f8fafc", fontSize: 40, fontWeight: 700,
            lineHeight: 1.15, letterSpacing: "-0.03em", margin: "0 0 16px",
          }}>
            Control your<br /><span style={{ color: "#3b82f6" }}>logistics</span> ops.
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.6, maxWidth: 320 }}>
            Full visibility into shipments, couriers, revenue, and users — all in one place.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
            {[{ label: "Shipments", value: "1,284" }, { label: "Couriers", value: "4 active" }, { label: "Revenue", value: "$38k" }].map((s) => (
              <div key={s.label} style={{
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 12, padding: "10px 16px",
              }}>
                <div style={{ color: "#f8fafc", fontSize: 15, fontWeight: 600 }}>{s.value}</div>
                <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ position: "relative", zIndex: 1, color: "#1e293b", fontSize: 12 }}>© 2025 ShipSphere</p>
      </div>

      {/* RIGHT */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 48, background: "#0a0a0f",
      }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <h2 style={{ color: "#f8fafc", fontSize: 26, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 6px" }}>
            Welcome To ShipSphere DevOps Project
          </h2>
          <p style={{ color: "#475569", fontSize: 14, margin: "0 0 36px" }}>Sign in to your admin account</p>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 10, padding: "10px 14px", color: "#f87171", fontSize: 13,
              marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>EMAIL</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocused("email")} onBlur={() => setFocused(null)}
                placeholder="admin@shipsphere.com" autoComplete="email" required
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: focused === "email" ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${focused === "email" ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                  borderRadius: 10, padding: "12px 14px", color: "#f8fafc", fontSize: 14, outline: "none", transition: "all 0.2s",
                }}
              />
            </div>

            <div>
              <label style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500, display: "block", marginBottom: 8, letterSpacing: "0.04em" }}>PASSWORD</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("pass")} onBlur={() => setFocused(null)}
                  placeholder="••••••••" autoComplete="current-password" required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: focused === "pass" ? "rgba(59,130,246,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${focused === "pass" ? "rgba(59,130,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                    borderRadius: 10, padding: "12px 44px 12px 14px", color: "#f8fafc", fontSize: 14, outline: "none", transition: "all 0.2s",
                  }}
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex",
                }}>
                  {showPass ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 8, width: "100%", padding: "13px",
              background: loading ? "rgba(59,130,246,0.4)" : "linear-gradient(135deg, #3b82f6, #6366f1)",
              border: "none", borderRadius: 10, color: "#fff", fontSize: 14, fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "opacity 0.2s", letterSpacing: "-0.01em",
            }}>
              {loading ? (
                <>
                  <svg style={{ animation: "spin 1s linear infinite" }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 11-6.219-8.56"/>
                  </svg>
                  Signing in…
                </>
              ) : "Sign in →"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #334155 !important; }
      `}</style>
    </div>
  );
}
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'

interface LoginProps {
  onCreateAccount: () => void
  onLoginSuccess: () => void
}

export default function Login({
  onCreateAccount,
  onLoginSuccess,
}: LoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'error' | 'success'>('error')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setMessage(error.message)
        setMessageType('error')
        return
      }

      setEmail('')
      setPassword('')
      setShowPassword(false)
      onLoginSuccess()
    } catch {
      setMessage('Something went wrong. Please try again.')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage('Please enter your email address first.')
      setMessageType('error')
      return
    }

    setResetting(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo: window.location.origin }
      )

      if (error) {
        setMessage(error.message)
        setMessageType('error')
      } else {
        setMessage('Password reset email sent. Check your inbox.')
        setMessageType('success')
      }
    } catch {
      setMessage('Unable to send reset email. Please try again.')
      setMessageType('error')
    } finally {
      setResetting(false)
    }
  }

  return (
    <div className="yelo-login">
      <style>{`
        .yelo-login {
          --yelo-yellow: #ffca28;
          --yelo-yellow-hover: #f2b900;
          --yelo-ink: #211b18;
          --yelo-muted: #837a73;
          --yelo-cream: #fffaf0;
          min-height: calc(100vh - 70px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          background: var(--yelo-cream);
          font-family: inherit;
        }

        .yelo-login *,
        .yelo-login *::before,
        .yelo-login *::after {
          box-sizing: border-box;
        }

        .yelo-login-card {
          width: 100%;
          max-width: 440px;
          padding: 42px;
          background: #fff;
          border: 1px solid #f0e8d9;
          border-radius: 24px;
          box-shadow: 0 18px 55px rgba(67, 43, 10, 0.09);
        }

        .yelo-login-brand {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 11px;
          margin-bottom: 38px;
          color: var(--yelo-ink);
          font-size: 23px;
          font-weight: 900;
          letter-spacing: -0.8px;
        }

        .yelo-login-brand-icon {
          display: grid;
          place-items: center;
          width: 45px;
          height: 45px;
          flex-shrink: 0;
          background: var(--yelo-yellow);
          color: var(--yelo-ink);
          border-radius: 14px;
        }

        .yelo-login-kicker {
          margin: 0 0 10px;
          color: #b88600;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .yelo-login-title {
          margin: 0;
          color: var(--yelo-ink);
          font-size: clamp(28px, 5vw, 35px);
          line-height: 1.2;
          font-weight: 900;
          letter-spacing: -1.3px;
        }

        .yelo-login-subtitle {
          margin: 12px 0 30px;
          color: var(--yelo-muted);
          font-size: 13px;
          line-height: 1.7;
        }

        .yelo-login-field {
          margin-bottom: 20px;
        }

        .yelo-login-label {
          display: block;
          margin-bottom: 9px;
          color: #332b27;
          font-size: 12px;
          font-weight: 800;
        }

        .yelo-login-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .yelo-login-input-icon {
          position: absolute;
          left: 15px;
          width: 18px;
          height: 18px;
          color: #9c9188;
          pointer-events: none;
        }

        .yelo-login-input {
          display: block;
          width: 100%;
          min-width: 0;
          height: 52px;
          padding: 0 44px;
          border: 1px solid #e9e3dc;
          border-radius: 12px;
          outline: none;
          background: #fffdf9;
          color: var(--yelo-ink);
          font: inherit;
          font-size: 13px;
          transition: border-color .2s, box-shadow .2s;
        }

        .yelo-login-input::placeholder {
          color: #b2a9a1;
        }

        .yelo-login-input:focus {
          border-color: var(--yelo-yellow-hover);
          box-shadow: 0 0 0 4px rgba(255, 202, 40, 0.18);
          background: #fff;
        }

        .yelo-login-eye {
          position: absolute;
          right: 10px;
          display: grid;
          place-items: center;
          width: 34px;
          height: 34px;
          padding: 0;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #82766d;
          cursor: pointer;
        }

        .yelo-login-eye:hover {
          background: #fff5d6;
          color: #8a6500;
        }

        .yelo-login-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin: -4px 0 23px;
        }

        .yelo-login-text-button {
          padding: 0;
          border: 0;
          background: none;
          color: #9b7100;
          font: inherit;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .yelo-login-text-button:hover {
          color: #6d5000;
          text-decoration: underline;
        }

        .yelo-login-text-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .yelo-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 53px;
          padding: 14px 20px;
          border: 0;
          border-radius: 12px;
          background: var(--yelo-yellow);
          color: #211b18;
          font: inherit;
          font-size: 13px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 7px 16px rgba(204, 153, 0, .16);
          transition: background .2s, transform .2s, box-shadow .2s;
        }

        .yelo-login-submit:hover:not(:disabled) {
          background: var(--yelo-yellow-hover);
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(204, 153, 0, .22);
        }

        .yelo-login-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .yelo-login-submit svg {
          width: 17px;
          height: 17px;
        }

        .yelo-login-message {
          margin-top: 17px;
          padding: 12px 14px;
          border-radius: 10px;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .yelo-login-message.error {
          color: #a71927;
          background: #fff0ef;
          border: 1px solid #ffd8d5;
        }

        .yelo-login-message.success {
          color: #216b43;
          background: #eefbf2;
          border: 1px solid #c8efd4;
        }

        .yelo-login-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 20px;
          color: #a0958b;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
        }

        .yelo-login-divider::before,
        .yelo-login-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #eee8e1;
        }

        .yelo-login-signup {
          margin: 0;
          color: #81766e;
          font-size: 12px;
          text-align: center;
        }

        .yelo-login-signup button {
          margin-left: 5px;
          padding: 0;
          border: 0;
          background: none;
          color: #9b7100;
          font: inherit;
          font-weight: 900;
          cursor: pointer;
        }

        .yelo-login-signup button:hover {
          color: #6d5000;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .yelo-login {
            min-height: calc(100vh - 60px);
            padding: 22px 14px;
          }

          .yelo-login-card {
            padding: 30px 23px;
            border-radius: 20px;
          }

          .yelo-login-brand {
            margin-bottom: 32px;
            font-size: 21px;
          }

          .yelo-login-brand-icon {
            width: 41px;
            height: 41px;
          }

          .yelo-login-title {
            font-size: 30px;
          }
        }

        @media (max-width: 350px) {
          .yelo-login {
            padding: 14px 9px;
          }

          .yelo-login-card {
            padding: 25px 17px;
          }

          .yelo-login-title {
            font-size: 27px;
          }

          .yelo-login-input {
            height: 49px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .yelo-login *,
          .yelo-login *::before,
          .yelo-login *::after {
            transition: none !important;
          }
        }
      `}</style>

      <div className="yelo-login-card">
        <div className="yelo-login-brand">
          <span className="yelo-login-brand-icon">
            <img
  src="/favicon.png"
  alt="Yelo Bistro"
  className="yelo-login-logo"
/>
          </span>
          YELO BISTRO
        </div>

        <p className="yelo-login-kicker">Welcome back</p>
        <h1 className="yelo-login-title">Sign in to your account</h1>
        <p className="yelo-login-subtitle">
          Enter your details below to continue.
        </p>

        <form onSubmit={handleLogin}>
          <div className="yelo-login-field">
            <label className="yelo-login-label" htmlFor="yelo-login-email">
              Email address
            </label>
            <div className="yelo-login-input-wrap">
              <Mail className="yelo-login-input-icon" aria-hidden="true" />
              <input
                id="yelo-login-email"
                className="yelo-login-input"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="yelo-login-field">
            <label className="yelo-login-label" htmlFor="yelo-login-password">
              Password
            </label>
            <div className="yelo-login-input-wrap">
              <Lock className="yelo-login-input-icon" aria-hidden="true" />
              <input
                id="yelo-login-password"
                className="yelo-login-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingRight: 48 }}
              />
              <button
                className="yelo-login-eye"
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="yelo-login-forgot-row">
            <button
              className="yelo-login-text-button"
              type="button"
              onClick={handleForgotPassword}
              disabled={resetting || loading}
            >
              {resetting ? 'Sending reset email...' : 'Forgot password?'}
            </button>
          </div>

          <button
            className="yelo-login-submit"
            type="submit"
            disabled={loading || resetting}
          >
            {loading ? 'loggning in...' : 'login'}
            {!loading && <ArrowRight aria-hidden="true" />}
          </button>
        </form>

        {message && (
          <div
            className={`yelo-login-message ${messageType}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        )}

        <div className="yelo-login-divider">New to Yelo Bistro?</div>

        <p className="yelo-login-signup">
          Don't have an account?
          <button type="button" onClick={onCreateAccount}>
            Create an account
          </button>
        </p>
      </div>
    </div>
  )
}

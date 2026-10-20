
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Eye,
  EyeOff,
  Lock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

export default function UpdatePassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdatePassword = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setMessage(error.message)
        return
      }

      setSuccess(true)
      setMessage(
        'Password updated successfully. You can now log in with your new password.',
      )
      setPassword('')
      setConfirmPassword('')
      setShowPassword(false)
      setShowConfirmPassword(false)
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="yelo-reset-page">
      <style>{`
        .yelo-reset-page {
          --reset-red: #c91525;
          --reset-dark-red: #a70e1b;
          --reset-yellow: #ffcf24;
          --reset-cream: #fffaf0;
          --reset-text: #251919;
          --reset-muted: #817777;

          box-sizing: border-box;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 28px 18px;
          background:
            radial-gradient(circle at 10% 5%, rgba(255, 207, 36, 0.16), transparent 32%),
            radial-gradient(circle at 95% 95%, rgba(201, 21, 37, 0.07), transparent 30%),
            var(--reset-cream);
          font-family: inherit;
        }

        .yelo-reset-page *,
        .yelo-reset-page *::before,
        .yelo-reset-page *::after {
          box-sizing: border-box;
        }

        .yelo-reset-card {
          width: 100%;
          max-width: 460px;
          padding: 34px;
          background: #ffffff;
          border: 1px solid rgba(201, 21, 37, 0.09);
          border-radius: 24px;
          box-shadow: 0 18px 55px rgba(73, 26, 20, 0.09);
        }

        .yelo-reset-header {
          text-align: center;
          margin-bottom: 27px;
        }

        .yelo-reset-brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .yelo-reset-logo {
          display: block;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          object-fit: contain;
        }

        .yelo-reset-brand {
          color: var(--reset-red);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .yelo-reset-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 66px;
          height: 66px;
          margin: 0 auto 19px;
          border-radius: 20px;
          background: #fff2c5;
          color: var(--reset-red);
        }

        .yelo-reset-header h1 {
          margin: 0 0 9px;
          color: var(--reset-text);
          font-size: clamp(25px, 5vw, 30px);
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .yelo-reset-header p {
          margin: 0;
          color: var(--reset-muted);
          font-size: 14px;
          line-height: 1.7;
        }

        .yelo-reset-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .yelo-reset-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .yelo-reset-field label {
          color: #382b2b;
          font-size: 13px;
          font-weight: 750;
        }

        .yelo-reset-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .yelo-reset-input-icon {
          position: absolute;
          left: 15px;
          color: #9b8888;
          pointer-events: none;
          flex-shrink: 0;
        }

        .yelo-reset-input {
          width: 100%;
          min-width: 0;
          height: 51px;
          padding: 0 48px 0 45px;
          border: 1px solid #eadfdf;
          border-radius: 12px;
          outline: none;
          background: #fffdfb;
          color: var(--reset-text);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .yelo-reset-input::placeholder {
          color: #b4a7a7;
        }

        .yelo-reset-input:focus {
          border-color: var(--reset-red);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(201, 21, 37, 0.09);
        }

        .yelo-reset-eye {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 9px;
          background: transparent;
          color: #8d7c7c;
          cursor: pointer;
          transition: color 0.2s, background 0.2s;
        }

        .yelo-reset-eye:hover {
          color: var(--reset-red);
          background: #fff0ef;
        }

        .yelo-reset-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 52px;
          margin-top: 3px;
          padding: 13px 18px;
          border: none;
          border-radius: 12px;
          background: var(--reset-yellow);
          color: var(--reset-red);
          font-family: inherit;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 7px 18px rgba(201, 21, 37, 0.12);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .yelo-reset-submit:hover:not(:disabled) {
          background: #e6b800;
          color: var(--reset-dark-red);
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(201, 21, 37, 0.18);
        }

        .yelo-reset-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .yelo-reset-message {
          display: flex;
          align-items: flex-start;
          gap: 9px;
          margin: 0;
          padding: 12px 13px;
          border: 1px solid #f0b9bd;
          border-radius: 10px;
          background: #fff1f2;
          color: #a70e1b;
          font-size: 13px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .yelo-reset-message.is-success {
          border-color: #b7e4c7;
          background: #effbf3;
          color: #176534;
        }

        .yelo-reset-message svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .yelo-reset-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin: 21px 0 0;
          color: #948686;
          font-size: 12px;
          text-align: center;
        }

        .yelo-reset-security svg {
          color: var(--reset-red);
          flex-shrink: 0;
        }

        @media (max-width: 520px) {
          .yelo-reset-page {
            padding: 20px 12px;
          }

          .yelo-reset-card {
            padding: 27px 21px;
            border-radius: 19px;
          }

          .yelo-reset-header {
            margin-bottom: 23px;
          }

          .yelo-reset-brand-row {
            gap: 9px;
            margin-bottom: 19px;
          }

          .yelo-reset-logo {
            width: 36px;
            height: 36px;
          }

          .yelo-reset-brand {
            font-size: 13px;
            letter-spacing: 1.7px;
          }

          .yelo-reset-icon {
            width: 58px;
            height: 58px;
            border-radius: 17px;
            margin-bottom: 16px;
          }

          .yelo-reset-form {
            gap: 15px;
          }

          .yelo-reset-input {
            height: 49px;
          }
        }

        @media (max-width: 360px) {
          .yelo-reset-page {
            padding: 16px 9px;
          }

          .yelo-reset-card {
            padding: 23px 16px;
          }

          .yelo-reset-header h1 {
            font-size: 24px;
          }

          .yelo-reset-brand {
            font-size: 12px;
            letter-spacing: 1.3px;
          }
        }
      `}</style>

      <section className="yelo-reset-card">
        <header className="yelo-reset-header">
          <div className="yelo-reset-brand-row">
            <img
              src="/favicon.png"
              alt="Yelo Bistro"
              className="yelo-reset-logo"
            />
            <span className="yelo-reset-brand">YELO BISTRO</span>
          </div>

          <div className="yelo-reset-icon">
            <Lock size={29} strokeWidth={1.8} />
          </div>

          <h1>Set New Password</h1>
          <p>
            Create a new password for your account.
            Make sure it is one you can remember.
          </p>
        </header>

        <form className="yelo-reset-form" onSubmit={handleUpdatePassword}>
          <div className="yelo-reset-field">
            <label htmlFor="reset-new-password">New password</label>

            <div className="yelo-reset-input-wrap">
              <Lock
                className="yelo-reset-input-icon"
                size={18}
              />

              <input
                id="reset-new-password"
                className="yelo-reset-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="yelo-reset-eye"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="yelo-reset-field">
            <label htmlFor="reset-confirm-password">
              Confirm new password
            </label>

            <div className="yelo-reset-input-wrap">
              <Lock
                className="yelo-reset-input-icon"
                size={18}
              />

              <input
                id="reset-confirm-password"
                className="yelo-reset-input"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />

              <button
                type="button"
                className="yelo-reset-eye"
                onClick={() =>
                  setShowConfirmPassword((current) => !current)
                }
                aria-label={
                  showConfirmPassword
                    ? 'Hide confirmation password'
                    : 'Show confirmation password'
                }
                aria-pressed={showConfirmPassword}
              >
                {showConfirmPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`yelo-reset-message${success ? ' is-success' : ''}`}
              role="status"
            >
              {success ? (
                <CheckCircle2 size={18} />
              ) : (
                <ShieldCheck size={18} />
              )}
              <span>{message}</span>
            </p>
          )}

          <button
            type="submit"
            className="yelo-reset-submit"
            disabled={loading}
          >
            {loading ? 'Updating password...' : 'Update Password'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <p className="yelo-reset-security">
          <ShieldCheck size={15} />
          Your account security matters to us.
        </p>
      </section>
    </div>
  )
}

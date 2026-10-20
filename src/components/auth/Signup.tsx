
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  Lock,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react'

interface SignupProps {
  onAccountCreated: () => void
  onBackToLogin: () => void
}

export default function Signup({
  onAccountCreated,
  onBackToLogin,
}: SignupProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            address: address.trim(),
          },
        },
      })

      console.log('SIGNUP DATA:', data)
      console.log('SIGNUP ERROR:', error)

      if (error) {
        setMessage(error.message)
        return
      }

      setFullName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setAddress('')
      setShowPassword(false)

      onAccountCreated()
    } catch {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="yelo-signup-page">
      <style>{`
        .yelo-signup-page {
          --signup-red: #c91525;
          --signup-dark-red: #a70e1b;
          --signup-yellow: #ffcf24;
          --signup-cream: #fffaf0;
          --signup-text: #251919;
          --signup-muted: #817777;

          box-sizing: border-box;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 28px 18px;
          background:
            radial-gradient(circle at 10% 5%, rgba(255, 207, 36, 0.16), transparent 32%),
            radial-gradient(circle at 95% 95%, rgba(201, 21, 37, 0.07), transparent 30%),
            var(--signup-cream);
          font-family: inherit;
        }

        .yelo-signup-page *,
        .yelo-signup-page *::before,
        .yelo-signup-page *::after {
          box-sizing: border-box;
        }

        .yelo-signup-card {
          width: 100%;
          max-width: 460px;
          padding: 34px;
          background: #ffffff;
          border: 1px solid rgba(201, 21, 37, 0.09);
          border-radius: 24px;
          box-shadow: 0 18px 55px rgba(73, 26, 20, 0.09);
        }

        .yelo-signup-header {
          text-align: center;
          margin-bottom: 27px;
        }

        .yelo-signup-brand-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 22px;
        }

        .yelo-signup-logo {
          display: block;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          object-fit: contain;
          margin: 0;
        }

        .yelo-signup-brand {
          color: var(--signup-red);
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .yelo-signup-header h1 {
          margin: 0 0 9px;
          color: var(--signup-text);
          font-size: clamp(25px, 5vw, 30px);
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.8px;
        }

        .yelo-signup-header p {
          margin: 0;
          color: var(--signup-muted);
          font-size: 14px;
          line-height: 1.6;
        }

        .yelo-signup-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .yelo-signup-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
        }

        .yelo-signup-field label {
          color: #382b2b;
          font-size: 13px;
          font-weight: 750;
        }

        .yelo-signup-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .yelo-signup-input-icon {
          position: absolute;
          left: 15px;
          color: #9b8888;
          pointer-events: none;
          flex-shrink: 0;
        }

        .yelo-signup-input {
          width: 100%;
          min-width: 0;
          height: 51px;
          padding: 0 15px 0 45px;
          border: 1px solid #eadfdf;
          border-radius: 12px;
          outline: none;
          background: #fffdfb;
          color: var(--signup-text);
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }

        .yelo-signup-input::placeholder {
          color: #b4a7a7;
        }

        .yelo-signup-input:focus {
          border-color: var(--signup-red);
          background: #ffffff;
          box-shadow: 0 0 0 3px rgba(201, 21, 37, 0.09);
        }

        .yelo-signup-password {
          padding-right: 48px;
        }

        .yelo-signup-eye {
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

        .yelo-signup-eye:hover {
          color: var(--signup-red);
          background: #fff0ef;
        }

        .yelo-signup-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 52px;
          margin-top: 5px;
          padding: 13px 18px;
          border: none;
          border-radius: 12px;
          background: #ffcf24; ;
          color: black;
          font-family: inherit;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          box-shadow: 0 7px 18px rgba(201, 21, 37, 0.19);
          transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
        }

        .yelo-signup-submit:hover:not(:disabled) {
          background:  #ffcf24;;
          transform: translateY(-1px);
          box-shadow: 0 10px 22px rgba(201, 21, 37, 0.23);
        }

        .yelo-signup-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .yelo-signup-message {
          margin: 0;
          padding: 11px 13px;
          border: 1px solid #f0b9bd;
          border-radius: 10px;
          background: #fff1f2;
          color: #a70e1b;
          font-size: 13px;
          line-height: 1.5;
          overflow-wrap: anywhere;
        }

        .yelo-signup-divider {
          height: 1px;
          margin: 23px 0 18px;
          background: #f0e7e5;
        }

        .yelo-signup-login-text {
          margin: 0;
          color: var(--signup-muted);
          text-align: center;
          font-size: 13px;
          line-height: 1.6;
        }

        .yelo-signup-back {
          display: inline;
          padding: 0;
          border: none;
          background: transparent;
          color: var(--signup-red);
          font-family: inherit;
          font-size: inherit;
          font-weight: 850;
          cursor: pointer;
        }

        .yelo-signup-back:hover {
          color: var(--signup-dark-red);
          text-decoration: underline;
        }

        @media (max-width: 520px) {
          .yelo-signup-page {
            padding: 20px 12px;
          }

          .yelo-signup-card {
            padding: 27px 21px;
            border-radius: 19px;
          }

          .yelo-signup-header {
            margin-bottom: 23px;
          }

          .yelo-signup-brand-row {
            gap: 9px;
            margin-bottom: 19px;
          }

          .yelo-signup-logo {
            width: 36px;
            height: 36px;
          }

          .yelo-signup-brand {
            font-size: 13px;
            letter-spacing: 1.7px;
          }

          .yelo-signup-form {
            gap: 15px;
          }

          .yelo-signup-input {
            height: 49px;
          }
        }

        @media (max-width: 360px) {
          .yelo-signup-page {
            padding: 16px 9px;
          }

          .yelo-signup-card {
            padding: 23px 16px;
          }

          .yelo-signup-header h1 {
            font-size: 24px;
          }

          .yelo-signup-brand {
            font-size: 12px;
            letter-spacing: 1.3px;
          }
        }
      `}</style>

      <section className="yelo-signup-card">
        <header className="yelo-signup-header">
          <div className="yelo-signup-brand-row">
            <img
              src="/favicon.png"
              alt="Yelo Bistro"
              className="yelo-signup-logo"
            />
            <span className="yelo-signup-brand">YELO BISTRO</span>
          </div>

          <h1>Create your account</h1>
        </header>

        <form className="yelo-signup-form" onSubmit={handleSignup}>
          <div className="yelo-signup-field">
            <label htmlFor="signup-full-name">Full name</label>
            <div className="yelo-signup-input-wrap">
              <UserRound
                className="yelo-signup-input-icon"
                size={18}
              />
              <input
                id="signup-full-name"
                className="yelo-signup-input"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className="yelo-signup-field">
            <label htmlFor="signup-email">Email address</label>
            <div className="yelo-signup-input-wrap">
              <Mail
                className="yelo-signup-input-icon"
                size={18}
              />
              <input
                id="signup-email"
                className="yelo-signup-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="yelo-signup-field">
            <label htmlFor="signup-password">Password</label>
            <div className="yelo-signup-input-wrap">
              <Lock
                className="yelo-signup-input-icon"
                size={18}
              />
              <input
                id="signup-password"
                className="yelo-signup-input yelo-signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={6}
                required
              />
              <button
                type="button"
                className="yelo-signup-eye"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
          </div>

          <div className="yelo-signup-field">
            <label htmlFor="signup-phone">Phone number</label>
            <div className="yelo-signup-input-wrap">
              <Phone
                className="yelo-signup-input-icon"
                size={18}
              />
              <input
                id="signup-phone"
                className="yelo-signup-input"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                required
              />
            </div>
          </div>

          <div className="yelo-signup-field">
            <label htmlFor="signup-address">Address</label>
            <div className="yelo-signup-input-wrap">
              <MapPin
                className="yelo-signup-input-icon"
                size={18}
              />
              <input
                id="signup-address"
                className="yelo-signup-input"
                type="text"
                placeholder="Enter your  Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                autoComplete="street-address"
                required
              />
            </div>
          </div>

          {message && (
            <p className="yelo-signup-message" role="alert">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="yelo-signup-submit"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="yelo-signup-divider" />

        <p className="yelo-signup-login-text">
          Already have an account?{' '}
          <button
            type="button"
            className="yelo-signup-back"
            onClick={onBackToLogin}
          >
            Login
          </button>
        </p>
      </section>
    </div>
  )
}

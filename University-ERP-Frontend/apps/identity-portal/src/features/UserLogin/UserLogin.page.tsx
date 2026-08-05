import React, { useState } from 'react';
import { admissionsApi } from '@university-erp/api-clients';
import { useUserRegistration } from '../UserRegistration/UserRegistration.hooks';
import { submitLogin } from './UserLogin.api';

const loginStyles = `
  @keyframes gradientAnim {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  @keyframes floatAnim {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  @keyframes floatAnimReverse {
    0% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(20px) rotate(-5deg); }
    100% { transform: translateY(0px) rotate(0deg); }
  }

  .login-container {
    display: flex;
    min-height: 100vh;
    justify-content: center;
    align-items: center;
    background: linear-gradient(-45deg, #020617, #1e1b4b, #0f172a, #312e81);
    background-size: 400% 400%;
    animation: gradientAnim 15s ease infinite;
    font-family: 'Inter', 'Roboto', system-ui, sans-serif;
    position: relative;
    overflow: hidden;
    padding: 2rem;
  }

  .blob {
    position: absolute;
    filter: blur(80px);
    z-index: 0;
    opacity: 0.5;
  }
  .blob-1 {
    top: -10%; left: -10%;
    width: 600px; height: 600px;
    background: radial-gradient(circle, rgba(139,92,246,0.4) 0%, rgba(0,0,0,0) 70%);
    animation: floatAnim 10s ease-in-out infinite;
  }
  .blob-2 {
    bottom: -15%; right: -5%;
    width: 700px; height: 700px;
    background: radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(0,0,0,0) 70%);
    animation: floatAnimReverse 12s ease-in-out infinite;
  }
  .blob-3 {
    top: 30%; left: 60%;
    width: 400px; height: 400px;
    background: radial-gradient(circle, rgba(236,72,153,0.2) 0%, rgba(0,0,0,0) 70%);
    animation: floatAnim 8s ease-in-out infinite;
  }

  .glass-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px;
    padding: 3rem 2.5rem;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    color: white;
    box-sizing: border-box;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .mode-toggle {
    display: flex;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 16px;
    padding: 0.35rem;
    margin-bottom: 2rem;
    position: relative;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.2);
  }

  .toggle-btn {
    flex: 1;
    padding: 0.75rem 1rem;
    text-align: center;
    border: none;
    background: transparent;
    color: #94a3b8;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s ease;
    z-index: 2;
  }

  .toggle-btn.active {
    color: white;
  }

  .toggle-pill {
    position: absolute;
    top: 0.35rem;
    bottom: 0.35rem;
    width: calc(50% - 0.35rem);
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 1;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  }

  .toggle-pill.right {
    transform: translateX(100%);
  }

  .login-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .login-title {
    font-size: 2.25rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(to right, #ffffff, #cbd5e1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.025em;
  }

  .login-subtitle {
    font-size: 0.95rem;
    color: #94a3b8;
    margin-top: 0.75rem;
    line-height: 1.5;
  }

  .input-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  .input-row > .input-group {
    margin-bottom: 0;
    flex: 1;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }

  .input-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #cbd5e1;
    margin-left: 0.25rem;
  }

  .glass-input, .glass-select {
    width: 100%;
    padding: 1rem 1.25rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.2);
    color: white;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-sizing: border-box;
    font-family: inherit;
  }

  .glass-select {
    appearance: none;
    cursor: pointer;
  }
  
  .glass-select option {
    background: #1e1b4b;
    color: white;
  }

  .glass-input:focus, .glass-select:focus {
    outline: none;
    border-color: rgba(139, 92, 246, 0.6);
    background: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.15);
  }

  .glass-input::placeholder {
    color: #475569;
  }

  .login-button {
    width: 100%;
    padding: 1rem;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #a855f7, #3b82f6);
    background-size: 200% 100%;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    margin-top: 1rem;
  }

  .login-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 20px 25px -5px rgba(99, 102, 241, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    background-position: 100% 0;
  }

  .login-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .login-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  .error-message {
    padding: 0.875rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
    color: #fca5a5;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    animation: fadeIn 0.3s ease;
  }

  .form-container {
    animation: fadeIn 0.4s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export const LoginPage = () => {
  const registerMutation = useUserRegistration();

  // Mode state
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('student');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setErrorMessage('');
    // Clear passwords when switching modes
    setPassword('');
  };

  const handleAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      if (isLoginMode) {
        if (!email || !password) throw new Error('Please enter both email and password.');

        // 1. Authenticate the user
        const response = await submitLogin({ email, password });
        localStorage.setItem('global_identity_token', response.token);

        // 2. Determine Redirection URLs strictly based on runtime execution port
        // If the browser is executing on port 3001, it is 100% native Vite.
        const currentPort = window.location.port;
        const isNative = currentPort === '3001';
        
        const defaultStudentUrl = isNative ? 'http://localhost:5173' : 'http://localhost:8080';
        const defaultApplicantUrl = isNative ? 'http://localhost:5174' : import.meta.env.VITE_APPLICANT_PORTAL_URL;
        const defaultAdminUrl = isNative ? 'http://localhost:5178' : import.meta.env.VITE_ADMIN_PORTAL_URL;
        const defaultFacultyUrl = isNative ? 'http://localhost:5175' : import.meta.env.VITE_FACULTY_PORTAL_URL;

        const urlParams = new URLSearchParams(window.location.search);
        let redirectUri = urlParams.get('redirect_uri') || defaultStudentUrl;

        // Role-Based Routing Interceptor
        if (response.user.role === 'Admin') {
            redirectUri = defaultAdminUrl;
            window.location.href = `${redirectUri}#token=${response.token}`;
            return;
        }

        if (response.user.role === 'Faculty') {
            redirectUri = defaultFacultyUrl;
            window.location.href = `${redirectUri}#token=${response.token}`;
            return;
        }

        // 3. True Database Check: Verify their Admissions status securely
        try {
          const applications = await admissionsApi.getApplicationStatus(response.user.id);

          // Check if they have an application that is officially enrolled or accepted
          const isApproved = applications.some((app: any) =>
            app.status === 'Enrolled' || app.status === 'Accepted'
          );

          if (!isApproved) {
            if (!defaultApplicantUrl) throw new Error("VITE_APPLICANT_PORTAL_URL is missing in environment config.");
            redirectUri = defaultApplicantUrl;
          }
        } catch (error) {
          // Failsafe: If no records exist, they are a new student. Route to Applicant Portal.
          if (defaultApplicantUrl) {
            redirectUri = defaultApplicantUrl;
          }
        }

        // 4. Execute the final redirect with the token fragment
        window.location.href = `${redirectUri}#token=${response.token}`;

      } else {
        // --- NEW USER REGISTRATION FLOW ---
        if (!firstName || !lastName || !email || !password) {
          throw new Error('Please fill in all registration fields.');
        }

        // 1. Execute the registration
        await registerMutation.mutateAsync({
          email,
          firstName,
          lastName,
          password,
          role: role as any
        });

        // 2. AUTO-LOGIN UX: Seamlessly log them in right after registering
        const response = await submitLogin({ email, password });
        localStorage.setItem('global_identity_token', response.token);

        // 3. Since they JUST registered, they are 100% a new student. 
        // Redirect them directly to the Applicant Portal.
        const currentPort = window.location.port;
        const isNative = currentPort === '3001';
        const applicantUrl = isNative ? 'http://localhost:5174' : import.meta.env.VITE_APPLICANT_PORTAL_URL;
        
        if (!applicantUrl) throw new Error("VITE_APPLICANT_PORTAL_URL is missing in environment config.");

        window.location.href = `${applicantUrl}#token=${response.token}`;
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || error.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{loginStyles}</style>
      <div className="login-container">
        {/* Animated Background Blobs */}
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="glass-card">
          <div className="mode-toggle">
            <div className={`toggle-pill ${!isLoginMode ? 'right' : ''}`}></div>
            <button
              type="button"
              className={`toggle-btn ${isLoginMode ? 'active' : ''}`}
              onClick={toggleMode}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`toggle-btn ${!isLoginMode ? 'active' : ''}`}
              onClick={toggleMode}
            >
              Register
            </button>
          </div>

          <div className="login-header">
            <h1 className="login-title">University ERP</h1>
            <p className="login-subtitle">
              {isLoginMode
                ? 'Sign in to access your unified applications.'
                : 'Create an account to join the University platform.'}
            </p>
          </div>

          <form onSubmit={handleAction} className="form-container" key={isLoginMode ? 'login' : 'register'}>
            {errorMessage && (
              <div className="error-message">
                {errorMessage}
              </div>
            )}

            {!isLoginMode && (
              <>
                <div className="input-group">
                  <label htmlFor="roleInput" className="input-label">I am a</label>
                  <select
                    id="roleInput"
                    className="glass-select"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty Member</option>
                  </select>
                </div>

                <div className="input-row">
                  <div className="input-group">
                    <label htmlFor="firstNameInput" className="input-label">First Name</label>
                    <input
                      id="firstNameInput"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={isLoading}
                      className="glass-input"
                      placeholder="Jane"
                      required={!isLoginMode}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="lastNameInput" className="input-label">Last Name</label>
                    <input
                      id="lastNameInput"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={isLoading}
                      className="glass-input"
                      placeholder="Doe"
                      required={!isLoginMode}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="input-group">
              <label htmlFor="emailInput" className="input-label">
                University Email
              </label>
              <input
                id="emailInput"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="glass-input"
                placeholder="user@university.edu"
                required
                autoComplete="username"
              />
            </div>

            <div className="input-group">
              <label htmlFor="passwordInput" className="input-label">
                Password
              </label>
              <input
                id="passwordInput"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="glass-input"
                placeholder="••••••••••••"
                required
                autoComplete={isLoginMode ? 'current-password' : 'new-password'}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading
                ? (isLoginMode ? 'Authenticating...' : 'Creating Account...')
                : (isLoginMode ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
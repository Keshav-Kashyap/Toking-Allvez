import React, { useState, useContext } from 'react';
import { Eye, EyeOff, Video, User, Lock, Mail, ArrowRight, Star, Shield, Users } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import '../styles/LoginPage.css';
import Navbar from "../Components/Navbar/Navbar"
import Footer from "../Components/Footer/Footer";
const ModernAuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // AuthContext se functions import karte hain
  const { handleLogin, handleRegister, getUserInfo } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ name: '', username: '', password: '' });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.username || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (activeTab === 'signup' && !formData.name) {
      setError('Name is required for registration');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (activeTab === 'login') {
        // Login function call
        const message = await handleLogin(formData.username, formData.password);
        const userInfo = await getUserInfo();
        if (userInfo) {
          console.log("userInfo this :", userInfo);
          localStorage.setItem("user", JSON.stringify(userInfo)); // ✅
        } else {
          console.log("not found user info");
        }
        setSuccess(message || 'Welcome back! Login successful!');
      } else {
        // Register function call
        const message = await handleRegister(formData.name, formData.username, formData.password);
        setSuccess(message || 'Account created successfully! Please login.');
        // Switch to login tab after successful registration
        setTimeout(() => {
          setActiveTab('login');
          setFormData({ name: '', username: '', password: '' });
          setSuccess('');
        }, 2000);
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Content for left side (when login - features on right, when signup - features on left)
  const loginContent = {
    title: "Welcome Back!",
    subtitle: "We're excited to see you again"
  };

  const signupContent = {
    title: "Join Our Community!",
    subtitle: "Start your journey with us today"
  };

  // Features for form side (right side for login, left side for signup)
  const loginFeatures = [
    { icon: <Video className="w-4 h-4" />, text: "Join video calls instantly" },
    { icon: <Users className="w-4 h-4" />, text: "Connect with your team" },
    { icon: <Shield className="w-4 h-4" />, text: "Secure & encrypted chats" }
  ];

  const signupFeatures = [
    { icon: <Star className="w-4 h-4" />, text: "Premium features included" },
    { icon: <User className="w-4 h-4" />, text: "Personalized experience" },
    { icon: <Shield className="w-4 h-4" />, text: "Enterprise-grade security" }
  ];

  const currentContent = activeTab === 'login' ? loginContent : signupContent;
  const currentFeatures = activeTab === 'login' ? loginFeatures : signupFeatures;

  return (

    <>

      <Navbar />
      <div className="auth-container">

        <div className="auth-main-card">
          <div className="auth-grid">
            {/* Login: Content Left, Form Right */}
            {/* Signup: Form Left, Content Right */}

            {activeTab === 'login' ? (
              <>
                {/* Left Side - Content for Login */}
                <div className="auth-content-side login-gradient">
                  <div className="auth-content-wrapper">
                    {/* Logo */}
                    <div className="auth-logo">
                      <Video className="w-10 h-10" />
                    </div>

                    <h1 className="auth-main-title">
                      Toking Allvez
                    </h1>

                    <div className="transform transition-all duration-500">
                      <h2 className="auth-content-title">
                        {currentContent.title}
                      </h2>

                      <p className="auth-content-subtitle">
                        {currentContent.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="glassy-box">
                    <h3 className="form-features-title login-features-title">
                      Why Choose Us?
                    </h3>
                    <div className="form-features-list">
                      {currentFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="glassy-feature-item"
                          style={{
                            animation: `slideInRight 0.6s ease-out ${index * 0.1}s both`
                          }}
                        >
                          <div className="form-feature-icon login-feature-icon">
                            {feature.icon}
                          </div>
                          <span className="form-feature-text">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>


                </div>

                {/* Right Side - Form with Features for Login */}
                <div className="auth-form-side">
                  <h2 className="headings"  >Login</h2>

                  {/* Tabs */}
                  <div className="auth-tabs-container">
                    <button
                      onClick={() => handleTabChange('login')}
                      className={`auth-tab ${activeTab === 'login' ? 'active-login' : ''}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleTabChange('signup')}
                      className={`auth-tab ${activeTab === 'signup' ? 'active-signup' : ''}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name field for registration */}
                    {activeTab === 'signup' && (
                      <div className="auth-input-group signup-enter">
                        <User className="auth-input-icon" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="auth-input"
                        />
                      </div>
                    )}

                    {/* Username field */}
                    <div className="auth-input-group">
                      <Mail className="auth-input-icon" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Email or Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`auth-input ${activeTab === 'signup' ? 'signup-focus' : ''}`}
                      />
                    </div>

                    {/* Password field */}
                    <div className="auth-input-group">
                      <Lock className="auth-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`auth-input ${activeTab === 'signup' ? 'signup-focus' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="auth-password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                      <div className="auth-alert error">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="auth-alert success">
                        {success}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`auth-submit-btn ${activeTab === 'login' ? 'login-btn' : 'signup-btn'}`}
                    >
                      {loading ? (
                        <div className="auth-loading-spinner"></div>
                      ) : (
                        <>
                          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="auth-footer">
                    <p>
                      {activeTab === 'login'
                        ? "New to Toking Allvez? Switch to Sign Up tab"
                        : "Already have an account? Switch to Login tab"
                      }
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Left Side - Form with Features for Signup */}
                <div className="auth-form-side">

                  <h2 className="headings"  >Registration</h2>


                  {/* Tabs */}
                  <div className="auth-tabs-container">
                    <button
                      onClick={() => handleTabChange('login')}
                      className={`auth-tab ${activeTab === 'login' ? 'active-login' : ''}`}
                    >
                      Login
                    </button>
                    <button
                      onClick={() => handleTabChange('signup')}
                      className={`auth-tab ${activeTab === 'signup' ? 'active-signup' : ''}`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="auth-form">
                    {/* Name field for registration */}
                    {activeTab === 'signup' && (
                      <div className="auth-input-group signup-enter">
                        <User className="auth-input-icon" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Full Name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={loading}
                          className="auth-input"
                        />
                      </div>
                    )}

                    {/* Username field */}
                    <div className="auth-input-group">
                      <Mail className="auth-input-icon" />
                      <input
                        type="text"
                        name="username"
                        placeholder="Email or Username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`auth-input ${activeTab === 'signup' ? 'signup-focus' : ''}`}
                      />
                    </div>

                    {/* Password field */}
                    <div className="auth-input-group">
                      <Lock className="auth-input-icon" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={loading}
                        className={`auth-input ${activeTab === 'signup' ? 'signup-focus' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        className="auth-password-toggle"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Alerts */}
                    {error && (
                      <div className="auth-alert error">
                        {error}
                      </div>
                    )}

                    {success && (
                      <div className="auth-alert success">
                        {success}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`auth-submit-btn ${activeTab === 'login' ? 'login-btn' : 'signup-btn'}`}
                    >
                      {loading ? (
                        <div className="auth-loading-spinner"></div>
                      ) : (
                        <>
                          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Footer */}
                  <div className="auth-footer">
                    <p>
                      {activeTab === 'login'
                        ? "New to Toking Allvez? Switch to Sign Up tab"
                        : "Already have an account? Switch to Login tab"
                      }
                    </p>
                  </div>
                </div>

                {/* Right Side - Content for Signup */}
                <div className="auth-content-side signup-gradient">



                  <div className="auth-content-wrapper">
                    {/* Logo */}
                    <div className="auth-logo">
                      <Video className="w-10 h-10" />
                    </div>

                    <h1 className="auth-main-title">
                      Toking Allvez
                    </h1>

                    <div className="transform transition-all duration-500">
                      <h2 className="auth-content-title">
                        {currentContent.title}
                      </h2>

                      <p className="auth-content-subtitle">
                        {currentContent.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="form-features-section glassy-box">
                    <h3 className="form-features-title signup-features-title">
                      Join Us Today!
                    </h3>
                    <div className="form-features-list ">
                      {currentFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="form-feature-item"
                          style={{
                            animation: `slideInLeft 0.6s ease-out ${index * 0.1}s both`
                          }}
                        >
                          <div className="form-feature-icon signup-feature-icon">
                            {feature.icon}
                          </div>
                          <span className="form-feature-text">{feature.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>

  );
};

export default ModernAuthPage;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';
import { toast } from 'sonner';
import { signUp } from '../lib/api';
import { useUser } from "@/hooks/useUser";

export default function Register() {
  const navigate = useNavigate();
  const { setUserId } = useUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await signUp({ email, password, fullName });
      
      if (response.needsEmailConfirmation) {
        toast.success('Account created! Please check your email and click the confirmation link to verify your account.');
        // Redirect to login page after showing the message
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        toast.success('Account created successfully!');
        navigate('/welcome');
      }
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Background Image */}
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/7132d4367431f4961e3e9053caa76e48cac8bfd0?width=2900"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Blur Overlay */}
      <div 
        className="absolute inset-0 w-full h-full flex items-center justify-center p-2.5"
        style={{
          background: 'rgba(1, 1, 1, 0.06)',
          backdropFilter: 'blur(25px)',
        }}
      >
        {/* Modal Container */}
        <div className="relative w-full max-w-[400px] bg-white rounded-2xl border border-squidgy-border p-6 flex flex-col items-center">
          {/* Close Button */}
          <button
            onClick={() => navigate('/welcome')}
            className="absolute top-4 right-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-squidgy-text-primary" strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <div className="py-5 mb-2">
            <div className="w-12 h-12 bg-squidgy-gradient rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">S</span>
            </div>
          </div>

          {/* Title */}
          <div className="pb-4 w-full">
            <h1 className="text-squidgy-text-primary text-center font-semibold text-2xl leading-[30px]">
              Create your account
            </h1>
            <p className="text-squidgy-text-secondary text-center text-sm mt-2">
              Join Squidgy and start building AI agents
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-squidgy-text-primary mb-2">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-3 border border-squidgy-border rounded-lg text-squidgy-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-squidgy-text-primary mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-squidgy-border rounded-lg text-squidgy-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-squidgy-text-primary mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-12 border border-squidgy-border rounded-lg text-squidgy-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  placeholder="Create a password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-squidgy-text-secondary hover:text-squidgy-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-squidgy-text-primary mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 pr-12 border border-squidgy-border rounded-lg text-squidgy-text-primary text-base focus:outline-none focus:ring-2 focus:ring-squidgy-purple focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-squidgy-text-secondary hover:text-squidgy-text-primary transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 bg-squidgy-gradient text-white font-bold text-[15px] leading-6 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-squidgy-text-secondary">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-squidgy-purple font-medium hover:underline"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

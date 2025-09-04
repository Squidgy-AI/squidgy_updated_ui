import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, X, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { resetPassword } from '../lib/api';

const SetNewPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get token from URL parameters
  const token = searchParams.get('token') || '';

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      isValid: minLength && hasUpper && hasLower && hasNumber
    };
  };

  const passwordValidation = validatePassword(password);
  const passwordsMatch = password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordValidation.isValid) {
      toast.error('Password must meet all requirements');
      return;
    }
    
    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token. Please request a new password reset.');
      return;
    }

    setLoading(true);
    
    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);
      toast.success('Password reset successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 w-full h-full">
        {/* Background Image */}
        <img 
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5b1c1e0c8f7c8b5b4e5e5e5e5e5e5e5?placeholderIfAbsent=true&apiKey=a938d9b6b5c54c9b9c5b5b5b5b5b5b5b" 
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

            {/* Success Icon */}
            <div className="py-5 mb-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Success Content */}
            <div className="text-center mb-6">
              <h2 className="text-squidgy-text-primary font-semibold text-xl leading-7 mb-2">
                Password Reset Successfully!
              </h2>
              <p className="text-squidgy-text-secondary text-sm leading-5">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>

            {/* Back to Login Button */}
            <button
              onClick={handleBackToLogin}
              className="w-full py-3 px-5 bg-squidgy-gradient text-white font-bold text-[15px] leading-6 rounded-lg hover:opacity-90 transition-opacity"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-full h-full">
      {/* Background Image */}
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/b5b1c1e0c8f7c8b5b4e5e5e5e5e5e5e5?placeholderIfAbsent=true&apiKey=a938d9b6b5c54c9b9c5b5b5b5b5b5b5b" 
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

          {/* Squidgy Logo */}
          <div className="py-5 mb-2">
            <div className="w-16 h-16 bg-squidgy-gradient rounded-2xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-squidgy-text-primary font-semibold text-xl leading-7 mb-2">
              Set New Password
            </h2>
            <p className="text-squidgy-text-secondary text-sm leading-5">
              Please enter your new password below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {/* New Password Input */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-squidgy-border rounded-lg focus:outline-none focus:ring-2 focus:ring-squidgy-primary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-squidgy-text-secondary hover:text-squidgy-text-primary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {password && (
              <div className="text-xs space-y-1">
                <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.minLength ? 'bg-green-600' : 'bg-red-500'}`} />
                  At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasUpper ? 'bg-green-600' : 'bg-red-500'}`} />
                  One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasLower ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasLower ? 'bg-green-600' : 'bg-red-500'}`} />
                  One lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-red-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${passwordValidation.hasNumber ? 'bg-green-600' : 'bg-red-500'}`} />
                  One number
                </div>
              </div>
            )}

            {/* Confirm Password Input */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-squidgy-border rounded-lg focus:outline-none focus:ring-2 focus:ring-squidgy-primary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-squidgy-text-secondary hover:text-squidgy-text-primary"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Match Indicator */}
            {confirmPassword && (
              <div className={`text-xs flex items-center gap-2 ${passwordsMatch ? 'text-green-600' : 'text-red-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${passwordsMatch ? 'bg-green-600' : 'bg-red-500'}`} />
                {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordValidation.isValid || !passwordsMatch}
              className="w-full py-3 px-5 bg-squidgy-gradient text-white font-bold text-[15px] leading-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-squidgy-primary text-sm font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;

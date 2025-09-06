import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { sendPasswordResetEmail } from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await sendPasswordResetEmail({ email });
      
      setIsSuccess(true);
      setEmailSent(true);
      toast.success(response.message || 'Password reset link sent to your email!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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

            {/* Success Icon */}
            <div className="py-5 mb-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Title */}
            <div className="pb-4 w-full">
              <h1 className="text-squidgy-text-primary text-center font-semibold text-2xl leading-[30px]">
                Check your email
              </h1>
              <p className="text-squidgy-text-secondary text-center text-sm mt-2">
                We've sent password reset instructions to {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="pb-6 w-full">
              <p className="text-squidgy-text-secondary text-center text-sm">
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 w-full">
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 px-5 bg-squidgy-gradient text-white font-bold text-[15px] leading-6 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                Back to sign in
              </button>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 px-5 text-squidgy-purple font-bold text-[15px] leading-6 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                Try different email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="absolute top-4 left-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-squidgy-text-primary" strokeWidth={1.5} />
          </button>

          {/* Lock Icon */}
          <div className="py-5 mb-2">
            <div className="w-12 h-12 bg-squidgy-gradient rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="pb-4 w-full">
            <h1 className="text-squidgy-text-primary text-center font-semibold text-2xl leading-[30px]">
              Forgot password?
            </h1>
            <p className="text-squidgy-text-secondary text-center text-sm mt-2">
              Enter your email and we'll send you a reset link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
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

            {/* Reset Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-5 bg-squidgy-gradient text-white font-bold text-[15px] leading-6 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center text-squidgy-text-secondary">
            Remember your password?{' '}
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

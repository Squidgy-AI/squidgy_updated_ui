import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle, ArrowLeft, ChevronLeft, ChevronRight, Zap, Shield, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { sendPasswordResetEmail } from '../lib/api';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselStates = [
    {
      icon: <Zap className="w-8 h-8 text-white" strokeWidth={1.67} />,
      title: "Quick Password Recovery",
      description: "Get back to building AI agents in seconds with our streamlined password reset process."
    },
    {
      icon: <Shield className="w-8 h-8 text-white" strokeWidth={1.67} />,
      title: "Secure Reset Process",
      description: "Your account security is our priority. We use encrypted links that expire for maximum protection."
    },
    {
      icon: <Users className="w-8 h-8 text-white" strokeWidth={1.67} />,
      title: "Never Lose Access",
      description: "Stay connected with your team and continue collaborating on AI projects without interruption."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white" strokeWidth={1.67} />,
      title: "Protect Your Data",
      description: "All your AI agents, analytics, and project data remain secure during the reset process."
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselStates.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselStates.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselStates.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselStates.length) % carouselStates.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

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
      <div className="flex min-h-screen bg-white font-['Open_Sans']">
        {/* Left Side - Success Message */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 max-w-[600px]">
          <div className="w-full max-w-[400px] mx-auto text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" strokeWidth={1.67} />
            </div>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-center text-[#101828] mb-2 font-['Open_Sans']">
                Check your email
              </h1>
              <p className="text-[15px] text-center text-[#4A5565] font-['Open_Sans']">
                We've sent password reset instructions to
              </p>
              <p className="text-[15px] text-center text-[#101828] font-medium mt-1 font-['Open_Sans']">
                {email}
              </p>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <p className="text-[13px] text-[#4A5565] text-center font-['Open_Sans'] leading-6">
                Click the link in the email to reset your password. If you don't see it, check your spam folder.
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => navigate('/login')}
                className="w-full px-4 py-3 rounded-[10px] bg-gradient-to-r from-[#FB252A] to-[#6017E8] text-white font-bold text-[15px] font-['Open_Sans'] hover:opacity-90 transition-opacity"
              >
                Back to sign in
              </button>
              
              <button
                onClick={() => setEmailSent(false)}
                className="w-full px-4 py-3 text-[#5E17EB] font-bold text-[15px] font-['Open_Sans'] rounded-[10px] hover:bg-gray-50 transition-colors"
              >
                Try different email
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Carousel */}
        <div className="flex-1 flex flex-col justify-between p-12 min-h-screen bg-gradient-to-br from-[#FB252A] via-[#A61D92] to-[#6017E8]">
          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {carouselStates.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === index 
                    ? "w-8 bg-white" 
                    : "w-2 bg-white/50"
                }`}
              />
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center">
            <div className="relative mb-12">
              {/* Icon Container */}
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
                {carouselStates[currentSlide].icon}
              </div>

              {/* Title and Description */}
              <div className="max-w-[453px]">
                <h2 className="text-4xl font-bold text-white mb-4 leading-[45px] font-['Open_Sans']">
                  {carouselStates[currentSlide].title}
                </h2>
                <p className="text-lg text-white/90 leading-7 font-['Open_Sans'] max-w-[448px]">
                  {carouselStates[currentSlide].description}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation and Trust Indicators */}
          <div>
            {/* Navigation Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={1.67} />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <ChevronRight size={20} strokeWidth={1.67} />
              </button>
            </div>

            {/* Trust Indicators */}
            <div>
              <p className="text-center text-white/80 text-[15px] mb-4 font-['Open_Sans']">
                Trusted by teams worldwide
              </p>
              <div className="flex justify-center items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#05DF72]"></div>
                  <span className="text-white text-[14px] font-['Open_Sans']">99.9% Uptime</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#51A2FF]"></div>
                  <span className="text-white text-[14px] font-['Open_Sans']">Secure & private</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#C27AFF]"></div>
                  <span className="text-white text-[14px] font-['Open_Sans']">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-['Open_Sans']">
      {/* Left Side - Forgot Password Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-20 2xl:px-24 max-w-[600px]">
        <div className="w-full max-w-[400px] mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-16">
            <img 
              src="https://api.builder.io/api/v1/image/assets/TEMP/e6ed19c13dbe3dffb61007c6e83218b559da44fe?width=290"
              alt="Squidgy"
              className="w-[145px] h-[59px]"
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-center text-[#101828] mb-2 font-['Open_Sans']">
              Reset password
            </h1>
            <p className="text-[15px] text-center text-[#4A5565] font-['Open_Sans']">
              Enter your email to reset your password
            </p>
          </div>

          {/* Back to Sign In */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 mb-6 text-[#5E17EB] hover:underline"
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.89062 8.125L8.39062 11.625L7.5 12.5L2.5 7.5L7.5 2.5L8.39062 3.375L4.89062 6.875H12.5V8.125H4.89062Z" fill="#5E17EB"/>
            </svg>
            <span className="text-[15px] font-['Open_Sans']">Back to sign in</span>
          </button>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[14px] text-[#364153] mb-1 font-['Open_Sans']">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-[13px] py-4 border border-[#D1D5DC] rounded-[10px] text-[15px] placeholder:text-[rgba(10,10,10,0.5)] font-['Open_Sans'] focus:outline-none focus:ring-2 focus:ring-[#5E17EB] focus:border-transparent"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Send Reset Link Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 rounded-[10px] bg-gradient-to-r from-[#FB252A] to-[#6017E8] text-white font-bold text-[15px] font-['Open_Sans'] hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Terms and Privacy */}
          <div className="text-center mt-8">
            <p className="text-[#9CA3AF] text-[11px] leading-4">
              By creating an account, you agree to our{" "}
              <a href="#" className="font-bold text-[#5E17EB] hover:underline">Terms of service</a>
              {" "}and{" "}
              <a href="#" className="font-bold text-[#5E17EB] hover:underline">Privacy policy</a>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Carousel */}
      <div className="flex-1 flex flex-col justify-between p-12 min-h-screen bg-gradient-to-br from-[#FB252A] via-[#A61D92] to-[#6017E8]">
        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 mb-8">
          {carouselStates.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                currentSlide === index 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center text-center">
          <div className="relative mb-12">
            {/* Icon Container */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-6">
              {carouselStates[currentSlide].icon}
            </div>

            {/* Title and Description */}
            <div className="max-w-[453px]">
              <h2 className="text-4xl font-bold text-white mb-4 leading-[45px] font-['Open_Sans']">
                {carouselStates[currentSlide].title}
              </h2>
              <p className="text-lg text-white/90 leading-7 font-['Open_Sans'] max-w-[448px]">
                {carouselStates[currentSlide].description}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation and Trust Indicators */}
        <div>
          {/* Navigation Controls */}
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} strokeWidth={1.67} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} strokeWidth={1.67} />
            </button>
          </div>

          {/* Trust Indicators */}
          <div>
            <p className="text-center text-white/80 text-[15px] mb-4 font-['Open_Sans']">
              Trusted by teams worldwide
            </p>
            <div className="flex justify-center items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#05DF72]"></div>
                <span className="text-white text-[14px] font-['Open_Sans']">99.9% Uptime</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#51A2FF]"></div>
                <span className="text-white text-[14px] font-['Open_Sans']">Secure & private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C27AFF]"></div>
                <span className="text-white text-[14px] font-['Open_Sans']">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

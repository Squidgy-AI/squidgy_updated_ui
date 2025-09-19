import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Camera, Save, X, ArrowLeft, User } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { UserAccountDropdown } from '../components/UserAccountDropdown';
import { profilesApi } from '../lib/supabase-api';

export default function AccountSettings() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile, isReady, isAuthenticated } = useUser();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.profile_avatar_url || '');
    }
  }, [profile]);

  // Redirect if not authenticated
  useEffect(() => {
    if (isReady && !isAuthenticated) {
      navigate('/login');
    }
  }, [isReady, isAuthenticated, navigate]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, GIF, WEBP)' });
      return;
    }
    
    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Image file is too large (max 5MB)' });
      return;
    }
    
    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setAvatarUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    setAvatarFile(file);
    setMessage(null);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!profile) return null;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Check if Supabase is configured
      const isDevelopment = import.meta.env.VITE_APP_ENV === 'development' || 
                           !import.meta.env.VITE_SUPABASE_URL || 
                           import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co';

      if (isDevelopment) {
        // Simulate upload progress for development
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 100);

        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Return the current preview URL (base64) for development
        return avatarUrl;
      }

      // Production mode - use Supabase storage like old design
      const { supabase } = await import('../lib/supabase');
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id || profile.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload to profiles bucket (same as old design)
      const { data, error } = await supabase
        .storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (error) throw error;
      
      setUploadProgress(100);
      
      // Get public URL (same as old design)
      const { data: urlData } = supabase
        .storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded file');
      }
      
      return urlData.publicUrl;
      
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile || !user) return;
    
    setIsSaving(true);
    setMessage(null);
    
    try {
      let newAvatarUrl = avatarUrl;
      
      // Upload avatar if changed
      if (avatarFile) {
        try {
          const uploadedUrl = await uploadAvatar(avatarFile);
          if (uploadedUrl) {
            newAvatarUrl = uploadedUrl;
          }
        } catch (error: any) {
          throw new Error(`Avatar upload failed: ${error.message}`);
        }
      }
      
      // Always attempt Supabase update - remove development mode bypass
      const { supabase } = await import('../lib/supabase');
      
      const profileId = profile.user_id || profile.id || user?.id;
      
      console.log('Attempting Supabase update with profile:', {
        profile_id: profile.id,
        user_id: profile.user_id,
        full_name: fullName,
        profile_avatar_url: newAvatarUrl,
        profileId: profileId
      });
      
      if (!profileId) {
        throw new Error('No valid profile ID found. Cannot update profile.');
      }
      
      // Check if profile exists by id first
      const { data: existingProfile } = await profilesApi.getById(profileId);
        
      console.log('Existing profile check by id:', existingProfile);
      
      let updateResult;
      
      if (!existingProfile) {
        // Check if profile exists by email (to avoid duplicate email constraint)
        const { data: emailProfile } = await profilesApi.getByEmail(user?.email || profile?.email);
          
        console.log('Existing profile check by email:', emailProfile);
        
        if (emailProfile) {
          // Profile exists with this email, update it instead of creating new one
          console.log('Updating existing profile found by email:', emailProfile.id);
          updateResult = await profilesApi.updateById(emailProfile.id, {
            full_name: fullName,
            profile_avatar_url: newAvatarUrl,
            updated_at: new Date().toISOString()
          });
        } else {
          // Create new profile only if no profile exists with this email
          console.log('Creating new profile for user:', profileId);
          updateResult = await profilesApi.create({
            id: profileId,
            user_id: crypto.randomUUID(),
            email: user?.email || profile?.email,
            full_name: fullName,
            profile_avatar_url: newAvatarUrl,
            role: 'member',
            company_id: crypto.randomUUID(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else {
        // Update existing profile using id column (same as old design)
        console.log('Updating existing profile for user:', profileId);
        updateResult = await profilesApi.updateById(profileId, {
          full_name: fullName,
          profile_avatar_url: newAvatarUrl,
          updated_at: new Date().toISOString()
        });
      }
        
      console.log('Supabase operation result:', updateResult);
      
      if (updateResult.error) {
        console.error('Supabase operation error:', updateResult.error);
        throw updateResult.error;
      }
      
      if (!updateResult.data || updateResult.data.length === 0) {
        throw new Error(`Failed to save profile for user ID: ${profileId}`);
      }
      
      console.log('Profile saved successfully in Supabase:', updateResult.data[0]);
      
      // Log the exact record that was updated for debugging
      console.log('Updated profile record details:', {
        id: updateResult.data[0].id,
        user_id: updateResult.data[0].user_id,
        email: updateResult.data[0].email,
        full_name: updateResult.data[0].full_name,
        profile_avatar_url: updateResult.data[0].profile_avatar_url
      });
      
      // Also verify the update by querying the database again
      const { data: verifyData } = await profilesApi.getById(profileId);
        
      console.log('Verification query result:', verifyData);
      
      // Refresh the profile in UserProvider to show updated data immediately
      if (refreshProfile) {
        await refreshProfile();
      }
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setAvatarFile(null);
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error updating profile. Please try again.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
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
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'rgba(1, 1, 1, 0.06)',
          backdropFilter: 'blur(25px)',
        }}
      >
        {/* Header */}
        <div className="h-16 bg-white/80 backdrop-blur-sm border-b border-grey-700 flex items-center px-5">
          <div className="flex items-center gap-3">
            {/* Squidgy Logo */}
            <div className="w-6 h-6 bg-squidgy-gradient rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="font-bold text-lg text-text-primary">Squidgy</span>
            
            {/* User Account Dropdown */}
            <UserAccountDropdown />
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-grey-800">
          <div className="h-full w-full bg-squidgy-gradient"></div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
                <Settings className="mr-3 w-6 h-6" />
                Account Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your profile information and preferences</p>
            </div>

            {/* Form */}
            <div className="p-6">
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.type === 'success' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden relative mb-4 border-4 border-white shadow-lg">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={fullName} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-500 bg-gradient-to-r from-purple-100 to-pink-100">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  
                  <label className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg cursor-pointer flex items-center text-sm font-medium transition-all">
                    <Camera size={16} className="mr-2" />
                    {isUploading ? 'Uploading...' : 'Change Profile Picture'}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                      disabled={isUploading || isSaving}
                    />
                  </label>
                  
                  {isUploading && (
                    <div className="w-full max-w-xs mt-3">
                      <div className="text-xs text-gray-600 mb-1 text-center">
                        Uploading... {Math.round(uploadProgress)}%
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                {/* Email - read only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || profile?.email || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-gray-50 cursor-not-allowed"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || isUploading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg flex items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

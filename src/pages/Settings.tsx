import React, { useState, useRef, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSidebar } from '@/hooks/useSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeContext } from '@/components/providers/ThemeProvider';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';
import { 
  Settings as SettingsIcon, 
  User, 
  Palette, 
  Database,
  Trash2,
  Download,
  Upload,
  Camera,
  Save,
  Edit,
  Check,
  X,
  UserCircle,
  Mail,
  Calendar,
  Clock
} from 'lucide-react';

const Settings = () => {
  const isMobile = useIsMobile();
  const { getSidebarClass } = useSidebar();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const { user, isLoaded } = useUser();
  
  // Profile state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize user data when user loads
  useEffect(() => {
    if (isLoaded && user) {
      setEditedName(user.fullName || '');
    }
  }, [isLoaded, user]);

  // Handle profile picture upload
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    
    try {
      await user.setProfileImage({ file });
      toast.success('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      toast.error('Failed to update profile picture');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle name save
  const handleNameSave = async () => {
    if (!user || !editedName.trim()) return;

    setIsSaving(true);
    
    try {
      await user.update({
        firstName: editedName.split(' ')[0],
        lastName: editedName.split(' ').slice(1).join(' ') || ''
      });
      setIsEditingName(false);
      toast.success('Name updated successfully!');
    } catch (error) {
      console.error('Error updating name:', error);
      toast.error('Failed to update name');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle name cancel
  const handleNameCancel = () => {
    setEditedName(user?.fullName || '');
    setIsEditingName(false);
  };

  // Export user data
  const handleExportData = () => {
    const userData = {
      profile: {
        name: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        createdAt: user?.createdAt,
        lastSignInAt: user?.lastSignInAt
      },
      settings: {
        theme: isDarkMode ? 'dark' : 'light'
      },
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  // Delete account data
  const handleDeleteAccount = async () => {
    if (!user) return;
    
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );
    
    if (confirmed) {
      try {
        await user.delete();
        toast.success('Account deleted successfully');
      } catch (error) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!isMobile && <Sidebar />}
      
      <div className={`${!isMobile ? getSidebarClass() : ''} min-h-screen transition-all duration-300`}>
        <Header
          onCreateTask={() => {}}
          searchQuery=""
          onSearchChange={() => {}}
        />
        
        <main className="container max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 font-inter flex items-center gap-3">
              <SettingsIcon className="w-8 h-8 text-purple-600" />
              Settings
            </h1>
            <p className="text-muted-foreground font-inter text-sm sm:text-base">
              Manage your account preferences and application settings
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {/* Profile Settings */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-white/10 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Profile Settings
                </CardTitle>
                <CardDescription>
                  Update your personal information and profile picture
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 border-4 border-white/50 dark:border-white/20 shadow-lg">
                      <AvatarImage 
                        src={user?.imageUrl} 
                        alt={user?.fullName || 'Profile'} 
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-600 text-white text-2xl font-semibold">
                        {user?.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Upload overlay */}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                         onClick={() => fileInputRef.current?.click()}>
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera className="w-6 h-6 text-white" />
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      aria-label="Upload profile picture"
                      title="Upload profile picture"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        {isUploading ? (
                          <>
                            <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Camera className="w-4 h-4" />
                            Change Picture
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supported formats: JPG, PNG, GIF (max 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Profile Information */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-purple-600" />
                      Full Name
                    </Label>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="bg-white/50 dark:bg-slate-800/50"
                          placeholder="Enter your full name"
                          onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                        />
                        <Button
                          size="sm"
                          onClick={handleNameSave}
                          disabled={isSaving || !editedName.trim()}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {isSaving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleNameCancel}
                          disabled={isSaving}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Input
                          value={user?.fullName || 'No name set'}
                          readOnly
                          className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setIsEditingName(true)}
                          className="flex items-center gap-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Email Field (Read-only) */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-600" />
                      Email Address
                    </Label>
                    <Input
                      value={user?.primaryEmailAddress?.emailAddress || 'No email'}
                      readOnly
                      className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here. Use your account provider settings.
                    </p>
                  </div>

                  {/* Account Created */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-purple-600" />
                      Account Created
                    </Label>
                    <Input
                      value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      readOnly
                      className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed"
                    />
                  </div>

                  {/* Last Sign In */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      Last Sign In
                    </Label>
                    <Input
                      value={user?.lastSignInAt ? new Date(user.lastSignInAt).toLocaleString() : 'Unknown'}
                      readOnly
                      className="bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Theme Settings */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize the look and feel of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleTheme}
                  />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label>Current Theme</Label>
                  <Badge variant={isDarkMode ? "secondary" : "outline"} className="w-fit">
                    {isDarkMode ? '🌙 Dark Theme' : '☀️ Light Theme'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-white/20 dark:border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  Data Management
                </CardTitle>
                <CardDescription>
                  Export your data and manage your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center gap-2"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4" />
                    Export Profile Data
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Download your profile information and settings as a JSON file
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="text-red-600 dark:text-red-400">Danger Zone</Label>
                  <Button 
                    variant="destructive" 
                    className="w-full flex items-center gap-2"
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    This action cannot be undone. Your account and all data will be permanently deleted.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Summary */}
          <Card className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-500/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                    Account Status
                  </h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300">
                    Your TaskFlowAI account is active and ready to use
                  </p>
                </div>
                <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                  ✓ Active
                </Badge>
              </div>
            </CardContent>
          </Card>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Settings;

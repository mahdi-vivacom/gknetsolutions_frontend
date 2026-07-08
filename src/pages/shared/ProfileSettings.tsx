import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '../../context/AuthContext';
import { fetchAPI } from '../../lib/api';
import { useToast } from '@/components/ui/use-toast';
import { User, Shield, Loader2 } from 'lucide-react';

export const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'security' ? 'security' : 'profile';
  
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
  });

  // Fetch full profile info on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetchAPI<any>('/auth/me', { method: 'GET' });
        if (response) {
          setFormData(prev => ({
            ...prev,
            firstName: response.firstName || prev.firstName,
            lastName: response.lastName || prev.lastName,
            email: response.email || prev.email,
            phone: response.profile?.phone || response.phone || '',
            address: response.profile?.address || response.address || '',
          }));
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetchAPI<any>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        })
      });
      updateUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "An error occurred while updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords mismatch",
        description: "Your new password and confirmation do not match.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await fetchAPI<any>('/auth/me', {
        method: 'PUT',
        body: JSON.stringify({
          password: formData.password,
        })
      });
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      toast({
        title: "Password Updated",
        description: "Your security settings have been successfully updated.",
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message || "An error occurred while updating your password.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Account Settings</h2>
        <p className="text-muted-foreground mt-2">Manage your profile and security preferences.</p>
      </div>
      
      <Tabs defaultValue={defaultTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" /> Profile Info
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" /> Security
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <Card>
            <form onSubmit={handleProfileSubmit}>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6 bg-muted/20">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
          <Card>
            <form onSubmit={handleSecuritySubmit}>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="password">New Password</Label>
                  <Input id="password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                </div>
                <div className="space-y-2 max-w-md">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t p-6 bg-muted/20">
                <Button type="submit" variant="default" disabled={isLoading || !formData.password}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Update Password
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

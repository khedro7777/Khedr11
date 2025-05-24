import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, User, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import apiClient from '@/lib/apiClient';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call real backend API to send OTP
      const response = await apiClient.post('/api/auth/request-otp', {
        email,
        purpose: 'register'
      });
      
      if (response.data.success) {
        toast({
          title: "رمز التحقق مرسل",
          description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
        });
        setOtpSent(true);
        
        // Set resend cooldown (60 seconds)
        setResendDisabled(true);
        setResendCountdown(60);
        const countdownInterval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 429) {
        setError('تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة لاحقاً.');
      } else if (err.response?.status === 400) {
        setError(err.response.data.message || 'البريد الإلكتروني مسجل بالفعل.');
      } else {
        setError('حدث خطأ أثناء إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Call real backend API to verify OTP and register user
      const response = await apiClient.post('/api/auth/verify-otp-register', {
        email,
        otp,
        fullName: name,
        username: email.split('@')[0], // Generate username from email
        country: 'SA', // Default country, will be updated in role selection
        role: 'buyer' // Default role, will be updated in role selection
      });
      
      if (response.data.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast({
          title: "تم التسجيل بنجاح",
          description: "يرجى اختيار دورك في النظام",
        });
        
        // Navigate to role selection with user data
        navigate('/role-selection', { 
          state: { 
            name, 
            email,
            userId: response.data.user.id 
          } 
        });
      }
    } catch (err: any) {
      console.error('Error verifying OTP:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 400) {
        setError(err.response.data.message || 'رمز التحقق غير صحيح أو منتهي الصلاحية.');
      } else {
        setError('حدث خطأ أثناء التحقق من الرمز. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (resendDisabled) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      // Call real backend API to resend OTP
      const response = await apiClient.post('/api/auth/request-otp', {
        email,
        purpose: 'register'
      });
      
      if (response.data.success) {
        toast({
          title: "تم إعادة الإرسال",
          description: "تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني",
        });
        
        // Set resend cooldown (60 seconds)
        setResendDisabled(true);
        setResendCountdown(60);
        const countdownInterval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      console.error('Error resending OTP:', err);
      
      // Handle different error scenarios
      if (err.response?.status === 429) {
        setError('تم تجاوز الحد المسموح من المحاولات. يرجى المحاولة لاحقاً.');
      } else {
        setError('حدث خطأ أثناء إعادة إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-bold text-primary mb-2">GPO</h2>
        <p className="text-lg text-muted-foreground">Smart Cooperation Platform</p>
      </div>
      
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center pb-4">
          <CardTitle className="text-2xl font-bold">إنشاء حساب</CardTitle>
          <CardDescription className="text-muted-foreground">
            أدخل معلوماتك للتسجيل في منصة GPO
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {!otpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-5">
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="الاسم الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 text-base"
                    required
                    dir="rtl"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="البريد الإلكتروني"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 text-base"
                    required
                    dir="rtl"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isLoading}
              >
                {isLoading ? "جاري الإرسال..." : "إرسال رمز التحقق"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              <div className="space-y-2">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="رمز التحقق"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                    required
                    className="text-center text-lg tracking-widest h-12"
                    maxLength={6}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  تم إرسال رمز التحقق إلى بريدك الإلكتروني
                </p>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendDisabled || isLoading}
                    className="text-sm text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                  >
                    {resendDisabled 
                      ? `إعادة الإرسال بعد ${resendCountdown} ثانية` 
                      : 'لم يصلك الرمز؟ إعادة الإرسال'}
                  </button>
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-medium" 
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "جاري التحقق..." : "تحقق من الرمز"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={() => setOtpSent(false)}
                disabled={isLoading}
              >
                العودة لتغيير المعلومات
              </Button>
            </form>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 pt-0">
          <div className="relative w-full my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">أو</span>
            </div>
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            لديك حساب بالفعل؟{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;

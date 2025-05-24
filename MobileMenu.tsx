import React from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/hooks/use-auth';

interface MobileMenuProps {
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
      <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-lg border-l p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold">القائمة</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-col space-y-6">
          <Link 
            to="/" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            الرئيسية
          </Link>
          <Link 
            to="/groups" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            المجموعات
          </Link>
          <Link 
            to="/governance" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            الحوكمة
          </Link>
          <Link 
            to="/dao" 
            className="text-base font-medium hover:text-primary transition-colors"
            onClick={onClose}
          >
            DAO
          </Link>
          
          {isAuthenticated && (
            <>
              <Link 
                to="/profile" 
                className="text-base font-medium hover:text-primary transition-colors"
                onClick={onClose}
              >
                الملف الشخصي
              </Link>
              <Link 
                to="/wallet" 
                className="text-base font-medium hover:text-primary transition-colors"
                onClick={onClose}
              >
                المحفظة
              </Link>
            </>
          )}
          
          {!isAuthenticated && (
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Link 
                to="/login" 
                className="w-full bg-primary text-white py-2 px-4 rounded text-center"
                onClick={onClose}
              >
                تسجيل الدخول
              </Link>
              <Link 
                to="/register" 
                className="w-full bg-white border border-primary text-primary py-2 px-4 rounded text-center"
                onClick={onClose}
              >
                إنشاء حساب
              </Link>
            </div>
          )}
        </nav>
      </div>
    </div>
  );
};

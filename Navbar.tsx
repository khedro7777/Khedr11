import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Globe, MapPin, DollarSign, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { MobileMenu } from './MobileMenu';
import { NotificationButton } from './navigation/NotificationButton';
import { useAuth } from '@/hooks/use-auth';
import { UserDropdown } from './navigation/UserDropdown';
import { AuthButtons } from './navigation/AuthButtons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <header className="border-b bg-white">
      {/* Top Bar - Language, Country, Currency, Time */}
      <div className="bg-gray-100 border-b border-gray-200 text-xs text-gray-600">
        <div className="container mx-auto px-4 h-8 flex items-center justify-end gap-4">
          <div className="flex items-center gap-1">
            <Globe size={14} />
            {/* Placeholder for Language Selector */}
            <Select defaultValue="ar">
              <SelectTrigger className="h-6 text-xs border-none bg-transparent focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {/* Placeholder for Country Selector */}
            <span>Country</span>
          </div>
          <div className="flex items-center gap-1">
            <DollarSign size={14} />
            {/* Placeholder for Currency Selector */}
            <span>USD</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {/* Placeholder for Time Display */}
            <span>10:32 GMT</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg">
              <span className="text-primary">GPO</span>
              <span className="hidden md:inline text-sm text-muted-foreground font-normal">Smart Cooperation Platform</span>
            </Link>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-sm hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link to="/groups" className="text-sm hover:text-primary transition-colors">
              المجموعات
            </Link>
            <Link to="/governance" className="text-sm hover:text-primary transition-colors">
              الحوكمة
            </Link>
            <Link to="/dao" className="text-sm hover:text-primary transition-colors">
              DAO
            </Link>
          </nav>

          {/* Auth Buttons & Mobile Toggle */}
          <div className="flex items-center gap-2">
            <NotificationButton />

            {isAuthenticated ? (
              <UserDropdown />
            ) : (
              <AuthButtons />
            )}

            {/* Mobile Menu Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <MobileMenu onClose={() => setShowMobileMenu(false)} />
      )}
    </header>
  );
};

export default Navbar;


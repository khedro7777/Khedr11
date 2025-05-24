import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={`border-t border-border py-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} GPO Smart Platform. جميع الحقوق محفوظة.
            </p>
          </div>
          <div className="flex space-x-6 rtl:space-x-reverse">
            {/* Links as per PDF requirement */}
            <Link to="/policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              سياسة الاستخدام
            </Link>
            <Link to="/sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              خريطة الموقع
            </Link>
            {/* Hidden Admin Page Link - kept minimal as requested */}
            <Link to="/admin-access" className="text-sm text-transparent hover:text-transparent cursor-default">
              .
            </Link>
            {/* Add other links if needed, e.g., Help Center */}
             <Link to="/help" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              مركز المساعدة
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



import React, { useState } from 'react';
import NewSidebar from './NewSidebar';
import Navbar from './Navbar';
import Footer from './Footer';
import MCPChat from '../chat/MCPChat';
import { useMCP } from '@/hooks/use-mcp';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Layout, MessageSquare } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ManualFlowExplorer from '../manual/ManualFlowExplorer';
import { SidebarProvider, SidebarWrapper } from '@/components/ui/sidebar';
import { NavigationLinks } from './navigation/NavigationLinks';

interface NewMainLayoutProps {
  children: React.ReactNode;
}

const NewMainLayout: React.FC<NewMainLayoutProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed for mobile-first
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const { mode, setMode } = useMCP();
  
  return (
    <SidebarWrapper defaultOpen={!isCollapsed}>
      <div className="min-h-screen flex flex-col w-full">
        <Navbar />
        
        <div className="flex flex-1">
          <NewSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          
          <div className={`flex flex-1 ${isCollapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}>
            {/* Left Panel: Manual Flow Explorer */}
            <div className={`${leftPanelOpen ? 'w-64' : 'w-0'} transition-all duration-300 border-r border-border bg-muted/30 relative overflow-hidden`}>
              {leftPanelOpen && (
                <ManualFlowExplorer />
              )}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-0 transform translate-x-full border-l-0 rounded-l-none h-10"
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
              >
                {leftPanelOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
              </Button>
            </div>
            
            {/* Main Content Area */}
            <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6 overflow-y-auto">
              <div className="mb-6">
                <Tabs value={mode} onValueChange={(value) => setMode(value as any)} className="w-full">
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="manual">وضع التنفيذ اليدوي</TabsTrigger>
                    <TabsTrigger value="auto">وضع التنفيذ التلقائي (MCP)</TabsTrigger>
                    <TabsTrigger value="ask">وضع الاستشارة (MCP)</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              {children}
            </main>
            
            {/* Right Panel: Chat Assistant */}
            <div className={`${rightPanelOpen ? 'w-80' : 'w-0'} transition-all duration-300 relative`}>
              {rightPanelOpen && (
                <div className="h-full">
                  <MCPChat />
                </div>
              )}
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 left-0 transform -translate-x-full border-r-0 rounded-r-none h-10"
                onClick={() => setRightPanelOpen(!rightPanelOpen)}
              >
                {rightPanelOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile Bottom Navigation (LinkedIn-style) */}
        <div className="md:hidden">
          <NavigationLinks />
        </div>
        
        {/* MCP Chat Assistant Button (Fixed) */}
        <div className="fixed bottom-20 md:bottom-4 right-4 z-40">
          <Button
            variant="default"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
            onClick={() => setRightPanelOpen(!rightPanelOpen)}
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
        
        <div className="fixed bottom-20 md:bottom-4 left-4 z-40 hidden md:block">
          <Button
            variant="outline"
            size="sm"
            className={`bg-background ${leftPanelOpen ? 'border-primary' : 'border-muted-foreground/20'}`}
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
          >
            <Layout className="h-4 w-4 mr-2" /> 
            عرض المسارات
          </Button>
        </div>
        
        <Footer className="hidden md:block" />
      </div>
    </SidebarWrapper>
  );
};

export default NewMainLayout;

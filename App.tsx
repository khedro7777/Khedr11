import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RoleSelection from '@/pages/auth/RoleSelection';
import Profile from '@/pages/profile/Profile';
import Groups from '@/pages/groups/MyGroups';
import GroupDetails from '@/pages/groups/GroupDetails';
import CreateGroup from '@/pages/groups/CreateGroup';
import Wallet from '@/pages/Wallet';
import Governance from '@/pages/Governance';
import DAO from '@/pages/DAO';
import Legal from '@/pages/Legal';
import Tools from '@/pages/Tools';
import AdminAccess from '@/pages/admin/AdminAccess';
import AdminMonitor from '@/pages/admin/AdminMonitor';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/use-auth';

function App() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Router>
      <Toaster />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          
          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/groups" element={
            <ProtectedRoute>
              <Groups />
            </ProtectedRoute>
          } />
          <Route path="/groups/:id" element={
            <ProtectedRoute>
              <GroupDetails />
            </ProtectedRoute>
          } />
          <Route path="/create-group/:type" element={
            <ProtectedRoute>
              <CreateGroup />
            </ProtectedRoute>
          } />
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/governance" element={
            <ProtectedRoute>
              <Governance />
            </ProtectedRoute>
          } />
          <Route path="/dao" element={
            <ProtectedRoute>
              <DAO />
            </ProtectedRoute>
          } />
          <Route path="/legal" element={
            <ProtectedRoute>
              <Legal />
            </ProtectedRoute>
          } />
          <Route path="/tools" element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          } />
          
          {/* Admin routes */}
          <Route path="/admin-access" element={<AdminAccess />} />
          <Route path="/admin-monitor-access" element={
            <ProtectedRoute requiredRole={['admin']}>
              <AdminMonitor />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
    </Router>
  );
}

export default App;

import React from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Briefcase, Scale, FileCheck, Settings } from 'lucide-react';

const AdminDashboard = () => {
  // Placeholder data - fetch real counts from backend/Strapi
  const counts = {
    pendingGroups: 2,
    pendingSupplierOffers: 5,
    pendingFreelancerOffers: 3,
    pendingArbitrations: 1,
  };

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">لوحة تحكم المسؤول</h1>
        <p className="text-muted-foreground">
          نظرة عامة على الطلبات المعلقة والإجراءات الإدارية.
        </p>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">مجموعات قيد المراجعة</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{counts.pendingGroups}</div>
              <p className="text-xs text-muted-foreground">
                مجموعات جديدة تنتظر الموافقة
              </p>
            </CardContent>
            <CardFooter>
                <Button size="sm" asChild variant="outline">
                    {/* Link to the actual admin page for reviewing groups */}
                    <Link to="/admin/review-groups">مراجعة المجموعات</Link>
                </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عروض موردين معلقة</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{counts.pendingSupplierOffers}</div>
              <p className="text-xs text-muted-foreground">
                عروض أسعار من موردين تنتظر المراجعة
              </p>
            </CardContent>
             <CardFooter>
                <Button size="sm" asChild variant="outline">
                    <Link to="/admin/review-supplier-offers">مراجعة عروض الموردين</Link>
                </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">عروض مستقلين معلقة</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{counts.pendingFreelancerOffers}</div>
              <p className="text-xs text-muted-foreground">
                عروض من مستقلين تنتظر المراجعة
              </p>
            </CardContent>
             <CardFooter>
                <Button size="sm" asChild variant="outline">
                    <Link to="/admin/review-freelancer-offers">مراجعة عروض المستقلين</Link>
                </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">طلبات تحكيم معلقة</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+{counts.pendingArbitrations}</div>
              <p className="text-xs text-muted-foreground">
                نزاعات تنتظر المراجعة والقرار
              </p>
            </CardContent>
             <CardFooter>
                <Button size="sm" asChild variant="outline">
                    <Link to="/admin/review-arbitration">مراجعة طلبات التحكيم</Link>
                </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Add links to other admin sections like user management, settings, etc. */}
        {/* Example: */}
        {/* <Card>
          <CardHeader>
            <CardTitle>إعدادات النظام</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline"><Settings className="mr-2 h-4 w-4"/> إدارة الإعدادات</Button>
          </CardContent>
        </Card> */}
      </div>
    </NewMainLayout>
  );
};

export default AdminDashboard;


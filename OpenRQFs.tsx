import React from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ListFilter } from 'lucide-react';

// Sample data for open RQF groups (Request for Quotation)
const openRqfGroups = [
  {
    id: 'rqf-1',
    title: 'شراء أجهزة كمبيوتر محمولة',
    groupName: 'مجموعة شراء الإلكترونيات',
    sector: 'تكنولوجيا',
    country: 'السعودية',
    requiredQuantity: 100,
    deadline: '2025-06-15',
    status: 'open',
  },
  {
    id: 'rqf-2',
    title: 'توريد مواد مكتبية',
    groupName: 'مجموعة المشتريات الإدارية',
    sector: 'خدمات',
    country: 'الإمارات',
    requiredQuantity: 500,
    deadline: '2025-06-20',
    status: 'open',
  },
   {
    id: 'rqf-3',
    title: 'حملة تسويقية رقمية',
    groupName: 'تحالف التسويق السياحي',
    sector: 'سياحة',
    country: 'مصر',
    requiredQuantity: null, // Not applicable for marketing
    deadline: '2025-07-01',
    status: 'open',
  },
];

const SupplierOpenRQFs = () => {
  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">طلبات عروض الأسعار المفتوحة (RQF)</h1>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> تصفية الطلبات
          </Button>
        </div>
        <p className="text-muted-foreground">
          استعرض طلبات عروض الأسعار المفتوحة من المجموعات وقدم عرضك.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openRqfGroups.map((rqf) => (
            <Card key={rqf.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-center mb-2">
                    <CardTitle className="text-lg">{rqf.title}</CardTitle>
                    <Badge variant="secondary">{rqf.status === 'open' ? 'مفتوح' : 'مغلق'}</Badge>
                </div>
                <CardDescription>مجموعة: {rqf.groupName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><span className="font-medium">القطاع:</span> {rqf.sector}</p>
                <p className="text-sm"><span className="font-medium">الدولة:</span> {rqf.country}</p>
                {rqf.requiredQuantity && (
                    <p className="text-sm"><span className="font-medium">الكمية المطلوبة:</span> {rqf.requiredQuantity}</p>
                )}
                <p className="text-sm"><span className="font-medium">آخر موعد للتقديم:</span> {rqf.deadline}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/suppliers/rqf/${rqf.id}`}>عرض التفاصيل وتقديم العرض</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {openRqfGroups.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا توجد طلبات عروض أسعار مفتوحة حالياً.</p>
          </div>
        )}
      </div>
    </NewMainLayout>
  );
};

export default SupplierOpenRQFs;


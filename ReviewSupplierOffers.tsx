import React, { useState } from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout'; // Assuming admin uses a similar layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, FileText, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Sample submitted supplier offers data
const submittedOffers = [
  {
    id: 'offer-sub-1',
    rqfId: 'rqf-1',
    rqfTitle: 'شراء أجهزة كمبيوتر محمولة',
    supplierName: 'شركة التقنية الحديثة',
    pricePerUnit: 1150,
    totalPrice: 115000,
    deliveryTime: 15,
    submittedAt: '2025-05-20T10:00:00Z',
    status: 'pending', // pending, approved, rejected
    attachmentsCount: 1,
    notes: 'السعر شامل الضريبة والضمان لمدة سنة.'
  },
  {
    id: 'offer-sub-2',
    rqfId: 'rqf-1',
    rqfTitle: 'شراء أجهزة كمبيوتر محمولة',
    supplierName: 'مؤسسة الحلول الذكية',
    pricePerUnit: 1200,
    totalPrice: 120000,
    deliveryTime: 10,
    submittedAt: '2025-05-21T14:30:00Z',
    status: 'pending',
    attachmentsCount: 2,
    notes: 'يمكن التسليم خلال 10 أيام عمل.'
  },
    {
    id: 'offer-sub-3',
    rqfId: 'rqf-2',
    rqfTitle: 'توريد مواد مكتبية',
    supplierName: 'المكتبة العصرية',
    pricePerUnit: null, // Price might be per item or total
    totalPrice: 5500,
    deliveryTime: 5,
    submittedAt: '2025-05-22T09:15:00Z',
    status: 'approved',
    attachmentsCount: 1,
    notes: 'العرض يشمل جميع المواد المطلوبة في RQF-2.'
  },
];

const AdminReviewSupplierOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState(submittedOffers);

  const handleReview = (offerId: string, decision: 'approved' | 'rejected') => {
    console.log(`Reviewing offer ${offerId} with decision: ${decision}`);
    // Simulate API call to update offer status
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, status: decision } : offer
      )
    );
    toast({
      title: `تم ${decision === 'approved' ? 'قبول' : 'رفض'} العرض بنجاح`,
      description: `تم تحديث حالة العرض ${offerId}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">قيد المراجعة</Badge>;
      case 'approved':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">مقبول</Badge>;
      case 'rejected':
        return <Badge variant="destructive">مرفوض</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">مراجعة عروض الموردين</h1>
        <p className="text-muted-foreground">
          مراجعة وقبول أو رفض عروض الأسعار المقدمة من الموردين لطلبات RQF المختلفة.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>العروض قيد المراجعة والسابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>معرف الطلب (RQF)</TableHead>
                  <TableHead>اسم المورد</TableHead>
                  <TableHead>السعر الإجمالي</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                        <div className="font-medium">{offer.rqfTitle}</div>
                        <div className="text-xs text-muted-foreground">({offer.rqfId})</div>
                    </TableCell>
                    <TableCell>{offer.supplierName}</TableCell>
                    <TableCell>{offer.totalPrice ? `${offer.totalPrice.toLocaleString()} ريال` : '-'}</TableCell>
                    <TableCell>{new Date(offer.submittedAt).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* Basic View/Download Attachments Button */} 
                        <Button variant="outline" size="sm" disabled={offer.attachmentsCount === 0}>
                           <Download className="h-3 w-3 mr-1"/> ({offer.attachmentsCount})
                        </Button>
                        {offer.status === 'pending' && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleReview(offer.id, 'approved')}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleReview(offer.id, 'rejected')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {offers.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لا توجد عروض لمراجعتها حالياً.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </NewMainLayout>
  );
};

export default AdminReviewSupplierOffers;


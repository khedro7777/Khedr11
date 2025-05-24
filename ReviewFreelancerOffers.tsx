import React, { useState } from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout'; // Assuming admin uses a similar layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Download, User, Briefcase } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

// Sample submitted freelancer offers data
const submittedFreelancerOffers = [
  {
    id: 'freelancer-offer-1',
    missionId: 'mission-2',
    missionTitle: 'تطوير واجهة أمامية لتطبيق ويب (React)',
    freelancerName: 'علي حسن',
    freelancerId: 'freelancer-ali',
    proposedBudget: 4800,
    proposedTimeline: '3 أسابيع',
    submittedAt: '2025-05-22T11:00:00Z',
    status: 'pending', // pending, approved, rejected
    attachmentsCount: 2, // CV, Portfolio
    proposalSummary: 'لدي خبرة 5 سنوات في تطوير واجهات React ويمكنني إنجاز المشروع بالجودة المطلوبة وضمن الوقت المحدد.'
  },
  {
    id: 'freelancer-offer-2',
    missionId: 'mission-2',
    missionTitle: 'تطوير واجهة أمامية لتطبيق ويب (React)',
    freelancerName: 'فاطمة الزهراء',
    freelancerId: 'freelancer-fatima',
    proposedBudget: 5000,
    proposedTimeline: '4 أسابيع',
    submittedAt: '2025-05-23T09:45:00Z',
    status: 'pending',
    attachmentsCount: 1, // Portfolio Link
    proposalSummary: 'خبرة متخصصة في React و Tailwind CSS، يمكنني البدء فوراً.'
  },
   {
    id: 'freelancer-offer-3',
    missionId: 'mission-1',
    missionTitle: 'تصميم شعار وهوية بصرية لشركة ناشئة',
    freelancerName: 'خالد عبد الله',
    freelancerId: 'freelancer-khaled',
    proposedBudget: 1500,
    proposedTimeline: 'أسبوع واحد',
    submittedAt: '2025-05-20T16:20:00Z',
    status: 'approved',
    attachmentsCount: 1, // Portfolio PDF
    proposalSummary: 'تصاميم إبداعية وعصرية، يمكن الاطلاع على معرض الأعمال المرفق.'
  },
];

const AdminReviewFreelancerOffers = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState(submittedFreelancerOffers);

  const handleReview = (offerId: string, decision: 'approved' | 'rejected') => {
    console.log(`Reviewing freelancer offer ${offerId} with decision: ${decision}`);
    // Simulate API call to update offer status
    setOffers(prevOffers =>
      prevOffers.map(offer =>
        offer.id === offerId ? { ...offer, status: decision } : offer
      )
    );
    toast({
      title: `تم ${decision === 'approved' ? 'قبول' : 'رفض'} عرض المستقل بنجاح`,
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
        <h1 className="text-3xl font-bold">مراجعة عروض المستقلين</h1>
        <p className="text-muted-foreground">
          مراجعة وقبول أو رفض العروض المقدمة من المستقلين للمهمات المنشورة.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>عروض المستقلين المقدمة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المهمة</TableHead>
                  <TableHead>اسم المستقل</TableHead>
                  <TableHead>الميزانية المقترحة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.map((offer) => (
                  <TableRow key={offer.id}>
                    <TableCell>
                        <div className="font-medium"><Link to={`/freelancers/mission/${offer.missionId}`} className="hover:underline">{offer.missionTitle}</Link></div>
                        <div className="text-xs text-muted-foreground">({offer.missionId})</div>
                    </TableCell>
                    <TableCell>
                        <Link to={`/profile/${offer.freelancerId}`} className="hover:underline flex items-center gap-1">
                           <User className="h-3 w-3"/> {offer.freelancerName}
                        </Link>
                    </TableCell>
                    <TableCell>{offer.proposedBudget.toLocaleString()} ريال</TableCell>
                    <TableCell>{new Date(offer.submittedAt).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{getStatusBadge(offer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2 items-center">
                         {/* Button to view proposal details/attachments */}
                        <Button variant="outline" size="sm">
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
                <p className="text-center text-muted-foreground py-4">لا توجد عروض من مستقلين لمراجعتها حالياً.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </NewMainLayout>
  );
};

export default AdminReviewFreelancerOffers;


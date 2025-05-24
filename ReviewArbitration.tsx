import React, { useState } from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout'; // Assuming admin uses a similar layout
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, FileText, Download, Scale, Eye, MessageSquare, Gavel } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Sample arbitration requests data
const arbitrationRequests = [
  {
    disputeId: 'DISPUTE-group-123-1684839300000',
    groupId: 'group-123',
    groupTitle: 'شراء أجهزة كمبيوتر',
    requesterName: 'أحمد محمد',
    disputeType: 'مشكلة في التسليم',
    submittedAt: '2025-05-23T10:00:00Z',
    status: 'pending_review', // pending_review, under_review, resolved, rejected
    evidenceCount: 2,
    description: 'المورد تأخر في تسليم الأجهزة عن الموعد المتفق عليه بأسبوعين.',
    proposedAction: 'إلزام المورد بتعويض عن التأخير أو السماح للمجموعة بإلغاء الطلب.',
    resolution: null,
    resolutionDate: null,
  },
  {
    disputeId: 'DISPUTE-group-456-1684842900000',
    groupId: 'group-456',
    groupTitle: 'حملة تسويقية مشتركة',
    requesterName: 'سارة خالد',
    disputeType: 'نزاع بين الأعضاء',
    submittedAt: '2025-05-22T15:30:00Z',
    status: 'resolved',
    evidenceCount: 1,
    description: 'خلاف حول توزيع الميزانية المخصصة للإعلانات.',
    proposedAction: 'إعادة توزيع الميزانية بناءً على مساهمة كل عضو.',
    resolution: 'تم الاتفاق على إعادة توزيع الميزانية بالتساوي بعد وساطة المسؤول.',
    resolutionDate: '2025-05-24T11:00:00Z',
  },
];

const AdminReviewArbitration = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState(arbitrationRequests);
  const [selectedRequest, setSelectedRequest] = useState<typeof arbitrationRequests[0] | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleUpdateRequestStatus = (disputeId: string, newStatus: string, resolution?: string) => {
    console.log(`Updating dispute ${disputeId} to status: ${newStatus}`);
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.disputeId === disputeId
          ? { ...req, status: newStatus, resolution: resolution || req.resolution, resolutionDate: resolution ? new Date().toISOString() : req.resolutionDate }
          : req
      )
    );
    toast({
      title: `تم تحديث حالة طلب التحكيم بنجاح`,
      description: `تم تحديث حالة الطلب ${disputeId} إلى ${newStatus}.`,
    });
    setSelectedRequest(null); // Close details view after update
    setResolutionNotes('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review': return <Badge variant="secondary">قيد المراجعة الأولية</Badge>;
      case 'under_review': return <Badge variant="outline" className="bg-yellow-100 text-yellow-600">تحت المراجعة</Badge>;
      case 'resolved': return <Badge variant="default" className="bg-green-500 hover:bg-green-600">تم الحل</Badge>;
      case 'rejected': return <Badge variant="destructive">مرفوض</Badge>;
      default: return <Badge variant="outline">غير معروف</Badge>;
    }
  };

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Scale/> مراجعة طلبات التحكيم (ORDA)</h1>
        <p className="text-muted-foreground">
          مراجعة طلبات التحكيم المقدمة من أعضاء المجموعات واتخاذ القرارات اللازمة.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>طلبات التحكيم</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>معرف النزاع</TableHead>
                  <TableHead>المجموعة</TableHead>
                  <TableHead>مقدم الطلب</TableHead>
                  <TableHead>نوع النزاع</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.disputeId}>
                    <TableCell className="font-mono text-xs">{req.disputeId}</TableCell>
                    <TableCell><Link to={`/groups/${req.groupId}`} className="hover:underline">{req.groupTitle}</Link></TableCell>
                    <TableCell>{req.requesterName}</TableCell>
                    <TableCell>{req.disputeType}</TableCell>
                    <TableCell>{new Date(req.submittedAt).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                        <Eye className="h-4 w-4 mr-1"/> عرض التفاصيل
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {requests.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لا توجد طلبات تحكيم لمراجعتها حالياً.</p>
            )}
          </CardContent>
        </Card>

        {/* Details and Resolution Section */} 
        {selectedRequest && (
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل طلب التحكيم: {selectedRequest.disputeId}</CardTitle>
              <CardDescription>
                المجموعة: {selectedRequest.groupTitle} | مقدم الطلب: {selectedRequest.requesterName} | الحالة: {getStatusBadge(selectedRequest.status)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">وصف النزاع:</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded">{selectedRequest.description}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">الإجراء المقترح من مقدم الطلب:</h4>
                <p className="text-sm text-muted-foreground p-3 bg-muted rounded">{selectedRequest.proposedAction}</p>
              </div>
              <div>
                <Button variant="outline" size="sm" disabled={selectedRequest.evidenceCount === 0}>
                  <Download className="h-4 w-4 mr-1"/> تحميل الأدلة ({selectedRequest.evidenceCount})
                </Button>
              </div>

              {selectedRequest.status === 'resolved' && selectedRequest.resolution && (
                 <div>
                    <h4 className="font-medium mb-1">قرار التحكيم:</h4>
                    <p className="text-sm text-muted-foreground p-3 bg-green-50 rounded border border-green-200">{selectedRequest.resolution}</p>
                    <p className="text-xs text-muted-foreground mt-1">تاريخ القرار: {selectedRequest.resolutionDate ? new Date(selectedRequest.resolutionDate).toLocaleString('ar-SA') : '-'}</p>
                 </div>
              )}

              {/* Resolution Form (only if pending/under review) */} 
              {(selectedRequest.status === 'pending_review' || selectedRequest.status === 'under_review') && (
                <div className="border-t pt-4 mt-4 space-y-3">
                  <h3 className="text-lg font-semibold">إجراءات المراجعة والقرار</h3>
                   {selectedRequest.status === 'pending_review' && (
                       <Button onClick={() => handleUpdateRequestStatus(selectedRequest.disputeId, 'under_review')}> <MessageSquare className="h-4 w-4 mr-1"/> بدء المراجعة (تحت المراجعة)</Button>
                   )}
                   {selectedRequest.status === 'under_review' && (
                       <>
                           <div>
                               <Label htmlFor="resolutionNotes">ملاحظات وقرار المراجع:</Label>
                               <Textarea
                                   id="resolutionNotes"
                                   value={resolutionNotes}
                                   onChange={(e) => setResolutionNotes(e.target.value)}
                                   placeholder="أدخل ملاحظات المراجعة والقرار النهائي هنا..."
                                   rows={4}
                                   required
                               />
                           </div>
                           <div className="flex gap-2">
                               <Button onClick={() => handleUpdateRequestStatus(selectedRequest.disputeId, 'resolved', resolutionNotes)} disabled={!resolutionNotes}> <Gavel className="h-4 w-4 mr-1"/> حفظ القرار (تم الحل)</Button>
                               <Button variant="destructive" onClick={() => handleUpdateRequestStatus(selectedRequest.disputeId, 'rejected', resolutionNotes)} disabled={!resolutionNotes}> <X className="h-4 w-4 mr-1"/> رفض الطلب</Button>
                           </div>
                       </>
                   )}
                </div>
              )}
            </CardContent>
            <CardFooter>
                <Button variant="ghost" onClick={() => setSelectedRequest(null)}>إغلاق التفاصيل</Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </NewMainLayout>
  );
};

export default AdminReviewArbitration;


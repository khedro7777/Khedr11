import React, { useState } from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Eye, Users } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';

// Sample pending group creation requests data
const pendingGroups = [
  {
    id: 'group-req-1',
    groupName: 'مجموعة مستوردي الأغذية',
    creatorName: 'عبدالله السالم',
    creatorId: 'user-abdullah',
    sector: 'أغذية ومشروبات',
    country: 'الكويت',
    expectedMembers: 15,
    resourceType: 'مواد غذائية',
    submittedAt: '2025-05-23T08:00:00Z',
    status: 'pending_approval',
  },
  {
    id: 'group-req-2',
    groupName: 'تحالف شركات المقاولات',
    creatorName: 'شركة البناء الحديث',
    creatorId: 'user-builder-inc',
    sector: 'مقاولات',
    country: 'قطر',
    expectedMembers: 8,
    resourceType: 'مواد بناء',
    submittedAt: '2025-05-22T18:30:00Z',
    status: 'pending_approval',
  },
];

const AdminReviewGroups = () => {
  const { toast } = useToast();
  const [groups, setGroups] = useState(pendingGroups);

  const handleReview = (groupId: string, decision: 'approved' | 'rejected') => {
    console.log(`Reviewing group creation request ${groupId} with decision: ${decision}`);
    // Simulate API call to update group status
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, status: decision } : group
      )
    );
    toast({
      title: `تم ${decision === 'approved' ? 'قبول' : 'رفض'} طلب إنشاء المجموعة بنجاح`,
      description: `تم تحديث حالة الطلب ${groupId}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_approval':
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
        <h1 className="text-3xl font-bold flex items-center gap-2"><Users/> مراجعة طلبات إنشاء المجموعات</h1>
        <p className="text-muted-foreground">
          مراجعة وقبول أو رفض طلبات إنشاء المجموعات الجديدة المقدمة من المستخدمين.
        </p>

        <Card>
          <CardHeader>
            <CardTitle>طلبات إنشاء المجموعات المعلقة</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المجموعة المقترح</TableHead>
                  <TableHead>مقدم الطلب</TableHead>
                  <TableHead>القطاع</TableHead>
                  <TableHead>الدولة</TableHead>
                  <TableHead>تاريخ التقديم</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">{group.groupName}</TableCell>
                    <TableCell>
                        <Link to={`/profile/${group.creatorId}`} className="hover:underline">
                            {group.creatorName}
                        </Link>
                    </TableCell>
                    <TableCell>{group.sector}</TableCell>
                    <TableCell>{group.country}</TableCell>
                    <TableCell>{new Date(group.submittedAt).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{getStatusBadge(group.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {/* Add a button to view more details if needed */}
                        {/* <Button variant="outline" size="sm"><Eye className="h-4 w-4 mr-1"/> تفاصيل</Button> */} 
                        {group.status === 'pending_approval' && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-700 hover:bg-green-100" onClick={() => handleReview(group.id, 'approved')}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-100" onClick={() => handleReview(group.id, 'rejected')}>
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
            {groups.length === 0 && (
                <p className="text-center text-muted-foreground py-4">لا توجد طلبات إنشاء مجموعات لمراجعتها حالياً.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </NewMainLayout>
  );
};

export default AdminReviewGroups;


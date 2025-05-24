import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewMainLayout from '@/components/layout/NewMainLayout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Users, FileText, Settings, Calendar, MessageSquare, Briefcase,
  CheckCircle, ArrowUpRight, FileCheck, Clock, ThumbsUp, ThumbsDown, ArrowRight,
  Info, List, Package, UserCheck, Vote, Scale
} from 'lucide-react';
import LoomioVoting from '@/components/voting/LoomioVoting';
import SnapshotVoting from '@/components/voting/SnapshotVoting';

// Sample data for the group details page
const groupData = {
  id: "group-123",
  title: "شراء أجهزة كمبيوتر",
  description: "مجموعة لشراء أجهزة كمبيوتر للموظفين الجدد في الشركة.",
  type: "buying", // buying, marketing, freelancers
  status: "active", // active, pending, completed, failed
  state: "voting", // review, negotiation, offer, voting, closed
  creator: "أحمد محمد",
  createdAt: "2025-05-01",
  location: "الرياض",
  country: "السعودية",
  dueDate: "2025-06-30",
  target: "100 جهاز",
  groupValue: "120,000 ريال",
  progress: 60,
  members: [
    { id: "user1", name: "أحمد محمد", role: "Admin", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Ahmed" },
    { id: "user2", name: "سارة خالد", role: "Member", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah" },
    { id: "user3", name: "محمد علي", role: "Member", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Mohammed" },
    // Add more members
  ],
  isAdmin: true, // Assume current user is admin for this example
  supplierOffersActivated: true,
  freelancerApplicationsActivated: false,
  votingActivated: true,
  arbitrationActivated: true,
};

// Sample Supplier Offers
const supplierOffers = [
    { id: 'offer-1', supplierName: 'شركة التقنية الحديثة', price: '115,000 ريال', delivery: '15 يوم', attachments: 1, status: 'pending' },
    { id: 'offer-2', supplierName: 'مؤسسة الحلول الذكية', price: '120,000 ريال', delivery: '10 أيام', attachments: 2, status: 'pending' },
];

// Sample Freelancer Applications
const freelancerApplications = [
    // None for this example
];

// Sample Arbitration Cases
const arbitrationCases = [
    { id: 'arb-1', disputeType: 'تأخر التسليم', status: 'resolved', resolution: 'تم تعويض المجموعة', date: '2025-04-10' }
];

const GroupDetails = () => {
  const { groupId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [votingSystem, setVotingSystem] = useState('loomio'); // loomio or snapshot

  // State for managing the sheet (modal) visibility
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Function to open the sheet
  const openSheet = () => setIsSheetOpen(true);

  // Function to close the sheet
  const closeSheet = () => setIsSheetOpen(false);

  // Sample proposal data for voting components
  const proposalData = {
    proposalId: "prop-123",
    title: "التصويت على عرض شركة التقنية الحديثة",
    description: "التصويت على قبول عرض الأسعار المقدم من شركة التقنية الحديثة لشراء 100 جهاز لابتوب بسعر إجمالي قدره 115,000 ريال سعودي",
    options: [
      { id: "opt1", title: "موافق", votes: 8 },
      { id: "opt2", title: "غير موافق", votes: 2 },
      { id: "opt3", title: "امتناع", votes: 1 }
    ],
    createdBy: "أحمد محمد",
    createdAt: "2025-05-15T10:00:00Z",
    endDate: "2025-05-22T10:00:00Z",
    minTokens: 100,
    deadline: "2025-05-22T10:00:00Z",
    totalVotes: 11,
    spaceId: "gpo-buying-123",
    voters: [
      { id: "user1", name: "أحمد محمد", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Ahmed", vote: "agree" },
      { id: "user2", name: "سارة خالد", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sarah", vote: "disagree" },
      { id: "user3", name: "محمد علي", avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Mohammed", vote: "abstain" }
    ]
  };

  // Event handlers for voting components
  const handleVote = (option: string) => {
    console.log(`تم التصويت: ${option}`);
    // Handle voting logic
  };

  const handleComment = (comment: string) => {
    console.log(`تعليق جديد: ${comment}`);
    // Handle comment logic
  };

  // Helper to get status badge
  const getGroupStatusBadge = (status: string, state: string) => {
    let colorClass = 'bg-gray-100 text-gray-600';
    let text = state;
    switch (status) {
      case 'active':
        colorClass = 'bg-blue-100 text-blue-600';
        if (state === 'negotiation') text = 'تفاوض';
        else if (state === 'offer') text = 'تقديم عروض';
        else if (state === 'voting') text = 'تصويت';
        else text = 'نشطة';
        break;
      case 'pending':
        colorClass = 'bg-yellow-100 text-yellow-600';
        if (state === 'review') text = 'قيد المراجعة';
        else text = 'قيد الانتظار';
        break;
      case 'completed':
        colorClass = 'bg-green-100 text-green-600';
        text = 'مكتملة';
        break;
      case 'failed': case 'cancelled':
        colorClass = 'bg-red-100 text-red-600';
        text = 'ملغاة/فاشلة';
        break;
    }
    return <Badge variant="outline" className={`${colorClass} border-none text-xs font-medium flex items-center gap-1`}><Circle size={8} fill="currentColor"/> {text}</Badge>;
  };

  return (
    <NewMainLayout>
      <div className="space-y-6">
        {/* Group Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{groupData.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{groupData.type === 'buying' ? 'مجموعة شراء' : groupData.type === 'marketing' ? 'مجموعة تسويق' : 'مجموعة مستقلين'}</Badge>
              {getGroupStatusBadge(groupData.status, groupData.state)}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/dashboard/my-groups">العودة للمجموعات</Link>
            </Button>
            {groupData.isAdmin && (
              <Button variant="default">
                <Settings className="mr-2 h-4 w-4" />
                إدارة المجموعة
              </Button>
            )}
          </div>
        </div>

        {/* Group Tabs - Updated based on PDF */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:w-fit">
            <TabsTrigger value="overview"><Info className="mr-1 h-4 w-4"/>نظرة عامة</TabsTrigger>
            <TabsTrigger value="members"><Users className="mr-1 h-4 w-4"/>الأعضاء</TabsTrigger>
            {groupData.supplierOffersActivated && (
              <TabsTrigger value="supplier_offers"><Package className="mr-1 h-4 w-4"/>عروض الموردين</TabsTrigger>
            )}
            {groupData.freelancerApplicationsActivated && (
              <TabsTrigger value="freelancer_applications"><UserCheck className="mr-1 h-4 w-4"/>طلبات المستقلين</TabsTrigger>
            )}
            {groupData.votingActivated && (
              <TabsTrigger value="voting"><Vote className="mr-1 h-4 w-4"/>التصويت</TabsTrigger>
            )}
            {groupData.arbitrationActivated && (
              <TabsTrigger value="arbitration"><Scale className="mr-1 h-4 w-4"/>التحكيم (ORDA)</TabsTrigger>
            )}
            {/* Optional: Add other tabs like Files, Chat if needed */}
          </TabsList>

          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-6 space-y-6">
             {/* Content from previous version - kept for brevity */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="md:col-span-2">
                 <CardHeader><CardTitle>تفاصيل المجموعة</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                   <p className="text-muted-foreground">{groupData.description}</p>
                   <div className="grid grid-cols-2 gap-4 pt-4">
                     {/* Details like creator, date, location etc. */}
                      <div><p className="text-sm text-muted-foreground">المؤسس</p><p className="font-medium">{groupData.creator}</p></div>
                      <div><p className="text-sm text-muted-foreground">تاريخ الإنشاء</p><p className="font-medium">{groupData.createdAt}</p></div>
                      <div><p className="text-sm text-muted-foreground">الموقع</p><p className="font-medium">{groupData.location}، {groupData.country}</p></div>
                      <div><p className="text-sm text-muted-foreground">تاريخ الانتهاء</p><p className="font-medium">{groupData.dueDate}</p></div>
                      <div><p className="text-sm text-muted-foreground">الهدف</p><p className="font-medium">{groupData.target}</p></div>
                      <div><p className="text-sm text-muted-foreground">القيمة الإجمالية</p><p className="font-medium">{groupData.groupValue}</p></div>
                   </div>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader><CardTitle>الحالة</CardTitle></CardHeader>
                 <CardContent className="space-y-4">
                   <div>
                     <div className="flex items-center justify-between mb-1"><span className="text-sm">نسبة الاكتمال</span><span className="text-sm font-bold">{groupData.progress}%</span></div>
                     <Progress value={groupData.progress} className="h-2" />
                   </div>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">عدد الأعضاء</span><span>{groupData.members.length}</span></div>
                     {/* Calculate remaining time */}
                     <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">الوقت المتبقي</span><span>...</span></div>
                     <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">المرحلة الحالية</span>{getGroupStatusBadge(groupData.status, groupData.state)}</div>
                   </div>
                   {/* Join button logic needed */}
                   <Button className="w-full mt-4">الانضمام للمجموعة</Button>
                 </CardContent>
               </Card>
             </div>
             {/* Add Stages and Activity Feed cards here if needed */}
          </TabsContent>

          {/* Members Tab Content */}
          <TabsContent value="members" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>أعضاء المجموعة ({groupData.members.length})</CardTitle>
                <CardDescription>قائمة بالأعضاء المشاركين في المجموعة</CardDescription>
              </CardHeader>
              <CardContent>
                 <ul className="space-y-3">
                    {groupData.members.map(member => (
                        <li key={member.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                            <div className="flex items-center gap-3">
                                <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full" />
                                <span>{member.name}</span>
                            </div>
                            <Badge variant={member.role === 'Admin' ? 'default' : 'outline'}>{member.role}</Badge>
                        </li>
                    ))}
                 </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supplier Offers Tab Content */}
          {groupData.supplierOffersActivated && (
            <TabsContent value="supplier_offers" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>عروض الموردين ({supplierOffers.length})</CardTitle>
                  <CardDescription>العروض المقدمة من الموردين لهذه المجموعة.</CardDescription>
                </CardHeader>
                <CardContent>
                  {supplierOffers.length > 0 ? (
                    <ul className="space-y-3">
                      {supplierOffers.map(offer => (
                        <li key={offer.id} className="border p-3 rounded">
                          <p><strong>{offer.supplierName}</strong> - السعر: {offer.price}, التسليم: {offer.delivery}</p>
                          {/* Add view details button */} 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">لا توجد عروض موردين حالياً.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Freelancer Applications Tab Content */}
          {groupData.freelancerApplicationsActivated && (
            <TabsContent value="freelancer_applications" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>طلبات المستقلين ({freelancerApplications.length})</CardTitle>
                  <CardDescription>المستقلون المتقدمون للعمل على مهام المجموعة.</CardDescription>
                </CardHeader>
                <CardContent>
                  {freelancerApplications.length > 0 ? (
                     <p className="text-muted-foreground">قائمة طلبات المستقلين...</p>
                  ) : (
                    <p className="text-muted-foreground">لا توجد طلبات من مستقلين حالياً.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Voting Tab Content */}
          {groupData.votingActivated && (
            <TabsContent value="voting" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>التصويت</CardTitle>
                  <CardDescription>شارك في عملية اتخاذ القرار للمجموعة.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={votingSystem} onValueChange={setVotingSystem} className="mb-6">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="loomio">نظام Loomio</TabsTrigger>
                      <TabsTrigger value="snapshot">نظام Snapshot</TabsTrigger>
                    </TabsList>
                    <TabsContent value="loomio">
                      <LoomioVoting
                        proposalId={proposalData.proposalId}
                        title={proposalData.title}
                        description={proposalData.description}
                        options={proposalData.options}
                        deadline={proposalData.deadline}
                        totalVotes={proposalData.totalVotes}
                        voters={proposalData.voters}
                        onVote={handleVote}
                        onComment={handleComment}
                      />
                    </TabsContent>
                    <TabsContent value="snapshot">
                      <SnapshotVoting
                        proposalId={proposalData.proposalId}
                        title={proposalData.title}
                        spaceId={proposalData.spaceId}
                        options={proposalData.options.map(o => o.title)}
                        deadline={proposalData.deadline}
                        minTokens={proposalData.minTokens}
                        onVote={handleVote}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Arbitration Tab Content */}
          {groupData.arbitrationActivated && (
            <TabsContent value="arbitration" className="mt-6 space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>التحكيم (ORDA)</CardTitle>
                        <CardDescription>إدارة النزاعات وحالات التحكيم المتعلقة بالمجموعة.</CardDescription>
                    </div>
                    <Button variant="outline">طلب تحكيم جديد</Button>
                </CardHeader>
                <CardContent>
                   {arbitrationCases.length > 0 ? (
                    <ul className="space-y-3">
                      {arbitrationCases.map(arb => (
                        <li key={arb.id} className="border p-3 rounded">
                          <p><strong>{arb.disputeType}</strong> - الحالة: {arb.status} ({arb.date})</p>
                          {/* Add view details button */} 
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">لا توجد حالات تحكيم حالياً.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

        </Tabs>
      </div>
    </NewMainLayout>
  );
};

export default GroupDetails;


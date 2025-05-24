import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ShoppingCart, BarChart3, Users, Building, Plus, Loader2, Edit, UserPlus, LogOut, Briefcase, MoreVertical, Circle } from 'lucide-react';
import { GroupType } from '@/types';

// Sample group data - Added 'role' (created/joined) and more detailed 'state'
const sampleUserId = 'user123'; // Assume this is the logged-in user's ID

const myGroupsData = [
  {
    id: 'group-1',
    title: 'مجموعة شراء إلكترونيات',
    type: 'buying',
    status: 'active', // Overall status
    state: 'negotiation', // More specific state
    members: 12,
    progress: 60,
    userId: 'user123', // User who created this group
    role: 'created', // User created this group
    description: 'مجموعة لشراء أجهزة إلكترونية بكميات كبيرة للحصول على خصومات',
    createdAt: '2025-05-01'
  },
  {
    id: 'group-2',
    title: 'حملة تسويقية مشتركة',
    type: 'marketing',
    status: 'pending',
    state: 'review',
    members: 8,
    progress: 30,
    userId: 'user456',
    role: 'joined', // User joined this group
    description: 'حملة تسويقية مشتركة لمجموعة من المتاجر الإلكترونية',
    createdAt: '2025-05-10'
  },
   {
    id: 'group-3',
    title: 'تطوير تطبيق موبايل',
    type: 'freelancers',
    status: 'active',
    state: 'voting',
    members: 5,
    progress: 85,
    userId: 'user123',
    role: 'created',
    description: 'مجموعة من المستقلين لتطوير تطبيق موبايل للعميل س',
    createdAt: '2025-04-20'
  },
   {
    id: 'group-4',
    title: 'شراء مواد بناء',
    type: 'buying',
    status: 'completed',
    state: 'closed',
    members: 20,
    progress: 100,
    userId: 'user789',
    role: 'joined',
    description: 'تم إكمال عملية الشراء بنجاح.',
    createdAt: '2025-03-15'
  }
];

const MyGroups = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'created', 'joined'
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [groupType, setGroupType] = useState<GroupType>('buying');

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    // Simulate API call
    setTimeout(() => {
      setIsCreating(false);
      setCreateDialogOpen(false);
      window.location.href = `/create-group/${groupType}`;
    }, 1000);
  };

  const getGroupIcon = (type: string) => {
    switch (type) {
      case 'buying': return <ShoppingCart className="h-5 w-5 text-primary" />;
      case 'marketing': return <BarChart3 className="h-5 w-5 text-primary" />;
      case 'company_formation': return <Building className="h-5 w-5 text-primary" />;
      case 'freelancers': return <Users className="h-5 w-5 text-primary" />;
      default: return <ShoppingCart className="h-5 w-5 text-primary" />;
    }
  };

  // Enhanced status/state display with color coding
  const getGroupStatusBadge = (status: string, state: string) => {
    let colorClass = 'bg-gray-100 text-gray-600'; // Default
    let text = state; // Default to specific state

    switch (status) {
      case 'active':
        colorClass = 'bg-blue-100 text-blue-600';
        if (state === 'negotiation') text = 'تفاوض';
        else if (state === 'offer') text = 'تقديم عروض';
        else if (state === 'voting') text = 'تصويت';
        else text = 'نشطة'; // Fallback for active status
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
       case 'failed':
       case 'cancelled':
         colorClass = 'bg-red-100 text-red-600';
         text = 'ملغاة/فاشلة';
         break;
    }
    return <Badge variant="outline" className={`${colorClass} border-none text-xs font-medium flex items-center gap-1`}><Circle size={8} fill="currentColor"/> {text}</Badge>;
  };

  // Filter groups based on active tab (all, created, joined)
  const filteredGroups = myGroupsData.filter(group => {
      if (activeTab === 'all') return true;
      if (activeTab === 'created') return group.role === 'created';
      if (activeTab === 'joined') return group.role === 'joined';
      return false;
  });

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">مجموعاتي</h1>
          {/* Create Group Dialog Trigger */}
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
             <DialogTrigger asChild>
               <Button>
                 <Plus className="mr-2 h-4 w-4" /> إنشاء مجموعة جديدة
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[500px]">
               {/* Dialog Content remains the same */}
               <DialogHeader>
                 <DialogTitle>إنشاء مجموعة جديدة</DialogTitle>
                 <DialogDescription>اختر نوع المجموعة التي تريد إنشائها</DialogDescription>
               </DialogHeader>
               <form onSubmit={handleCreateGroup} className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Select value={groupType} onValueChange={(value) => setGroupType(value as GroupType)}>
                     <SelectTrigger><SelectValue placeholder="اختر نوع المجموعة" /></SelectTrigger>
                     <SelectContent>
                       <SelectItem value="buying">مجموعة شراء</SelectItem>
                       <SelectItem value="marketing">مجموعة تسويق</SelectItem>
                       <SelectItem value="company_formation">تأسيس شركة</SelectItem>
                       <SelectItem value="freelancers">مجموعة مستقلين</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <DialogFooter>
                   <Button type="submit" disabled={isCreating}>
                     {isCreating ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> جاري الإنشاء...</>) : ('متابعة الإنشاء')}
                   </Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>
        </div>
        <p className="text-muted-foreground">
          إدارة المجموعات التي أنشأتها أو انضممت إليها ومتابعة تقدمها.
        </p>

        {/* Tabs for All / Created / Joined */}
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full md:w-[300px]">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="created">أنشأتها</TabsTrigger>
            <TabsTrigger value="joined">انضممت إليها</TabsTrigger>
          </TabsList>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredGroups.map(group => (
              <Card key={group.id} className="overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                        {getGroupIcon(group.type)}
                        <span className="text-xs text-muted-foreground">
                            {group.type === 'buying' && 'شراء'}
                            {group.type === 'marketing' && 'تسويق'}
                            {group.type === 'company_formation' && 'تأسيس'}
                            {group.type === 'freelancers' && 'مستقلون'}
                        </span>
                    </div>
                    {getGroupStatusBadge(group.status, group.state)}
                  </div>
                  <CardTitle className="text-lg font-semibold">{group.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {group.members} عضو | أُنشئت في {group.createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between pt-0">
                  <div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">{group.description}</p>
                    {/* Progress bar */}
                    <div className="w-full bg-muted h-1.5 rounded-full mb-1">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${group.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-4">
                      <span>التقدم</span>
                      <span>{group.progress}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                     <Link to={`/groups/${group.id}`} className="flex-grow">
                        <Button variant="outline" className="w-full sm:w-auto">عرض التفاصيل</Button>
                     </Link>
                    {/* Action Buttons Dropdown (only if user has permissions, e.g., created the group) */}
                    {(group.role === 'created') && (
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="mr-2 h-4 w-4" /> دعوة أعضاء
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Briefcase className="mr-2 h-4 w-4" /> طلب مستقلين
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            <LogOut className="mr-2 h-4 w-4" /> انسحاب/حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                     {(group.role === 'joined') && (
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="ml-2">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <LogOut className="mr-2 h-4 w-4" /> انسحاب من المجموعة
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                     )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredGroups.length === 0 && (
              <div className="col-span-full text-center py-10">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">لم يتم العثور على مجموعات</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {activeTab === 'created' ? 'لم تقم بإنشاء أي مجموعات بعد.' : activeTab === 'joined' ? 'لم تنضم إلى أي مجموعات بعد.' : 'لا توجد مجموعات لعرضها.'}
                </p>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> إنشاء مجموعة جديدة
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </NewMainLayout>
  );
};

export default MyGroups;


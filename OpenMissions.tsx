import React from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { ListFilter, Briefcase } from 'lucide-react';

// Sample data for open freelancer missions
const openMissions = [
  {
    id: 'mission-1',
    title: 'تصميم شعار وهوية بصرية لشركة ناشئة',
    groupName: 'مجموعة التسويق الإبداعي',
    skillsRequired: ['تصميم جرافيك', 'هوية بصرية', 'Adobe Illustrator'],
    budget: '1500 ريال',
    deadline: '2025-06-10',
    status: 'open',
  },
  {
    id: 'mission-2',
    title: 'تطوير واجهة أمامية لتطبيق ويب (React)',
    groupName: 'فريق تطوير البرمجيات ألفا',
    skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'API Integration'],
    budget: '5000 ريال',
    deadline: '2025-07-05',
    status: 'open',
  },
  {
    id: 'mission-3',
    title: 'كتابة محتوى تسويقي لمدونة تقنية',
    groupName: 'مجموعة المحتوى الرقمي',
    skillsRequired: ['كتابة المحتوى', 'SEO', 'التسويق الرقمي'],
    budget: '50 ريال/مقال',
    deadline: 'مستمر',
    status: 'open',
  },
];

const FreelancerOpenMissions = () => {
  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">المهمات المتاحة للمستقلين</h1>
          <Button variant="outline">
            <ListFilter className="mr-2 h-4 w-4" /> تصفية المهمات
          </Button>
        </div>
        <p className="text-muted-foreground">
          استعرض المهمات المتاحة التي نشرتها المجموعات وقدم عرضك للعمل عليها.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {openMissions.map((mission) => (
            <Card key={mission.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-2 h-14">{mission.title}</CardTitle>
                    <Badge variant="secondary">{mission.status === 'open' ? 'مفتوح' : 'مغلق'}</Badge>
                </div>
                <CardDescription>مجموعة: {mission.groupName}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 flex-grow">
                <div>
                    <p className="text-sm font-medium mb-1">المهارات المطلوبة:</p>
                    <div className="flex flex-wrap gap-1">
                        {mission.skillsRequired.map((skill, index) => (
                            <Badge key={index} variant="outline">{skill}</Badge>
                        ))}
                    </div>
                </div>
                <p className="text-sm"><span className="font-medium">الميزانية:</span> {mission.budget}</p>
                <p className="text-sm"><span className="font-medium">آخر موعد للتقديم:</span> {mission.deadline}</p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to={`/freelancers/mission/${mission.id}`}> <Briefcase className="mr-2 h-4 w-4"/> عرض التفاصيل وتقديم العرض</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {openMissions.length === 0 && (
          <div className="text-center py-10">
            <p className="text-muted-foreground">لا توجد مهمات متاحة للمستقلين حالياً.</p>
          </div>
        )}
      </div>
    </NewMainLayout>
  );
};

export default FreelancerOpenMissions;


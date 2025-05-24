import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewMainLayout from '@/components/layout/NewMainLayout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Send, ArrowLeft, Briefcase, Calendar, Tag, Users } from 'lucide-react';

// Sample mission data (fetch based on missionId)
const sampleMissionData = {
  id: 'mission-2',
  title: 'تطوير واجهة أمامية لتطبيق ويب (React)',
  groupName: 'فريق تطوير البرمجيات ألفا',
  groupId: 'group-dev-alpha',
  skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'API Integration'],
  budget: '5000 ريال',
  deadline: '2025-07-05',
  status: 'open',
  description: 'مطلوب مطور واجهة أمامية محترف باستخدام React و TypeScript لبناء واجهة مستخدم تفاعلية لتطبيق ويب جديد. يجب أن يكون لدى المطور خبرة في التعامل مع Tailwind CSS ودمج واجهات برمجة التطبيقات (APIs). سيتم توفير تصميم الواجهة (Figma).',
  responsibilities: [
    'تحويل تصميم Figma إلى مكونات React قابلة لإعادة الاستخدام.',
    'بناء واجهات مستخدم تفاعلية وسريعة الاستجابة.',
    'دمج واجهات برمجة التطبيقات (APIs) الخلفية.',
    'كتابة كود نظيف وقابل للصيانة.',
    'التعاون مع فريق الواجهة الخلفية والمصممين.',
  ],
};

const FreelancerMissionDetails = () => {
  const { missionId } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    proposalDescription: '',
    proposedTimeline: '', // e.g., "3 أسابيع"
    proposedBudget: '', // Could be different from mission budget
    attachments: null as FileList | null,
  });

  // Fetch mission data based on missionId - using sample data for now
  const missionData = sampleMissionData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachments: e.target.files }));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting freelancer offer:', formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم إرسال عرضك بنجاح",
        description: "سيتم مراجعة عرضك من قبل المجموعة أو المسؤول.",
      });
      // Optionally redirect or clear form
      setFormData({
        proposalDescription: '',
        proposedTimeline: '',
        proposedBudget: '',
        attachments: null,
      });
    }, 1500);
  };

  if (!missionData) {
    return <NewMainLayout><p>جاري تحميل تفاصيل المهمة...</p></NewMainLayout>;
  }

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div>
            <Button variant="outline" asChild size="sm" className="mb-4">
                <Link to="/freelancers/open-missions">
                    <ArrowLeft className="mr-1 h-4 w-4"/> العودة إلى قائمة المهمات
                </Link>
            </Button>
            <h1 className="text-3xl font-bold">تفاصيل المهمة: {missionData.title}</h1>
            <p className="text-muted-foreground">
                نشرت بواسطة: <Link to={`/groups/${missionData.groupId}`} className="text-primary hover:underline">{missionData.groupName}</Link>
            </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mission Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>تفاصيل المهمة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <h4 className="font-medium mb-1 text-sm flex items-center"><Briefcase className="h-4 w-4 mr-1 text-muted-foreground"/> الوصف</h4>
                    <p className="text-sm text-muted-foreground">{missionData.description}</p>
                </div>
                 <div>
                    <h4 className="font-medium mb-1 text-sm flex items-center"><Users className="h-4 w-4 mr-1 text-muted-foreground"/> المهارات المطلوبة</h4>
                    <div className="flex flex-wrap gap-1">
                        {missionData.skillsRequired.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                </div>
                 <div>
                    <h4 className="font-medium mb-1 text-sm flex items-center"><Tag className="h-4 w-4 mr-1 text-muted-foreground"/> الميزانية</h4>
                    <p className="text-sm text-muted-foreground">{missionData.budget}</p>
                </div>
                 <div>
                    <h4 className="font-medium mb-1 text-sm flex items-center"><Calendar className="h-4 w-4 mr-1 text-muted-foreground"/> آخر موعد للتقديم</h4>
                    <p className="text-sm text-muted-foreground">{missionData.deadline}</p>
                </div>
                 <div>
                    <h4 className="font-medium mb-1 text-sm">المسؤوليات الرئيسية</h4>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                        {missionData.responsibilities.map((resp, index) => (
                            <li key={index}>{resp}</li>
                        ))}
                    </ul>
                </div>
            </CardContent>
          </Card>

          {/* Submit Offer Form Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>تقديم عرض للعمل على المهمة</CardTitle>
              <CardDescription>اشرح لماذا أنت مناسب لهذه المهمة وقدم عرضك.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <Label htmlFor="proposalDescription">لماذا أنت مناسب لهذه المهمة؟ (اشرح خبراتك ذات الصلة)</Label>
                  <Textarea id="proposalDescription" name="proposalDescription" value={formData.proposalDescription} onChange={handleInputChange} required rows={5} placeholder="أذكر خبراتك السابقة في المشاريع المشابهة، وكيف يمكنك تحقيق متطلبات المهمة..." />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="proposedTimeline">الجدول الزمني المقترح لإنجاز المهمة</Label>
                    <Input id="proposedTimeline" name="proposedTimeline" value={formData.proposedTimeline} onChange={handleInputChange} required placeholder="مثال: 3 أسابيع" />
                  </div>
                  <div>
                    <Label htmlFor="proposedBudget">الميزانية المطلوبة (بالريال)</Label>
                    <Input id="proposedBudget" name="proposedBudget" type="number" step="0.01" value={formData.proposedBudget} onChange={handleInputChange} required placeholder={`الميزانية المحددة: ${missionData.budget}`} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="attachments">المرفقات (ملف السيرة الذاتية، معرض الأعمال، إلخ)</Label>
                  <Input id="attachments" name="attachments" type="file" onChange={handleFileChange} multiple />
                  {formData.attachments && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.attachments.length} ملف تم اختياره.
                    </p>
                  )}
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'جاري الإرسال...' : <><Send className="mr-2 h-4 w-4"/> إرسال العرض</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </NewMainLayout>
  );
};

export default FreelancerMissionDetails;


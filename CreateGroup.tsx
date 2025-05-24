import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

// Placeholder descriptions for each gateway type
const serviceExplanations: { [key: string]: { title: string; description: string } } = {
  purchasing: {
    title: 'خدمة الشراء التعاوني',
    description: 'انضم أو أنشئ مجموعة للحصول على أفضل الصفقات من خلال قوة الشراء الجماعي. قلل التكاليف وحسّن شروط التوريد.',
  },
  marketing: {
    title: 'خدمة التسويق الجماعي',
    description: 'شارك في حملات تسويقية مشتركة لزيادة الوصول وتقليل النفقات. استفد من الجهود الجماعية لتوسيع نطاق علامتك التجارية.',
  },
  freelancers: {
    title: 'خدمة المستقلين',
    description: 'كوّن فريقًا من المستقلين أو انضم إلى مجموعة قائمة للتعاون في المشاريع. اعثر على الفرص المناسبة أو شكّل فريق أحلامك.',
  },
  suppliers: {
    title: 'خدمة الموردين',
    description: 'هذه البوابة مخصصة للموردين لتقديم عروضهم. لا يمكن إنشاء مجموعات من هنا.', // Suppliers don't create groups
  },
};

const CreateGroup = () => {
  const { type = 'purchasing' } = useParams<{ type: string }>(); // Default to purchasing if type is undefined
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1); // 1: Explanation & Choice, 2: Form
  const [groupTypeChoice, setGroupTypeChoice] = useState<'group' | 'solo' | null>(null);
  const [formState, setFormState] = useState({
    groupName: '',
    country: '',
    sector: '',
    expectedMembers: '',
    resourceType: '',
    rqfDetails: '',
  });

  const explanation = serviceExplanations[type] || serviceExplanations.purchasing;
  const canBeSolo = type === 'freelancers'; // Only freelancers can potentially be solo

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  const handleStart = () => {
    if (type === 'suppliers') {
      // Handle supplier case - maybe redirect or show a message
      toast({
        title: "ملاحظة",
        description: "بوابة الموردين مخصصة لتقديم العروض ولا تدعم إنشاء المجموعات.",
      });
      return;
    }
    setStep(2);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add form validation here if needed
    console.log('Form submitted:', formState);
    toast({
      title: "تم الإرسال بنجاح",
      description: "طلب إنشاء المجموعة قيد المراجعة الآن.",
    });
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/dashboard/my-groups'); // Navigate to Dashboard > My Groups
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">إنشاء مجموعة جديدة</h1>

        {/* Step 1: Explanation and Group/Solo Choice */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{explanation.title}</CardTitle>
              <CardDescription>{explanation.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {type !== 'suppliers' && (
                <>
                  <Label className="text-base font-semibold">كيف ترغب بالبدء؟</Label>
                  <RadioGroup 
                    defaultValue={groupTypeChoice ?? undefined} 
                    onValueChange={(value: 'group' | 'solo') => setGroupTypeChoice(value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem value="group" id="r-group" />
                      <Label htmlFor="r-group">إنشاء مجموعة جديدة</Label>
                    </div>
                    {canBeSolo && (
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <RadioGroupItem value="solo" id="r-solo" />
                        <Label htmlFor="r-solo">العمل كفرد (Solo)</Label>
                      </div>
                    )}
                  </RadioGroup>
                  <Button onClick={handleStart} disabled={!groupTypeChoice} className="w-full md:w-auto">
                    ابدأ الآن
                  </Button>
                </>
              )}
              {type === 'suppliers' && (
                 <Button onClick={() => navigate('/suppliers/offers')} className="w-full md:w-auto">
                    الانتقال لتقديم العروض
                  </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Mini Form */}
        {step === 2 && groupTypeChoice === 'group' && (
          <Card>
            <CardHeader>
              <CardTitle>تفاصيل المجموعة ({explanation.title})</CardTitle>
              <CardDescription>أدخل تفاصيل المجموعة التي ترغب بإنشائها.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="groupName">اسم المجموعة</Label>
                  <Input id="groupName" name="groupName" value={formState.groupName} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="country">الدولة</Label>
                    <Select name="country" onValueChange={(value) => handleSelectChange('country', value)} required>
                      <SelectTrigger id="country">
                        <SelectValue placeholder="اختر الدولة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sa">السعودية</SelectItem>
                        <SelectItem value="ae">الإمارات</SelectItem>
                        <SelectItem value="eg">مصر</SelectItem>
                        <SelectItem value="kw">الكويت</SelectItem>
                        {/* Add more countries */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sector">القطاع</Label>
                     <Select name="sector" onValueChange={(value) => handleSelectChange('sector', value)} required>
                      <SelectTrigger id="sector">
                        <SelectValue placeholder="اختر القطاع" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tech">تكنولوجيا</SelectItem>
                        <SelectItem value="retail">تجزئة</SelectItem>
                        <SelectItem value="health">صحة</SelectItem>
                        <SelectItem value="edu">تعليم</SelectItem>
                         {/* Add more sectors */}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expectedMembers">الأعضاء المتوقعون (العدد)</Label>
                      <Input id="expectedMembers" name="expectedMembers" type="number" value={formState.expectedMembers} onChange={handleInputChange} required />
                    </div>
                     <div>
                      <Label htmlFor="resourceType">نوع المورد/الخدمة المطلوبة</Label>
                      <Input id="resourceType" name="resourceType" value={formState.resourceType} onChange={handleInputChange} required />
                    </div>
                 </div>
                <div>
                  <Label htmlFor="rqfDetails">تفاصيل الطلب (RFQ - اختياري)</Label>
                  <Textarea id="rqfDetails" name="rqfDetails" value={formState.rqfDetails} onChange={handleInputChange} placeholder="أضف وصفًا تفصيليًا للمنتجات أو الخدمات المطلوبة، الكميات، المواصفات، إلخ..." />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  إرسال طلب إنشاء المجموعة
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
         {/* Step 2: Solo Flow (Placeholder) */}
         {step === 2 && groupTypeChoice === 'solo' && (
            <Card>
                <CardHeader>
                    <CardTitle>العمل كفرد (Solo)</CardTitle>
                    <CardDescription>سيتم توجيهك إلى لوحة التحكم الخاصة بك.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>جاري توجيهك...</p>
                    {/* Add logic to redirect to the appropriate solo dashboard/section */}
                    {/* Example redirect: */}
                    {/* { setTimeout(() => navigate('/dashboard/solo-projects'), 1500) } */}
                </CardContent>
            </Card>
         )}
      </div>
    </MainLayout>
  );
};

export default CreateGroup;


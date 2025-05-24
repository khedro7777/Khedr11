import React, { useState } from 'react';
import NewMainLayout from '@/components/layout/NewMainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Send, ArrowLeft, Scale } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

const RequestArbitration = () => {
  const { groupId } = useParams(); // Assuming the group ID is passed in the route
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    disputeType: '',
    description: '',
    evidence: null as FileList | null,
    proposedAction: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, evidence: e.target.files }));
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const disputeId = `DISPUTE-${groupId}-${Date.now()}`;
    console.log('Submitting arbitration request:', { ...formData, disputeId });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم إرسال طلب التحكيم بنجاح",
        description: `تم إنشاء طلب التحكيم بالمعرف: ${disputeId}. سيتم مراجعة طلبك وتجميد أنشطة المجموعة مؤقتًا إذا لزم الأمر.`,
      });
      // Optionally redirect or clear form
      setFormData({
        disputeType: '',
        description: '',
        evidence: null,
        proposedAction: '',
      });
      // Potentially redirect back to the group page or a disputes list page
      // navigate(`/groups/${groupId}/arbitration`);
    }, 1500);
  };

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div>
          <Button variant="outline" asChild size="sm" className="mb-4">
            {/* Adjust link based on where the button is placed, e.g., group details page */}
            <Link to={`/groups/${groupId || 'default'}`}>
              <ArrowLeft className="mr-1 h-4 w-4"/> العودة إلى المجموعة
            </Link>
          </Button>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Scale/> طلب تحكيم (ORDA)</h1>
          <p className="text-muted-foreground">
            إذا واجهت نزاعًا داخل المجموعة لا يمكن حله، يمكنك طلب تدخل طرف ثالث محايد (ORDA) للمساعدة في التوصل إلى حل.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>نموذج طلب التحكيم</CardTitle>
            <CardDescription>يرجى تقديم تفاصيل دقيقة وواضحة حول النزاع والأدلة الداعمة.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitRequest} className="space-y-4">
              <div>
                <Label htmlFor="disputeType">نوع النزاع</Label>
                <Select name="disputeType" onValueChange={(value) => handleSelectChange('disputeType', value)} required>
                  <SelectTrigger id="disputeType">
                    <SelectValue placeholder="اختر نوع النزاع" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery_issue">مشكلة في التسليم (تأخير، جودة، كمية)</SelectItem>
                    <SelectItem value="payment_issue">مشكلة في الدفع</SelectItem>
                    <SelectItem value="contract_breach">مخالفة شروط العقد</SelectItem>
                    <SelectItem value="member_dispute">نزاع بين الأعضاء</SelectItem>
                    <SelectItem value="freelancer_dispute">نزاع مع مستقل</SelectItem>
                    <SelectItem value="other">أخرى (يرجى التوضيح في الوصف)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">وصف النزاع</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} required rows={6} placeholder="اشرح طبيعة النزاع بالتفصيل، الأطراف المعنية، وتاريخ بدء المشكلة..." />
              </div>
              <div>
                <Label htmlFor="evidence">الأدلة الداعمة (مستندات، صور، محادثات)</Label>
                <Input id="evidence" name="evidence" type="file" onChange={handleFileChange} multiple />
                {formData.evidence && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.evidence.length} ملف تم اختياره.
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="proposedAction">الإجراء المقترح للحل</Label>
                <Textarea id="proposedAction" name="proposedAction" value={formData.proposedAction} onChange={handleInputChange} required rows={3} placeholder="ما هو الحل الذي تقترحه لحل هذا النزاع؟" />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'جاري الإرسال...' : <><Send className="mr-2 h-4 w-4"/> إرسال طلب التحكيم</>}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </NewMainLayout>
  );
};

export default RequestArbitration;


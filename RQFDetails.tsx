import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import NewMainLayout from '@/components/layout/NewMainLayout';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Upload, Send, ArrowLeft } from 'lucide-react';

// Sample RQF data (fetch based on rqfId)
const sampleRqfData = {
  id: 'rqf-1',
  title: 'شراء أجهزة كمبيوتر محمولة',
  groupName: 'مجموعة شراء الإلكترونيات',
  sector: 'تكنولوجيا',
  country: 'السعودية',
  requiredQuantity: 100,
  deadline: '2025-06-15',
  status: 'open',
  description: 'مطلوب شراء 100 جهاز كمبيوتر محمول بمواصفات محددة (Core i7, 16GB RAM, 512GB SSD) لتلبية احتياجات التوسع في الشركة. يجب أن تكون الأجهزة جديدة ومع ضمان لمدة سنة على الأقل.',
  specifications: [
    'المعالج: Intel Core i7 أو ما يعادله',
    'الذاكرة العشوائية: 16GB DDR4',
    'التخزين: 512GB NVMe SSD',
    'الشاشة: 14-15.6 بوصة Full HD',
    'الضمان: سنة واحدة على الأقل',
  ],
};

const SupplierRQFDetails = () => {
  const { rqfId } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    pricePerUnit: '',
    totalPrice: '',
    deliveryTime: '',
    notes: '',
    attachments: null as FileList | null,
  });

  // Fetch RQF data based on rqfId - using sample data for now
  const rqfData = sampleRqfData;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Auto-calculate total price if price per unit and quantity are available
    if (name === 'pricePerUnit' && rqfData.requiredQuantity) {
      const price = parseFloat(value);
      if (!isNaN(price)) {
        setFormData(prev => ({ ...prev, totalPrice: (price * rqfData.requiredQuantity).toFixed(2) }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, attachments: e.target.files }));
  };

  const handleSubmitOffer = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting offer:', formData);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "تم إرسال العرض بنجاح",
        description: "سيتم مراجعة عرضك من قبل مسؤول المجموعة.",
      });
      // Optionally redirect or clear form
      setFormData({
        companyName: '',
        pricePerUnit: '',
        totalPrice: '',
        deliveryTime: '',
        notes: '',
        attachments: null,
      });
    }, 1500);
  };

  if (!rqfData) {
    return <NewMainLayout><p>جاري تحميل تفاصيل الطلب...</p></NewMainLayout>;
  }

  return (
    <NewMainLayout>
      <div className="space-y-6">
        <div>
            <Button variant="outline" asChild size="sm" className="mb-4">
                <Link to="/suppliers/open-rqfs">
                    <ArrowLeft className="mr-1 h-4 w-4"/> العودة إلى قائمة الطلبات
                </Link>
            </Button>
            <h1 className="text-3xl font-bold">تفاصيل طلب عرض الأسعار: {rqfData.title}</h1>
            <p className="text-muted-foreground">مجموعة: {rqfData.groupName} | آخر موعد للتقديم: {rqfData.deadline}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RQF Details Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>تفاصيل الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong className="font-medium">الوصف:</strong> {rqfData.description}</p>
              <p><strong className="font-medium">الكمية المطلوبة:</strong> {rqfData.requiredQuantity}</p>
              <p><strong className="font-medium">القطاع:</strong> {rqfData.sector}</p>
              <p><strong className="font-medium">الدولة:</strong> {rqfData.country}</p>
              <div>
                <strong className="font-medium">المواصفات المطلوبة:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1 text-sm text-muted-foreground">
                  {rqfData.specifications.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Submit Offer Form Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>تقديم عرض سعر</CardTitle>
              <CardDescription>املأ النموذج التالي لتقديم عرض السعر الخاص بك لهذا الطلب.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitOffer} className="space-y-4">
                <div>
                  <Label htmlFor="companyName">اسم الشركة الموردة</Label>
                  <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleInputChange} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pricePerUnit">السعر للوحدة (بالريال)</Label>
                    <Input id="pricePerUnit" name="pricePerUnit" type="number" step="0.01" value={formData.pricePerUnit} onChange={handleInputChange} required />
                  </div>
                  <div>
                    <Label htmlFor="totalPrice">السعر الإجمالي (محسوب)</Label>
                    <Input id="totalPrice" name="totalPrice" type="number" value={formData.totalPrice} readOnly disabled />
                  </div>
                </div>
                <div>
                  <Label htmlFor="deliveryTime">مدة التسليم المتوقعة (بالأيام)</Label>
                  <Input id="deliveryTime" name="deliveryTime" type="number" value={formData.deliveryTime} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="notes">ملاحظات إضافية</Label>
                  <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} placeholder="أضف أي تفاصيل أو شروط إضافية هنا..." />
                </div>
                <div>
                  <Label htmlFor="attachments">المرفقات (كتالوج، عرض سعر رسمي، إلخ)</Label>
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

export default SupplierRQFDetails;


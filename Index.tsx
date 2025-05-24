
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, BarChart3, Users, Building, Store, Search, Globe, Tag, MessageSquare } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { NavigationLinks } from '@/components/layout/navigation/NavigationLinks';
import { useAuth } from '@/hooks/use-auth';

const portals = [
  {
    id: 'purchasing',
    title: 'الشراء التعاوني',
    description: 'نظام شراء جماعي للحصول على أفضل الأسعار والشروط من الموردين',
    icon: <ShoppingCart className="h-6 w-6 text-white" />,
    type: 'web2',
    collectiveOption: true,
  },
  {
    id: 'marketing',
    title: 'التسويق الجماعي',
    description: 'حملات تسويقية مشتركة لتقليل التكاليف وزيادة الوصول للجمهور المستهدف',
    icon: <BarChart3 className="h-6 w-6 text-white" />,
    type: 'web2',
    collectiveOption: true,
  },
  {
    id: 'freelancers',
    title: 'المستقلون',
    description: 'منصة للمستقلين للعمل فرديًا أو ضمن مجموعات على مشاريع متنوعة',
    icon: <Users className="h-6 w-6 text-white" />,
    type: 'web3',
    collectiveOption: true,
  },
  {
    id: 'suppliers',
    title: 'الموردون',
    description: 'نظام متكامل للموردين لتقديم العروض والخدمات لمجموعات الشراء',
    icon: <Store className="h-6 w-6 text-white" />,
    type: 'web2',
    collectiveOption: false,
  },
];

// Sample active groups data
const activeGroups = [
  {
    id: 'group-1',
    title: 'مجموعة شراء أجهزة إلكترونية',
    type: 'buying',
    members: 24,
    country: 'السعودية',
    status: 'active',
    needsFreelancer: false,
    rqfOpen: true,
  },
  {
    id: 'group-2',
    title: 'حملة تسويقية لمنتجات صحية',
    type: 'marketing',
    members: 18,
    country: 'الإمارات',
    status: 'active',
    needsFreelancer: true,
    rqfOpen: false,
  },
  {
    id: 'group-3',
    title: 'تطوير منصة تعليمية',
    type: 'freelancers',
    members: 15,
    country: 'مصر',
    status: 'active',
    needsFreelancer: false,
    rqfOpen: false,
  }
];

const YouTubeEmbed: React.FC<{videoId: string}> = ({ videoId }) => {
  return (
    <div className="relative w-full max-w-md aspect-video rounded-lg overflow-hidden">
      <iframe 
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen>
      </iframe>
    </div>
  );
};

const Index = () => {
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sectorFilter, setSectorFilter] = useState<string>('all');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [language, setLanguage] = useState<string>('ar');
  const [country, setCountry] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('portals');
  const { isAuthenticated } = useAuth();
  
  // Filter groups
  const filteredGroups = activeGroups.filter(group => {
    const matchesSearch = group.title.toLowerCase().includes(searchText.toLowerCase());
    const matchesType = typeFilter === 'all' || group.type === typeFilter;
    const matchesRegion = regionFilter === 'all' || group.country === regionFilter;
    
    return matchesSearch && matchesType && matchesRegion;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                منصة عقود ذكية للمشترين والموردين والمستقلين
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                استفد من قوة التعاون الجماعي، العقود الذكية، وتكنولوجيا GPO لبناء مستقبل أفضل للتعاون والأعمال
              </p>
              <Button size="lg" className="px-8 py-6 text-lg">
                ابدأ الآن
              </Button>
            </div>
            <div className="w-full md:w-auto">
              <YouTubeEmbed videoId="dQw4w9WgXcQ" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-4 shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="ابحث في المنصة..." 
                className="pl-10 bg-muted/20" 
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                dir="rtl"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="نوع الخدمة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">الكل</SelectItem>
                  <SelectItem value="buying">الشراء</SelectItem>
                  <SelectItem value="marketing">التسويق</SelectItem>
                  <SelectItem value="freelancers">المستقلون</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sectorFilter} onValueChange={setSectorFilter}>
                <SelectTrigger className="w-[150px]">
                  <Tag className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="القطاع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل القطاعات</SelectItem>
                  <SelectItem value="tech">تكنولوجيا</SelectItem>
                  <SelectItem value="retail">تجزئة</SelectItem>
                  <SelectItem value="health">صحة</SelectItem>
                  <SelectItem value="edu">تعليم</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={regionFilter} onValueChange={setRegionFilter}>
                <SelectTrigger className="w-[150px]">
                  <Globe className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="المنطقة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل المناطق</SelectItem>
                  <SelectItem value="السعودية">السعودية</SelectItem>
                  <SelectItem value="الإمارات">الإمارات</SelectItem>
                  <SelectItem value="مصر">مصر</SelectItem>
                  <SelectItem value="الكويت">الكويت</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Smart Cards */}
        <h2 className="text-2xl font-bold mb-6 text-center md:text-right">البوابات الرئيسية</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {portals.map((portal) => (
            <Link to={`/create-group/${portal.id}`} key={portal.id} className="block">
              <Card className="h-full hover:shadow-md transition-shadow overflow-hidden border-0 shadow-sm">
                <div className="h-1.5 bg-gradient-to-r from-primary to-primary/70"></div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-primary rounded-md p-2.5">
                      {portal.icon}
                    </div>
                    {portal.collectiveOption && (
                      <Badge variant="outline" className="text-xs">فردي / جماعي</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{portal.title}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10">{portal.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="secondary" className="w-full mt-3 justify-between">
                    ابدأ
                    <span className="mr-2">←</span>
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        {/* Group Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-right">المجموعات النشطة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeGroups.slice(0, 3).map(group => (
              <Card key={group.id} className="hover:shadow-md transition-shadow border-0 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-300"></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                      {group.type === 'buying' && 'شراء'}
                      {group.type === 'marketing' && 'تسويق'}
                      {group.type === 'freelancers' && 'مستقلين'}
                    </Badge>
                    <Badge variant="outline">{group.country}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{group.title}</CardTitle>
                  <CardDescription>
                    {group.members} أعضاء
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {group.needsFreelancer && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-50">بحاجة إلى مستقلين</Badge>
                    )}
                    {group.rqfOpen && (
                      <Badge variant="secondary" className="bg-green-50 text-green-600 hover:bg-green-50">RFQ مفتوح</Badge>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <Button asChild className="w-full justify-between">
                      <Link to={`/groups/${group.id}`}>
                        الانضمام للمجموعة
                        <span className="mr-2">←</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" asChild>
              <Link to="/groups">
                عرض المزيد من المجموعات
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Suppliers Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center md:text-right">المجموعات التي تبحث عن موردين</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeGroups.slice(0, 2).map(group => (
              <Card key={group.id} className="hover:shadow-md transition-shadow border-0 shadow-sm overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-300"></div>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="default" className="bg-teal-500 hover:bg-teal-600">
                      بحاجة لموردين
                    </Badge>
                    <Badge variant="outline">{group.country}</Badge>
                  </div>
                  <CardTitle className="mt-2 text-lg">{group.title}</CardTitle>
                  <CardDescription>
                    نوع العرض: {group.type === 'buying' ? 'شراء' : 'خدمات'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <Button asChild variant="secondary" className="w-full justify-between">
                      <Link to={`/groups/${group.id}`}>
                        تقديم عرض
                        <span className="mr-2">←</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-10">
        <NavigationLinks />
      </div>
      
      {/* MCP Assistant Button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
        <Button 
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      </div>
      
      <Footer className="hidden md:block" />
    </div>
  );
};

export default Index;

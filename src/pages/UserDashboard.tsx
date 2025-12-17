import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Call {
  id: string;
  city: string;
  date: string;
  duration: number;
  timeOfDay: 'day' | 'night';
  cost: number;
}

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const calls: Call[] = [
    {
      id: '1',
      city: 'Москва',
      date: '2024-12-17 14:30',
      duration: 15,
      timeOfDay: 'day',
      cost: 180,
    },
    {
      id: '2',
      city: 'Санкт-Петербург',
      date: '2024-12-17 09:15',
      duration: 23,
      timeOfDay: 'day',
      cost: 345,
    },
    {
      id: '3',
      city: 'Екатеринбург',
      date: '2024-12-16 22:00',
      duration: 8,
      timeOfDay: 'night',
      cost: 96,
    },
    {
      id: '4',
      city: 'Москва',
      date: '2024-12-16 11:20',
      duration: 42,
      timeOfDay: 'day',
      cost: 453.6,
    },
    {
      id: '5',
      city: 'Казань',
      date: '2024-12-15 16:45',
      duration: 12,
      timeOfDay: 'day',
      cost: 156,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Выход выполнен',
      description: 'До свидания!',
    });
  };

  const goToAdmin = () => {
    navigate('/admin');
  };

  const totalCalls = calls.length;
  const totalCost = calls.reduce((sum, call) => sum + call.cost, 0);
  const totalMinutes = calls.reduce((sum, call) => sum + call.duration, 0);
  const avgCost = totalCalls > 0 ? totalCost / totalCalls : 0;

  const dayCalls = calls.filter(c => c.timeOfDay === 'day').length;
  const nightCalls = calls.filter(c => c.timeOfDay === 'night').length;

  const callsByCity = calls.reduce((acc, call) => {
    acc[call.city] = (acc[call.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(callsByCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Icon name="Phone" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Личный кабинет</h1>
                <p className="text-xs text-muted-foreground">{user?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goToAdmin} className="gap-1.5">
                <Icon name="Settings" size={14} />
                <span className="hidden sm:inline">Админ</span>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
                <Icon name="LogOut" size={14} />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1">Добро пожаловать!</h2>
          <p className="text-muted-foreground">Здесь вы можете отслеживать свои звонки и расходы</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="PhoneCall" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalCalls}</div>
                  <div className="text-xs opacity-90">Звонков</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalMinutes}</div>
                  <div className="text-xs opacity-90">Минут</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{totalCost.toFixed(0)}</div>
                  <div className="text-xs opacity-90">Рублей</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{avgCost.toFixed(0)}</div>
                  <div className="text-xs opacity-90">Средний чек</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-10">
            <TabsTrigger value="overview" className="gap-1.5 text-xs">
              <Icon name="LayoutDashboard" size={14} />
              <span>Обзор</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="gap-1.5 text-xs">
              <Icon name="History" size={14} />
              <span>История</span>
            </TabsTrigger>
            <TabsTrigger value="tariff" className="gap-1.5 text-xs">
              <Icon name="CreditCard" size={14} />
              <span>Тариф</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    Популярные направления
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCities.map(([city, count], idx) => (
                      <div key={city} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">{idx + 1}</span>
                          </div>
                          <span className="text-sm font-medium">{city}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">{count} звонков</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Icon name="PieChart" size={16} className="text-primary" />
                    Распределение по времени
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Дневные</span>
                        <span className="text-sm font-medium">{dayCalls} ({((dayCalls / totalCalls) * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                          style={{ width: `${(dayCalls / totalCalls) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Ночные</span>
                        <span className="text-sm font-medium">{nightCalls} ({((nightCalls / totalCalls) * 100).toFixed(0)}%)</span>
                      </div>
                      <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                          style={{ width: `${(nightCalls / totalCalls) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon name="Activity" size={16} className="text-primary" />
                  Последние звонки
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Город</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Дата</TableHead>
                      <TableHead className="text-xs">Длит.</TableHead>
                      <TableHead className="text-xs text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calls.slice(0, 3).map(call => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium text-xs">{call.city}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">{call.date}</TableCell>
                        <TableCell className="text-xs">{call.duration} мин</TableCell>
                        <TableCell className="text-right font-semibold text-xs">{call.cost.toFixed(2)} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">История звонков</CardTitle>
                <CardDescription className="text-xs">Все ваши телефонные переговоры</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Город</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Дата и время</TableHead>
                      <TableHead className="text-xs">Длительность</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Период</TableHead>
                      <TableHead className="text-xs text-right">Стоимость</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calls.map(call => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium text-xs">{call.city}</TableCell>
                        <TableCell className="text-xs text-muted-foreground hidden md:table-cell">{call.date}</TableCell>
                        <TableCell className="text-xs">{call.duration} мин</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={call.timeOfDay === 'day' ? 'default' : 'secondary'} className="text-xs px-1.5 py-0">
                            {call.timeOfDay === 'day' ? 'День' : 'Ночь'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold text-xs">{call.cost.toFixed(2)} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tariff">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2 border-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Текущий тариф</CardTitle>
                    <Badge className="bg-primary">Активен</Badge>
                  </div>
                  <CardDescription>Ваш тарифный план</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Дневной тариф</span>
                      <span className="font-semibold">12 ₽/мин</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-muted-foreground">Ночной тариф</span>
                      <span className="font-semibold">8 ₽/мин</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-muted-foreground">Абонентская плата</span>
                      <span className="font-semibold">0 ₽/мес</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Скидки</CardTitle>
                  <CardDescription>Действующие скидки на звонки</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      <span className="text-sm font-medium">От 10 минут</span>
                    </div>
                    <Badge variant="outline" className="bg-white">-5%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      <span className="text-sm font-medium">От 30 минут</span>
                    </div>
                    <Badge variant="outline" className="bg-white">-10%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Icon name="Check" size={16} className="text-green-600" />
                      <span className="text-sm font-medium">От 60 минут</span>
                    </div>
                    <Badge variant="outline" className="bg-white">-15%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default UserDashboard;
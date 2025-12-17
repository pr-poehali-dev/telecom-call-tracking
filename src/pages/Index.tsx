import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Subscriber {
  id: string;
  name: string;
  inn: string;
  account: string;
  phone: string;
  contact: string;
}

interface Call {
  id: string;
  subscriberId: string;
  city: string;
  date: string;
  duration: number;
  timeOfDay: 'day' | 'night';
  cost: number;
}

interface Tariff {
  city: string;
  dayRate: number;
  nightRate: number;
  discounts: { from: number; discount: number }[];
}

const Index = () => {
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subscribers');

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: 'Выход выполнен',
      description: 'Вы успешно вышли из системы',
    });
  };

  const goToUserView = () => {
    navigate('/');
  };

  const [subscribers, setSubscribers] = useState<Subscriber[]>([
    {
      id: '1',
      name: 'ООО "Техносервис"',
      inn: '7701234567',
      account: '40702810400000012345',
      phone: '+7 (495) 123-45-67',
      contact: 'Иванов И.И.',
    },
    {
      id: '2',
      name: 'ИП Петров П.П.',
      inn: '773456789012',
      account: '40802810700000067890',
      phone: '+7 (812) 987-65-43',
      contact: 'Петров П.П.',
    },
  ]);

  const [calls, setCalls] = useState<Call[]>([
    {
      id: '1',
      subscriberId: '1',
      city: 'Санкт-Петербург',
      date: '2024-12-15 14:30',
      duration: 15,
      timeOfDay: 'day',
      cost: 225,
    },
    {
      id: '2',
      subscriberId: '1',
      city: 'Екатеринбург',
      date: '2024-12-15 22:15',
      duration: 45,
      timeOfDay: 'night',
      cost: 472.5,
    },
    {
      id: '3',
      subscriberId: '2',
      city: 'Москва',
      date: '2024-12-16 10:00',
      duration: 8,
      timeOfDay: 'day',
      cost: 80,
    },
  ]);

  const [tariffs, setTariffs] = useState<Tariff[]>([
    {
      city: 'Москва',
      dayRate: 12,
      nightRate: 8,
      discounts: [
        { from: 10, discount: 5 },
        { from: 30, discount: 10 },
        { from: 60, discount: 15 },
      ],
    },
    {
      city: 'Санкт-Петербург',
      dayRate: 15,
      nightRate: 10,
      discounts: [
        { from: 10, discount: 5 },
        { from: 30, discount: 12 },
        { from: 60, discount: 18 },
      ],
    },
    {
      city: 'Екатеринбург',
      dayRate: 18,
      nightRate: 12,
      discounts: [
        { from: 10, discount: 8 },
        { from: 30, discount: 15 },
        { from: 60, discount: 20 },
      ],
    },
  ]);

  const [newSubscriber, setNewSubscriber] = useState({
    name: '',
    inn: '',
    account: '',
    phone: '',
    contact: '',
  });

  const calculateCost = (duration: number, city: string, timeOfDay: 'day' | 'night') => {
    const tariff = tariffs.find(t => t.city === city);
    if (!tariff) return 0;

    const baseRate = timeOfDay === 'day' ? tariff.dayRate : tariff.nightRate;
    let discount = 0;

    for (const d of tariff.discounts.sort((a, b) => b.from - a.from)) {
      if (duration >= d.from) {
        discount = d.discount;
        break;
      }
    }

    const cost = duration * baseRate * (1 - discount / 100);
    return Math.round(cost * 100) / 100;
  };

  const addSubscriber = () => {
    if (!newSubscriber.name || !newSubscriber.inn) {
      toast({
        title: 'Ошибка',
        description: 'Заполните обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    const subscriber: Subscriber = {
      id: Date.now().toString(),
      ...newSubscriber,
    };

    setSubscribers([...subscribers, subscriber]);
    setNewSubscriber({ name: '', inn: '', account: '', phone: '', contact: '' });
    toast({
      title: 'Успешно',
      description: 'Абонент добавлен',
    });
  };

  const getSubscriberName = (id: string) => {
    return subscribers.find(s => s.id === id)?.name || 'Неизвестно';
  };

  const totalCalls = calls.length;
  const totalCost = calls.reduce((sum, call) => sum + call.cost, 0);
  const avgDuration = calls.length > 0 ? calls.reduce((sum, call) => sum + call.duration, 0) / calls.length : 0;

  const callsByCity = calls.reduce((acc, call) => {
    acc[call.city] = (acc[call.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(callsByCity)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={24} className="text-primary" />
              <h1 className="text-xl font-bold">Учет переговоров</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={goToUserView} className="gap-1.5">
                <Icon name="User" size={14} />
                <span className="hidden sm:inline">Мой кабинет</span>
              </Button>
              <div className="text-right hidden md:block">
                <div className="text-xs text-muted-foreground">Администратор</div>
                <div className="text-sm font-medium">{user?.full_name}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
                <Icon name="LogOut" size={14} />
                <span className="hidden sm:inline">Выход</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4">
        <Card className="mb-4">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{totalCalls}</div>
                <div className="text-xs text-muted-foreground">Звонков</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{totalCost.toFixed(0)} ₽</div>
                <div className="text-xs text-muted-foreground">Стоимость</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{avgDuration.toFixed(0)} мин</div>
                <div className="text-xs text-muted-foreground">Средняя длит.</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">{subscribers.length}</div>
                <div className="text-xs text-muted-foreground">Абонентов</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 h-10">
            <TabsTrigger value="subscribers" className="gap-1.5 text-xs">
              <Icon name="Users" size={14} />
              <span className="hidden sm:inline">Абоненты</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="gap-1.5 text-xs">
              <Icon name="PhoneCall" size={14} />
              <span className="hidden sm:inline">Звонки</span>
            </TabsTrigger>
            <TabsTrigger value="tariffs" className="gap-1.5 text-xs">
              <Icon name="DollarSign" size={14} />
              <span className="hidden sm:inline">Тарифы</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-xs">
              <Icon name="BarChart3" size={14} />
              <span className="hidden sm:inline">Аналитика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Абоненты</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1.5 h-8">
                        <Icon name="Plus" size={14} />
                        <span className="hidden sm:inline">Добавить</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый абонент</DialogTitle>
                        <DialogDescription>Добавьте данные юридического лица</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="name" className="text-xs">Название организации *</Label>
                          <Input
                            id="name"
                            value={newSubscriber.name}
                            onChange={e => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                            placeholder="ООО «Компания»"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inn" className="text-xs">ИНН *</Label>
                          <Input
                            id="inn"
                            value={newSubscriber.inn}
                            onChange={e => setNewSubscriber({ ...newSubscriber, inn: e.target.value })}
                            placeholder="1234567890"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account" className="text-xs">Расчетный счет</Label>
                          <Input
                            id="account"
                            value={newSubscriber.account}
                            onChange={e => setNewSubscriber({ ...newSubscriber, account: e.target.value })}
                            placeholder="40702810400000012345"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-xs">Телефон</Label>
                          <Input
                            id="phone"
                            value={newSubscriber.phone}
                            onChange={e => setNewSubscriber({ ...newSubscriber, phone: e.target.value })}
                            placeholder="+7 (___) ___-__-__"
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact" className="text-xs">Контактное лицо</Label>
                          <Input
                            id="contact"
                            value={newSubscriber.contact}
                            onChange={e => setNewSubscriber({ ...newSubscriber, contact: e.target.value })}
                            placeholder="Иванов И.И."
                            className="h-9"
                          />
                        </div>
                        <Button onClick={addSubscriber} className="w-full h-9">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Название</TableHead>
                      <TableHead className="text-xs">ИНН</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Р/счет</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Телефон</TableHead>
                      <TableHead className="text-xs hidden lg:table-cell">Контакт</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map(subscriber => (
                      <TableRow key={subscriber.id}>
                        <TableCell className="font-medium text-xs">{subscriber.name}</TableCell>
                        <TableCell className="text-xs">{subscriber.inn}</TableCell>
                        <TableCell className="font-mono text-xs hidden md:table-cell">{subscriber.account}</TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{subscriber.phone}</TableCell>
                        <TableCell className="text-xs hidden lg:table-cell">{subscriber.contact}</TableCell>
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
                <CardTitle className="text-base">Реестр звонков</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Абонент</TableHead>
                      <TableHead className="text-xs">Город</TableHead>
                      <TableHead className="text-xs hidden md:table-cell">Дата</TableHead>
                      <TableHead className="text-xs">Длит.</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Период</TableHead>
                      <TableHead className="text-xs text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calls.map(call => (
                      <TableRow key={call.id}>
                        <TableCell className="font-medium text-xs">{getSubscriberName(call.subscriberId)}</TableCell>
                        <TableCell className="text-xs">{call.city}</TableCell>
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

          <TabsContent value="tariffs">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Тарифы и скидки</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tariffs.map(tariff => (
                  <div key={tariff.city} className="border rounded-lg p-3 space-y-2">
                    <h3 className="font-semibold text-sm">{tariff.city}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Дневной</div>
                        <div className="text-base font-bold text-primary">{tariff.dayRate} ₽/мин</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Ночной</div>
                        <div className="text-base font-bold text-primary">{tariff.nightRate} ₽/мин</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1.5">Скидки</div>
                      <div className="flex flex-wrap gap-1">
                        {tariff.discounts.map((discount, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0">
                            {discount.from}+ мин: {discount.discount}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Топ городов</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {topCities.map(([city, count], idx) => (
                      <div key={city} className="flex items-center justify-between py-1">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {idx + 1}
                          </div>
                          <span className="text-xs font-medium">{city}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Распределение по времени</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Дневные звонки</span>
                        <span className="text-xs font-medium">
                          {calls.filter(c => c.timeOfDay === 'day').length} ({((calls.filter(c => c.timeOfDay === 'day').length / calls.length) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(calls.filter(c => c.timeOfDay === 'day').length / calls.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-muted-foreground">Ночные звонки</span>
                        <span className="text-xs font-medium">
                          {calls.filter(c => c.timeOfDay === 'night').length} ({((calls.filter(c => c.timeOfDay === 'night').length / calls.length) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-muted-foreground rounded-full transition-all"
                          style={{ width: `${(calls.filter(c => c.timeOfDay === 'night').length / calls.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Расходы по абонентам</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Абонент</TableHead>
                      <TableHead className="text-xs">Звонков</TableHead>
                      <TableHead className="text-xs hidden sm:table-cell">Длительность</TableHead>
                      <TableHead className="text-xs text-right">Сумма</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map(subscriber => {
                      const subscriberCalls = calls.filter(c => c.subscriberId === subscriber.id);
                      const totalDuration = subscriberCalls.reduce((sum, c) => sum + c.duration, 0);
                      const totalCost = subscriberCalls.reduce((sum, c) => sum + c.cost, 0);

                      return (
                        <TableRow key={subscriber.id}>
                          <TableCell className="font-medium text-xs">{subscriber.name}</TableCell>
                          <TableCell className="text-xs">{subscriberCalls.length}</TableCell>
                          <TableCell className="text-xs hidden sm:table-cell">{totalDuration} мин</TableCell>
                          <TableCell className="text-right font-bold text-primary text-xs">{totalCost.toFixed(2)} ₽</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
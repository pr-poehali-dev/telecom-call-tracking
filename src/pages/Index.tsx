import { useState } from 'react';
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
  const [activeTab, setActiveTab] = useState('subscribers');

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
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Icon name="Phone" size={28} className="text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Учет телефонных переговоров</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Всего звонков</CardDescription>
              <CardTitle className="text-3xl text-primary">{totalCalls}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Общая стоимость</CardDescription>
              <CardTitle className="text-3xl text-primary">{totalCost.toFixed(2)} ₽</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Средняя длительность</CardDescription>
              <CardTitle className="text-3xl text-primary">{avgDuration.toFixed(1)} мин</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardDescription>Абонентов</CardDescription>
              <CardTitle className="text-3xl text-primary">{subscribers.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              <span>Абоненты</span>
            </TabsTrigger>
            <TabsTrigger value="calls" className="flex items-center gap-2">
              <Icon name="PhoneCall" size={18} />
              <span>Звонки</span>
            </TabsTrigger>
            <TabsTrigger value="tariffs" className="flex items-center gap-2">
              <Icon name="DollarSign" size={18} />
              <span>Тарифы</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Icon name="BarChart3" size={18} />
              <span>Аналитика</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscribers" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Абоненты</CardTitle>
                    <CardDescription>Управление данными юридических лиц</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Icon name="Plus" size={18} />
                        Добавить абонента
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Новый абонент</DialogTitle>
                        <DialogDescription>Добавьте данные юридического лица</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Название организации *</Label>
                          <Input
                            id="name"
                            value={newSubscriber.name}
                            onChange={e => setNewSubscriber({ ...newSubscriber, name: e.target.value })}
                            placeholder="ООО «Компания»"
                          />
                        </div>
                        <div>
                          <Label htmlFor="inn">ИНН *</Label>
                          <Input
                            id="inn"
                            value={newSubscriber.inn}
                            onChange={e => setNewSubscriber({ ...newSubscriber, inn: e.target.value })}
                            placeholder="1234567890"
                          />
                        </div>
                        <div>
                          <Label htmlFor="account">Расчетный счет</Label>
                          <Input
                            id="account"
                            value={newSubscriber.account}
                            onChange={e => setNewSubscriber({ ...newSubscriber, account: e.target.value })}
                            placeholder="40702810400000012345"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Телефон</Label>
                          <Input
                            id="phone"
                            value={newSubscriber.phone}
                            onChange={e => setNewSubscriber({ ...newSubscriber, phone: e.target.value })}
                            placeholder="+7 (___) ___-__-__"
                          />
                        </div>
                        <div>
                          <Label htmlFor="contact">Контактное лицо</Label>
                          <Input
                            id="contact"
                            value={newSubscriber.contact}
                            onChange={e => setNewSubscriber({ ...newSubscriber, contact: e.target.value })}
                            placeholder="Иванов И.И."
                          />
                        </div>
                        <Button onClick={addSubscriber} className="w-full">
                          Добавить
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Название</TableHead>
                      <TableHead>ИНН</TableHead>
                      <TableHead>Расчетный счет</TableHead>
                      <TableHead>Телефон</TableHead>
                      <TableHead>Контактное лицо</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map(subscriber => (
                      <TableRow key={subscriber.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{subscriber.name}</TableCell>
                        <TableCell>{subscriber.inn}</TableCell>
                        <TableCell className="font-mono text-sm">{subscriber.account}</TableCell>
                        <TableCell>{subscriber.phone}</TableCell>
                        <TableCell>{subscriber.contact}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Реестр звонков</CardTitle>
                <CardDescription>История всех телефонных переговоров</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Абонент</TableHead>
                      <TableHead>Город</TableHead>
                      <TableHead>Дата и время</TableHead>
                      <TableHead>Длительность</TableHead>
                      <TableHead>Время суток</TableHead>
                      <TableHead className="text-right">Стоимость</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calls.map(call => (
                      <TableRow key={call.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{getSubscriberName(call.subscriberId)}</TableCell>
                        <TableCell>{call.city}</TableCell>
                        <TableCell className="text-sm">{call.date}</TableCell>
                        <TableCell>{call.duration} мин</TableCell>
                        <TableCell>
                          <Badge variant={call.timeOfDay === 'day' ? 'default' : 'secondary'}>
                            {call.timeOfDay === 'day' ? 'День' : 'Ночь'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{call.cost.toFixed(2)} ₽</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tariffs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Тарифы и скидки</CardTitle>
                <CardDescription>Стоимость минуты и система скидок по городам</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {tariffs.map(tariff => (
                  <div key={tariff.city} className="border border-gray-200 rounded-lg p-4 space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900">{tariff.city}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Дневной тариф:</span>
                        <p className="text-xl font-bold text-primary">{tariff.dayRate} ₽/мин</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Ночной тариф:</span>
                        <p className="text-xl font-bold text-primary">{tariff.nightRate} ₽/мин</p>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 block mb-2">Скидки по длительности:</span>
                      <div className="flex flex-wrap gap-2">
                        {tariff.discounts.map((discount, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            от {discount.from} мин → {discount.discount}%
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Топ городов</CardTitle>
                  <CardDescription>По количеству звонков</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topCities.map(([city, count], idx) => (
                      <div key={city} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {idx + 1}
                          </div>
                          <span className="font-medium">{city}</span>
                        </div>
                        <Badge variant="secondary">{count} звонков</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Распределение по времени</CardTitle>
                  <CardDescription>День vs Ночь</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Дневные звонки</span>
                        <span className="text-sm font-medium">
                          {calls.filter(c => c.timeOfDay === 'day').length} ({((calls.filter(c => c.timeOfDay === 'day').length / calls.length) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(calls.filter(c => c.timeOfDay === 'day').length / calls.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">Ночные звонки</span>
                        <span className="text-sm font-medium">
                          {calls.filter(c => c.timeOfDay === 'night').length} ({((calls.filter(c => c.timeOfDay === 'night').length / calls.length) * 100).toFixed(0)}%)
                        </span>
                      </div>
                      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-400 rounded-full transition-all"
                          style={{ width: `${(calls.filter(c => c.timeOfDay === 'night').length / calls.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Расходы по абонентам</CardTitle>
                <CardDescription>Общая стоимость звонков за период</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Абонент</TableHead>
                      <TableHead>Количество звонков</TableHead>
                      <TableHead>Общая длительность</TableHead>
                      <TableHead className="text-right">Сумма к оплате</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscribers.map(subscriber => {
                      const subscriberCalls = calls.filter(c => c.subscriberId === subscriber.id);
                      const totalDuration = subscriberCalls.reduce((sum, c) => sum + c.duration, 0);
                      const totalCost = subscriberCalls.reduce((sum, c) => sum + c.cost, 0);

                      return (
                        <TableRow key={subscriber.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">{subscriber.name}</TableCell>
                          <TableCell>{subscriberCalls.length}</TableCell>
                          <TableCell>{totalDuration} мин</TableCell>
                          <TableCell className="text-right font-bold text-primary">{totalCost.toFixed(2)} ₽</TableCell>
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

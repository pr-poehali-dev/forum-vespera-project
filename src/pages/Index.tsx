import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  telegramId: string;
  username: string;
  avatar: string;
  role: 'OWNER' | 'ADMIN' | 'MODERATOR' | 'USER';
  rating: number;
}

interface Post {
  id: string;
  author: User;
  title: string;
  content: string;
  category: string;
  timestamp: Date;
  likes: number;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Новости');

  const categories = [
    { name: 'Новости', icon: 'Newspaper', locked: true },
    { name: 'Общение', icon: 'MessageSquare' },
    { name: 'Реклама', icon: 'Megaphone' },
  ];

  const mockPosts: Post[] = [
    {
      id: '1',
      author: {
        id: 'usr_001',
        telegramId: '123456789',
        username: 'Администратор',
        avatar: '',
        role: 'OWNER',
        rating: 1250,
      },
      title: 'Добро пожаловать на Forum Vespera',
      content: 'Рады приветствовать вас на нашем форуме! Здесь вы можете обсуждать интересные темы, делиться мнениями и находить единомышленников.',
      category: 'Новости',
      timestamp: new Date('2024-11-13T10:00:00'),
      likes: 42,
    },
    {
      id: '2',
      author: {
        id: 'usr_002',
        telegramId: '987654321',
        username: 'Модератор Алексей',
        avatar: '',
        role: 'MODERATOR',
        rating: 850,
      },
      title: 'Правила форума',
      content: 'Просим всех участников ознакомиться с правилами форума. Будьте вежливы, не спамьте и соблюдайте тематику веток.',
      category: 'Новости',
      timestamp: new Date('2024-11-13T09:30:00'),
      likes: 28,
    },
  ];

  const handleTelegramAuth = () => {
    console.log('Telegram auth clicked');
    const mockUser: User = {
      id: 'usr_123',
      telegramId: '555444333',
      username: 'Новый участник',
      avatar: '',
      role: 'USER',
      rating: 0,
    };
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    console.log('Auth completed, user:', mockUser);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-gradient-to-r from-purple-600 to-pink-600';
      case 'ADMIN':
        return 'bg-gradient-to-r from-red-500 to-orange-500';
      case 'MODERATOR':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen">
      <Dialog open={showAuthModal && !isAuthenticated} onOpenChange={setShowAuthModal}>
        <DialogContent className="glass border-2 border-white/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold neon-text text-center">
              Forum Vespera
            </DialogTitle>
            <DialogDescription className="text-center text-gray-300 mt-4">
              Для доступа к форуму необходимо авторизоваться через Telegram
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="w-24 h-24 rounded-full glass flex items-center justify-center neon-glow">
              <Icon name="MessageCircle" size={48} className="text-primary" />
            </div>
            <Button
              onClick={handleTelegramAuth}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white font-semibold py-6 text-lg neon-glow"
            >
              <Icon name="Send" className="mr-2" />
              Войти через Telegram
            </Button>
            <p className="text-xs text-gray-400 text-center">
              Мы не храним ваши личные данные, только Telegram ID
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {isAuthenticated && currentUser && (
        <div className="flex h-screen">
          <aside className="w-64 glass border-r border-white/10 p-4 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold neon-text mb-2">Forum Vespera</h2>
              <p className="text-xs text-gray-400">Форум нового поколения</p>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 mb-3 px-2">ВЕТКИ ФОРУМА</p>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      selectedCategory === category.name
                        ? 'glass-hover neon-glow text-white'
                        : 'hover:glass text-gray-300'
                    }`}
                  >
                    <Icon name={category.icon} size={20} />
                    <span className="font-medium">{category.name}</span>
                    {category.locked && (
                      <Icon name="Lock" size={14} className="ml-auto text-gray-500" />
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </aside>

          <main className="flex-1 flex flex-col">
            <header className="glass border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="Hash" className="text-primary" />
                <h1 className="text-xl font-semibold">{selectedCategory}</h1>
              </div>

              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-3 glass-hover px-3 py-2 rounded-lg">
                      <Avatar className="w-8 h-8 ring-2 ring-primary">
                        <AvatarImage src={currentUser.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                          {currentUser.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{currentUser.username}</span>
                      <Icon name="ChevronDown" size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="glass border border-white/20 w-56" align="end">
                    <div className="px-2 py-2 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{currentUser.username}</span>
                        {currentUser.role !== 'USER' && (
                          <Badge className={`${getRoleBadgeColor(currentUser.role)} text-white text-[10px] px-1.5 py-0`}>
                            {currentUser.role}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Icon name="Star" size={12} className="text-primary" />
                        <span>{currentUser.rating} рейтинг</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="hover:glass-hover cursor-pointer">
                      <Icon name="User" className="mr-2" size={16} />
                      Мой профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:glass-hover cursor-pointer">
                      <Icon name="PenSquare" className="mr-2" size={16} />
                      Создать пост
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:glass-hover cursor-pointer">
                      <Icon name="Settings" className="mr-2" size={16} />
                      Настройки
                    </DropdownMenuItem>
                    {(currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem className="hover:glass-hover cursor-pointer text-primary">
                          <Icon name="Shield" className="mr-2" size={16} />
                          Админ-панель
                    </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="hover:glass-hover cursor-pointer text-red-400">
                      <Icon name="LogOut" className="mr-2" size={16} />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            <ScrollArea className="flex-1 p-6">
              <div className="max-w-4xl mx-auto space-y-4">
                {mockPosts.map((post) => (
                  <article key={post.id} className="glass-hover rounded-xl p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 ring-2 ring-primary">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                            {post.author.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{post.author.username}</span>
                            {post.author.role !== 'USER' && (
                              <Badge className={`${getRoleBadgeColor(post.author.role)} text-white text-xs px-2`}>
                                {post.author.role}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">
                            {post.timestamp.toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="hover:glass">
                            <Icon name="MoreVertical" size={18} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass border border-white/20">
                          <DropdownMenuItem className="hover:glass-hover cursor-pointer">
                            <Icon name="Flag" className="mr-2" size={16} />
                            Пожаловаться
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                      <p className="text-gray-300 leading-relaxed">{post.content}</p>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <Button variant="ghost" size="sm" className="hover:glass gap-2">
                        <Icon name="ThumbsUp" size={18} />
                        <span>{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:glass gap-2">
                        <Icon name="MessageSquare" size={18} />
                        <span>Ответить</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:glass gap-2">
                        <Icon name="Share2" size={18} />
                      </Button>
                    </div>
                  </article>
                ))}
              </div>
            </ScrollArea>
          </main>
        </div>
      )}
    </div>
  );
};

export default Index;
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  telegramId: string;
  username: string;
  avatar: string;
  bio?: string;
  banner?: string;
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
  videoUrl?: string;
  thumbnail?: string;
  views?: number;
}

interface Message {
  id: string;
  author: User;
  content: string;
  timestamp: Date;
}

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Новости');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedPostCategory, setSelectedPostCategory] = useState('');
  const [chatMessage, setChatMessage] = useState('');

  const categories = [
    { name: 'Новости', icon: 'Newspaper', locked: true, allowPosts: true },
    { name: 'Видео', icon: 'Play', locked: false, allowPosts: true },
    { name: 'Общение', icon: 'MessageSquare', locked: false, allowPosts: false },
    { name: 'Реклама', icon: 'Megaphone', locked: false, allowPosts: true },
  ];

  const mockPosts: Post[] = [
    {
      id: '1',
      author: {
        id: 'usr_001',
        telegramId: '123456789',
        username: 'Администратор',
        avatar: '',
        bio: 'Создатель и владелец форума',
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

  const mockVideos: Post[] = [
    {
      id: 'v1',
      author: {
        id: 'usr_003',
        telegramId: '111222333',
        username: 'Видеоблогер',
        avatar: '',
        role: 'USER',
        rating: 520,
      },
      title: 'Обзор новых функций форума',
      content: '',
      category: 'Видео',
      timestamp: new Date('2024-11-12T15:00:00'),
      likes: 156,
      views: 2340,
      thumbnail: '',
      videoUrl: '',
    },
    {
      id: 'v2',
      author: {
        id: 'usr_004',
        telegramId: '444555666',
        username: 'Контент Мейкер',
        avatar: '',
        role: 'USER',
        rating: 380,
      },
      title: 'Как создать пост на форуме',
      content: '',
      category: 'Видео',
      timestamp: new Date('2024-11-11T12:00:00'),
      likes: 89,
      views: 1245,
      thumbnail: '',
      videoUrl: '',
    },
  ];

  const mockChatMessages: Message[] = [
    {
      id: 'msg1',
      author: mockPosts[0].author,
      content: 'Всем привет! Как дела?',
      timestamp: new Date('2024-11-13T11:00:00'),
    },
    {
      id: 'msg2',
      author: mockPosts[1].author,
      content: 'Отлично! Форум работает супер!',
      timestamp: new Date('2024-11-13T11:01:00'),
    },
  ];

  const handleTelegramAuth = () => {
    const mockUser: User = {
      id: 'usr_123',
      telegramId: '555444333',
      username: 'Новый участник',
      avatar: '',
      bio: 'Приветствую! Рад быть здесь.',
      role: 'USER',
      rating: 0,
    };
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
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

  const handleOpenProfile = (user: User) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const handleSelectCategoryForPost = (categoryName: string) => {
    setSelectedPostCategory(categoryName);
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      console.log('Sending message:', chatMessage);
      setChatMessage('');
    }
  };

  const renderContent = () => {
    if (selectedCategory === 'Общение') {
      return (
        <div className="flex flex-col h-full">
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {mockChatMessages.map((message) => (
                <div key={message.id} className="flex items-start gap-3">
                  <Avatar 
                    className="w-10 h-10 ring-2 ring-primary cursor-pointer"
                    onClick={() => handleOpenProfile(message.author)}
                  >
                    <AvatarImage src={message.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {message.author.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span 
                        className="font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleOpenProfile(message.author)}
                      >
                        {message.author.username}
                      </span>
                      {message.author.role !== 'USER' && (
                        <Badge className={`${getRoleBadgeColor(message.author.role)} text-white text-[10px] px-1.5 py-0`}>
                          {message.author.role}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="glass rounded-lg px-4 py-2">
                      <p className="text-gray-200">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="glass border-t border-white/10 p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Написать сообщение..."
                className="glass border-white/10 flex-1"
              />
              <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary/90">
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (selectedCategory === 'Видео') {
      return (
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.map((video) => (
                <div key={video.id} className="glass-hover rounded-xl overflow-hidden cursor-pointer">
                  <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <Icon name="Play" size={48} className="text-white/50" />
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-0.5 rounded text-xs">
                      {video.views?.toLocaleString()} просмотров
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex gap-2 mb-2">
                      <Avatar 
                        className="w-9 h-9 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenProfile(video.author);
                        }}
                      >
                        <AvatarImage src={video.author.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">
                          {video.author.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{video.title}</h3>
                        <p 
                          className="text-xs text-gray-400 cursor-pointer hover:text-primary transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenProfile(video.author);
                          }}
                        >
                          {video.author.username}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <span>{video.likes} лайков</span>
                          <span>•</span>
                          <span>{video.timestamp.toLocaleDateString('ru-RU')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      );
    }

    return (
      <ScrollArea className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {mockPosts.filter(p => p.category === selectedCategory).map((post) => (
            <article key={post.id} className="glass-hover rounded-xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar 
                    className="w-12 h-12 ring-2 ring-primary cursor-pointer"
                    onClick={() => handleOpenProfile(post.author)}
                  >
                    <AvatarImage src={post.author.avatar} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white">
                      {post.author.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span 
                        className="font-semibold cursor-pointer hover:text-primary transition-colors"
                        onClick={() => handleOpenProfile(post.author)}
                      >
                        {post.author.username}
                      </span>
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
    );
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
              <h2 className="text-lg font-semibold text-gray-300">Vespera</h2>
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
                    <DropdownMenuItem 
                      className="hover:glass-hover cursor-pointer"
                      onClick={() => handleOpenProfile(currentUser)}
                    >
                      <Icon name="User" className="mr-2" size={16} />
                      Мой профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:glass-hover cursor-pointer"
                      onClick={() => setShowCreatePostModal(true)}
                    >
                      <Icon name="PenSquare" className="mr-2" size={16} />
                      Создать пост
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:glass-hover cursor-pointer"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <Icon name="Settings" className="mr-2" size={16} />
                      Настройки
                    </DropdownMenuItem>
                    {(currentUser.role === 'OWNER' || currentUser.role === 'ADMIN') && (
                      <>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          className="hover:glass-hover cursor-pointer text-primary"
                          onClick={() => setShowAdminModal(true)}
                        >
                          <Icon name="Shield" className="mr-2" size={16} />
                          Админ-панель
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem 
                      className="hover:glass-hover cursor-pointer text-red-400"
                      onClick={() => {
                        setIsAuthenticated(false);
                        setCurrentUser(null);
                        setShowAuthModal(true);
                      }}
                    >
                      <Icon name="LogOut" className="mr-2" size={16} />
                      Выйти
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>

            {renderContent()}
          </main>
        </div>
      )}

      <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
        <DialogContent className="glass border-2 border-white/20 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="relative">
            {(selectedUser?.banner || showProfileModal) && (
              <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-lg -mx-6 -mt-6 mb-4 flex items-center justify-center">
                {!selectedUser?.banner && <Icon name="Image" size={32} className="text-white/30" />}
              </div>
            )}
            <div className="flex items-start gap-4 -mt-16 relative z-10 ml-6">
              <Avatar className="w-24 h-24 ring-4 ring-background">
                <AvatarImage src={selectedUser?.avatar || currentUser?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl">
                  {(selectedUser?.username || currentUser?.username || '').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
          <div className="space-y-4 mt-2">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold">{selectedUser?.username || currentUser?.username}</h3>
                {(selectedUser?.role || currentUser?.role) !== 'USER' && (
                  <Badge className={`${getRoleBadgeColor(selectedUser?.role || currentUser?.role || 'USER')} text-white`}>
                    {selectedUser?.role || currentUser?.role}
                  </Badge>
                )}
              </div>
              {(selectedUser?.bio || currentUser?.bio) && (
                <p className="text-gray-400 text-sm mb-3">{selectedUser?.bio || currentUser?.bio}</p>
              )}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Star" size={16} className="text-primary" />
                  <span className="text-gray-300">{selectedUser?.rating || currentUser?.rating} рейтинг</span>
                </div>
                <div className="text-gray-500">ID: {selectedUser?.id || currentUser?.id}</div>
              </div>
            </div>
            {selectedUser?.id === currentUser?.id && (
              <div className="space-y-2 pt-4 border-t border-white/10">
                <Button className="w-full glass-hover border border-white/10 justify-start">
                  <Icon name="Upload" className="mr-2" size={18} />
                  Изменить аватар
                </Button>
                <Button className="w-full glass-hover border border-white/10 justify-start">
                  <Icon name="Image" className="mr-2" size={18} />
                  Изменить баннер
                </Button>
                <Button className="w-full glass-hover border border-white/10 justify-start">
                  <Icon name="Edit" className="mr-2" size={18} />
                  Редактировать био
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <DialogContent className="glass border-2 border-white/20 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Настройки</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Оформление</h4>
              <Button className="w-full glass-hover border border-white/10 justify-start">
                <Icon name="Palette" className="mr-2" size={18} />
                Изменить тему
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Уведомления</h4>
              <Button className="w-full glass-hover border border-white/10 justify-start">
                <Icon name="Bell" className="mr-2" size={18} />
                Настроить уведомления
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreatePostModal} onOpenChange={setShowCreatePostModal}>
        <DialogContent className="glass border-2 border-white/20 sm:max-w-lg">
          {!selectedPostCategory ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Создать пост</DialogTitle>
                <DialogDescription className="text-gray-300">
                  Выберите ветку для размещения поста
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-4">
                {categories.filter(c => c.allowPosts).map((category) => (
                  <Button
                    key={category.name}
                    disabled={category.locked && currentUser?.role === 'USER'}
                    onClick={() => handleSelectCategoryForPost(category.name)}
                    className="w-full glass-hover border border-white/10 justify-start h-auto py-4"
                  >
                    <Icon name={category.icon} className="mr-3" size={20} />
                    <div className="text-left">
                      <div className="font-semibold">{category.name}</div>
                      {category.locked && (
                        <div className="text-xs text-gray-400">Только для администрации</div>
                      )}
                      {category.name === 'Видео' && (
                        <div className="text-xs text-gray-400">Загрузка видео</div>
                      )}
                    </div>
                    {category.locked && <Icon name="Lock" size={16} className="ml-auto text-gray-500" />}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {selectedPostCategory === 'Видео' ? 'Загрузить видео' : 'Новый пост'}
                </DialogTitle>
                <DialogDescription className="text-gray-300">
                  {selectedPostCategory}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {selectedPostCategory === 'Видео' ? (
                  <div className="space-y-4">
                    <div className="glass rounded-lg p-8 text-center border-2 border-dashed border-white/20 cursor-pointer hover:border-primary/50 transition-colors">
                      <Icon name="Upload" size={48} className="mx-auto mb-3 text-gray-400" />
                      <p className="text-sm text-gray-400">Нажмите для загрузки видео</p>
                      <p className="text-xs text-gray-500 mt-1">MP4, AVI, MOV до 500MB</p>
                    </div>
                    <Input
                      placeholder="Заголовок видео"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="glass border-white/10"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedPostCategory('')} variant="outline" className="flex-1 glass border-white/10">
                        Назад
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Input
                      placeholder="Заголовок"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="glass border-white/10"
                    />
                    <Textarea
                      placeholder="Содержание поста"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="glass border-white/10 min-h-[150px]"
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => setSelectedPostCategory('')} variant="outline" className="flex-1 glass border-white/10">
                        Назад
                      </Button>
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        Опубликовать
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="glass border-2 border-white/20 sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Icon name="Shield" className="text-primary" />
              Админ-панель
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            <Button className="glass-hover border border-white/10 h-20 flex-col">
              <Icon name="Search" size={24} className="mb-2" />
              Поиск пользователей
            </Button>
            <Button className="glass-hover border border-white/10 h-20 flex-col">
              <Icon name="UserPlus" size={24} className="mb-2" />
              Добавить админа
            </Button>
            <Button className="glass-hover border border-white/10 h-20 flex-col">
              <Icon name="Plus" size={24} className="mb-2" />
              Добавить ветку
            </Button>
            <Button className="glass-hover border border-white/10 h-20 flex-col">
              <Icon name="FileCheck" size={24} className="mb-2" />
              Модерация постов
            </Button>
            <Button className="glass-hover border border-white/10 h-20 flex-col col-span-2">
              <Icon name="Flag" size={24} className="mb-2" />
              Модерация жалоб
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

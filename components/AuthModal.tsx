'use client';

import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, LogIn, UserPlus, Upload, CheckCircle2, Cloud, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { loginWithEmail, registerWithEmail, loginWithGoogle, uploadFile as uploadFileToStorage, UserAdapter as User } from '@/lib/storageAdapter';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSuccessToast: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSuccessToast,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'upload'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Storage Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onSuccessToast('Успішний вхід за допомогою пошти та паролю!');
        onClose();
      } else if (mode === 'register') {
        if (!email || !password) {
          setErrorMsg('Будь ласка, введіть пошту та пароль');
          setIsLoading(false);
          return;
        }
        await registerWithEmail(email, password, displayName);
        onSuccessToast('Обліковий запис успішно створено!');
        onClose();
      }
    } catch (err: unknown) {
      console.error('Auth error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/invalid-credential') || msg.includes('auth/wrong-password')) {
        setErrorMsg('Невірний e-mail або пароль.');
      } else if (msg.includes('auth/email-already-in-use')) {
        setErrorMsg('Користувач з таким e-mail вже існує.');
      } else if (msg.includes('auth/weak-password')) {
        setErrorMsg('Пароль повинен містити принаймні 6 символів.');
      } else {
        setErrorMsg(`Помилка аутентифікації: ${msg}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      onSuccessToast('Вхід через Google успішний!');
      onClose();
    } catch (err: unknown) {
      setErrorMsg('Помилка входу через Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setIsUploading(true);
    setErrorMsg(null);

    try {
      const downloadUrl = await uploadFileToStorage(uploadFile, 'plant-photos');
      setUploadedUrl(downloadUrl);
      onSuccessToast('Файл успішно завантажено у хмарне сховище!');
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setErrorMsg('Не вдалося завантажити файл у хмарне сховище.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-start sm:justify-center items-stretch bg-black/95 backdrop-blur-md p-0 sm:p-2 overflow-y-auto">
      <div className="bg-[#18191c] rounded-none sm:rounded-[28px] w-screen sm:w-full max-w-none min-h-screen sm:min-h-[96vh] overflow-y-auto shadow-2xl border-0 sm:border border-neutral-800 text-white">
        
        {/* Header */}
        <div className="bg-[#22242a] text-white px-6 py-4 flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-[#fad277]" />
            <h3 className="font-black text-base tracking-tight">
              {currentUser ? 'Хмарний профіль' : 'Вхід та реєстрація'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2c2e35] hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        {/* Navigation Mode Tabs */}
        <div className="flex border-b border-neutral-800 bg-[#141518] px-6 pt-3 gap-2">
          {!currentUser && (
            <>
              <button
                onClick={() => { setMode('login'); setErrorMsg(null); }}
                className={`pb-2.5 px-3 text-xs font-black transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  mode === 'login'
                    ? 'border-[#d8f087] text-[#d8f087]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Вхід (Email/Pass)
              </button>

              <button
                onClick={() => { setMode('register'); setErrorMsg(null); }}
                className={`pb-2.5 px-3 text-xs font-black transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  mode === 'register'
                    ? 'border-[#d8f087] text-[#d8f087]'
                    : 'border-transparent text-neutral-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Реєстрація
              </button>
            </>
          )}

          <button
            onClick={() => { setMode('upload'); setErrorMsg(null); }}
            className={`pb-2.5 px-3 text-xs font-black transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
              mode === 'upload'
                ? 'border-[#d8f087] text-[#d8f087]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Хмарне сховище (Файли)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 bg-[#fa6e59]/20 border border-[#fa6e59]/40 text-[#fa6e59] rounded-2xl text-xs flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {currentUser && (
            <div className="p-3 bg-[#d8f087]/20 border border-[#d8f087]/40 rounded-2xl text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#d8f087]" />
                <div>
                  <p className="font-black text-[#d8f087]">Авторизовано в хмарі</p>
                  <p className="text-neutral-300 font-medium">{currentUser.email || currentUser.displayName}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login / Register Form */}
          {(mode === 'login' || mode === 'register') && !currentUser && (
            <form onSubmit={handleSubmitAuth} className="space-y-3">
              {mode === 'register' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Ваше Ім&apos;я / Нікнейм
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Наприклад: Гровер Мастер"
                      className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#24262c] text-white border border-neutral-700 rounded-2xl focus:outline-none focus:border-[#d8f087]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Електронна пошта (Email)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#24262c] text-white border border-neutral-700 rounded-2xl focus:outline-none focus:border-[#d8f087]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Пароль
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 text-xs bg-[#24262c] text-white border border-neutral-700 rounded-2xl focus:outline-none focus:border-[#d8f087]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#d8f087] hover:bg-[#cbe385] text-[#18181b] text-xs font-black py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-98"
              >
                {isLoading ? (
                  <span>Зачекайте...</span>
                ) : mode === 'login' ? (
                  <>
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    Увійти через Email
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    Зареєструватися
                  </>
                )}
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#18191c] px-3 text-neutral-400 font-bold">або</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full bg-[#24262c] hover:bg-[#2c2e35] text-white border border-neutral-700 text-xs font-black py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Увійти з Google
              </button>
            </form>
          )}

          {/* Cloud Storage Upload Section */}
          {mode === 'upload' && (
            <form onSubmit={handleFileUpload} className="space-y-3">
              <div className="p-3 bg-[#fad277]/15 border border-[#fad277]/30 rounded-2xl text-xs text-[#fad277]">
                <p className="font-black mb-1">Завантаження файлів у хмарне сховище</p>
                <p className="text-neutral-300">Файли зберігаються на захищеному локальному/хмарному сервері додатка.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Оберіть файл або зображення
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                  className="w-full text-xs text-neutral-300 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#d8f087] file:text-[#18181b] hover:file:bg-[#cbe385] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={!uploadFile || isUploading}
                className="w-full bg-[#d8f087] hover:bg-[#cbe385] disabled:bg-neutral-800 disabled:text-neutral-500 text-[#18181b] text-xs font-black py-3 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
              >
                {isUploading ? (
                  <span>Завантаження у хмару...</span>
                ) : (
                  <>
                    <Upload className="w-4 h-4 stroke-[2.5]" />
                    Завантажити у Хмару
                  </>
                )}
              </button>

              {uploadedUrl && (
                <div className="p-3 bg-[#d8f087]/15 border border-[#d8f087]/30 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[#d8f087] text-xs font-black">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Файл завантажено успішно!</span>
                  </div>
                  {uploadFile?.type.startsWith('image/') && (
                    <div className="w-full h-32 relative rounded-xl overflow-hidden border border-[#d8f087]/30">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={uploadedUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-[10px] break-all text-neutral-300 bg-[#24262c] p-2 rounded-xl border border-neutral-700 font-mono">
                    {uploadedUrl}
                  </div>
                </div>
              )}
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

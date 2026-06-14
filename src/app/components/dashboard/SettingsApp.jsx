'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

export default function SettingsApp() {
  const [googleLinked, setGoogleLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('system');
  const [iconSize, setIconSize] = useState('medium');
  const [fontSize, setFontSize] = useState('medium');
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load configuration on mount
  useEffect(() => {

    fetch('/api/user/settings')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Failed to load settings');
      })
      .then((data) => {
        setGoogleLinked(data.googleLinked);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Theme loading
    const savedTheme = localStorage.getItem('pref-theme') || 'system';
    setTheme(savedTheme);
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    let active = savedTheme;
    if (savedTheme === 'system') {
      active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(active);

    // Icon size loading
    const savedIconSize = localStorage.getItem('pref-icon-size') || 'medium';
    setIconSize(savedIconSize);

    // Font size loading
    const savedFontSize = localStorage.getItem('pref-font-size') || 'medium';
    setFontSize(savedFontSize);
  }, []);

  // Update theme helper
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('pref-theme', newTheme);
    const root = document.documentElement;
    root.classList.remove('dark', 'light');
    let active = newTheme;
    if (newTheme === 'system') {
      active = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    root.classList.add(active);
  };

  // Update Icon Size helper
  const handleIconSizeChange = (size) => {
    setIconSize(size);
    localStorage.setItem('pref-icon-size', size);
    const root = document.documentElement;
    if (size === 'small') {
      root.style.setProperty('--icon-size', '42px');
      root.style.setProperty('--icon-wrapper-width', '70px');
    } else if (size === 'large') {
      root.style.setProperty('--icon-size', '64px');
      root.style.setProperty('--icon-wrapper-width', '92px');
    } else {
      root.style.setProperty('--icon-size', '52px');
      root.style.setProperty('--icon-wrapper-width', '80px');
    }
  };

  // Update Font Size helper
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    localStorage.setItem('pref-font-size', size);
    const root = document.documentElement;
    if (size === 'small') {
      root.style.setProperty('--icon-font-size', '10px');
    } else if (size === 'large') {
      root.style.setProperty('--icon-font-size', '13px');
    } else {
      root.style.setProperty('--icon-font-size', '11px');
    }
  };

  const handleUnlink = async () => {
    const confirm = window.confirm(
      'DISCLAIMER: Unlinking your Google account means you will no longer be able to log in with one click via Google. If you do not have a password set, you will not be able to log in at all. Are you sure you want to proceed?'
    );
    if (!confirm) return;

    setActionLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlink-google' }),
      });
      const data = await res.json();
      if (res.ok) {
        setGoogleLinked(false);
        setMessage(data.message);
      } else {
        setErrorMsg(data.message || 'Failed to unlink account');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      'WARNING / DISCLAIMER: Deleting your account is permanent. All your data will be permanently removed. This cannot be undone. Are you sure you want to delete your account?'
    );
    if (!confirm) return;

    setActionLoading(true);
    setMessage(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete-account' }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Account deleted. Logging out...');
        setTimeout(() => {
          signOut({ callbackUrl: '/login' });
        }, 1500);
      } else {
        setErrorMsg(data.message || 'Failed to delete account');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-foreground/50 text-xs flex items-center justify-center h-full">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="p-6 overflow-y-auto h-full text-foreground max-w-lg mx-auto space-y-8 select-none scrollbar-none">

      {message && (
        <div className="p-3 text-xs bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg animate-fade-in">
          {message}
        </div>
      )}
      {errorMsg && (
        <div className="p-3 text-xs bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg animate-fade-in">
          {errorMsg}
        </div>
      )}


      <section className="flex items-center justify-between border-b border-foreground/5 pb-4">
        <div>
          <h2 className="text-sm font-semibold tracking-wide">System Settings</h2>
          <p className="text-[11px] text-foreground/40 mt-0.5">Customize your desktop workspace</p>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Log Out
        </button>
      </section>


      <section className="space-y-2">
        <label className="text-[11px] font-medium text-foreground/50 tracking-wider uppercase">Appearance Theme</label>
        <div className="grid grid-cols-3 gap-2 bg-surface-dim p-1.5 rounded-xl border border-foreground/5">
          {['light', 'dark', 'system'].map((t) => (
            <button
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`py-1.5 text-xs rounded-lg font-medium capitalize transition-all ${
                theme === t
                  ? 'bg-background shadow-sm border border-foreground/5 font-semibold text-foreground'
                  : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </section>


      <section className="grid grid-cols-2 gap-4">

        <div className="space-y-2">
          <label className="text-[11px] font-medium text-foreground/50 tracking-wider uppercase">App Icon Size</label>
          <div className="flex bg-surface-dim p-1 rounded-xl border border-foreground/5 justify-between">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => handleIconSizeChange(size)}
                className={`flex-1 py-1.5 text-[10px] rounded-lg font-medium capitalize transition-all ${
                  iconSize === size
                    ? 'bg-background shadow-sm border border-foreground/5 font-semibold text-foreground'
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>


        <div className="space-y-2">
          <label className="text-[11px] font-medium text-foreground/50 tracking-wider uppercase">App Font Size</label>
          <div className="flex bg-surface-dim p-1 rounded-xl border border-foreground/5 justify-between">
            {['small', 'medium', 'large'].map((size) => (
              <button
                key={size}
                onClick={() => handleFontSizeChange(size)}
                className={`flex-1 py-1.5 text-[10px] rounded-lg font-medium capitalize transition-all ${
                  fontSize === size
                    ? 'bg-background shadow-sm border border-foreground/5 font-semibold text-foreground'
                    : 'text-foreground/50 hover:text-foreground'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </section>


      <section className="space-y-4 border-t border-foreground/5 pt-6">
        <label className="text-[11px] font-medium text-foreground/50 tracking-wider uppercase block">Account Integration</label>
        

        <div className="flex items-center justify-between bg-surface-dim border border-foreground/5 p-4 rounded-2xl">
          <div>
            <h4 className="text-xs font-semibold">Google Account Connection</h4>
            <p className="text-[10px] text-foreground/40 mt-1 max-w-[280px]">
              {googleLinked
                ? 'Your Google account is linked. You can sign in with one click.'
                : 'No Google account is currently linked.'}
            </p>
          </div>
          {googleLinked && (
            <button
              onClick={handleUnlink}
              disabled={actionLoading}
              className="text-[11px] bg-foreground/5 hover:bg-red-500/10 hover:text-red-500 text-foreground/70 px-3 py-1.5 rounded-lg font-medium transition-all"
            >
              Unlink
            </button>
          )}
        </div>


        <div className="flex items-center justify-between border border-red-500/10 bg-red-500/[0.02] p-4 rounded-2xl">
          <div>
            <h4 className="text-xs font-semibold text-red-500">Delete Account</h4>
            <p className="text-[10px] text-red-500/40 mt-1 max-w-[280px]">
              Permanently delete all your settings, workspace, and accounts.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={actionLoading}
            className="text-[11px] bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-all"
          >
            Delete
          </button>
        </div>
      </section>
    </div>
  );
}

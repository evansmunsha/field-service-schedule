'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 rounded-xl bg-indigo-600 p-4 text-white shadow-xl md:left-auto md:right-6 md:w-96">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold">Install Field Service Scheduler</p>
          <p className="text-sm opacity-90">
            Get faster access and offline support
          </p>
        </div>

        <button
          onClick={installApp}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-600"
        >
          Install
        </button>
      </div>
    </div>
  );
}

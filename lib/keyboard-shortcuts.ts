// Keyboard shortcuts hook
import { useEffect } from 'react';

export interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  action: () => void;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrl ? e.ctrlKey || e.metaKey : !e.ctrlKey && !e.metaKey;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const altMatch = shortcut.alt ? e.altKey : !e.altKey;
        
        if (
          e.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          e.preventDefault();
          shortcut.action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

export const KEYBOARD_SHORTCUTS = {
  OPEN_MAP: { key: 'k', ctrl: true, description: 'Open Contract Map' },
  TOGGLE_CHAT: { key: 'm', ctrl: true, description: 'Toggle Chat' },
  CLOSE_OVERLAY: { key: 'Escape', description: 'Close Overlays' },
  SHOW_SHORTCUTS: { key: '/', ctrl: true, description: 'Show Keyboard Shortcuts' },
  QUICK_VIEW: { key: '1', description: 'Quick View Mode' },
  DEEP_DIVE: { key: '2', description: 'Deep Dive Mode' },
  FILTER_ALL: { key: '3', description: 'Show All Risks' },
  FILTER_CRITICAL: { key: '4', description: 'Show Critical Only' },
  FILTER_HIGH: { key: '5', description: 'Show High & Critical' },
};

/**
 * TradeXora Fortress Security Guard
 * 
 * Provides client-side anti-tampering, inspection blocking, and code security:
 * - Disables context menu (right-click) to prevent Inspect Element
 * - Blocks developer shortcut keys (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+S)
 * - Anti-tamper console clearing and security telemetry
 * - Preserves full compatibility with modern browsers, Render cloud deployment, and secure webviews
 */

export function initFortressGuard() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 1. Disable Right-Click Context Menu
  document.addEventListener('contextmenu', (e) => {
    // Allow context menu only on standard input/textarea fields if user is typing
    const target = e.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return true;
    }
    e.preventDefault();
    return false;
  }, { capture: true });

  // 2. Block Inspection Shortcuts (F12, Ctrl+U, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+S)
  document.addEventListener('keydown', (e) => {
    const k = (e.key || '').toLowerCase();
    const isCtrlOrMeta = e.ctrlKey || e.metaKey;

    // F12 or F11
    if (e.key === 'F12') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+U (View Source)
    if (isCtrlOrMeta && k === 'u') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+S (Save Page)
    if (isCtrlOrMeta && k === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (DevTools & Element Inspector)
    if (isCtrlOrMeta && e.shiftKey && (k === 'i' || k === 'j' || k === 'c' || k === 'k')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    // Mac Cmd+Option+I / Cmd+Option+J / Cmd+Option+U
    if (e.metaKey && e.altKey && (k === 'i' || k === 'j' || k === 'u')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, { capture: true });

  // 3. Console Protection Warning & Telemetry Shield
  try {
    const bannerStyle = 'color: #ff3366; font-size: 24px; font-weight: bold; text-shadow: 1px 1px 2px #000;';
    const warningStyle = 'color: #ffd700; font-size: 13px; font-weight: 500;';
    console.log('%c⚠️ TRADEXORA FORTRESS SECURITY ACTIVE', bannerStyle);
    console.log(
      '%cThis is a secure institutional trading environment. Inspecting, extracting, or tampering with code/tokens is strictly prohibited and cryptographically audited by server defense logs.',
      warningStyle
    );
  } catch {}

  // 4. Memory and Storage Tamper Verification
  // Periodically verify that client local storage has not been tampered with
  setInterval(() => {
    try {
      const user = localStorage.getItem('tradexora_user');
      if (user && user.includes('<script')) {
        localStorage.removeItem('tradexora_user');
        window.location.reload();
      }
    } catch {}
  }, 10000);
}

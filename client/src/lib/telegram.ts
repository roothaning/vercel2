// Interface for Telegram Web App
interface ITelegramWebApp {
  ready(): void;
  expand(): void;
  close(): void;
  showConfirm(message: string): Promise<boolean>;
  showAlert(message: string): Promise<void>;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  isVersionAtLeast(version: string): boolean;
  setBackgroundColor(color: string): void;
  setHeaderColor(color: string): void;
  onEvent(eventType: string, eventHandler: Function): void;
  offEvent(eventType: string, eventHandler: Function): void;
  BackButton: {
    show(): void;
    hide(): void;
    onClick(callback: Function): void;
    offClick(callback: Function): void;
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    onClick(callback: Function): void;
    offClick(callback: Function): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive: boolean): void;
    hideProgress(): void;
  };
  HapticFeedback: {
    impactOccurred(style: string): void;
    notificationOccurred(type: string): void;
    selectionChanged(): void;
  };
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: {
      id: number;
      first_name: string;
      last_name: string;
      username: string;
      language_code: string;
    };
    auth_date: number;
    hash: string;
  };
  version: string;
  colorScheme: string;
  themeParams: {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  platform: string;
  headerColor: string;
  backgroundColor: string;
}

// Check if Telegram WebApp is available
const isTelegramWebApp = (): boolean => {
  return window.Telegram && window.Telegram.WebApp ? true : false;
};

// Get Telegram WebApp
const getTelegramWebApp = (): ITelegramWebApp | null => {
  if (isTelegramWebApp()) {
    return window.Telegram.WebApp;
  }
  return null;
};

class TelegramWebApp {
  private webApp: ITelegramWebApp | null = null;

  init() {
    this.webApp = getTelegramWebApp();
    
    if (this.webApp) {
      // Expand the web app to take the full screen
      this.webApp.expand();
      
      // Tell Telegram that we are ready
      this.webApp.ready();
      
      // Set the theme colors
      this.webApp.setBackgroundColor('#1A1A2E');
      this.webApp.setHeaderColor('#1A1A2E');
    } else {
      console.log('Telegram WebApp is not available, running in browser mode');
    }
  }

  setViewport() {
    // Set the viewport for mobile devices
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        'content',
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
  }

  showMainButton(text: string) {
    if (this.webApp) {
      this.webApp.MainButton.setText(text);
      this.webApp.MainButton.show();
    }
  }

  hideMainButton() {
    if (this.webApp) {
      this.webApp.MainButton.hide();
    }
  }

  onMainButtonClick(callback: Function) {
    if (this.webApp) {
      this.webApp.MainButton.onClick(callback);
    }
  }

  showAlert(message: string) {
    if (this.webApp) {
      return this.webApp.showAlert(message);
    }
    return Promise.resolve();
  }

  showConfirm(message: string) {
    if (this.webApp) {
      return this.webApp.showConfirm(message);
    }
    return Promise.resolve(false);
  }

  hapticFeedback() {
    if (this.webApp && this.webApp.HapticFeedback) {
      this.webApp.HapticFeedback.impactOccurred('medium');
    }
  }

  getUserInfo() {
    if (this.webApp && this.webApp.initDataUnsafe.user) {
      return this.webApp.initDataUnsafe.user;
    }
    return null;
  }

  getQueryId() {
    if (this.webApp && this.webApp.initDataUnsafe.query_id) {
      return this.webApp.initDataUnsafe.query_id;
    }
    return null;
  }

  close() {
    if (this.webApp) {
      this.webApp.close();
    }
  }
}

// Declare global Telegram interface
declare global {
  interface Window {
    Telegram?: {
      WebApp: ITelegramWebApp;
    };
  }
}

// Export singleton instance
export const WebApp = new TelegramWebApp();

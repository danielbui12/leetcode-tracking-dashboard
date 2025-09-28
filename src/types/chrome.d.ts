// Chrome extension type definitions

declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | null, callback: (items: { [key: string]: any }) => void): void;
      set(items: { [key: string]: any }, callback?: () => void): void;
      remove(keys: string | string[], callback?: () => void): void;
    }

    const local: StorageArea;
  }

  namespace runtime {
    function sendMessage(message: any, callback?: (response: any) => void): void;
    const onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response?: any) => void) => void): void;
    };
  }

  namespace tabs {
    interface Tab {
      id: number;
      url?: string;
    }

    function get(tabId: number): Promise<Tab>;
    function sendMessage(tabId: number, message: any): Promise<any>;
    const onUpdated: {
      addListener(callback: (tabId: number, changeInfo: any, tab: Tab) => void): void;
    };
    const onActivated: {
      addListener(callback: (activeInfo: { tabId: number }) => void): void;
    };
  }

  namespace sidePanel {
    function open(options: { tabId: number }): Promise<void>;
    const onOpened: {
      addListener(callback: () => void): void;
    };
    const onClosed: {
      addListener(callback: () => void): void;
    };
  }

  namespace action {
    const onClicked: {
      addListener(callback: (tab: Tab) => void): void;
    };
  }
}

declare const chrome: typeof chrome;

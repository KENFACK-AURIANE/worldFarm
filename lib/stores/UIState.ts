interface UIState {
  sidebarOpen: boolean;
  cartDrawerOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  toggleSidebar: () => void;
  toggleCartDrawer: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme, THEMES } from '../context/ThemeContext';
import type { ReactNode } from 'react';

// Mock storage functions
vi.mock('../utils/storage', () => ({
  getThemeId: vi.fn(() => 'default'),
  setThemeId: vi.fn(),
}));

describe('ThemeContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ThemeProvider', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div>Test Child</div>
        </ThemeProvider>
      );
      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('should provide default theme', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div data-testid="theme-id">{theme.id}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      expect(screen.getByTestId('theme-id').textContent).toBe('default');
    });

    it('should provide theme object with correct properties', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <span data-testid="primary-color">{theme.primaryColor}</span>
            <span data-testid="background">{theme.background}</span>
            <span data-testid="text-color">{theme.textColor}</span>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      const defaultTheme = THEMES.find(t => t.id === 'default');
      expect(screen.getByTestId('primary-color').textContent).toBe(defaultTheme?.primaryColor);
      expect(screen.getByTestId('background').textContent).toBe(defaultTheme?.background);
    });
  });

  describe('useTheme hook', () => {
    it('should throw error when used outside provider', () => {
      const TestComponent = () => {
        try {
          useTheme();
          return <div>No error</div>;
        } catch (e) {
          return <div data-testid="error">{e instanceof Error ? e.message : 'Error'}</div>;
        }
      };

      render(<TestComponent />);
      expect(screen.getByTestId('error').textContent).toBe('useTheme must be used within ThemeProvider');
    });

    it('should provide setTheme function', () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('blue')} data-testid="set-theme-btn">
            Set Blue
          </button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByTestId('set-theme-btn')).toBeInTheDocument();
    });

    it('should allow theme switching', async () => {
      const { getThemeId, setThemeId } = await import('../utils/storage');
      
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme-id">{theme.id}</span>
            <button onClick={() => setTheme('blue')} data-testid="set-blue">
              Blue
            </button>
            <button onClick={() => setTheme('green')} data-testid="set-green">
              Green
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      // Click to set blue theme
      fireEvent.click(screen.getByTestId('set-blue'));
      expect(setThemeId).toHaveBeenCalledWith('blue');
    });
  });

  describe('THEMES constant', () => {
    it('should have valid themes array', () => {
      expect(THEMES.length).toBeGreaterThan(0);
      THEMES.forEach(theme => {
        expect(theme.id).toBeDefined();
        expect(theme.name).toBeDefined();
        expect(theme.primaryColor).toBeDefined();
        expect(theme.background).toBeDefined();
        expect(theme.textColor).toBeDefined();
      });
    });

    it('should have unique theme IDs', () => {
      const ids = THEMES.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have default theme', () => {
      expect(THEMES.find(t => t.id === 'default')).toBeDefined();
    });

    it('should have blue theme', () => {
      expect(THEMES.find(t => t.id === 'blue')).toBeDefined();
    });

    it('should have green theme', () => {
      expect(THEMES.find(t => t.id === 'green')).toBeDefined();
    });

    it('should have purple theme', () => {
      expect(THEMES.find(t => t.id === 'purple')).toBeDefined();
    });

    it('should have orange theme', () => {
      expect(THEMES.find(t => t.id === 'orange')).toBeDefined();
    });

    it('should have valid color formats', () => {
      const hexColorPattern = /^#[0-9A-Fa-f]{6}$/;
      THEMES.forEach(theme => {
        expect(hexColorPattern.test(theme.primaryColor)).toBe(true);
        expect(hexColorPattern.test(theme.secondaryColor)).toBe(true);
      });
    });
  });

  describe('Theme switching integration', () => {
    it('should update themeId state on setTheme call', async () => {
      const TestComponent = () => {
        const { theme, themeId, setTheme } = useTheme();
        return (
          <div>
            <span data-testid="theme-id">{themeId}</span>
            <span data-testid="theme-name">{theme.name}</span>
            <button onClick={() => setTheme('blue')} data-testid="switch-btn">
              Switch to Blue
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      const initialThemeId = screen.getByTestId('theme-id').textContent;
      fireEvent.click(screen.getByTestId('switch-btn'));
      
      // State should update
      expect(screen.getByTestId('theme-id').textContent).toBe('blue');
    });
  });
});
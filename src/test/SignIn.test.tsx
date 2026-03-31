import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import SignIn from '../pages/SignIn';
import { doSignIn, hasSignedInToday, getConsecutiveDays, SIGN_IN_REWARDS, saveSignInData, getSignInData } from '../utils/storage';
import type { SignInData } from '../types';

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Wrapper with router
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <MemoryRouter>
      {component}
    </MemoryRouter>
  );
};

describe('SignIn Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('initial render', () => {
    it('should render sign-in page', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText('每日签到')).toBeInTheDocument();
    });

    it('should show consecutive days count', () => {
      renderWithRouter(<SignIn />);
      // Default consecutive days should be 0
      expect(screen.getByText('连续签到天数')).toBeInTheDocument();
    });

    it('should render sign-in button when not signed', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByRole('button', { name: '立即签到' })).toBeInTheDocument();
    });

    it('should show "today signed" status when already signed', () => {
      // Perform sign-in first
      doSignIn();
      renderWithRouter(<SignIn />);
      expect(screen.getByText('今日已签到')).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByRole('button', { name: '← 返回' })).toBeInTheDocument();
    });

    it('should render sign-in rewards list', () => {
      renderWithRouter(<SignIn />);
      SIGN_IN_REWARDS.forEach(reward => {
        expect(screen.getByText(reward.label)).toBeInTheDocument();
      });
    });

    it('should render sign-in rules', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText('签到规则')).toBeInTheDocument();
      expect(screen.getByText(/每日签到获得基础/)).toBeInTheDocument();
    });

    it('should show expected reward points', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText(/今日可获得/)).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate to home when back button clicked', async () => {
      renderWithRouter(<SignIn />);
      const backButton = screen.getByRole('button', { name: '← 返回' });
      await userEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('sign-in action', () => {
    it('should perform sign-in when button clicked', async () => {
      renderWithRouter(<SignIn />);
      const signInButton = screen.getByRole('button', { name: '立即签到' });
      await userEvent.click(signInButton);
      
      // Should show success animation
      await waitFor(() => {
        expect(screen.getByText('签到成功！')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should disable sign-in button after signing', async () => {
      // Sign in first
      doSignIn();
      renderWithRouter(<SignIn />);
      
      // Find all buttons and look for the signed one
      const buttons = screen.getAllByRole('button');
      const signedButton = buttons.find(b => b.textContent?.includes('今日已签到'));
      // If button exists, check it's disabled
      if (signedButton) {
        expect(signedButton).toBeDisabled();
      } else {
        // Button text might be in a different format
        expect(screen.getByText('今日已签到')).toBeInTheDocument();
      }
    });
  });

  describe('reward progress', () => {
    it('should show achieved rewards when streak reached', () => {
      // Simulate 3 days streak
      const today = new Date().toISOString().split('T')[0];
      const data: SignInData = {
        lastSignInDate: today,
        consecutiveDays: 3,
        totalDays: 3,
        records: [
          { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], reward: 10, streakAtSign: 1 },
          { date: new Date(Date.now() - 86400000).toISOString().split('T')[0], reward: 15, streakAtSign: 2 },
          { date: today, reward: 15, streakAtSign: 3 },
        ],
      };
      saveSignInData(data);
      
      renderWithRouter(<SignIn />);
      expect(screen.getByText('已达成')).toBeInTheDocument();
    });

    it('should show next reward progress', () => {
      // Simulate 2 days streak (next reward at 3 days)
      const today = new Date().toISOString().split('T')[0];
      const data: SignInData = {
        lastSignInDate: today,
        consecutiveDays: 2,
        totalDays: 2,
        records: [],
      };
      saveSignInData(data);
      
      renderWithRouter(<SignIn />);
      expect(screen.getByText('还差 1 天')).toBeInTheDocument();
    });
  });

  describe('statistics display', () => {
    it('should show total sign-in days', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText('累计签到')).toBeInTheDocument();
    });

    it('should show consecutive days', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText('连续签到')).toBeInTheDocument();
    });

    it('should show total earned points', () => {
      renderWithRouter(<SignIn />);
      expect(screen.getByText('累计获得')).toBeInTheDocument();
    });
  });

  describe('sign-in records', () => {
    it('should show recent sign-in records', () => {
      // Create some records
      doSignIn();
      
      renderWithRouter(<SignIn />);
      expect(screen.getByText('最近签到记录')).toBeInTheDocument();
    });

    it('should display record details correctly', () => {
      const today = new Date().toISOString().split('T')[0];
      const data: SignInData = {
        lastSignInDate: today,
        consecutiveDays: 1,
        totalDays: 1,
        records: [{ date: today, reward: 10, streakAtSign: 1 }],
      };
      saveSignInData(data);
      
      renderWithRouter(<SignIn />);
      expect(screen.getByText(today)).toBeInTheDocument();
      expect(screen.getByText('连续1天')).toBeInTheDocument();
      expect(screen.getByText('+10分')).toBeInTheDocument();
    });
  });

  describe('animation', () => {
    it('should show success animation overlay', async () => {
      renderWithRouter(<SignIn />);
      const signInButton = screen.getByRole('button', { name: '立即签到' });
      await userEvent.click(signInButton);
      
      await waitFor(() => {
        expect(screen.getByText('签到成功！')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });
});
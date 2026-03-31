import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import Achievements from '../pages/Achievements';
import { getAllAchievementsWithStatus, checkin, getCheckinStatus, unlockAchievement, resetUserData } from '../utils/storage';
import ACHIEVEMENT_CATEGORIES from '../data/achievements';

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

describe('Achievements Component', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  describe('initial render', () => {
    it('should render achievements page', () => {
      renderWithRouter(<Achievements />);
      expect(screen.getByText('🏆 成就徽章')).toBeInTheDocument();
    });

    it('should show progress count', () => {
      renderWithRouter(<Achievements />);
      expect(screen.getByText(/已解锁/)).toBeInTheDocument();
    });

    it('should render back button', () => {
      renderWithRouter(<Achievements />);
      expect(screen.getByRole('button', { name: '← 返回' })).toBeInTheDocument();
    });

    it('should render category tabs', () => {
      renderWithRouter(<Achievements />);
      ACHIEVEMENT_CATEGORIES.forEach(cat => {
        expect(screen.getByText(cat.name)).toBeInTheDocument();
      });
    });

    it('should show check-in section', () => {
      renderWithRouter(<Achievements />);
      expect(screen.getByText('连续签到')).toBeInTheDocument();
    });

    it('should show all achievements', () => {
      renderWithRouter(<Achievements />);
      // Should show achievement names
      expect(screen.getByText('首战告捷')).toBeInTheDocument();
      expect(screen.getByText('五连击')).toBeInTheDocument();
      expect(screen.getByText('百分达人')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should navigate to home when back button clicked', async () => {
      renderWithRouter(<Achievements />);
      const backButton = screen.getByRole('button', { name: '← 返回' });
      await userEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  describe('category filtering', () => {
    it('should filter achievements by category', async () => {
      renderWithRouter(<Achievements />);
      
      // Click on "闯关" category button
      const buttons = screen.getAllByRole('button');
      const gameCategoryBtn = buttons.find(b => b.textContent?.includes('闯关'));
      if (gameCategoryBtn) {
        await userEvent.click(gameCategoryBtn);
      }
      
      // Should show game category achievements
      expect(screen.getByText('首战告捷')).toBeInTheDocument();
      expect(screen.getByText('五连击')).toBeInTheDocument();
    });

    it('should show all achievements when "全部" selected', async () => {
      renderWithRouter(<Achievements />);
      
      // Click on "全部" category
      const buttons = screen.getAllByRole('button');
      const allCategoryBtn = buttons.find(b => b.textContent?.includes('全部'));
      if (allCategoryBtn) {
        await userEvent.click(allCategoryBtn);
      }
      
      // Should show all achievements
      expect(screen.getByText('首战告捷')).toBeInTheDocument();
      expect(screen.getByText('百分达人')).toBeInTheDocument();
      expect(screen.getByText('坚持学习')).toBeInTheDocument();
    });
  });

  describe('achievement status display', () => {
    it('should show unlocked status for unlocked achievements', () => {
      // Unlock an achievement
      localStorage.clear();
      unlockAchievement('first_correct');
      
      renderWithRouter(<Achievements />);
      
      // Should show "已解锁" status
      expect(screen.getByText('✓ 已解锁')).toBeInTheDocument();
    });

    it('should show locked status for locked achievements', () => {
      renderWithRouter(<Achievements />);
      
      // Should show "未解锁" for locked achievements - use getAllByText since there are multiple
      const lockedElements = screen.getAllByText('🔒 未解锁');
      expect(lockedElements.length).toBeGreaterThan(0);
    });

    it('should update progress count after unlocking', () => {
      localStorage.clear();
      unlockAchievement('first_correct');
      
      renderWithRouter(<Achievements />);
      
      // Should show 1 unlocked
      expect(screen.getByText(/已解锁 1/)).toBeInTheDocument();
    });
  });

  describe('achievement details modal', () => {
    it('should open modal when achievement clicked', async () => {
      renderWithRouter(<Achievements />);
      
      // Click on an achievement name
      const achievementName = screen.getByText('首战告捷');
      const achievementCard = achievementName.closest('div');
      if (achievementCard) {
        fireEvent.click(achievementCard);
      }
      
      await waitFor(() => {
        // Modal should appear with close button
        expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should show unlock condition for locked achievements', async () => {
      renderWithRouter(<Achievements />);
      
      // Click on a locked achievement (streak_10 requires 10 consecutive correct)
      const achievementName = screen.getByText('十连胜');
      const achievementCard = achievementName.closest('div');
      if (achievementCard) {
        fireEvent.click(achievementCard);
      }
      
      await waitFor(() => {
        expect(screen.getByText('解锁条件')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should close modal when close button clicked', async () => {
      renderWithRouter(<Achievements />);
      
      // Open modal first
      const achievementName = screen.getByText('首战告捷');
      const achievementCard = achievementName.closest('div');
      if (achievementCard) {
        fireEvent.click(achievementCard);
      }
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '关闭' })).toBeInTheDocument();
      });
      
      const closeButton = screen.getByRole('button', { name: '关闭' });
      await userEvent.click(closeButton);
      
      await waitFor(() => {
        expect(screen.queryByRole('button', { name: '关闭' })).not.toBeInTheDocument();
      });
    });
  });

  describe('check-in integration', () => {
    it('should show check-in streak', () => {
      renderWithRouter(<Achievements />);
      
      expect(screen.getByText('连续签到')).toBeInTheDocument();
      // Default streak is 0
      expect(screen.getByText('0 天')).toBeInTheDocument();
    });

    it('should allow check-in from achievements page', async () => {
      renderWithRouter(<Achievements />);
      
      const buttons = screen.getAllByRole('button');
      const checkinButton = buttons.find(b => b.textContent?.includes('立即签到'));
      if (checkinButton) {
        await userEvent.click(checkinButton);
      }
      
      // After check-in, should show signed status
      await waitFor(() => {
        expect(screen.getByText('✓ 今日已签到')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should disable check-in button after signing', () => {
      // Sign in first
      localStorage.clear();
      checkin();
      
      renderWithRouter(<Achievements />);
      
      // Find signed button
      const buttons = screen.getAllByRole('button');
      const signedButton = buttons.find(b => b.textContent?.includes('今日已签到'));
      expect(signedButton).toBeDisabled();
    });
  });

  describe('progress bar', () => {
    it('should show progress indicator', () => {
      renderWithRouter(<Achievements />);
      
      // Progress text should be visible - use more specific selector
      const progressText = screen.getByText(/已解锁.*\/.*\d/);
      expect(progressText).toBeInTheDocument();
    });

    it('should update progress based on unlocked count', () => {
      localStorage.clear();
      unlockAchievement('first_correct');
      unlockAchievement('streak_5');
      
      renderWithRouter(<Achievements />);
      
      // Should show 2 unlocked
      expect(screen.getByText(/已解锁 2/)).toBeInTheDocument();
    });
  });
});
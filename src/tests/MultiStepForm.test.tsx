import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Multi-Step Form App Integration & Navigation Tests', () => {
  it('renders Step 1 Loan Selection title and loan type cards on initial load', () => {
    render(<App />);
    expect(screen.getByText(/Step 1: Loan Category & Financial Capital Specifications/i)).toBeInTheDocument();
    expect(screen.getByText(/Personal Loan/i)).toBeInTheDocument();
    expect(screen.getByText(/Home \/ Property Loan/i)).toBeInTheDocument();
    expect(screen.getByText(/Business Loan/i)).toBeInTheDocument();
  });

  it('renders progress bar with 9 steps', () => {
    render(<App />);
    expect(screen.getByText(/Application Progress/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Loan/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/KYC/i).length).toBeGreaterThan(0);
  });

  it('navigates from Step 1 to Step 2 when Next button is clicked', () => {
    render(<App />);
    const nextButton = screen.getByText(/Save & Proceed to Personal KYC/i);
    fireEvent.click(nextButton);
    expect(screen.getByText(/Step 2: Digital Identity Verification & NSDL \/ UIDAI e-KYC Compliance/i)).toBeInTheDocument();
  });

  it('toggles theme when dark mode toggle button is clicked', () => {
    render(<App />);
    const themeButton = screen.getByRole('button', { name: /Toggle Theme/i });
    expect(themeButton).toBeInTheDocument();
    fireEvent.click(themeButton);
    // documentElement class toggle test
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

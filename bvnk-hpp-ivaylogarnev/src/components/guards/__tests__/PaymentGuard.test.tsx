import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom';

import { PaymentGuard } from '../PaymentGuard';
import { usePaymentSummary } from '@hooks/usePaymentSummary';
import { ROUTES } from '@utils/constants';
import { EQuoteStatus } from '@models/EQuoteStatus';
import { EStatus } from '@models/EStatus';

// Mock the hooks
vi.mock('@hooks/usePaymentSummary');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
    useParams: vi.fn()
  };
});

// Test component to render inside the guard
const TestComponent = () => <div>Test Content</div>;

describe('PaymentGuard', () => {
  const mockNavigate = vi.fn();
  const validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const mockPaymentSummary = {
    status: EStatus.PENDING,
    quoteStatus: EQuoteStatus.PENDING,
    acceptanceExpiryDate: Date.now() + 3600000 // 1 hour from now
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ uuid: validUuid });
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: mockPaymentSummary
    });
  });

  const renderGuard = () => {
    return render(
      <MemoryRouter initialEntries={[`/payment/${validUuid}`]}>
        <Routes>
          <Route element={<PaymentGuard />}>
            <Route path="/payment/:uuid" element={<TestComponent />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders children when all conditions are met', () => {
    renderGuard();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('navigates to not found page when UUID is invalid', () => {
    (useParams as jest.Mock).mockReturnValue({ uuid: 'invalid-uuid' });
    renderGuard();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.NOT_FOUND, {
      replace: true
    });
  });

  it('navigates to payment page when quote is accepted', () => {
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: {
        ...mockPaymentSummary,
        quoteStatus: EQuoteStatus.ACCEPTED
      }
    });
    renderGuard();
    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.PAYMENT_PAY.replace(':uuid', validUuid)
    );
  });

  it('navigates to expired page when payment status is EXPIRED', () => {
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: {
        ...mockPaymentSummary,
        status: EStatus.EXPIRED
      }
    });
    renderGuard();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });

  it('navigates to expired page when acceptance expiry date has passed', () => {
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: {
        ...mockPaymentSummary,
        acceptanceExpiryDate: Date.now() - 1000 // 1 second ago
      }
    });
    renderGuard();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PAYMENT_EXPIRED, {
      replace: true
    });
  });

  it('handles missing payment summary gracefully', () => {
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: null
    });
    renderGuard();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles missing acceptance expiry date gracefully', () => {
    (usePaymentSummary as jest.Mock).mockReturnValue({
      paymentSummary: {
        ...mockPaymentSummary,
        acceptanceExpiryDate: null
      }
    });
    renderGuard();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});

import { Route, Routes } from 'react-router-dom';

import { HomePage } from '@pages/HomePage';
import { AcceptQuotePage } from '@pages/AcceptQuotePage';
import { PayQuotePage } from '@pages/PayQuotePage';
import { ExpiredPage } from '@pages/ExpiredPage';
import { NotFoundPage } from '@pages/NotFoundPage';

import { PaymentGuard } from '@components/guards/PaymentGuard';
import { Header } from '@components/layout/Header';

import { ROUTES } from '@utils/constants';

export const Layout = () => {
  return (
    <div className="h-screen bg-gray-100">
      <Header />
      <main className="mt-16">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />

          <Route element={<PaymentGuard />}>
            <Route
              path={ROUTES.PAYMENT_SUMMARY}
              element={<AcceptQuotePage />}
            />
            <Route path={ROUTES.PAYMENT_PAY} element={<PayQuotePage />} />
          </Route>

          <Route path={ROUTES.PAYMENT_EXPIRED} element={<ExpiredPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  );
};

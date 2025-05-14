import { Route, Routes } from 'react-router-dom';

import { HomePage } from '@pages/HomePage';
import { AcceptQuotePage } from '@pages/AcceptQuotePage';
import { PayQuotePage } from '@pages/PayQuotePage';
import { ExpiredPage } from '@pages/ExpiredPage';
import { NotFoundPage } from '@pages/NotFoundPage';

import { PaymentInProgressGuard } from '@components/guards/PaymentInProgressGuard';

export const App = () => {
  return (
    <div className="bg-gray-100">
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Payment routes */}
        <Route element={<PaymentInProgressGuard />}>
          <Route path="/payin/:uuid" element={<AcceptQuotePage />} />
          <Route path="/payin/:uuid/pay" element={<PayQuotePage />} />
        </Route>
        <Route path="/expired" element={<ExpiredPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

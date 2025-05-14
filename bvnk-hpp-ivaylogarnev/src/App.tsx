import { Route, Routes } from 'react-router-dom';

import HomePage from '@pages/HomePage';
import AcceptQuotePage from '@pages/payin/AcceptQuotePage';
import PayQuotePage from '@pages/payin/PayQuotePage';
import ExpiredPage from '@pages/payin/ExpiredPage';
import NotFoundPage from '@pages/NotFoundPage';

import PaymentRouteGuard from '@guards/PaymentRouteGuard';
import PaymentInProgressGuard from '@guards/PaymentInProgressGuard';

export const App = () => {
  return (
    <div className="bg-gray-100">
      <Routes>
        {/* Home page */}
        <Route path="/" element={<HomePage />} />

        {/* Payment routes */}
        <Route element={<PaymentRouteGuard />}>
          <Route element={<PaymentInProgressGuard />}>
            <Route path="/payin/:uuid" element={<AcceptQuotePage />} />
          </Route>
          <Route path="/payin/:uuid/pay" element={<PayQuotePage />} />
        </Route>
        <Route path="/expired" element={<ExpiredPage />} />

        {/* 404 Page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
};

export default App;

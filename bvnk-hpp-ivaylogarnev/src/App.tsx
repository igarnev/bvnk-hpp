import { Route, Routes } from 'react-router-dom';

import HomePage from '@pages/HomePage';
import AcceptQuotePage from '@pages/payin/AcceptQuotePage';
import PayQuotePage from '@pages/payin/PayQuotePage';
import ExpiredPage from '@pages/payin/ExpiredPage';
import NotFoundPage from '@pages/NotFoundPage';

export const App = () => {
  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<HomePage />} />

      {/* Payment routes */}
      <Route path="/payin/:uuid" element={<AcceptQuotePage />} />
      <Route path="/payin/:uuid/pay" element={<PayQuotePage />} />
      <Route path="/expired" element={<ExpiredPage />} />

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;

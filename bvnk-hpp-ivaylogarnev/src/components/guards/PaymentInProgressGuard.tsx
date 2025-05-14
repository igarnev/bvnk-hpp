import { useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

export const PaymentInProgressGuard = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const payInProgressSummary = JSON.parse(
      localStorage.getItem('payInProgressSummary') || '{}'
    );

    if (payInProgressSummary?.uuid === uuid) {
      navigate(`/payin/${uuid}/pay`);
    }
  }, [navigate, uuid]);

  return <Outlet />;
};

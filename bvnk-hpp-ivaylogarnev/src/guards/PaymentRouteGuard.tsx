import { useEffect } from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';

import { uuidSchema } from '@utils/zod-schemas';

const PaymentRouteGuard = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate UUID first
    const uuidValidation = uuidSchema.uuid.safeParse(uuid);
    if (!uuidValidation.success) {
      navigate('/not-found');
      return;
    }

    if (
      localStorage.getItem('payInProgressSummary') &&
      JSON.parse(localStorage.getItem('payInProgressSummary')!).uuid === uuid
    ) {
      navigate(`/payin/${uuid}/pay`);
    }
  }, [navigate, uuid]);

  return <Outlet />;
};

export default PaymentRouteGuard;

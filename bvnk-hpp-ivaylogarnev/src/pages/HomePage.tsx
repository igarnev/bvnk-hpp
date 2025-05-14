import { useState } from 'react';

import { Input } from '@components/ui/input';
import { Button } from '@components/ui/button';

import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';

const HomePage = () => {
  const [paymentUuid, setPaymentUuid] = useState<string>('');
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="flex w-1/4 min-w-96 p-4 mb-64">
        <h1 className="text-center">BVNK Hosted Payment Page</h1>
        <Input
          placeholder="Enter a payment UUID"
          onChange={(e) => setPaymentUuid(e.target.value)}
        />
        <Button
          onClick={() => {
            navigate(`/payin/${paymentUuid}`);
          }}
        >
          Pay
        </Button>
      </Card>
    </div>
  );
};

export default HomePage;

import { useParams } from 'react-router-dom';

const PayQuotePage = () => {
  const { uuid } = useParams<{ uuid: string }>();

  return (
    <div>
      <h1>Pay Quote Page</h1>
      <p>UUID: {uuid}</p>
      {/* Payment details will be implemented here */}
    </div>
  );
};

export default PayQuotePage;

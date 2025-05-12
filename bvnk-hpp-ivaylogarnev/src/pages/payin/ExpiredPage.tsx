import { useParams } from 'react-router-dom';

const ExpiredPage = () => {
  const { uuid } = useParams<{ uuid: string }>();

  return (
    <div>
      <h1>Quote Expired</h1>
      <p>The quote with UUID: {uuid} has expired.</p>
      {/* Expiry details will be implemented here */}
    </div>
  );
};

export default ExpiredPage;

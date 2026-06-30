// NotFoundPage - shown for any unmatched route

import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import Button from '../components/common/Button';

const NotFoundPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
    <Zap className="text-primary-500 mb-4" size={48} />
    <h1 className="mb-2">404</h1>
    <p className="text-gray-500 dark:text-gray-400 mb-6">This page doesn't exist.</p>
    <Link to="/">
      <Button variant="primary">Back to home</Button>
    </Link>
  </div>
);

export default NotFoundPage;

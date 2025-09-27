import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useClient } from '@/contexts/ClientContext';

const NotFound = () => {
  const location = useLocation();
  const { adminContent } = useClient();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">
          {(adminContent as any)?.page_not_found_label || 'Oops! Page not found'}
        </p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          {(adminContent as any)?.back_to_home_button_label || 'Return to Home'}
        </a>
      </div>
    </div>
  );
};

export default NotFound;

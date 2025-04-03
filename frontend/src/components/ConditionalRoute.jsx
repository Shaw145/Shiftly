import { Navigate } from 'react-router-dom';

const ConditionalRoute = ({ element, condition, redirectTo = '/' }) => {
  return condition ? element : <Navigate to={redirectTo} replace />;
};

export default ConditionalRoute;
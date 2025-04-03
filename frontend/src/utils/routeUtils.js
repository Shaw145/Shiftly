// Define the base dashboard routes
const DASHBOARD_BASE_ROUTES = ['/dashboard', '/book-transport', '/my-bookings'];

export const isDashboardPath = (pathname) => {
  // Check if the current path exactly matches or is a child of any dashboard route
  return DASHBOARD_BASE_ROUTES.some(route => 
    pathname === route || // Exact match
    (pathname.startsWith(route) && pathname.charAt(route.length) === '/') // Child route
  );
};
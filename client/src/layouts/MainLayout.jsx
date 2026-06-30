// MainLayout - wraps every page with the navbar

import Navbar from './Navbar';

const MainLayout = ({ children }) => (
  <div className="min-h-screen">
    <Navbar />
    {children}
  </div>
);

export default MainLayout;

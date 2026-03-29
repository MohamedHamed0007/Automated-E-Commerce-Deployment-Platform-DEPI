import { createBrowserRouter } from "react-router-dom";
import Auth from "./Layouts/Auth";
import MainLayout from "./Layouts/MainLayout";
import About from "./pages/About/About";
import Billing from "./pages/Billing/Billing";
import Compare from "./pages/Compare/Compare";
import Contact from "./pages/Contact/Contact";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Profile from "./pages/Profile/Profile";
import Subscription from "./pages/SubscriptionPlans/Subscription";
import Settings from "./pages/Settings/Settings";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Help from "./pages/Help/Help";
import History from "./pages/History/History";
import NewShipment from "./pages/NewShipment/NewShipment";
import NotFound from "./app/pages/NotFound";
import TrackingPage from "./pages/TrackingPage/TrackingPage";
import Payment from "./pages/Payment/Payment";
import PaymentSuccess from "./app/pages/PaymentSuccess";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "forgot", element: <ForgotPassword /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <Auth />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "billing", element: <Billing /> },
      
      // Flow: NewShipment → Compare → Payment → PaymentSuccess → Tracking
      { path: "newshipment", element: <NewShipment /> },
      { path: "compare/:shipmentId", element: <Compare /> },
      { path: "payment/:shipmentId", element: <Payment /> },
      { path: "paymentSuccess/:trackingNumber", element: <PaymentSuccess /> },
      { path: "tracking/:trackingNumber", element: <TrackingPage /> },

      { path: "profile", element: <Profile /> },
      { path: "settings", element: <Settings /> },
      { path: "subscription", element: <Subscription /> },
      { path: "help", element: <Help /> },
      { path: "history", element: <History /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default router;
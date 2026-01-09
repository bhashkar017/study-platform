import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import GroupView from './pages/GroupView';
import ProtectedRoute from './components/ProtectedRoute';

import AIAssistant from './components/AIAssistant';
import Developer from './pages/Developer';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/group/:groupId" element={<GroupView />} />
                </Route>

                <Route path="/developer" element={<Developer />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>

            {/* Render AI Assistant globally, it handles its own visibility */}
            {/* Logic: Only show if authenticated? Ideally yes. 
               We can wrap it in a logical check or rely on the fact that if a user isn't logged in, they are redirected.
               But to be safe and clean, let's put it inside a fragment or simple check. 
               Since we can't easily check auth outside a component here without context, 
               let's place it here and let it rely on the API. 
               Better yet, let's create a Layout component. 
               For now, simple placement is fine, the user requested it. 
             */}
            <AIAssistant />
        </BrowserRouter >
    );
}

export default App;

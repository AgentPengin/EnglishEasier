import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import FlashcardsPage from './pages/FlashcardsPage';
import CreateSetPage from './pages/CreateSetPage';
import EditSetPage from './pages/EditSetPage';
import StudyPage from './pages/StudyPage';
import PomodoroPage from './pages/PomodoroPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import FoldersPage from './pages/FoldersPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <ProtectedRoute>
              <Layout>
                <FlashcardsPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/folders"
          element={
            <ProtectedRoute>
              <Layout>
                <FoldersPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-set"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateSetPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-set/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditSetPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/study/:id"
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/study"
          element={
            <ProtectedRoute>
              <StudyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <Layout>
                <PomodoroPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Layout>
                <LeaderboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Layout>
                <ProfilePage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

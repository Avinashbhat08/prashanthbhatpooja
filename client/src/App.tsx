import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { LanguageProvider } from './contexts/LanguageContext.js';
import { ToastProvider } from './components/common/Toast.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';
import { ProtectedRoute } from './components/layout/ProtectedRoute.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { AboutPage } from './pages/AboutPage.js';
import { PoojaItemsPage } from './pages/PoojaItemsPage.js';
import { GalleryPage } from './pages/GalleryPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <div className="flex flex-col min-h-screen bg-spiritual-cream text-neutral-900 font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />

                  {/* Protected Pooja Samagri Generator Route */}
                  <Route
                    path="/samagri"
                    element={
                      <ProtectedRoute>
                        <PoojaItemsPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Admin Route */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
};

export default App;


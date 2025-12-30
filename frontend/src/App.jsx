import './styles/App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import ProtectedRoute from './auth/ProtectedRoute'
import Layout from './components/layout/Layout'
import UserProfilePage from './pages/UserProfilePage';
import MyProfilePage from './pages/MyProfilePage'
import Login from './pages/Login'
import AdsList from './pages/Ads/AdsList'
import AdDetails from './pages/Ads/AdDetails'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import ChatsList from './pages/Chats/ChatsList'
import Chat from './pages/Chats/Chat'
import CreateAd from './pages/MyAds/CreateAd'
import ModeratorAds from './pages/Moderator/ModeratorAds'
import EditAd from './pages/MyAds/EditAd'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<AdsList />} />
            <Route path="/ads/:id" element={<AdDetails />} />
            <Route path="/chats" element={<ProtectedRoute><ChatsList /></ProtectedRoute>} />
            <Route path="/chats/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/myads/create" element={<ProtectedRoute><CreateAd /></ProtectedRoute>} />
            <Route path="/myads/edit/:id" element={<ProtectedRoute><EditAd /></ProtectedRoute>} />
            <Route path="/moderator/ads" element={<ProtectedRoute><ModeratorAds /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><MyProfilePage /></ProtectedRoute>} />
            <Route path="/users/:id" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

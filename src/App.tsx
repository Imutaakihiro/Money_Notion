import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import { NotionProvider } from './contexts/NotionContext'

function App() {
  return (
    <Router>
      <NotionProvider>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <Navigation />
          <main className="pb-20">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </NotionProvider>
    </Router>
  )
}

export default App
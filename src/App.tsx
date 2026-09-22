import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FloodDataProvider } from './hooks/useFloodData'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Settings from './pages/Settings'
import Login from './pages/Login'
import FloodMonitoring from './pages/FloodMonitoring'
import GeospatialMap from './pages/GeospatialMap'
import Forecasting from './pages/Forecasting'
import Alerts from './pages/Alerts'
import SensorStatus from './pages/SensorStatus'
import HistoricalData from './pages/HistoricalData'
import Reports from './pages/Reports'

export default function App() {
  return (
    <BrowserRouter>
      <FloodDataProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/flood-monitoring" element={<FloodMonitoring />} />
            <Route path="/geospatial-map" element={<GeospatialMap />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/sensor-status" element={<SensorStatus />} />
            <Route path="/historical-data" element={<HistoricalData />} />
            <Route path="/history" element={<History />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </FloodDataProvider>
    </BrowserRouter>
  )
}
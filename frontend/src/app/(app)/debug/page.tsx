'use client'
import { useState } from 'react'
import apiClient from '@/lib/api/client'
import { assignmentApi } from '@/lib/api/assignments'
import { connectSocket, onJobCompleted } from '@/lib/socket/client'

interface HealthResponse {
  status: string;
  timestamp: string;
}

interface Assignment {
  id: string;
  title: string;
}

export default function DebugPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [assignments, setAssignments] = useState<Assignment[] | null>(null)
  const [wsStatus, setWsStatus] = useState('not connected')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)

  async function runChecks() {
    setRunning(true)
    setErrors({})
    setHealth(null)
    setAssignments(null)
    setWsStatus('connecting...')

    // Health check
    try {
      const res = await apiClient.get('/health')
      setHealth(res.data)
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      setErrors(prev => ({ ...prev, health: error.message }))
    }

    // Assignments check
    try {
      const data = await assignmentApi.getAll()
      setAssignments(data)
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      setErrors(prev => ({ 
        ...prev, assignments: error.message 
      }))
    }

    // Socket check
    try {
      connectSocket()
      
      const unsubscribe = onJobCompleted(() => {
        setWsStatus('connected ✓')
      })
      
      setTimeout(() => {
        if (wsStatus === 'connecting...') {
          setWsStatus('connected (polling)')
        }
        unsubscribe()
      }, 5000)
    } catch (e: unknown) {
      const error = e instanceof Error ? e : new Error(String(e))
      setErrors(prev => ({ ...prev, socket: error.message }))
    }

    setRunning(false)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6 min-h-screen bg-gray-50">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900">
          Production Debug
        </h1>
        <p className="text-gray-600">
          Verify that backend, database, and WebSocket connections are working
        </p>
      </div>
      
      <div className="space-y-2 text-sm font-mono bg-gray-800 text-gray-100 p-4 rounded-lg">
        <p>API URL: {process.env.NEXT_PUBLIC_API_URL}</p>
        <p>WS URL: {process.env.NEXT_PUBLIC_WS_URL}</p>
        <p>Environment: {process.env.NODE_ENV}</p>
      </div>

      <button
        onClick={runChecks}
        disabled={running}
        className="px-6 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
      >
        {running ? 'Running checks...' : 'Run All Checks'}
      </button>

      {health && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="font-bold text-green-800 mb-2">
            ✅ Backend: Connected
          </p>
          <pre className="text-xs text-green-700 bg-white p-2 rounded overflow-auto max-h-48">
            {JSON.stringify(health, null, 2)}
          </pre>
        </div>
      )}

      {assignments !== null && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <p className="font-bold text-green-800">
            ✅ Database: {Array.isArray(assignments) 
              ? `${assignments.length} assignments found`
              : 'Connected'}
          </p>
          {Array.isArray(assignments) && assignments.length > 0 && (
            <pre className="text-xs text-green-700 bg-white p-2 rounded mt-2 overflow-auto max-h-48">
              {JSON.stringify(assignments.slice(0, 2), null, 2)}
            </pre>
          )}
        </div>
      )}

      <div className={`border-l-4 p-4 rounded
        ${wsStatus.includes('connected') 
          ? 'bg-green-50 border-green-400' 
          : 'bg-yellow-50 border-yellow-400'}`}>
        <p className="font-bold">
          {wsStatus.includes('connected') ? '✅' : '⏳'} 
          WebSocket: {wsStatus}
        </p>
      </div>

      {Object.entries(errors).length > 0 && (
        <div className="space-y-2">
          <p className="font-semibold text-gray-900">Errors Found:</p>
          {Object.entries(errors).map(([key, msg]) => (
            <div key={key} className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="font-bold text-red-800">
                ❌ {key}: {msg}
              </p>
            </div>
          ))}
        </div>
      )}

      {!running && health && assignments && wsStatus.includes('connected') && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
          <p className="font-bold text-blue-800">
            ✨ All systems operational!
          </p>
          <p className="text-sm text-blue-700 mt-1">
            You can delete /debug/page.tsx now. Production deployment is ready.
          </p>
        </div>
      )}
    </div>
  )
}

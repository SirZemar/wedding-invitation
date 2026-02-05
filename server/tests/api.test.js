import { describe, it, before, after } from 'node:test'
import assert from 'node:assert'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const TEST_PORT = 3099
const BASE_URL = `http://localhost:${TEST_PORT}`

let serverProcess
let adminToken

// Helper to make HTTP requests
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  })
  const data = response.headers.get('content-type')?.includes('application/json')
    ? await response.json()
    : await response.text()
  return { status: response.status, data }
}

// Helper to make authenticated requests
async function authRequest(endpoint, options = {}) {
  return request(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${adminToken}`
    }
  })
}

describe('Wedding Invitation API', () => {
  before(async () => {
    // Clean up test database if exists
    const testDbPath = path.join(__dirname, '../db/test-wedding.db')
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath)
    }

    // Start server with test port and db
    serverProcess = spawn('node', ['server.js'], {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        PORT: TEST_PORT,
        DB_PATH: testDbPath,
        ADMIN_PASSWORD: 'testpassword',
        ADMIN_TOKEN_SECRET: 'testsecret'
      },
      stdio: 'pipe'
    })

    // Wait for server to start
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Server startup timeout')), 5000)
      serverProcess.stdout.on('data', (data) => {
        if (data.toString().includes('Server running')) {
          clearTimeout(timeout)
          resolve()
        }
      })
      serverProcess.stderr.on('data', (data) => {
        console.error('Server error:', data.toString())
      })
    })
  })

  after(() => {
    if (serverProcess) {
      serverProcess.kill()
    }
  })

  describe('Health Check', () => {
    it('should return ok status', async () => {
      const { status, data } = await request('/api/health')
      assert.strictEqual(status, 200)
      assert.strictEqual(data.status, 'ok')
      assert.ok(data.timestamp)
    })
  })

  describe('RSVP Endpoints', () => {
    it('should reject RSVP with no guests', async () => {
      const { status, data } = await request('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({ guests: [], language: 'en' })
      })
      assert.strictEqual(status, 400)
      assert.ok(data.error.includes('guest'))
    })

    it('should reject RSVP with missing language', async () => {
      const { status, data } = await request('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({
          guests: [{ name: 'Test Guest', attending: true }]
        })
      })
      assert.strictEqual(status, 400)
      assert.ok(data.error.includes('Language'))
    })

    it('should reject RSVP with empty guest name', async () => {
      const { status, data } = await request('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({
          guests: [{ name: '', attending: true }],
          language: 'en'
        })
      })
      assert.strictEqual(status, 400)
      assert.ok(data.error.includes('name'))
    })

    it('should create RSVP with single guest', async () => {
      const { status, data } = await request('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({
          guests: [{ name: 'John Doe', attending: true }],
          language: 'en',
          notes: 'Looking forward to it!'
        })
      })
      assert.strictEqual(status, 201)
      assert.strictEqual(data.success, true)
      assert.ok(data.submissionId)
    })

    it('should create RSVP with multiple guests', async () => {
      const { status, data } = await request('/api/rsvp', {
        method: 'POST',
        body: JSON.stringify({
          guests: [
            { name: 'Jane Smith', attending: true, isPlusOneRequest: true },
            { name: 'Bob Smith', attending: true },
            { name: 'Alice Smith', attending: false }
          ],
          language: 'pt'
        })
      })
      assert.strictEqual(status, 201)
      assert.strictEqual(data.success, true)
    })

    it('should reject GET without auth', async () => {
      const { status } = await request('/api/rsvp')
      assert.strictEqual(status, 401)
    })
  })

  describe('Admin Authentication', () => {
    it('should reject login with wrong password', async () => {
      const { status, data } = await request('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'wrongpassword' })
      })
      assert.strictEqual(status, 401)
      assert.ok(data.error.includes('Invalid'))
    })

    it('should reject login with no password', async () => {
      const { status, data } = await request('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({})
      })
      assert.strictEqual(status, 400)
      assert.ok(data.error.includes('required'))
    })

    it('should login with correct password', async () => {
      const { status, data } = await request('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password: 'testpassword' })
      })
      assert.strictEqual(status, 200)
      assert.strictEqual(data.success, true)
      assert.ok(data.token)
      adminToken = data.token
    })
  })

  describe('Admin Endpoints (authenticated)', () => {
    it('should get stats', async () => {
      const { status, data } = await authRequest('/api/admin/stats')
      assert.strictEqual(status, 200)
      assert.strictEqual(data.totalSubmissions, 2)
      assert.strictEqual(data.totalGuests, 4)
      assert.strictEqual(data.attendingGuests, 3)
      assert.strictEqual(data.notAttendingGuests, 1)
      assert.strictEqual(data.plusOneRequests, 1)
    })

    it('should get all submissions', async () => {
      const { status, data } = await authRequest('/api/rsvp')
      assert.strictEqual(status, 200)
      assert.strictEqual(data.length, 2)
      assert.ok(Array.isArray(data[0].guests))
    })

    it('should export CSV', async () => {
      const { status, data } = await authRequest('/api/admin/export')
      assert.strictEqual(status, 200)
      assert.ok(data.includes('Submission ID'))
      assert.ok(data.includes('John Doe'))
      assert.ok(data.includes('Jane Smith'))
    })

    it('should delete submission', async () => {
      // Get submissions first
      const { data: submissions } = await authRequest('/api/rsvp')
      const idToDelete = submissions[0].id

      const { status, data } = await authRequest(`/api/rsvp/${idToDelete}`, {
        method: 'DELETE'
      })
      assert.strictEqual(status, 200)
      assert.strictEqual(data.success, true)

      // Verify deletion
      const { data: updatedSubmissions } = await authRequest('/api/rsvp')
      assert.strictEqual(updatedSubmissions.length, 1)
    })

    it('should return 404 for non-existent submission', async () => {
      const { status } = await authRequest('/api/rsvp/99999', {
        method: 'DELETE'
      })
      assert.strictEqual(status, 404)
    })
  })
})

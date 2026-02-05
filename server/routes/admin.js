import { Router } from 'express';
import db from '../db/init.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = Router();

// Admin login
router.post('/login', (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = generateToken(password);

    res.json({
      success: true,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get dashboard statistics (admin only)
router.get('/stats', authMiddleware, (req, res) => {
  try {
    // Total submissions
    const totalSubmissions = db.prepare('SELECT COUNT(*) as count FROM submissions').get().count;

    // Total guests
    const totalGuests = db.prepare('SELECT COUNT(*) as count FROM guests').get().count;

    // Attending guests (excluding plus ones)
    const attendingGuests = db.prepare('SELECT COUNT(*) as count FROM guests WHERE attending = 1').get().count;

    // Approved plus ones
    const approvedPlusOnes = db.prepare('SELECT COUNT(*) as count FROM guests WHERE is_plus_one_request = 1 AND attending = 1 AND plus_one_status = ?').get('approved').count;

    // Not attending guests
    const notAttendingGuests = db.prepare('SELECT COUNT(*) as count FROM guests WHERE attending = 0').get().count;

    // Plus one requests (total)
    const plusOneRequests = db.prepare('SELECT COUNT(*) as count FROM guests WHERE is_plus_one_request = 1 AND attending = 1').get().count;

    // Submissions by language
    const byLanguage = db.prepare(`
      SELECT language, COUNT(*) as count
      FROM submissions
      GROUP BY language
    `).all();

    // Recent submissions (last 5)
    const recentSubmissions = db.prepare(`
      SELECT
        s.id,
        s.created_at,
        s.language,
        (SELECT COUNT(*) FROM guests WHERE submission_id = s.id) as guest_count,
        (SELECT COUNT(*) FROM guests WHERE submission_id = s.id AND attending = 1) as attending_count
      FROM submissions s
      ORDER BY s.created_at DESC
      LIMIT 5
    `).all();

    res.json({
      totalSubmissions,
      totalGuests,
      attendingGuests,
      approvedPlusOnes,
      notAttendingGuests,
      plusOneRequests,
      byLanguage,
      recentSubmissions
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Export CSV (admin only)
router.get('/export', authMiddleware, (req, res) => {
  try {
    const data = db.prepare(`
      SELECT
        s.id as submission_id,
        s.created_at,
        s.language,
        s.notes,
        g.name as guest_name,
        g.attending,
        g.is_plus_one_request,
        g.plus_one_status
      FROM submissions s
      LEFT JOIN guests g ON g.submission_id = s.id
      ORDER BY s.created_at DESC, g.id
    `).all();

    // Build CSV
    const headers = ['Submission ID', 'Date', 'Language', 'Notes', 'Guest Name', 'Attending', 'Plus One Request', 'Plus One Status'];
    const rows = data.map(row => [
      row.submission_id,
      row.created_at,
      row.language,
      `"${(row.notes || '').replace(/"/g, '""')}"`,
      `"${row.guest_name.replace(/"/g, '""')}"`,
      row.attending ? 'Yes' : 'No',
      row.is_plus_one_request ? 'Yes' : 'No',
      row.plus_one_status || '-'
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=rsvp-export.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

export default router;

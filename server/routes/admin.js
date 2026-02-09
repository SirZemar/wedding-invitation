import { Router } from 'express';
import pool from '../db/init.js';
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
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    // Total submissions
    const totalSubmissionsResult = await pool.query('SELECT COUNT(*) as count FROM submissions');
    const totalSubmissions = parseInt(totalSubmissionsResult.rows[0].count);

    // Total guests
    const totalGuestsResult = await pool.query('SELECT COUNT(*) as count FROM guests');
    const totalGuests = parseInt(totalGuestsResult.rows[0].count);

    // Attending guests (excluding plus ones)
    const attendingGuestsResult = await pool.query('SELECT COUNT(*) as count FROM guests WHERE attending = true');
    const attendingGuests = parseInt(attendingGuestsResult.rows[0].count);

    // Approved plus ones
    const approvedPlusOnesResult = await pool.query(
      'SELECT COUNT(*) as count FROM guests WHERE is_plus_one_request = true AND attending = true AND plus_one_status = $1',
      ['approved']
    );
    const approvedPlusOnes = parseInt(approvedPlusOnesResult.rows[0].count);

    // Not attending guests
    const notAttendingGuestsResult = await pool.query('SELECT COUNT(*) as count FROM guests WHERE attending = false');
    const notAttendingGuests = parseInt(notAttendingGuestsResult.rows[0].count);

    // Plus one requests (total)
    const plusOneRequestsResult = await pool.query('SELECT COUNT(*) as count FROM guests WHERE is_plus_one_request = true AND attending = true');
    const plusOneRequests = parseInt(plusOneRequestsResult.rows[0].count);

    // Submissions by language
    const byLanguageResult = await pool.query(`
      SELECT language, COUNT(*) as count
      FROM submissions
      GROUP BY language
    `);
    const byLanguage = byLanguageResult.rows.map(row => ({
      language: row.language,
      count: parseInt(row.count)
    }));

    // Recent submissions (last 5)
    const recentSubmissionsResult = await pool.query(`
      SELECT
        s.id,
        s.created_at,
        s.language,
        (SELECT COUNT(*) FROM guests WHERE submission_id = s.id) as guest_count,
        (SELECT COUNT(*) FROM guests WHERE submission_id = s.id AND attending = true) as attending_count
      FROM submissions s
      ORDER BY s.created_at DESC
      LIMIT 5
    `);
    const recentSubmissions = recentSubmissionsResult.rows.map(row => ({
      ...row,
      guest_count: parseInt(row.guest_count),
      attending_count: parseInt(row.attending_count)
    }));

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
router.get('/export', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
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
    `);

    const data = result.rows;

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

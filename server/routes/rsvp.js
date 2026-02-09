import { Router } from 'express';
import pool from '../db/init.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create a new RSVP submission
router.post('/', async (req, res) => {
  const client = await pool.connect();

  try {
    const { guests, notes, language } = req.body;

    // Validate input
    if (!guests || !Array.isArray(guests) || guests.length === 0) {
      return res.status(400).json({ error: 'At least one guest is required' });
    }

    if (!language) {
      return res.status(400).json({ error: 'Language is required' });
    }

    // Validate each guest
    for (const guest of guests) {
      if (!guest.name || guest.name.trim() === '') {
        return res.status(400).json({ error: 'Guest name is required' });
      }
      if (typeof guest.attending !== 'boolean') {
        return res.status(400).json({ error: 'Attending status is required' });
      }
    }

    // Use transaction for data integrity
    await client.query('BEGIN');

    // Insert submission
    const submissionResult = await client.query(
      'INSERT INTO submissions (language, notes) VALUES ($1, $2) RETURNING id',
      [language, notes || null]
    );
    const submissionId = submissionResult.rows[0].id;

    // Insert guests
    for (const guest of guests) {
      await client.query(
        'INSERT INTO guests (submission_id, name, attending, is_plus_one_request) VALUES ($1, $2, $3, $4)',
        [submissionId, guest.name.trim(), guest.attending, guest.isPlusOneRequest || false]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      submissionId,
      message: 'RSVP submitted successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating RSVP:', error);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  } finally {
    client.release();
  }
});

// Get all submissions (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        s.id,
        s.created_at,
        s.language,
        s.notes,
        COALESCE(
          json_agg(
            json_build_object(
              'id', g.id,
              'name', g.name,
              'attending', g.attending,
              'isPlusOneRequest', g.is_plus_one_request,
              'plusOneStatus', g.plus_one_status
            )
            ORDER BY g.id
          ) FILTER (WHERE g.id IS NOT NULL),
          '[]'
        ) as guests
      FROM submissions s
      LEFT JOIN guests g ON g.submission_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Update submission notes (admin only)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = await pool.query(
      'UPDATE submissions SET notes = $1 WHERE id = $2',
      [notes, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ success: true, message: 'Notes updated' });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// Update guest plus one status (admin only)
router.patch('/:submissionId/guest/:guestId', authMiddleware, async (req, res) => {
  try {
    const { submissionId, guestId } = req.params;
    const { plusOneStatus } = req.body;

    // Validate status
    if (!['approved', 'rejected', null].includes(plusOneStatus)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved", "rejected", or null' });
    }

    const result = await pool.query(
      'UPDATE guests SET plus_one_status = $1 WHERE id = $2 AND submission_id = $3',
      [plusOneStatus, guestId, submissionId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({ success: true, message: 'Plus one status updated' });
  } catch (error) {
    console.error('Error updating plus one status:', error);
    res.status(500).json({ error: 'Failed to update plus one status' });
  }
});

// Delete a submission (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM submissions WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

export default router;

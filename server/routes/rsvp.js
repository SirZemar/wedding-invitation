import { Router } from 'express';
import db from '../db/init.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// Create a new RSVP submission
router.post('/', (req, res) => {
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

    // Insert submission
    const insertSubmission = db.prepare(`
      INSERT INTO submissions (language, notes)
      VALUES (?, ?)
    `);

    const insertGuest = db.prepare(`
      INSERT INTO guests (submission_id, name, attending, is_plus_one_request)
      VALUES (?, ?, ?, ?)
    `);

    // Use transaction for data integrity
    const createSubmission = db.transaction((guests, notes, language) => {
      const result = insertSubmission.run(language, notes || null);
      const submissionId = result.lastInsertRowid;

      for (const guest of guests) {
        insertGuest.run(
          submissionId,
          guest.name.trim(),
          guest.attending ? 1 : 0,
          guest.isPlusOneRequest ? 1 : 0
        );
      }

      return submissionId;
    });

    const submissionId = createSubmission(guests, notes, language);

    res.status(201).json({
      success: true,
      submissionId,
      message: 'RSVP submitted successfully'
    });
  } catch (error) {
    console.error('Error creating RSVP:', error);
    res.status(500).json({ error: 'Failed to submit RSVP' });
  }
});

// Get all submissions (admin only)
router.get('/', authMiddleware, (req, res) => {
  try {
    const submissions = db.prepare(`
      SELECT
        s.id,
        s.created_at,
        s.language,
        s.notes,
        json_group_array(
          json_object(
            'id', g.id,
            'name', g.name,
            'attending', g.attending,
            'isPlusOneRequest', g.is_plus_one_request,
            'plusOneStatus', g.plus_one_status
          )
        ) as guests
      FROM submissions s
      LEFT JOIN guests g ON g.submission_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `).all();

    // Parse the JSON guests string
    const result = submissions.map(s => ({
      ...s,
      guests: JSON.parse(s.guests)
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Update submission notes (admin only)
router.patch('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const result = db.prepare('UPDATE submissions SET notes = ? WHERE id = ?').run(notes, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ success: true, message: 'Notes updated' });
  } catch (error) {
    console.error('Error updating notes:', error);
    res.status(500).json({ error: 'Failed to update notes' });
  }
});

// Update guest plus one status (admin only)
router.patch('/:submissionId/guest/:guestId', authMiddleware, (req, res) => {
  try {
    const { submissionId, guestId } = req.params;
    const { plusOneStatus } = req.body;

    // Validate status
    if (!['approved', 'rejected', null].includes(plusOneStatus)) {
      return res.status(400).json({ error: 'Invalid status. Must be "approved", "rejected", or null' });
    }

    const result = db.prepare(`
      UPDATE guests
      SET plus_one_status = ?
      WHERE id = ? AND submission_id = ?
    `).run(plusOneStatus, guestId, submissionId);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Guest not found' });
    }

    res.json({ success: true, message: 'Plus one status updated' });
  } catch (error) {
    console.error('Error updating plus one status:', error);
    res.status(500).json({ error: 'Failed to update plus one status' });
  }
});

// Delete a submission (admin only)
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM submissions WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('Error deleting submission:', error);
    res.status(500).json({ error: 'Failed to delete submission' });
  }
});

export default router;

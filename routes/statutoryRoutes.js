const express = require('express');
const router = express.Router();

router.post('/config', (req, res) => {
  console.log('TERMINAL LOG: Statutory saved!', req.body);
  res.json({ success: true, config: req.body });
});

router.get('/config', (req, res) => {
  console.log('Terminal: Config loaded');
  res.json({
    pf: { employee: 12, employer: 12 },
    esi: { employee: 0.75, employer: 3.25 }
  });
});

module.exports = router;

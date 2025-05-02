import express from 'express';
const router = express.Router();

router.get('/:siteid', (req, res) => {
  const { siteid } = req.params;

  const config = {
    name: "Serine AI",
    theme: "light",
    primaryColor: "#10B981",
  };

  res.json(config);
});

export default router;

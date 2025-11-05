import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { sequelize } from './db.js';
import Puppy from './models/puppies.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => res.json({ ok: true }));

app.get('/puppies', async (_req, res) => res.json(await Puppy.findAll()));
app.get('/puppies/:id', async (req, res) => {
  const puppy = await Puppy.findByPk(req.params.id);
  if (!puppy) return res.status(404).json({ error: 'Not found' });
  res.json(puppy);
});
app.post('/puppies', async (req, res) => res.status(201).json(await Puppy.create(req.body)));
app.put('/puppies/:id', async (req, res) => {
  const puppy = await Puppy.findByPk(req.params.id);
  if (!puppy) return res.status(404).json({ error: 'Not found' });
  await puppy.update(req.body);
  res.json(puppy);
});
app.delete('/puppies/:id', async (req, res) => {
  const deleted = await Puppy.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ error: 'Not found' });
  res.json({ deleted: true });
});

app.get('/__debug', async (_req, res) => {
  try {
    const [db]  = await sequelize.query("select current_database() db");
    const [tbl] = await sequelize.query("select to_regclass('public.puppies') as exists");
    const [cnt] = await sequelize.query("select count(*)::int as count from puppies");
    res.json({ database: db[0].db, puppies_table: tbl[0].exists, puppies_count: cnt[0].count });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

const PORT = process.env.PORT || 5000;

(async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
})();

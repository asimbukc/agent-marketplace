import express from 'express';
import Agent from '../models/Agent.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().limit(20);
    
    const formattedAgents = agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      image: agent.avatar,
      office: agent.office,
      role: agent.specialization
    }));

    res.json(formattedAgents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents' });
  }
});

export default router;

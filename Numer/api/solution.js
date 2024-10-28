import mongoose from 'mongoose';
import { connectToDatabase } from './_db';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    const Solution = mongoose.models.Solution;

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST, GET');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return res.status(200).end();
    }

    if (req.method === 'POST') {
      const solution = await Solution.create(req.body);
      return res.status(201).json(solution);
    }

    if (req.method === 'GET') {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const solutions = await Solution.find({ userId })
        .sort({ createdAt: -1 })
        .limit(10);
      return res.json(solutions);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
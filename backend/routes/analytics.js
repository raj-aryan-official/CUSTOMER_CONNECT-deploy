const express = require('express');
const router = express.Router();

// Get customer analytics
router.get('/customers', async (req, res) => {
  try {
    // Mock data for now
    const analytics = {
      totalCustomers: 150,
      newCustomers: 25,
      activeCustomers: 120,
      customerRetention: 85,
      customerSatisfaction: 4.5,
      monthlyGrowth: 15,
      customerSegments: {
        premium: 30,
        standard: 80,
        basic: 40
      }
    };
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get interaction analytics
router.get('/interactions', async (req, res) => {
  try {
    // Mock data for now
    const interactions = {
      totalInteractions: 500,
      averageResponseTime: 2.5,
      satisfactionScore: 4.2,
      interactionTypes: {
        email: 200,
        phone: 150,
        chat: 100,
        inPerson: 50
      },
      monthlyTrend: [
        { month: 'Jan', count: 40 },
        { month: 'Feb', count: 45 },
        { month: 'Mar', count: 50 },
        { month: 'Apr', count: 55 }
      ]
    };
    
    res.json(interactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get performance metrics
router.get('/performance', async (req, res) => {
  try {
    // Mock data for now
    const performance = {
      responseRate: 95,
      resolutionTime: 24,
      customerSatisfaction: 4.5,
      teamEfficiency: 90,
      monthlyMetrics: [
        { month: 'Jan', satisfaction: 4.2, responseTime: 2.8 },
        { month: 'Feb', satisfaction: 4.3, responseTime: 2.6 },
        { month: 'Mar', satisfaction: 4.4, responseTime: 2.4 },
        { month: 'Apr', satisfaction: 4.5, responseTime: 2.2 }
      ]
    };
    
    res.json(performance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, phone, city, locationRisk, upiId } = req.body;

    // Validation
    if (!name || !phone || !city || !locationRisk) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if MongoDB is available
    if (global.inMemoryDB) {
      // In-memory storage
      const existingUser = global.inMemoryDB.users.find(u => u.phone === phone);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this phone number already exists'
        });
      }

      const user = {
        _id: Date.now().toString(),
        name,
        phone,
        city,
        locationRisk,
        upiId: upiId || `${phone}@paytm`,
        createdAt: new Date()
      };

      global.inMemoryDB.users.push(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    }

    // MongoDB storage
    let user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this phone number already exists'
      });
    }

    user = await User.create({
      name,
      phone,
      city,
      locationRisk,
      upiId: upiId || `${phone}@paytm`
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (global.inMemoryDB) {
      const user = global.inMemoryDB.users.find(u => u._id === userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      return res.json({ success: true, data: user });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
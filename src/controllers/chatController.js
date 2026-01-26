const Message = require('../model/messageModel.js');

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.render('index', { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.saveMessage = async (username, message) => {
  try {
    const newMessage = new Message({ username, message });
    return await newMessage.save();
  } catch (err) {
    console.error('Error saving message:', err);
    throw err;
  }
};

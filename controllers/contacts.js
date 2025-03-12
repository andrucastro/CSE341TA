const mongodb = require('../db/connect');

const getAll = async (req, res, next) => {
  try {
    const db = mongodb.getDb();
    const result = await db.collection('contacts').find().toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Failed to get contacts', error });
  }
};

const getSingle = async (req, res, next) => {
  try {
    const contactId = req.params.id;  
    const result = await mongodb.getDb().collection('contacts').find({ _id: contactId });
    const contacts = await result.toArray();

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(contacts[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Failed to get contact', error });
  }
};

module.exports = { 
  getAll,
  getSingle
};

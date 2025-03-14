const mongodb = require('../db/connect');
const { ObjectId } = require('mongodb'); // Import ObjectId for ID conversion

const getAll = async (req, res) => {
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

const getSingle = async (req, res) => {
  try {
    const contactId = req.params.id;
    if (!ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: 'Invalid contact ID' });
    }

    const result = await mongodb
      .getDb()
      .collection('contacts')
      .findOne({ _id: new ObjectId(contactId) });

    if (!result) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Failed to get contact', error });
  }
};

const createContact = async (req, res) => {
  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  try {
    const response = await mongodb
      .getDb()
      .collection('contacts')
      .insertOne(contact);

    if (response.acknowledged) {
      res.status(201).json({ message: 'Contact created successfully' });
    } else {
      res.status(500).json({ message: 'Failed to create contact' });
    }
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ message: 'Failed to create contact', error });
  }
};

const updateContact = async (req, res) => {
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  const contact = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    favoriteColor: req.body.favoriteColor,
    birthday: req.body.birthday,
  };

  try {
    const response = await mongodb
      .getDb()
      .collection('contacts')
      .replaceOne({ _id: new ObjectId(contactId) }, contact);

    if (response.modifiedCount > 0) {
      res.status(200).json({ message: 'Contact updated successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found or no changes made' });
    }
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ message: 'Failed to update contact', error });
  }
};

const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  if (!ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: 'Invalid contact ID' });
  }

  try {
    const response = await mongodb
      .getDb()
      .collection('contacts')
      .deleteOne({ _id: new ObjectId(contactId) });

    if (response.deletedCount > 0) {
      res.status(200).json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ message: 'Contact not found' });
    }
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Failed to delete contact', error });
  }
};

module.exports = {
  getAll,
  getSingle,
  createContact,
  updateContact,
  deleteContact,
};

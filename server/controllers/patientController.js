import Patient from '../models/Patient.js';

const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find().select('name _id');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching patients', error });
  }
};

export { getPatients };
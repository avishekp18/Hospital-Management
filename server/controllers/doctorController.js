import Doctor from '../models/Doctor.js';

const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().select('name specialty _id');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

export { getDoctors };
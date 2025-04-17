export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    // Here, you could save to a Contact model, send an email, etc.
    console.log('Contact form submitted:', { name, email, subject, message });
    res.status(200).json({ message: 'Message received. We’ll get back to you soon!' });
  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({ message: 'Failed to process your request' });
  }
};
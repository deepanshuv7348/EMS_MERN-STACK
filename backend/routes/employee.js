const express = require('express');
const multer = require('multer');
const Employee = require('../models/Employee');

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// Create Employee
router.post('/', upload.single('image'), async (req, res) => {
  const { name, email, mobile, designation, gender, course } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      course: course.split(','),
      image: req.file.filename,  // Store the uploaded image filename
    });

    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error creating employee', error: err });
  }
});

// Get All Employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees', error: err });
  }
});

// Update Employee
router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, email, mobile, designation, gender, course } = req.body;

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        name,
        email,
        mobile,
        designation,
        gender,
        course: course.split(','),
        ...(req.file && { image: req.file.filename }), // Update image if new file is provided
      },
      { new: true }
    );

    res.status(200).json(updatedEmployee);
  } catch (err) {
    res.status(500).json({ message: 'Error updating employee', error: err });
  }
});

// Delete Employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting employee', error: err });
  }
});

module.exports = router;

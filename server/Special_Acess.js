// import { MongoClient } from "mongodb";

// // MongoDB connection URL
// const url = "mongodb://localhost:27017";
// const dbName = "hms";

// async function updateUserRole(username, newRole) {
//   const client = new MongoClient(url);

//   try {
//     await client.connect();
//     console.log("Connected to MongoDB");

//     const db = client.db(dbName);
//     const users = db.collection("users");

//     // Check if the user exists
//     const user = await users.findOne({ username: username });
//     if (!user) {
//       console.log(`User with username ${username} does not exist.`);
//       return;
//     }

//     // Update user role
//     const result = await users.updateOne(
//       { username: username },  // Find user by username
//       { $set: { role: newRole } }  // Update role field
//     );

//     if (result.modifiedCount === 0) {
//       console.log(`User role was not updated. Maybe the role is already ${newRole}`);
//     } else {
//       console.log(`User role updated to ${newRole}:`, result.modifiedCount);
//     }
//   } catch (err) {
//     console.error("Error occurred while updating user role:", err);
//   } finally {
//     await client.close();
//   }
// }

// // Call function to update user role
// updateUserRole("Smruti", "admin");

// import mongoose from 'mongoose';
// import User from './models/User.js'; // Adjust path
// import Doctor from './models/Doctor.js'; // Adjust path

// const mongoURI = 'mongodb://localhost:27017/hms';

// async function updateUserRole(username, newRole) {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log('✅ Connected to MongoDB');

//     const user = await User.findOne({ username });
//     if (!user) {
//       console.log(`❌ User "${username}" not found`);
//       return;
//     }

//     const result = await User.updateOne(
//       { username },
//       { $set: { role: newRole } }
//     );
//     if (result.modifiedCount === 0) {
//       console.log(`⚠️ Role not updated; already "${newRole}" for "${username}"`);
//     } else {
//       console.log(`✅ Updated role to "${newRole}" for "${username}"`);
//     }

//     if (newRole.toLowerCase().includes('doctor')) {
//       const existingDoctor = await Doctor.findOne({ email: user.email });
//       if (!existingDoctor) {
//         const newDoctor = new Doctor({
//           name: user.username, // Copy from user
//           specialty: 'General Practice', // Default; adjust as needed
//           contact: '555-000-0000', // Default; adjust as needed
//           email: user.email, // Copy from user
//           availability: 'Mon-Fri 9 AM - 5 PM', // Default; adjust as needed
//           userId: user._id // Link to user
//         });
//         await newDoctor.save();
//         console.log(`✅ Added "${username}" to doctors with doctorId: ${newDoctor.doctorId}`);
//       } else {
//         console.log(`⚠️ Doctor "${user.email}" already exists`);
//       }
//     }
//   } catch (err) {
//     console.error('❌ Error:', err);
//   } finally {
//     await mongoose.connection.close();
//   }
// }

// updateUserRole('Avishek', 'doctor');


import mongoose from 'mongoose';
import User from './models/User.js'; // Adjust path
import Doctor from './models/Doctor.js'; // Adjust path

// MongoDB connection URL
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hms';

async function updateUserRole(username, newRole) {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("✅ Connected to MongoDB");

    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      console.log(`❌ User with username "${username}" does not exist.`);
      return;
    }

    // Update user role
    const result = await User.updateOne(
      { username },
      { $set: { role: newRole } }
    );
    if (result.modifiedCount === 0) {
      console.log(`⚠️ User role was not updated. Maybe the role is already "${newRole}" for "${username}".`);
    } else {
      console.log(`✅ User role updated to "${newRole}" for "${username}".`);
    }

    // Check if the new role includes "doctor" (case-insensitive)
    if (newRole.toLowerCase().includes("doctor")) {
      // Check if the doctor already exists in the doctors collection
      const existingDoctor = await Doctor.findOne({ email: user.email });
      if (!existingDoctor) {
        // Create a new doctor document with "Dr." prefixed name
        const newDoctor = new Doctor({
          name: `Dr. ${user.username}`, // Prefix "Dr." to username
          specialty: 'General Practice', // Default value; adjust as needed
          contact: '555-000-0000', // Default value; adjust or prompt for input
          email: user.email, // Copy from user
          availability: 'Mon-Fri 9 AM - 5 PM', // Default value; adjust as needed
          userId: user._id // Link to the User document
        });

        await newDoctor.save(); // Save triggers the pre-save hook to generate doctorId
        console.log(`✅ User "${username}" added to doctors with name: "${newDoctor.name}" and doctorId: ${newDoctor.doctorId}`);
      } else {
        console.log(`⚠️ Doctor with email "${user.email}" already exists in the doctors collection.`);
      }
    }
  } catch (err) {
    console.error("❌ Error updating user role or adding to doctors:", err);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

// Call function to update user role
updateUserRole("Avishek", "doctor").catch(console.error);
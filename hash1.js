const bcrypt = require('bcrypt');

const verifyPassword = async () => {
    const plainPassword = "securepassword12345"; // Replace with the password you are testing
    const hashedPassword = "$2b$10$J5/JE1G2Zdg7zwTlUibRAO4opJpFNg80PUS3usVJpTQFRdNtgH3sS"; // Copy this from your database

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);

    if (isMatch) {
        console.log("Passwords match!");
    } else {
        console.log("Passwords do NOT match!");
    }
};

verifyPassword();

const bcrypt = require('bcrypt');

const hashPassword = async () => {
    const password = "securepassword12345";
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Hashed Password:", hashedPassword);
};

hashPassword();

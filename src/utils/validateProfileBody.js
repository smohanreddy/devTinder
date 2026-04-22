const validateProfileBody = (req) => {
    const allowedFields = ["firstName", "lastName", "age","gender","skills","about"];
    const isallowed = Object.keys(req.body).every((field) => allowedFields.includes(field));
    return isallowed;
};

module.exports = validateProfileBody;
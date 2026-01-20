

function validatePenCapacity(penCapacity, penType) {
    let validCapacity=true;
    if(penType === 'reproducción' && (penCapacity !== 1)) {
        validCapacity = false;
    }
    if(penType === 'engorde' && (penCapacity < 0 || penCapacity > 6)) {
        validCapacity = false;
    }
    return validCapacity;
}

function validatePenType(penType) {
    const validTypes = ['reproducción', 'engorde'];
    return validTypes.includes(penType);
}

module.exports = {
    validatePenCapacity,
    validatePenType
};
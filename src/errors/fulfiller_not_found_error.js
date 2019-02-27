class FulfillerNotFoundError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'FulfillerNotFoundError';
    }
}


module.exports = FulfillerNotFoundError;
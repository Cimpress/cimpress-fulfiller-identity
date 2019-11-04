class ForbiddenError extends Error {
    constructor(...args) {
        super(...args);
        this.name = 'ForbiddenError';
    }
}

module.exports = ForbiddenError;

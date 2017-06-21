module.exports = {
    captureAsyncFunc: function (arg, cb) {
      cb({
        addAnnotation: function () {
        },
        addMetadata: function () {
        },
        addError: function () {
        },
        close: function () {
        }
      });
    }, captureAWS: function (arg) {
      return arg;
    }
  };
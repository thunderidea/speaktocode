// Toast utility functions
let toastCallback = null;

export const registerToastCallback = (callback) => {
  toastCallback = callback;
};

export const showToast = (message, type = 'info') => {
  if (toastCallback) {
    toastCallback(message, type);
  } else {
    console.log(`Toast [${type}]: ${message}`);
  }
};

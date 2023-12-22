export const parseFirebaseSignInError = (err) => {
    let errorMessage = '';
  
    switch (err.code) {
      case 'auth/user-not-found':
        errorMessage = 'User not found.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Wrong password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Try again later.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      default:
        errorMessage = 'An unknown error occurred.';
    }
  
    return errorMessage;
  }
  
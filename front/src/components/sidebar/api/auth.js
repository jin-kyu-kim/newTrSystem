
export async function signIn(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true,
      data: "hello"
    };
  }
  catch {
    return {
      isOk: false,
      message: "Authentication failed"
    };
  }
}

export async function getUser() {
  try {
    // Send request

    return {
      isOk: true,
      data: "hello"
    };
  }
  catch {
    return {
      isOk: false
    };
  }
}



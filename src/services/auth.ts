interface SignInParams {
  email: string;
  password_hash: string;
}

interface SignUpParams {
  name: string;
  email: string;
  password_hash: string;
}

export const signIn = async ({
  email,
  password_hash,
}: SignInParams): Promise<void> => {
  try {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password_hash }),
    });

    if (!response.ok) {
      throw new Error("Sign in failed");
    }

    const data = await response.json();
    // Store the token or user data as needed
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.error("Sign in error:", error);
    throw error;
  }
};

export const signUp = async ({
  name,
  email,
  password_hash,
}: SignUpParams): Promise<void> => {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password_hash }),
    });

    if (!response.ok) {
      throw new Error("Sign up failed");
    }

    const data = await response.json();
    // Store the token or user data as needed
    localStorage.setItem("token", data.token);
  } catch (error) {
    console.error("Sign up error:", error);
    throw error;
  }
};

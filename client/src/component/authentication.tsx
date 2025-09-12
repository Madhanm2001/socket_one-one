import React, { useEffect, useState } from "react";
import axiosInstance from "../settings/axiosInstance";
import { URL } from "../settings/apiUrl";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [signInDetails, setSignInDetails] = useState({
    phoneNumber:'',
    email: "",
    password: "",
  });
  const [signInError, setSignInError] = useState({
    phoneNumber:'',
    email: "",
    password: "",
    invalid: "",
  });
  const [signUpDetails, setSignUpDetails] = useState({
    password: "",
    confirmPassword:'',
    phoneNumber: "",
    email: "",
    name: "",
  });
  const [signUpError, setSignUpError] = useState({
    password: "",
    confirmPassword:'',
    phoneNumber: "",
    email: "",
    name: "",
    invalid: "",
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const nameRegex = /^[A-Za-z\s]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  const passwordRegex = /^.{6,}$/;

  const validateSignIn = (values: { email: string; password: string }) => {
    let errors: any = {};

    if (!values.email) errors.email = "Email is required";
    else if (!emailRegex.test(values.email) && !phoneRegex.test(values.email)) {
      errors.email = "Enter a valid email or phone number";
    }

    if (!values.password) errors.password = "Password is required";
    else if (!passwordRegex.test(values.password))
      errors.password = "Password must be at least 6 characters";

    return errors;
  };

  const validateSignUp = (values: typeof signUpDetails) => {
    let errors: any = {};

    if (!values.name) errors.name = "Name is required";
    else if (!nameRegex.test(values.name))
      errors.name = "Enter a valid name (min 3 letters)";

    if (!values.email) errors.email = "Email is required";
    else if (!emailRegex.test(values.email))
      errors.email = "Enter a valid email address";

    if (!values.phoneNumber) errors.phoneNumber = "Phone number is required";
    else if (!phoneRegex.test(values.phoneNumber))
      errors.phoneNumber = "Enter valid phone number (10–15 digits)";

    if (!values.password) errors.password = "Password is required";
    else if (!passwordRegex.test(values.password))
      errors.password = "Password must be at least 6 characters";

    if (!values.confirmPassword)
      errors.confirmPassword = "Confirm password is required";
    else if (values.password !== values.confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    return errors;
  };

const onClickSignIn = async () => {
  const errors = validateSignIn(signInDetails);
  if (Object.keys(errors).length > 0) {
    setSignInError({ ...errors, invalid: "" });
    return;
  }

  try {
    const res = await axiosInstance.post(URL.user.signIn, {
      email: signInDetails.email.includes("@")
        ? signInDetails.email
        : undefined,
      phoneNumber: !signInDetails.email.includes("@")
        ? signInDetails.email
        : undefined,
      password: signInDetails.password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/");
    console.log("log",res);
  } catch (err: any) {
    setSignInError({
      email: "",
      phoneNumber:"",
      password: "",
      invalid: err.response?.data?.message || "Invalid credentials",
    });
    console.log("log",err);
    
  }
};

const onClickSignUp = async () => {
  const errors = validateSignUp(signUpDetails);
  if (Object.keys(errors).length > 0) {
    setSignUpError({ ...errors, invalid: "" });
    return;
  }

  try {
    const res = await axiosInstance.post(URL.user.signUp, signUpDetails);
    console.log("log",res);
    if(res){
      window.location.reload()
    }
  } catch (err: any) {
    console.log("log",err);
    setSignUpError({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      invalid: err.response?.data?.message || "Signup failed",
    });
  }
};


  const handleChangeSignUp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignUpDetails((ps) => ({
      ...ps,
      [name]: value,
    }));
  };

  const handleChangeSignIn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setSignInDetails((ps) => ({
      ...ps,
      [name]: value,
    }));
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background:'black',
    height:'auto',
    minHeight:'100vh'
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "black",
    boxShadow: "0px 0px 10px 2px #b8b8b8ff",
    borderRadius: "10px",
    width: "80%",
    maxWidth: "400px",
    padding: "30px 20px",
  };

  const titleStyle: React.CSSProperties = {
    color: "#c8c0c0",
    fontSize: "20px",
    textAlign: "center",
  };

  const labelStyle: React.CSSProperties = {
    color: "white",
    fontWeight: "600",
    marginBottom: "5px",
  };

  const inputStyle: React.CSSProperties = {
    border: "1px solid #ccc",
    borderRadius: "5px",
    color: "white",
    backgroundColor: "transparent",
    padding: "8px 15px",
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#005e37ff",
    color: "white",
    borderRadius: "5px",
    border: "none",
    width: "100%",
    marginTop: "20px",
    padding: "8px",
    cursor: "pointer",
  };

  const errorTextStyle: React.CSSProperties = {
    color: "red",
    fontSize: "12px",
    marginTop: "3px",
  };

  const linkStyle: React.CSSProperties = {
    textAlign: "center",
    color: "white",
    marginTop: "15px",
    cursor: "pointer",
  };

  return (
    <div style={containerStyle}>
      {!isSignUp ? (
        <section style={cardStyle}>
          <h2 style={titleStyle}>Sign-In</h2>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
            <label style={labelStyle}>email or Phone number:</label>
            <input
              type="text"
              name="email"
              value={signInDetails.email}
              onKeyDown={(e) => {
                if (e.key === "Enter") onClickSignIn();
              }}
              onChange={handleChangeSignIn}
              style={inputStyle}
            />
            <div style={errorTextStyle}>{signInError.email}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}>
            <label style={labelStyle}>password:</label>
            <input
              type="password"
              name="password"
              value={signInDetails.password}
              onKeyDown={(e) => {
                if (e.key === "Enter") onClickSignIn();
              }}
              onChange={handleChangeSignIn}
              style={inputStyle}
            />
            <div style={errorTextStyle}>{signInError.password}</div>
          </div>

          <button style={buttonStyle} onClick={onClickSignIn}>
            submit
          </button>
          <div style={{ ...errorTextStyle, textAlign: "center" }}>{signInError.invalid}</div>
          <div
            style={linkStyle}
            onClick={() => {
              setIsSignUp(true);
              setSignInError({ email: "", password: "", invalid: "" ,phoneNumber:""});
              setSignInDetails({ email: "", password: "", phoneNumber:"" });
            }}
          >
            create account
          </div>
        </section>
      ) : (
        <section style={cardStyle}>
          <h2 style={titleStyle}>Sign-up</h2>

          {["name", "email", "phoneNumber", "password","confirmPassword"].map(
            (field) => (
              <div
                key={field}
                style={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
              >
                <label style={labelStyle}>{field}:</label>
                <input
                  type={field.toLowerCase().includes("password") ? "password" : "text"}
                  name={field}
                  value={(signUpDetails as any)[field]}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onClickSignUp();
                  }}
                  onChange={handleChangeSignUp}
                  style={inputStyle}
                />
                <div style={errorTextStyle}>{(signUpError as any)[field]}</div>
              </div>
            )
          )}

          <div style={{ ...errorTextStyle, textAlign: "center" }}>{signUpError.invalid}</div>
          <button style={buttonStyle} onClick={onClickSignUp}>
            submit
          </button>
          <div
            style={linkStyle}
            onClick={() => {
              setIsSignUp(false);
              setSignUpError({
                password: "",
                confirmPassword:'',
                phoneNumber: "",
                email: "",
                name: "",
                invalid: "",
              });
              setSignUpDetails({
                password: "",
                phoneNumber: "",
                confirmPassword:'',
                email: "",
                name: "",
              });
            }}
          >
            sign-in
          </div>
        </section>
      )}
    </div>
  );
};

export default Auth;

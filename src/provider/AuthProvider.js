import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, setPersistence, signInWithRedirect, inMemoryPersistence, GoogleAuthProvider } from "firebase/auth";

const AuthContext = createContext();
const AuthProvider = (props) => {
  const auth = getAuth();
  // user null = loading
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const date = Date.now();
  // const milisecond = date.getMilliseconds();

  useEffect(() => {
    // setPersistence(auth, inMemoryPersistence)
    // .then(() => {
    //   const provider = new GoogleAuthProvider();
    //   // In memory persistence will be applied to the signed in Google user
    //   // even though the persistence was set to 'none' and a page redirect
    //   // occurred.
    //   return signInWithRedirect(auth, provider);
    // })
    // .catch((error) => {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    // });
    checkLogin();
  }, []);

  

  function checkLogin() {
    onAuthStateChanged(auth, (u) => {
      if (u) {
        console.log(u);
        setUser(true);
        console.log(date)
        // getUserData();
        if (u.email === "admin@gmail.com") {
          setUser('admin');
          setAdmin(true);
        }
      } else {
        setAdmin(false);
        setUser(false);
        // setUserData(null);
      }
    });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        admin
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Body from "./components/Body/Body.jsx";
import Profile from "./components/Profile/Profile.jsx";
import View from "./components/View/View.jsx";
import SignIn from "./components/SignIn/SignIn.jsx";
import SignUp from "./components/SignUp/SignUp.jsx";
import Logout from "./components/Logout/Logout.jsx";
import App from "./App.jsx";
// import { ThemeProvider, createTheme } from "@mui/material/styles";
// import CssBaseline from "@mui/material/CssBaseline";

export default function Index() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [themeMode, setThemeMode] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
      document.body.classList.remove('light-mode', 'dark-mode');
      document.body.classList.add(`${themeMode}-mode`);
      localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  const toggleTheme = () => {
    console.log(themeMode)
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // const theme = createTheme({
  //   palette: { mode: themeMode },
  // });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      async function checkSignedIn(token) {
        try {
          const response = await fetch("https://blog-backend-production-6422.up.railway.app/login/check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status !== 200) {
            return;
          }

          setIsSignedIn(true);
        } catch (error) {
          console.error("Error:", error);
        }
      }

      checkSignedIn(token);
    }
  }, []);

  const handleLogin = () => setIsSignedIn(true);
  const handleLogout = () => setIsSignedIn(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <App isSignedIn={isSignedIn} toggleTheme={toggleTheme} themeMode={themeMode} />,
      children: [
        { index: true, element: <Body /> },
        { path: "posts", element: <Body /> },
        { path: "profile", element: <Profile /> },
        { path: "view/:id/:author", element: <View isSignedIn={isSignedIn} /> },
        { path: "logout", element: <Logout onLogout={handleLogout} /> },
      ],
    },
    {
      path: "/sign-in",
      element: <SignIn onLogin={handleLogin} />,
    },
    {
      path: "/sign-up",
      element: <SignUp />,
    },
  ]);

  return (
    // <ThemeProvider theme={theme}>
    //   <CssBaseline />
      <RouterProvider router={router} />
    // </ThemeProvider>
  );
}

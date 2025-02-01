import { useState, useEffect } from 'react'
import { Outlet } from "react-router-dom";
import Header from './components/Header/Header';
import './App.css'
import PropTypes from "prop-types";

function App({ isSignedIn, toggleTheme, themeMode }) {

  const [user, setuser] = useState(null)

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const token = localStorage.getItem("token");
      async function checkSignedIn(token) {
        try {
          const response = await fetch('https://blog-backend-production-6422.up.railway.app/login/check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });

          if (response.status != 200) { //invalid token decoded
            return
          }
          //token decoded successfully
          let data = await response.json();
          setuser(data)
        }
        catch (error) {
          console.error('Error:', error);
        }

      }

      checkSignedIn(token)
    }

  }, [])

  return (
    <>
      <Header isSignedIn={isSignedIn} user={user} toggleTheme={toggleTheme} themeMode={themeMode}></Header>
      <Outlet />
    </>
  )
}


App.propTypes = {
  isSignedIn: PropTypes.bool,
  toggleTheme: PropTypes.func.isRequired,
  themeMode: PropTypes.string.isRequired,
}
export default App

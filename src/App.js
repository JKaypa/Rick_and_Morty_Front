import Cards from "./components/Cards/Cards";
import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Nav from "./components/NavBar/Nav";
import About from "./components/About/About";
import Detail from "./components/Detail/Detail";
import Form from "./components/Form/Form";
import Favorites from "./components/Favorites/Favorites";
import { getFav } from "./redux/actions";
import { useDispatch } from "react-redux";
import axios from "axios";



const regEmail =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const regPass = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/

function App() {
  let [characters, setCharacters] = useState([]);
  let [alwaysSameChars, setAlwaysSameChars] = useState([]);
  let [_render, setRender] = useState("");
  let [id, setId] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const onChange = (event) => {
    let id = event.target.value;
    setId(id);
  };

  async function onSearch(charId, event) {
    if (event.target.value === "click") {
      try {
        let random = Math.round(Math.random() * 864);
        const { data } = await axios(
          `/character/${random}`
        );
        let exist = characters.find((char) => char.id === data.id);
        if (exist) return alert("This character exists already");
        setCharacters([...characters, data]);
        setAlwaysSameChars([...alwaysSameChars, data]);
      } catch (error) {
        window.alert("Character does not exist");
      }
    } else if (event.key === "Enter") {
      try {
        setId("");
        const { data } = await axios(
          `/character/${charId}`
        );
        let exist = characters.find((char) => char.id === data.id);
        if (exist) return alert("This character exists already");
        setCharacters([...characters, data]);
        setAlwaysSameChars([...alwaysSameChars, data]);
      } catch (error) {
        window.alert("Character does not exist");
      }
    }
  }

  useEffect(() => {
    async function hundred() {
      const { data } = await axios(
        "/allCharacters"
      );
      setCharacters(data);
      setAlwaysSameChars(data);
    }
    hundred();
  }, []);

  useEffect(() => {
    dispatch(getFav());
  }, []);

  console.log(characters);

  const login = (user) => {
    regEmail.test(user.email) &&
      regPass.test(user.password) &&
      navigate("/home");
  };

  const handleGender = (event) => {
    let gender = event.target.value;
    if (gender) {
      if (gender === "All") {
        setCharacters(alwaysSameChars);
      } else {
        setCharacters(alwaysSameChars.filter((char) => char.gender === gender));
      }
    }
    setRender(gender);
  };

  const handleOrder = (event) => {
    let order = event.target.value;
    if (order === "upward") {
      setCharacters(
        characters.sort((a, b) => {
          return a.id - b.id;
        })
      );
      setAlwaysSameChars(
        alwaysSameChars.sort((a, b) => {
          return a.id - b.id;
        })
      );
    } else if (order === "downward") {
      setCharacters(
        characters.sort((a, b) => {
          return b.id - a.id;
        })
      );
      setAlwaysSameChars(
        alwaysSameChars.sort((a, b) => {
          return b.id - a.id;
        })
      );
    }
    setRender(order);
  };

  const onClose = (id) => {
    setCharacters(characters.filter((char) => char.id !== id));
    setAlwaysSameChars(alwaysSameChars.filter((char) => char.id !== id));
  };

  return (
    <div>
      {location.pathname !== "/" && (
        <Nav onSearch={onSearch} onChange={onChange} id={id} />
      )}
      <Routes>
        <Route path="/" element={<Form login={login} />} />
        <Route path="about" element={<About />} />
        <Route
          path="home"
          element={
            <Cards
              handleGender={handleGender}
              handleOrder={handleOrder}
              onClose={onClose}
              characters={characters}
            />
          }
        />
        <Route path="detail/:id" element={<Detail />} />
        <Route path="favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;

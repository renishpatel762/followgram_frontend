import Navbar from "../components/Navbar";
import "../styles/globals.css";
import { useState, createContext, useReducer, useContext, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useSpeechSynthesis } from "react-speech-kit";
import { reducer, initialState } from './reducers/userReducers'

export const UserContext = createContext();

function MyApp({ Component, pageProps }) {
  // const localuser=JSON.parse(localStorage.getItem("user"));
  const router = useRouter();
  const [text, setText] = useState("");
  const [photoPost, setPhotoPost] = useState(true);
  const [postFilter, setPostFilter] = useState("all");
  const [previousPostFilter, setPreviousPostFilter] = useState("all");
  const [date1, setDate1] = useState(null);
  const [date2, setDate2] = useState(null);
  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis();
  // const user=localStorage.getItem("user");
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(()=>{
    const localuser=JSON.parse(localStorage.getItem("user"));
    // console.log("Hey on refresh local user is",localuser);
    if(localuser){
      dispatch({type:"USER",payload:localuser});
      // console.log(localuser);
    }else{
      // console.log("router is",router);
    }
  },[])

  const logoutUser = () => {
    if (speaking) {
      cancel();
    }
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/welcome");
  };

  return (
      <NextUIProvider>
        <UserContext.Provider value={[state, dispatch]}>
        <Navbar
          logoutUser={logoutUser}
          cancel={cancel}
          speaking={speaking}
          supported={supported}
          photoPost={photoPost}
          setPhotoPost={setPhotoPost}
          postFilter={postFilter}
          setPostFilter={setPostFilter}
          previousPostFilter={previousPostFilter}
          setPreviousPostFilter={setPreviousPostFilter}
          date1={date1}
          setDate1={setDate1}
          date2={date2}
          setDate2={setDate2}
        />
        <Component
          {...pageProps}
          speak={speak}
          cancel={cancel}
          speaking={speaking}
          supported={supported}
          voices={voices}
          photoPost={photoPost}
          postFilter={postFilter}
          previousPostFilter={previousPostFilter}
          date1={date1}
          date2={date2}
        />
        </UserContext.Provider>
      </NextUIProvider>
  );
}

export default MyApp;

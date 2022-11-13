import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Verify() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  //   const [email , setEmail] = useState(router.query.email);
  const { email } = router.query;
  useEffect(() => {
    if (!router.asPath.includes('email=') && !router.asPath.includes('@')) {
      router.push('/welcome');
    }
  }, []);

  const handleEnter = (event) => {
    if(event.keyCode == 13){
      handleSubmit();
    }
  }

  const handleSubmit = async () => {
    if (otp.length === 6) {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          otp,
          email
        }),
      }).then((response) => response.json());
      console.log("res is",res);
      if (res.success) {
        toast.success("Your account is verified..Thank you", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        // localStorage.removeItem("email");
        localStorage.setItem("token",res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
        router.push("/profile");
      }else{
        toast.error("Invalid otp try again.", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } else {
      toast.error("otp must be of 6 digits.", {
        position: "top-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="min-h-screen py-2 dark:text-white dark:bg-gray-800">
      <Head>
        <title>Verify - Followgram</title>
        <meta
          name="description"
          content="Followgram share posts & text with your friend"
        />
      </Head>
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="flex h-[70vh] justify-center items-center">
        <div className="w-full max-w-md mx-auto px-2">
          <h1 className="text-center my-3 text-2xl">Verify Your Account</h1>
          <h1 className="text-center my-3 text-2xl">Email : {email}</h1>
          <label
            className="block text-gray-700 text-lg font-bold mb-2"
            htmlFor="otp"
          >
            Enter OTP
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 leading-tight focus:outline-none focus:shadow-outline"
            id="otp"
            name="otp"
            type="text"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            onKeyUp={handleEnter}
            placeholder="Enter OTP here"
          />
          <div className="my-4 text-center">
            <button
              className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400"
              onClick={handleSubmit}
            >
              Verify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

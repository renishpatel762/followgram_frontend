import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BiMessageAdd, BiLogOut, BiSearch } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { Tooltip } from "@nextui-org/react";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineHome,
} from "react-icons/ai";
import { IoPersonAddOutline, IoSettings } from "react-icons/io5";

export default function Navbar({
  logoutUser,
  cancel,
  speaking,
  supported,
  photoPost,
  setPhotoPost,
  postFilter,
  setPostFilter,
  previousPostFilter,
  setPreviousPostFilter,
  date1,
  setDate1,
  date2,
  setDate2,
}) {
  const router = useRouter();
  const [imageName, setImageName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    // console.log(router.pathname);
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      setImageName(parsedUser.pic);
    }

    if (supported && speaking) {
      cancel();
    }
    setShowMenu(false);
  }, [router.pathname]);

  useEffect(() => {
    if (postFilter === "between_two_dates") {
      setShowModal(true);
    } else if (showModal) {
      setShowModal(false);
    }
  }, [postFilter]);

  return (
    <div className="sticky top-0 z-20">
      <nav className="bg-gray-300 text-gray-700 border-gray-200 px-2 sm:px-4 py-2.5 dark:bg-gray-900 dark:text-gray-400">
        <div className="flex flex-wrap justify-between items-center mx-auto">
          <Link href={"/"}>
            <a className="flex items-center">
              {/* <Image src={logo} height={10} width={200}/> */}
              <span className="self-center text-xl font-semibold whitespace-nowrap hover:text-black dark:hover:text-white">
                Followgram
              </span>
            </a>
          </Link>
          <div className="flex items-center md:order-2">
            {/* <button
              type="button"
              className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="user-dropdown"
              data-dropdown-placement="bottom"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button> */}
            {/* {![
              "/signup",
              "/verify",
              "/",
              "/profile",
              "/createpost",
              "/profile/[userId]",
            ].includes(router.pathname) && (
              <Link href={"/signup"}>
                <a className="text-white mx-2.5 dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
                  Signup
                </a>
              </Link>
            )} */}
            {![
              "/login",
              "/profile",
              "/",
              "/createpost",
              "/search",
            "/explore",
              "/profile/[userId]",
              "/profile/setting"
            ].includes(router.pathname) && (
              <Link href={"/login"}>
                <a className="mx-5 text-black dark:text-white dark:border-white border-black border-2 py-1 px-2 rounded-md hover:border-blue-400 hover:text-blue-400">
                  Login
                </a>
              </Link>
            )}

            {/* {![
              "/login",
              "/signup",
              "/verify",
              "/createpost",
              "/welcome",
            ].includes(router.pathname) && (
              <Tooltip
                placement="bottom"
                contentColor="default"
                color="primary"
                content="New Post"
              >
                <Link href={"/createpost"}>
                  <a className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400">
                    <BiMessageAdd />
                  </a>
                </Link>
              </Tooltip>
            )} */}

            {/* {!["/login", "/signup", "/verify", "/welcome"].includes(
              router.pathname
            ) && (
              <Tooltip
                placement="bottom"
                contentColor="default"
                color="primary"
                content="Logout"
              >
                <a
                  className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400"
                  onClick={logoutUser}
                >
                  <BiLogOut />
                </a>
              </Tooltip>
            )} */}

            {/* {!["/login", "/signup", "/verify", "/profile", "/welcome"].includes(
              router.pathname
            ) && (
              <Tooltip
                placement="bottom"
                contentColor="default"
                color="primary"
                content="Profile"
              >
                <Link href={"/profile"}>
                  <a className="text-white text-2xl mx-2 py-1 px-1 rounded-md hover:text-blue-400">
                    <CgProfile />
                  </a>
                </Link>
              </Tooltip>
            )} */}

            {!showMenu && (
              <Tooltip
                placement="bottom"
                contentColor="default"
                color="primary"
                content="Menu"
              >
                <span
                  className="text-2xl mr-2 hover:text-black dark:hover:text-white"
                  onClick={() => {
                    setShowMenu(true);
                  }}
                >
                  <AiOutlineMenuFold />
                </span>
              </Tooltip>
            )}

            {/* <div className="z-50 my-4 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 block" id="user-dropdown" data-popper-reference-hidden="" data-popper-escaped="" data-popper-placement="bottom" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(476px, 76px, 0px);">
        <div className="py-3 px-4">
          <span className="block text-sm text-gray-900 dark:text-white">Bonnie Green</span>
          <span className="block text-sm font-medium text-gray-500 truncate dark:text-gray-400">name@flowbite.com</span>
        </div>
        <ul className="py-1" aria-labelledby="user-menu-button">
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Dashboard</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Earnings</a>
          </li>
          <li>
            <a href="#" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</a>
          </li>
        </ul>
      </div> */}
            {/* <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
        <span className="sr-only">Open main menu</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button> */}
          </div>
          {/* <div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
    <ul className="flex flex-col p-4 mt-4 bg-gray-50 rounded-lg border border-gray-100 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" aria-current="page">Home</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Services</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
      </li>
      <li>
        <a href="#" className="block py-2 pr-4 pl-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div> */}
        </div>
      </nav>
      {/* {showMenu && <div className="absolute right-0 top-0">Hello</div>} */}
      {/* {showMenu && ( */}

      <div
        className={`absolute top-0 transition-all duration-500 ${
          showMenu
            ? "right-0"
            : "-right-[75vw] md:-right-[30vw] lg:-right-[20vw]"
        } h-[100vh] scrollbar_hide overflow-auto w-[75vw] lg:w-[20vw] md:w-[30vw] dark:bg-gray-600 dark:text-white text-black bg-gray-300`}
      >
        <span className="flex text-2xl pt-3 pl-3">
          <AiOutlineMenuUnfold
            className="cursor-pointer"
            onClick={() => {
              setShowMenu(false);
            }}
          />
          {currentUser && <p className="pl-3">{currentUser.name}</p>}
        </span>
        <div className="pt-1 pl-3">

          {/* Home */}
          {!["/login", "/signup", "/verify", "/welcome" , "/"].includes(
            router.pathname
          ) && (
            <Tooltip
              placement="left"
              contentColor="default"
              color="primary"
              content="Home"
            >
              <Link href={"/"}>
                <a className="flex text-2xl py-1 rounded-md hover:text-blue-400">
                  <AiOutlineHome /> <p className="pl-3">Home</p>
                </a>
              </Link>
            </Tooltip>
          )}

          {/* profile */}
          {!["/login", "/signup", "/verify", "/profile", "/welcome"].includes(
            router.pathname
          ) && (
            <Tooltip
              placement="left"
              contentColor="default"
              color="primary"
              content="Profile"
            >
              <Link href={"/profile"}>
                <a className="flex text-2xl py-1 rounded-md hover:text-blue-400">
                  <CgProfile /> <p className="pl-3">Profile</p>
                </a>
              </Link>
            </Tooltip>
          )}

          

          {/* register */}
          {![
            "/signup",
            "/verify",
            "/",
            "/profile",
            "/createpost",
            "/search",
            "/explore",
            "/profile/[userId]",
          ].includes(router.pathname) && (
            <Link href={"/signup"}>
              <a className="flex py-1 hover:text-blue-400">
                <IoPersonAddOutline /> <p className="pl-3">Signup</p>
              </a>
            </Link>
          )}

          {/* createpost */}
          {![
            "/login",
            "/signup",
            "/verify",
            "/createpost",
            "/welcome",
          ].includes(router.pathname) && (
              <Tooltip
                placement="bottom"
                contentColor="default"
                color="primary"
                content="New Post"
              >
                <Link href={"/createpost"}>
                  <a className="flex text-2xl py-1 rounded-md hover:text-blue-400">
                    <BiMessageAdd /> <p className="pl-3">Create Post</p>
                  </a>
                </Link>
              </Tooltip>
            )}

          {/* //search done by galaxy */}
          {![
            "/login",
            "/signup",
            "/verify",
            "/createpost",
            "/welcome",
            "/search"
          ].includes(router.pathname) && (
            <Tooltip
              placement="bottom"
              contentColor="default"
              color="primary"
              content="Exlpore"
            >
              <Link href={"/search"}>
                <a
                  className="flex text-2xl py-1 rounded-md hover:text-blue-400"
                  onClick={() => {}}
                >
                  <BiSearch /> <p className="pl-3">Explore</p>
                </a>
              </Link>
            </Tooltip>
          )}

          {/* imagepost or textpost */}
          {["/"].includes(router.pathname) && (
            <div className="my-3">
              <p>Select Post type</p>
              <div className="flex items-center mb-1 ml-4 mt-2">
                <input
                  id="imagePost"
                  type="radio"
                  value=""
                  name="post-radio"
                  checked={photoPost}
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPhotoPost(true);
                    setShowMenu(false);
                  }}
                />
                <label htmlFor="imagePost" className="ml-2 text-sm font-medium">
                  Image Posts
                </label>
              </div>
              <div className="flex items-center ml-4">
                <input
                  checked={!photoPost}
                  id="textPost"
                  type="radio"
                  value=""
                  name="post-radio"
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPhotoPost(false);
                    setShowMenu(false);
                  }}
                />
                <label htmlFor="textPost" className="ml-2 text-sm font-medium">
                  Text Posts
                </label>
              </div>
            </div>
          )}

          {/* Filter */}
          {["/"].includes(router.pathname) && (
            <div className="mt-3">
              <p>Filter</p>
              <div className="flex items-center mb-1 ml-4 mt-2">
                <input
                  id="all"
                  type="radio"
                  value=""
                  name="filter-radio"
                  checked={postFilter === "all"}
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPreviousPostFilter(postFilter);
                    setPostFilter("all");
                    setShowMenu(false);
                  }}
                />
                <label htmlFor="all" className="ml-2 text-sm font-medium">
                  All
                </label>
              </div>
              <div className="flex items-center mb-1 ml-4">
                <input
                  checked={postFilter === "today"}
                  id="today"
                  type="radio"
                  value=""
                  name="filter-radio"
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPreviousPostFilter(postFilter);
                    setPostFilter("today");
                    setShowMenu(false);
                  }}
                />
                <label htmlFor="today" className="ml-2 text-sm font-medium">
                  Today
                </label>
              </div>
              <div className="flex items-center mb-1 ml-4">
                <input
                  checked={postFilter === "last_week"}
                  id="lastWeek"
                  type="radio"
                  value=""
                  name="filter-radio"
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPreviousPostFilter(postFilter);
                    setPostFilter("last_week");
                    setShowMenu(false);
                  }}
                />
                <label htmlFor="lastWeek" className="ml-2 text-sm font-medium">
                  Last Week
                </label>
              </div>
              <div className="flex items-center mb-1 ml-4">
                <input
                  checked={postFilter === "last_30_days"}
                  id="last30days"
                  type="radio"
                  value=""
                  name="filter-radio"
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPreviousPostFilter(postFilter);
                    setPostFilter("last_30_days");
                    setShowMenu(false);
                  }}
                />
                <label
                  htmlFor="last30days"
                  className="ml-2 text-sm font-medium"
                >
                  Last 30 days
                </label>
              </div>
              <div
                className={`flex items-center ml-4 ${
                  showModal ? "mb-1" : "mb-4"
                }`}
              >
                <input
                  checked={postFilter === "between_two_dates"}
                  id="betweeonTwoDates"
                  type="radio"
                  value=""
                  name="filter-radio"
                  className="w-4 h-4 text-blue-300 bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                  onChange={() => {
                    setPreviousPostFilter(postFilter);
                    setPostFilter("between_two_dates");
                  }}
                />
                <label
                  htmlFor="betweeonTwoDates"
                  className="ml-2 text-sm font-medium"
                >
                  Betweeon Two Dates
                </label>
              </div>
            </div>
          )}

          {/* modal */}
          {showModal && (
            <div className={`pb-4 ml-5`}>
              <div className="mt-2">
                <p className="text-xs ml-5">Please select valid dates</p>
                <div>
                  <p>From</p>
                  <input
                    type="date"
                    className="cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setDate1(e.target.value);
                    }}
                  />
                </div>
                <div className="pb-2">
                  <p>To</p>
                  <input
                    type="date"
                    className="cursor-pointer bg-transparent"
                    onChange={(e) => {
                      setDate2(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="mt-3 pb-2">
                <button
                  type="button"
                  onClick={() => {
                    // setShowModal(false);
                    setDate1(null);
                    setDate2(null);
                    setPostFilter(previousPostFilter);
                  }}
                  className="border-2 border-gray-800 px-3 py-1 rounded-md bg-transparent hover:bg-white hover:text-black"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* logout */}
          {!["/login", "/signup", "/verify", "/welcome"].includes(
            router.pathname
          ) && (
            <Tooltip
              placement="left"
              contentColor="default"
              color="primary"
              content="Logout"
            >
              <a
                className="flex text-2xl py-1 rounded-md hover:text-blue-400"
                onClick={() => {
                  setCurrentUser(null);
                  logoutUser();
                }}
              >
                <BiLogOut /> <p className="pl-3">Logout</p>
              </a>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

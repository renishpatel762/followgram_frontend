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
          </div>
        </div>
      </nav>
      <div
        className={`absolute top-0 transition-all duration-500 ${
          showMenu
            ? "right-0 opacity-100"
            : "-right-[75vw] opacity-0 md:-right-[30vw] lg:-right-[20vw]"
        } h-[100vh] scrollbar_hide  overflow-auto w-[75vw] lg:w-[20vw] md:w-[30vw] dark:bg-gray-600 dark:text-white text-black bg-gray-300`}
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
                {/* <p className="text-xs ml-5">Please select valid dates</p> */}
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

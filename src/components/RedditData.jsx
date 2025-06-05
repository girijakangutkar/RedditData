import React, { useEffect, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { AiFillRedditCircle } from "react-icons/ai";
import { ImNewTab } from "react-icons/im";
import { IoMedalOutline } from "react-icons/io5";
import { SpinnerDiamond } from "spinners-react";
import { FaSearch } from "react-icons/fa";
import { FaLightbulb } from "react-icons/fa";

function RedditData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTruncate, setIsTruncate] = useState({});
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme === "dark");
    }
  }, []);

  const url = import.meta.env.VITE_URI;
  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch(`${url}`);
      const jsonData = await response.json();
      setData(jsonData.data?.children || []);
    } catch (error) {
      console.error("Error occurred:", error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const decodeHTML = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.documentElement.textContent;
  };

  // const handleToggle = (postId) => {
  //   setIsTruncate((prevState) => ({
  //     ...prevState,
  //     [postId]: !prevState[postId],
  //   }));
  // };

  function searchIt() {
    return data.filter((ele) =>
      ele.data.title.toLowerCase().includes(search.toLowerCase())
    );
  }

  function toggleTheme() {
    const newTheme = !theme;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  }

  return (
    <div
      className={`${
        theme ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } w-96 sm:w-200 md:w-240 lg:w-302 xl:w-360 2xl:w-380 min-h-screen`}
    >
      {loading && (
        <div className="flex items-center justify-center w-100 h-screen 2xl:mx-75">
          <SpinnerDiamond
            size={70}
            thickness={135}
            speed={100}
            color="rgba(58, 57, 172, 1)"
            secondaryColor="rgba(0, 0, 0, 0.44)"
            className="w-64 h-64"
          />
        </div>
      )}
      {error && (
        <div className="flex items-center justify-center w-100 h-screen 2xl:mx-75">
          <p className="text-2xl text-red-500">Error: {error.message}</p>
        </div>
      )}
      {data && (
        // <div className="w-full">
        <>
          <div
            className={` ${
              theme ? "bg-gray-800 text-white" : "bg-gray-300 text-black"
            }, flex justify-between items-center w-95 md:w-240 lg:w-300 xl:w-360 2xl:w-380`}
          >
            <div className="justify-left w-70 p-2 ml-3 2xl:ml-20 sm:w-100 md:w-300 lg:w-320 xl:w-360 2xl:w-250 relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${
                  theme ? "text-black" : "text-white"
                }, border p-2 pl-10 rounded-2xl w-70`}
                placeholder="Search for reddit post"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            <div className="mr-5 xl:mr-10 2xl:mr-10">
              <button onClick={toggleTheme}>
                {theme ? (
                  <FaLightbulb color={"gray"} size={20} />
                ) : (
                  <FaLightbulb color={"yellow"} size={20} />
                )}
              </button>
            </div>
          </div>
          <div className="border grid mt-10 m-1 sm:grid-cols-1 sm:w-100 sm:mx-0 lg:grid-cols-3 lg:w-300 lg:mx-2 md:grid-cols-2 md:w-240 md:mx:20 xl:grid-cols-3 xl:w-350 xl:mx-5 2xl:grid-cols-3 2xl:w-350 2xl:mx-20 ">
            {searchIt().map((ele) => {
              const postId = ele.data.id;
              const Text = decodeHTML(ele.data.selftext_html);
              const maxLength = 300;
              const truncatedText =
                Text.length > maxLength
                  ? Text.substring(0, maxLength) + "..."
                  : Text;
              const isPostTruncated = isTruncate[postId] ?? true;

              return (
                <div
                  key={postId}
                  className={`${
                    theme
                      ? "bg-gray-800 text-gray-300 border-black"
                      : "bg-gray-100 text-gray-800 border-black"
                  }, justify-center h-auto w-90 m-3 mb-10 p-10 border rounded-xl ring sm:w-lg md:w-md lg:w-sm xl:w-md 2xl:w:2xl`}
                >
                  <h1 className="font-bold text-2xl w-full">
                    {ele.data.title}
                  </h1>
                  <div className="flex items-center">
                    {ele.data.thumbnail && ele.data.thumbnail !== "self" ? (
                      <img
                        src={ele.data.thumbnail}
                        alt="Thumbnail"
                        className="border rounded-full w-10 h-10 m-2 mt-4"
                      />
                    ) : (
                      <AiFillRedditCircle className="w-10 h-10 m-2 text-red-500" />
                    )}
                    <p className="font-bold text-lg ml-2 mt-1">
                      {ele.data.author_fullname}
                    </p>
                  </div>
                  <div className="flex flex-row justify-between my-2">
                    <div className="flex flex-row">
                      <IoMedalOutline size={20} className="mt-1" />
                      <p className="ml-3">{ele.data.score}</p>
                    </div>
                    <a
                      href={ele.data.url}
                      className="py-2 text-sm flex items-center text-blue-500"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ImNewTab className="mr-1" /> Go to
                    </a>
                  </div>

                  {ele.data.selftext_html && (
                    <>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: isPostTruncated && truncatedText,
                        }}
                        className={`${
                          theme ? "text-gray-700" : "text-gray-900"
                        }, text-justify overflow-auto`}
                      />
                      {/* {Text.length > maxLength && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggle(postId);
                    }}
                    className="mt-2 flex items-center p-1 text-blue-500"
                  >
                    {isPostTruncated ? <MdExpandMore /> : <MdExpandLess />}
                    <span className="ml-1">
                      {isPostTruncated ? "Show More" : "Show Less"}
                    </span>
                  </button>
                )} */}
                      {Text.length > maxLength && (
                        <p className="text-red-300 text-sm my-2">
                          [ Please click on "go to" button to read all ]
                        </p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default RedditData;

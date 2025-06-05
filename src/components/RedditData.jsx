import React, { useEffect, useState } from "react";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import { AiFillRedditCircle } from "react-icons/ai";
import { ImNewTab } from "react-icons/im";
import { IoMedalOutline } from "react-icons/io5";
import { SpinnerDiamond } from "spinners-react";

function RedditData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTruncate, setIsTruncate] = useState({});

  useEffect(() => {
    fetchData();
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

  return (
    <div className="w-100 my-0 p-3 bg-gray-200 sm:mx-5 md:mx-15 lg:mx-30 xl:mx-40 2xl:mx-60">
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
      {data.map((ele) => {
        const postId = ele.data.id;
        const Text = decodeHTML(ele.data.selftext_html);
        const maxLength = 300;
        const truncatedText =
          Text.length > maxLength ? Text.substring(0, maxLength) + "..." : Text;
        const isPostTruncated = isTruncate[postId] ?? true;

        return (
          <div
            key={postId}
            className="justify-center border mx-5 mb-10 p-10 bg-gray-800 text-gray-300 rounded-xl ring sm:w-6xl md:w-xl lg:w-2xl xl:w-5xl 2xl:w-5xl 2xl:p-10"
          >
            <h1 className="font-bold text-2xl w-full">{ele.data.title}</h1>
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
                  className="text-gray-400 text-justify overflow-auto"
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
  );
}

export default RedditData;

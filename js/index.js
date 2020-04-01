const API_KEY = "AIzaSyBhWg3HRbaP3pxJcmMLxx9lQLQv6DdWnXE";

const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&maxResults=10`;

let nextPageToken = "";
let prevPageToken = "";
let currentSearch = "";

const makeFetch = url => {
  const options = {
    method: "GET",
    referrer: "https://arturotorresc.github.io/youtube-app/"
  };
  fetch(url, options)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Error while fetching page...");
    })
    .then(resJson => {
      displayVideos(resJson, url);
    })
    .catch(err => {
      console.log(err.message);
    });
};

const handlePages = () => {
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  nextButton.addEventListener("click", () => {
    makeFetch(currentSearch + nextPageToken);
  });
  prevButton.addEventListener("click", () => {
    makeFetch(currentSearch + prevPageToken);
  });
};

const displayVideos = videos => {
  const results = document.querySelector("main > div.results");
  results.innerHTML = "";
  const noResults = document.querySelector("main > div.no-results");
  if (noResults) {
    noResults.remove();
  }
  if (videos.nextPageToken) {
    nextPageToken = `&pageToken=${videos.nextPageToken}`;
  }
  if (videos.prevPageToken) {
    prevPageToken = `&pageToken=${videos.prevPageToken}`;
  }
  for (const video of videos.items) {
    results.innerHTML += `
      <div class="video-item">
        <a href="https://www.youtube.com/watch?v=${video.id.videoId}" target="blank">
          <div class="video-desc">
            <img alt="${video.snippet.title}" src="${video.snippet.thumbnails.medium.url}">
            <h4>${video.snippet.title}</h4>
          </div>
        </a>
      </div>
    `;
  }
};

const fetchVideos = query => {
  if (query === "") {
    window.alert("Type something in the search bar.");
    return;
  }
  const search = url + `&q=${query}`;
  currentSearch = search;
  makeFetch(search);
  const pagesButtons = document.querySelector(".page-container");
  pagesButtons.className = "page-container";
};

const handleClick = () => {
  const searchForm = document.getElementById("search-form");
  searchForm.addEventListener("submit", event => {
    const searchBar = document.getElementById("search-bar");
    const query = searchBar.value;
    fetchVideos(query);
    event.preventDefault();
  });
};

function init() {
  handleClick();
  handlePages();
}

window.onload = () => {
  init();
};

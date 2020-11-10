let rockArtists = [
  "queen",
  "u2",
  "thepolice",
  "eagles",
  "thedoors",
  "oasis",
  "thewho",
  "bonjovi",
];

let popArtists = [
  "maroon5",
  "coldplay",
  "onerepublic",
  "jamesblunt",
  "katyperry",
  "arianagrande",
];

let hipHopArtists = ["eminem", "snoopdogg", "lilwayne", "drake", "kanyewest"];

const albumCard = (songInfo) => {
  return `
          <div class="col text-center" id=${songInfo.id}>
          
            <a href="/album_page.html?id=${songInfo.album.id}"> <img class="img-fluid" src=${songInfo.album.cover_medium} alt="img of ${songInfo.artist.name}"/></a>
              <p> <a href="/album_page.html?id=${songInfo.album.id}">Album: "${songInfo.album.title}"</a>
              <br>
              <a href="/artist_page.html?artistId=${songInfo.artist.id}">Artist: "${songInfo.artist.name}"</a>
              </p>
          </div>
        `;
};

let query = "metallica";

const handleSearchQuery = (e) => {
  query = e.target.value;
};

const headers = new Headers({
  "x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
  "x-rapidapi-key": "4013e328ffmsh3feb54311ce7296p1c3cc4jsnd3ad09e0821d",
});

const search = (q = query, firstLoad = false) => {
  fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + q, {
    method: "GET",
    headers,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((songs) => {
      const songsInfo = songs.data;
      document.querySelector("#results > h2").innerText = query;
      const row = document.querySelector("#results > .row");

      row.innerHTML = "";

      songsInfo.forEach((song) => {
        const col = document.createElement("div");
        col.className = "col";
        col.id = song.id;
        col.innerHTML += albumCard(song);
        col.onclick = (e) => setPlayerSong(song);
        row.appendChild(col);
      });

      if (firstLoad) {
        const storageSongId = window.localStorage.getItem("songId");
        const prevSong = songsInfo.find(
          (song) => song.id === parseInt(storageSongId)
        );
        if (storageSongId && prevSong) {
          if (prevSong) {
            setPlayerInfos(prevSong);
          }
        } else {
          setPlayerInfos(songsInfo[0]);
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const getSongsFromArr = (arr, secTitle) => {
  let arrOfPromises = arr.map((artist) =>
    fetch("https://deezerdevs-deezer.p.rapidapi.com/search?q=" + artist, {
      method: "GET",
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .catch((err) => console.log(err))
  );
  document.querySelector("#results > h2").innerText = secTitle;
  const row = document.querySelector("#results > .row");

  row.innerHTML = `<div class="pl-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>`;

  let reducer = (acc, current) => acc.concat(...current.slice(0, 4));

  Promise.all(arrOfPromises).then((resp) => {
    row.innerHTML = "";

    resp
      .map((arr) => arr.data)
      .reduce(reducer, [])
      .forEach((song) => {
        const col = document.createElement("div");
        col.className = "col";
        col.id = song.id;
        col.innerHTML += albumCard(song);
        col.onclick = () => setPlayerSong(song);
        row.appendChild(col);
      });
  });
};

window.onload = function () {
  search(query, true);

  //load handles on menu items
  document.getElementById("Rock").onclick = () =>
    getSongsFromArr(rockArtists, "Rock");
  document.getElementById("Pop").onclick = () =>
    getSongsFromArr(popArtists, "Pop");
  document.getElementById("Hip Hop").onclick = () =>
    getSongsFromArr(hipHopArtists, "Hip Hop");
};

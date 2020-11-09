let audio = document.getElementsByTagName("audio")[0];
let playIcon = document.querySelector("img[src$='Play.png']");
let mute = false;
let prevVolume = 1;
let volumeIconClass;
let range;

window.addEventListener("DOMContentLoaded", () => {
  range = document.querySelector(".playerVolume input[type='range']");

  volumeIconClass =
    range.value < 10
      ? "off"
      : range.value < 30
      ? "down"
      : range.value > 30
      ? "up"
      : "";

  //localStorage
  let storageVolume = window.localStorage.getItem("prevVolume");
  if (storageVolume) {
    prevVolume = storageVolume;
    audio.volume = storageVolume;
    range.setAttribute("value", storageVolume * 100);
    changeVolIcon(storageVolume * 100);
  }
});

const setPlayerSong = (song) => {
  audio.src = song.preview;
  playIcon.src = "playerbuttons/Pause.png";
  setPlayerInfos(song);
  window.localStorage.setItem("songId", song.id);
  audio.play();
};

const setPlayerInfos = (song) => {
  let playerArtistInfo = document.querySelector(".playerArtistInfo");
  let img = playerArtistInfo.querySelector("img");
  let songTitle = playerArtistInfo.querySelector("h6");
  let songAlbum = playerArtistInfo.querySelector("p");
  img.src = song.album.cover;
  img.classList.add("img-fluid");
  img.style.cssText = "height: auto; max-height: 50px";
  songTitle.innerText = song.title;
  songAlbum.innerText = song.album.title;
  audio.src = song.preview;

  let player = document.querySelector(".player");
  let duration = player.querySelector(".duration");
  let currTime = player.querySelector(".currentTime");
  currTime.innerText = "00:00";
  duration.innerText =
    ("0" + Math.floor(song.duration / 60)).substr(-2) +
    ":" +
    ("0" + Math.floor(song.duration % 60)).substr(-2);
};

const changeProgressBar = (node, perc) => {
  node.style.width = perc.toString() + "%";
  node.setAttribute("aria-valuenow", perc.toString());
};

const handleProgressBarUpdate = (ended = false) => {
  let elem = document.querySelector(".progress-bar");
  let percentage = (audio.currentTime / audio.duration) * 100;

  changeProgressBar(elem, percentage);

  if (ended) {
    changeProgressBar(elem, 0);
    playIcon.src = "playerbuttons/Play.png";
  }
  let player = document.querySelector(".player");
  let currTime = player.querySelector(".currentTime");
  let minutes = "0" + Math.floor(audio.currentTime / 60);
  let seconds = "0" + Math.floor(audio.currentTime);
  currTime.innerText = minutes.substr(-2) + ":" + seconds.substr(-2);
};

const handleProgressBarClick = (e) => {
  let elem = e.currentTarget.firstElementChild;
  let percentage = parseInt((e.offsetX * 100) / e.currentTarget.clientWidth);
  elem.style.width = percentage.toString() + "%";
  elem.setAttribute("aria-valuenow", percentage.toString());

  audio.currentTime = (percentage / 100) * audio.duration;
};

const changeVolIcon = (value) => {
  if (value < 10) {
    document.querySelector(".playerVolume i").className = "fa fa-volume-off";
    volumeIconClass = "off";
  } else if (value > 10 && value < 30) {
    document.querySelector(".playerVolume i").className = "fa fa-volume-down";
    volumeIconClass = "down";
  } else if (value > 30) {
    document.querySelector(".playerVolume i").className = "fa fa-volume-up";
    volumeIconClass = "up";
  }
};

const handleChangeVolume = (e) => {
  let volume = e.target.value / 100;
  prevVolume = volume;

  window.localStorage.setItem("prevVolume", volume);
  audio.volume = volume;

  changeVolIcon(e.target.value);
};

const handleMute = () => {
  if (mute) {
    document.querySelector(".playerVolume i").className =
      "fa fa-volume-" + volumeIconClass;
    mute = false;
    audio.volume = prevVolume;
  } else {
    document.querySelector(".playerVolume i").className = "fa fa-volume-mute";
    mute = true;
    audio.volume = 0;
  }
};

const handlePlay = () => {
  if (audio.played.length > 0) {
    if (audio.paused) {
      playIcon.src = "playerbuttons/Pause.png";
      audio.play();
    } else {
      playIcon.src = "playerbuttons/Play.png";
      audio.pause();
    }
  } else {
    playIcon.src = "playerbuttons/Pause.png";
    audio.play();
  }
};

audio.ontimeupdate = () => handleProgressBarUpdate();
audio.onended = () => handleProgressBarUpdate(true);

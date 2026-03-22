/**
 * Background music: MP3 on home, YouTube (hidden iframe) on city pages.
 * YouTube autoplays muted (browser policy); first “Sound on” unlocks audio for the tab (sessionStorage).
 */
(function () {
  var STORAGE_ON = "tripBgMusicOn";
  var STORAGE_UNLOCK = "tripBgSoundUnlocked";

  /** Page key → YouTube video id (streams in-page; no download). */
  var TRIP_YOUTUBE_IDS = {
    amsterdam: "bvUTvG0LgaU",
    paris: "9n-hyA2-FDg",
  };

  var TRIP_MUSIC_SRC = {
    home: "media/music.mp3",
    london: "media/music.mp3",
  };

  var DEFAULT_AUDIO_VOL = 0.32;
  var DEFAULT_YT_VOL = 32;

  function musicPageKey() {
    if (document.body.classList.contains("page-home")) return "home";
    var c = document.body.dataset.city;
    if (c === "paris") return "paris";
    if (c === "london") return "london";
    return "amsterdam";
  }

  function wantsMusicOn() {
    try {
      return sessionStorage.getItem(STORAGE_ON) === "1";
    } catch (e) {
      return false;
    }
  }

  function setWantsMusicOn(yes) {
    try {
      sessionStorage.setItem(STORAGE_ON, yes ? "1" : "0");
    } catch (e) {}
  }

  function soundUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_UNLOCK) === "1";
    } catch (e) {
      return false;
    }
  }

  function setSoundUnlocked() {
    try {
      sessionStorage.setItem(STORAGE_UNLOCK, "1");
    } catch (e) {}
  }

  function createUiShell() {
    var wrap = document.createElement("div");
    wrap.className = "trip-music";
    wrap.setAttribute("aria-live", "polite");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "trip-music__btn";

    var err = document.createElement("p");
    err.className = "trip-music__err";
    err.hidden = true;

    function setLabel(playing) {
      btn.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      btn.textContent = playing ? "Pause music" : "Play music";
    }

    setLabel(false);
    wrap.appendChild(btn);
    wrap.appendChild(err);
    document.body.appendChild(wrap);

    return { wrap: wrap, btn: btn, err: err, setLabel: setLabel };
  }

  function loadYouTubeApi(callback) {
    if (window.YT && window.YT.Player) {
      setTimeout(callback, 0);
      return;
    }
    var queue = window.__tripYtApiQueue;
    if (!queue) {
      queue = window.__tripYtApiQueue = [];
      window.onYouTubeIframeAPIReady = function () {
        var fns = window.__tripYtApiQueue;
        window.__tripYtApiQueue = null;
        if (fns) {
          fns.forEach(function (fn) {
            try {
              fn();
            } catch (e) {}
          });
        }
      };
      var tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }
    queue.push(callback);
  }

  function initYouTube(videoId, pageKey) {
    var ui = createUiShell();
    ui.btn.disabled = true;

    var hostId = "trip-yt-player-" + pageKey;
    var host = document.createElement("div");
    host.id = hostId;
    host.className = "trip-music__youtube-host trip-music__youtube-host--hidden";
    host.setAttribute("aria-hidden", "true");
    host.setAttribute("tabindex", "-1");
    ui.wrap.insertBefore(host, ui.btn);

    var playerRef = { p: null };

    function syncYtButton() {
      var p = playerRef.p;
      var YT = window.YT;
      if (!p || !p.getPlayerState || !YT) {
        ui.setLabel(false);
        return;
      }
      var st = p.getPlayerState();
      var active = st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING;
      if (active) {
        if (typeof p.isMuted === "function" && p.isMuted()) {
          ui.btn.textContent = "Sound on";
          ui.btn.setAttribute("aria-label", "Turn sound on for background music");
          ui.btn.setAttribute("aria-pressed", "true");
        } else {
          ui.btn.textContent = "Pause music";
          ui.btn.setAttribute("aria-label", "Pause background music");
          ui.btn.setAttribute("aria-pressed", "true");
        }
      } else {
        ui.btn.textContent = "Play music";
        ui.btn.setAttribute("aria-label", "Play background music");
        ui.btn.setAttribute("aria-pressed", "false");
      }
    }

    ui.btn.addEventListener("click", function () {
      var p = playerRef.p;
      if (!p || !p.getPlayerState) return;
      var YT = window.YT;
      var st = p.getPlayerState();
      var active = st === YT.PlayerState.PLAYING || st === YT.PlayerState.BUFFERING;

      if (active && typeof p.isMuted === "function" && p.isMuted()) {
        p.unMute();
        setSoundUnlocked();
        setWantsMusicOn(true);
        syncYtButton();
        return;
      }

      if (active) {
        p.pauseVideo();
        setWantsMusicOn(false);
        syncYtButton();
        return;
      }

      p.playVideo();
      setWantsMusicOn(true);
      if (soundUnlocked()) {
        p.unMute();
      } else {
        p.mute();
      }
      syncYtButton();
    });

    loadYouTubeApi(function () {
      var origin = "";
      try {
        if (/^https?:/i.test(window.location.protocol)) {
          origin = window.location.origin || "";
        }
      } catch (e) {}

      var playerVars = {
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: videoId,
        enablejsapi: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        controls: 0,
      };
      if (origin) playerVars.origin = origin;

      playerRef.p = new window.YT.Player(hostId, {
        videoId: videoId,
        width: "200",
        height: "113",
        /* Error 153 fix: privacy-enhanced embed (see youtube-nocookie + referrer meta). */
        host: "https://www.youtube-nocookie.com",
        playerVars: playerVars,
        events: {
          onReady: function (ev) {
            var p = ev.target;
            try {
              var iframe = p.getIframe && p.getIframe();
              if (iframe) {
                iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
              }
            } catch (e1) {}
            p.setVolume(DEFAULT_YT_VOL);
            p.mute();
            p.playVideo();
            if (soundUnlocked() && wantsMusicOn()) {
              p.unMute();
            }
            ui.btn.disabled = false;
            syncYtButton();
          },
          onStateChange: function (ev) {
            var YT = window.YT;
            if (!YT) return;
            if (ev.data === YT.PlayerState.ENDED) {
              ev.target.seekTo(0, true);
              ev.target.playVideo();
            }
            syncYtButton();
          },
          onError: function (ev) {
            var hint =
              ev.data === 150 || ev.data === 101
                ? " This video can’t be embedded; try a different link."
                : ev.data === 153
                  ? " Referrer/embed issue — try a hard refresh, allow this site in ad blockers, or open the video on YouTube."
                  : "";
            ui.err.textContent =
              "Couldn’t load the YouTube player." + hint + " Check your connection or try again later.";
            ui.err.hidden = false;
            ui.btn.disabled = true;
            ui.setLabel(false);
          },
        },
      });
    });
  }

  function syncAudioButton(audio, ui) {
    if (audio.error) {
      ui.setLabel(false);
      return;
    }
    if (!audio.paused) {
      if (audio.muted) {
        ui.btn.textContent = "Sound on";
        ui.btn.setAttribute("aria-label", "Turn sound on for background music");
        ui.btn.setAttribute("aria-pressed", "true");
      } else {
        ui.btn.textContent = "Pause music";
        ui.btn.setAttribute("aria-label", "Pause background music");
        ui.btn.setAttribute("aria-pressed", "true");
      }
    } else {
      ui.btn.textContent = "Play music";
      ui.btn.setAttribute("aria-label", "Play background music");
      ui.btn.setAttribute("aria-pressed", "false");
    }
  }

  function initAudio() {
    var key = musicPageKey();
    var src = TRIP_MUSIC_SRC[key];
    if (!src) return;

    var audio = document.createElement("audio");
    audio.className = "trip-music__audio";
    audio.setAttribute("aria-hidden", "true");
    audio.setAttribute("playsinline", "");
    audio.setAttribute("webkit-playsinline", "");
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = DEFAULT_AUDIO_VOL;
    audio.src = src;
    document.body.appendChild(audio);

    var ui = createUiShell();
    ui.err.textContent =
      "Couldn’t load music — add an MP3 at media/music.mp3 (see TRIP_MUSIC_SRC in trip-bg-music.js).";

    ui.btn.addEventListener("click", function () {
      if (audio.error) return;
      if (!audio.paused && audio.muted) {
        audio.muted = false;
        setSoundUnlocked();
        setWantsMusicOn(true);
        syncAudioButton(audio, ui);
        return;
      }
      if (!audio.paused) {
        audio.pause();
        setWantsMusicOn(false);
        syncAudioButton(audio, ui);
        return;
      }
      audio.play().then(function () {
        setWantsMusicOn(true);
        if (soundUnlocked()) {
          audio.muted = false;
        } else {
          audio.muted = true;
        }
        syncAudioButton(audio, ui);
      }).catch(function () {
        syncAudioButton(audio, ui);
      });
    });

    function showError() {
      ui.err.hidden = false;
      ui.btn.disabled = true;
      ui.setLabel(false);
    }

    audio.addEventListener("error", showError);

    function startHomeAudio() {
      audio.muted = true;
      audio
        .play()
        .then(function () {
          if (soundUnlocked() && wantsMusicOn()) {
            audio.muted = false;
          }
          syncAudioButton(audio, ui);
        })
        .catch(function () {
          syncAudioButton(audio, ui);
        });
    }

    if (audio.readyState >= 2) startHomeAudio();
    else {
      audio.addEventListener(
        "canplay",
        function onCanPlay() {
          audio.removeEventListener("canplay", onCanPlay);
          startHomeAudio();
        },
        { once: true }
      );
    }
  }

  function init() {
    var key = musicPageKey();
    var ytId = TRIP_YOUTUBE_IDS[key];
    if (ytId) {
      initYouTube(ytId, key);
      return;
    }
    initAudio();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

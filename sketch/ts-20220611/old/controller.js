import { Pane } from "../../lib/tweakpane-4.0.3.min.js";
import * as Tone from "../../lib/tone-14.8.26.js";
// import { ToneAudioBuffer } from "../../lib/tone-14.8.26.js";
// import toggle_on from "../../sound/ui/toggle_on.wav";
// import toggle_off from "../../sound/ui/toggle_off.wav";

const controllers = {
  isInit: true,
  isPlay: false,
  scrLk: true,
  frameRate: 0,
  frameCount: 0,
  toneSec: 0,
  toneSecPre: 0,
  toneAccSec: 0,
  mute: true,
};

const setController = () => controllers;

const updateController = (s, controllers) => {
  controllers.frameRate = s.frameRate();
  controllers.frameCount += 1;
  controllers.toneSec = Tone.Transport.seconds;
  controllers.toneAccSec = controllers.toneSecPre + Tone.Transport.seconds;
};

const activate = async (s, controllers, seq) => {
  await Tone.start();
  // se.triggerAttackRelease("A1", 0.1);
  setTimeout(() => {
    Tone.Destination.mute = controllers.mute;
    if (seq === true) Tone.Transport.start();
    controllers.isPlay = true;
    controllers.isInit = false;
    s.loop();
  }, 100);
};
const inactivate = (s, controllers, seq) => {
  // se.triggerAttackRelease("A2", 0.1);
  setTimeout(() => {
    if (seq === true) Tone.Transport.stop();
    controllers.toneSecPre = controllers.toneAccSec;
    Tone.Destination.mute = true;
    controllers.isPlay = false;
    s.noLoop();
  }, 100);
};
const reactivate = (s, controllers, seq) => {
  if (seq === true) Tone.Transport.start();
  Tone.Destination.mute = controllers.mute;
  s.loop();
  // se.triggerAttackRelease("A1", 0.1);
  controllers.isPlay = true;
};

const ban_scroll = () => {
  document.addEventListener("wheel", notscroll, { passive: false }); // pc
  document.addEventListener("touchmove", notscroll, { passive: false }); // touch
  document.addEventListener("dblclick", notscroll, { passive: false }); // expand
};
const go_scroll = () => {
  document.removeEventListener("wheel", notscroll, { capture: false }); // pc
  document.removeEventListener("touchmove", notscroll, { capture: false }); // touch
  document.removeEventListener("dblclick", notscroll, { capture: false }); // expand
};
const notscroll = (e) => {
  e.preventDefault();
};

// export const setSe = async () => {
//   // const toggle_on_buffer = new Tone.ToneAudioBuffer();
//   // await toggle_on_buffer.load("../../sound/ui/toggle_on.wav");
//   // const toggle_off_buffer = new Tone.ToneAudioBuffer();
//   // await toggle_off_buffer.load("../../sound/ui/toggle_off.wav");
//   const se = new Tone.Sampler({
//     urls: {
//       A1: "../../sound/ui/toggle_on.wav",
//       A2: "../../sound/ui/toggle_off.wav",
//     },
//   }).toDestination();
//   se.volume.value = -10;
//   return se;
// };

const setGui = (s, controllers, seq = false) => {
  document.getElementById(
    "indicator"
  ).innerHTML = `...waiting. please uncheck "mute" box to play sounds.`;
  const pane = new Pane({
    container: document.getElementById("pane"),
  });
  const tab = pane.addTab({
    pages: [{ title: "default" }, { title: "sketch" }, { title: "sound" }],
  });
  const play = () => {
    const isInit = controllers.isInit;
    const isPlay = s.isLooping();
    const isPause =
      !controllers.isInit && !s.isLooping() && !controllers.isPlay;
    if (isInit) {
      console.log(`activate`);
      activate(s, controllers, seq);
      document.getElementById("indicator").innerHTML = "playing";
    }
    if (isPlay) {
      console.log(`inactivate`);
      inactivate(s, controllers, seq);
      document.getElementById("indicator").innerHTML = "...waiting";
    }
    if (isPause) {
      console.log(`reactivate`);
      reactivate(s, controllers, seq);
      document.getElementById("indicator").innerHTML = "playing";
    }
  };
  document.addEventListener("keydown", (ev) => {
    if (ev.code === "Space") play();
  });
  tab.pages[0]
    .addButton({ title: "on/off", label: "play" })
    .on("click", async () => play());
  tab.pages[0].addBinding(controllers, "frameRate", {
    readonly: true,
    interval: 500,
  });
  tab.pages[0].addBinding(controllers, "toneSec", {
    readonly: true,
    interval: 500,
  });
  tab.pages[0].addBinding(controllers, "toneAccSec", {
    readonly: true,
    interval: 500,
  });
  ban_scroll();
  tab.pages[0].addBinding(controllers, "scrLk").on("change", (event) => {
    if (event.value === true) {
      ban_scroll();
    }
    if (event.value === false) go_scroll();
  });
  tab.pages[0].addBinding(controllers, "mute").on("change", (event) => {
    if (s.isLooping()) Tone.Destination.mute = event.value;
  });
  return tab;
};

export const controller = { setController, updateController, setGui };

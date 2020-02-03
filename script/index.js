const marker = document.querySelector("a-marker").object3D;
const camera = document.querySelector("[camera]").getObject3D("camera");
const mameBox = document.querySelector(".mame-box");
const mame = document.querySelector(".mame");

const results = {
  hit: document.querySelector(".result.hit"),
  miss: document.querySelector(".result.miss")
};

let hit = null;
let daemonRadian = null;
let latestTouch = null;

const updateDaemonRadian = () => {
  try {
    const { x, y } = marker.position.project(camera);
    daemonRadian = Math.atan2(x, (y + 1.0) / 2);
  } catch (o_O) {
    //
  }

  requestAnimationFrame(updateDaemonRadian);
};

updateDaemonRadian();

const getTouch = changedTouches =>
  latestTouch &&
  [...changedTouches].find(t => t.identifier === latestTouch.identifier);

mameBox.addEventListener("touchstart", e => {
  e.preventDefault();
  mameBox.classList.add("tame");
  if (latestTouch == null) latestTouch = e.changedTouches[0];
});

document.addEventListener("touchend", e => {
  e.preventDefault();
  mameBox.classList.remove("tame");
  const t = getTouch(e.changedTouches);
  if (t != null) {
    const rad = Math.atan2(
      t.pageX - latestTouch.pageX,
      -1 * (t.pageY - latestTouch.pageY)
    );
    mame.classList.remove("throwing");
    requestAnimationFrame(() => {
      const r = Math.max(document.body.clientWidth, document.body.clientHeight);
      mame.style.setProperty(
        "--target-x",
        Math.cos(-rad + Math.PI / 2) * r + "px"
      );
      mame.style.setProperty(
        "--target-y",
        Math.sin(-rad + Math.PI / 2) * -r + "px"
      );
      mame.classList.add("throwing");
    });
    hit = Math.abs(rad - daemonRadian) <= Math.PI / 4;
    latestTouch = null;
  }
});

document.addEventListener("touchcancel", e => {
  e.preventDefault();
  mameBox.classList.remove("tame");
  if (getTouch(e.changedTouches) != null) {
    latestTouch = null;
  }
});

mame.addEventListener("animationend", () => {
  mame.classList.remove("throwing");

  if (hit === null) return;

  const result = results[hit ? "hit" : "miss"];
  result.classList.add("show");
  result.addEventListener("animationend", ({ currentTarget }) =>
    currentTarget.classList.remove("show")
  );
});

document.addEventListener("mousedown", e => e.preventDefault());
document.addEventListener("mouseup", e => e.preventDefault());

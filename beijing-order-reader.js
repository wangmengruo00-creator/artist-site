(() => {
  const reader = document.querySelector("[data-dragon-reader]");
  if (!reader) return;

  const stage = reader.querySelector("[data-reader-stage]");
  const leavesRoot = reader.querySelector("[data-reader-leaves]");
  const resetButton = reader.querySelector("[data-reader-reset]");
  const count = reader.querySelector("[data-reader-count]");
  const imageLeafCount = 16;
  const leafCount = imageLeafCount + 1;
  const openAngle = -168;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = Array(leafCount).fill(0);
  const angles = Array(leafCount).fill(0);
  const leaves = [];
  let dragging = false;
  let frame = 0;

  const renderCount = () => {
    const opened = targets.filter((angle) => angle < -35).length;
    count.textContent = `${String(opened).padStart(2, "0")} / ${leafCount}`;
  };

  const animate = () => {
    let moving = false;
    leaves.forEach((leaf, index) => {
      const distance = targets[index] - angles[index];
      if (Math.abs(distance) > 0.08) {
        angles[index] += reducedMotion ? distance : distance * 0.16;
        moving = true;
      } else {
        angles[index] = targets[index];
      }
      leaf.style.setProperty("--turn", `${angles[index]}deg`);
      leaf.style.setProperty("--lift", String(Math.min(1, Math.abs(angles[index]) / 72)));
      leaf.style.zIndex = Math.abs(angles[index]) > 90 ? String(index + 1) : String(leafCount - index);
    });
    frame = moving ? requestAnimationFrame(animate) : 0;
  };

  const requestRender = () => {
    renderCount();
    if (!frame) frame = requestAnimationFrame(animate);
  };

  const setProgress = (clientX) => {
    const bounds = leavesRoot.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width));
    const threshold = Math.round(progress * leafCount);
    leaves.forEach((leaf) => leaf.classList.remove("is-near"));
    targets.forEach((_, index) => {
      targets[index] = index < threshold ? openAngle : 0;
    });
    requestRender();
  };

  for (let index = 0; index < leafCount; index += 1) {
    const leaf = document.createElement("button");
    leaf.type = "button";
    leaf.className = "dragon-reader-leaf";
    leaf.setAttribute("aria-label", index === 0 ? "Toggle cover" : `Toggle leaf ${index}`);
    leaf.style.setProperty("--index", index);
    leaf.style.setProperty("--position", `${(index / (leafCount - 1)) * 100}%`);
    leaf.style.setProperty("--turn", "0deg");
    leaf.style.setProperty("--lift", "0");
    const front = document.createElement("span");
    const back = document.createElement("span");
    front.className = "dragon-reader-face dragon-reader-face-front";
    back.className = "dragon-reader-face dragon-reader-face-back";
    if (index === 0) {
      leaf.classList.add("dragon-reader-cover");
      front.classList.add("dragon-reader-cover-front");
      back.classList.add("dragon-reader-cover-back");
      front.innerHTML = '<span class="sr-only">C / Opened cover</span>';
      back.innerHTML = '<span class="sr-only">Inside of cover</span>';
    }
    leaf.append(front, back);
    leaf.addEventListener("click", (event) => {
      if (dragging) return;
      event.stopPropagation();
      targets[index] = targets[index] < -90 ? 0 : openAngle;
      requestRender();
    });
    leavesRoot.appendChild(leaf);
    leaves.push(leaf);
  }

  const layoutLeaves = () => {
    const bounds = leavesRoot.getBoundingClientRect();
    const coverWidth = bounds.width * 0.13;
    const imageStart = coverWidth;
    const imageWidth = bounds.width - imageStart;
    const leafWidth = imageWidth * 0.17;
    const step = (imageWidth - leafWidth) / (imageLeafCount - 1);

    leaves.forEach((leaf, index) => {
      const isCover = index === 0;
      const left = isCover ? 0 : imageStart + (index - 1) * step;
      leaf.style.left = `${left}px`;
      leaf.style.width = `${isCover ? coverWidth : leafWidth}px`;
      if (!isCover) {
        leaf.querySelectorAll(".dragon-reader-face").forEach((face) => {
          face.style.backgroundSize = `${imageWidth}px ${bounds.height}px`;
          face.style.backgroundPosition = `${-(left - imageStart)}px 0`;
        });
      }
    });
  };

  new ResizeObserver(layoutLeaves).observe(leavesRoot);

  stage.addEventListener("pointerdown", (event) => {
    dragging = true;
    leaves.forEach((leaf) => leaf.classList.remove("is-near"));
    stage.setPointerCapture(event.pointerId);
    setProgress(event.clientX);
  });

  stage.addEventListener("pointermove", (event) => {
    if (dragging) {
      setProgress(event.clientX);
      return;
    }

    const bounds = leavesRoot.getBoundingClientRect();
    const relative = (event.clientX - bounds.left) / bounds.width;
    const hovered = Math.floor(relative * leafCount);
    leaves.forEach((leaf, index) => {
      leaf.classList.toggle("is-near", targets[index] === 0 && index === hovered);
    });
  });

  stage.addEventListener("pointerleave", () => {
    leaves.forEach((leaf) => leaf.classList.remove("is-near"));
  });

  stage.addEventListener("pointerup", (event) => {
    stage.releasePointerCapture(event.pointerId);
    window.setTimeout(() => { dragging = false; }, 0);
  });

  stage.addEventListener("pointercancel", () => {
    dragging = false;
  });

  resetButton.addEventListener("click", () => {
    targets.fill(0);
    requestRender();
    reader.focus();
  });

  reader.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const opened = targets.filter((angle) => angle < -35).length;
    if (event.key === "ArrowRight" && opened < leafCount) targets[opened] = openAngle;
    if (event.key === "ArrowLeft" && opened > 0) targets[opened - 1] = 0;
    if (event.key === "Home") targets.fill(0);
    if (event.key === "End") targets.fill(openAngle);
    requestRender();
  });

  layoutLeaves();
  requestRender();
})();

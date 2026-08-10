(() => {
  const canvas = document.querySelector("[data-process-evolution-canvas]");
  const host = canvas?.closest(".process-evolution");

  if (!canvas || !host) return;

  const context = canvas.getContext("2d");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const particles = Array.from({ length: 72 }, (_, index) => ({
    x: ((index * 37) % 101) / 101,
    y: ((index * 61) % 97) / 97,
    phase: index * 0.73,
    radius: 0.55 + (index % 4) * 0.24,
  }));

  let width = 1;
  let height = 1;
  let ratio = 1;

  const resize = () => {
    const rect = host.getBoundingClientRect();
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const region = (index) => {
    if (width <= 820) return { x: 0, y: height * index / 3, width, height: height / 3 };
    return { x: width * index / 3, y: 0, width: width / 3, height };
  };

  const drawParticleState = (time) => {
    const area = region(0);
    const points = particles.slice(0, 30).map((particle) => ({
      x: area.x + area.width * (0.08 + particle.x * 0.84) + Math.sin(time * 0.00022 + particle.phase) * 5,
      y: area.y + area.height * (0.08 + particle.y * 0.7) + Math.cos(time * 0.00018 + particle.phase) * 4,
      radius: particle.radius,
    }));

    points.forEach((point, index) => {
      for (let otherIndex = index + 1; otherIndex < points.length; otherIndex += 1) {
        const other = points[otherIndex];
        const distance = Math.hypot(point.x - other.x, point.y - other.y);
        if (distance > area.width * 0.16) continue;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(220,220,211,${(1 - distance / (area.width * 0.16)) * 0.075})`;
        context.lineWidth = 0.5;
        context.stroke();
      }

      context.beginPath();
      context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(229,228,218,0.38)";
      context.fill();
    });
  };

  const drawDirectionalTrace = (time) => {
    const area = region(1);
    const points = Array.from({ length: 48 }, (_, index) => {
      const progress = index / 47;
      return {
        x: area.x + area.width * (0.08 + progress * 0.84),
        y: area.y + area.height * (0.3 + Math.sin(progress * Math.PI * 3.2 + time * 0.00022) * 0.13 + progress * 0.08),
      };
    });

    for (let echo = 3; echo >= 0; echo -= 1) {
      context.beginPath();
      points.forEach((point, index) => {
        const offset = Math.sin(index * 0.5 + time * 0.0004) * echo * 1.2;
        if (index === 0) context.moveTo(point.x, point.y + offset);
        else context.lineTo(point.x, point.y + offset);
      });
      context.strokeStyle = `rgba(216,218,211,${echo === 0 ? 0.48 : 0.055})`;
      context.lineWidth = echo === 0 ? 0.85 : 0.55;
      context.stroke();
    }

    points.filter((_, index) => index % 8 === 0).forEach((point) => {
      context.beginPath();
      context.arc(point.x, point.y, 1.15, 0, Math.PI * 2);
      context.fillStyle = "rgba(232,231,220,0.4)";
      context.fill();
    });
  };

  const drawEmbodiedPressure = (time) => {
    const area = region(2);
    const centerX = area.x + area.width * 0.52;
    const centerY = area.y + area.height * 0.36;
    const breath = reducedMotion ? 0.5 : (Math.sin(time * 0.00075) + 1) / 2;

    const gradient = context.createRadialGradient(centerX, centerY, 2, centerX, centerY, area.width * (0.12 + breath * 0.18));
    gradient.addColorStop(0, `rgba(226,226,216,${0.16 + breath * 0.08})`);
    gradient.addColorStop(0.35, `rgba(207,209,201,${0.07 + breath * 0.04})`);
    gradient.addColorStop(1, "rgba(190,194,187,0)");
    context.fillStyle = gradient;
    context.fillRect(area.x, area.y, area.width, area.height);

    particles.slice(30).forEach((particle, index) => {
      const angle = particle.phase + time * 0.00005;
      const radius = area.width * (0.06 + particle.x * 0.28 + breath * 0.04);
      const x = centerX + Math.cos(angle) * radius * (0.7 + particle.y * 0.5);
      const y = centerY + Math.sin(angle) * radius * 0.52;
      context.beginPath();
      context.arc(x, y, particle.radius, 0, Math.PI * 2);
      context.fillStyle = `rgba(224,223,213,${0.08 + (index % 5) * 0.025})`;
      context.fill();
    });
  };

  const render = (time) => {
    context.clearRect(0, 0, width, height);
    drawParticleState(time);
    drawDirectionalTrace(time);
    drawEmbodiedPressure(time);
    window.requestAnimationFrame(render);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  window.requestAnimationFrame(render);
})();

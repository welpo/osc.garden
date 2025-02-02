const WARNING_CLASS = "warning";
const HOUR_SUFFIX = " hr";
const HOUR_MIN_FORMAT = " hr ";
const MIN_SUFFIX = " min";
const RECOMMENDATION_HOURS_PREFIX = "Tip: ";
const WARNING_ICON = "<span class='icon warning-icon'></span>";
const GOAL_MET_MESSAGE = "This schedule meets your sleep goal.";
const GOAL_NOT_MET_MESSAGE = `${WARNING_ICON} This schedule does not meet your sleep goal.`;
const goalStatusDisplay = document.getElementById("goalStatus");

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DEGREES_PER_HOUR = 15;
const MINUTES_PER_HOUR = 60;
const MINUTES_PER_DAY = 24 * MINUTES_PER_HOUR;
const MINUTES_PER_HALF_DAY = MINUTES_PER_DAY / 2;
const DEGREES_IN_CIRCLE = 360;
const DEGREES_IN_HALF_CIRCLE = 180;
const DEGREES_90 = 90;
const MINUTES_TO_ANGLE = MINUTES_PER_HOUR / DEGREES_PER_HOUR;
const DEGREES_PER_MINUTE = DEGREES_IN_CIRCLE / (24 * MINUTES_PER_HOUR);
const SNAP_TO_MINUTES = 5;
const SNAP_TO_DEGREES = DEGREES_PER_MINUTE * SNAP_TO_MINUTES;

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(minutes) {
  minutes = Math.round(minutes / 5) * 5;
  minutes = (minutes + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const mins = minutes % MINUTES_PER_HOUR;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

class SleepClock {
  constructor() {
    // Initialize state
    this.container = document.getElementById("clockContainer");
    const baseSize = parseInt(getComputedStyle(this.container).width);
    this.clockCenter = { x: baseSize * 0.5, y: baseSize * 0.5 };
    this.arcRadius = baseSize * 0.42;
    this.handleRadius = baseSize * 0.055;
    this.tickSpacing = 2.7;
    this.tickLength = baseSize * 0.03;
    this.minSleepHours = 1;
    this.maxSleepHours = 20;
    this.sleepAngle = this.timeToAngle(22); // Default 10 PM
    this.wakeAngle = this.timeToAngle(6); // Default 6 AM

    // Dragging state
    this.isDraggingArc = false;
    this.isConstraintPushing = false;
    this.isDraggingHandle = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragStartSleepAngle = 0;
    this.dragStartWakeAngle = 0;

    // Get DOM elements
    this.outerContainer = this.container.querySelector(".outer-container");
    this.sleepHandle = this.container.querySelector(".handle.sleep");
    this.wakeHandle = this.container.querySelector(".handle.wake");
    this.sleepTimeInput = this.container.querySelector("#sleepTime");
    this.wakeTimeInput = this.container.querySelector("#wakeTime");
    this.totalSleepDisplay = this.container.querySelector(".total-sleep");
    this.clockFace = this.container.querySelector(".clock-face");
    this.arcPath = this.container.querySelector(".sleep-arc");
    this.ticksPath = this.container.querySelector(".arc-ticks");
    this.hoursInput = document.getElementById("goalHours");
    this.minutesInput = document.getElementById("goalMinutes");
    // Set up SVG viewBox
    const arcLayer = this.container.querySelector(".arc-layer");
    arcLayer.setAttribute("viewBox", `0 0 ${baseSize} ${baseSize}`);
    console.log("Clock initialized:", {
      baseSize,
      center: this.clockCenter,
      arcRadius: this.arcRadius,
      sleepAngle: this.sleepAngle,
      wakeAngle: this.wakeAngle,
    });

    // Initialize components
    this.setupClock();
    this.setupHandles();
    this.setupArcDragging();
    this.setupTimeInputs();
    this.updateTimeDisplays();
    this.updateSleepDuration();
  }

  timeToAngle(hours, minutes = 0) {
    return hours * DEGREES_PER_HOUR + minutes * DEGREES_PER_MINUTE;
  }

  setupClock() {
    // Add all even numbers.
    for (let hour = 0; hour < 24; hour += 2) {
      const number = document.createElement("div");
      number.className = "number";
      if (hour % 6 === 0) {
        number.className = "number primary"; // Special class for 0,6,12,18.
      }
      number.style.transform = `rotate(${hour * DEGREES_PER_HOUR}deg)`;
      const span = document.createElement("span");
      span.style.display = "block";
      span.style.transform = `rotate(${-hour * DEGREES_PER_HOUR}deg)`;
      span.textContent = hour;
      const baseUnit = parseInt(
        getComputedStyle(document.documentElement).getPropertyValue(
          "--base-unit"
        )
      );
      span.style.marginTop = `${baseUnit * 0.5}px`;
      number.appendChild(span);
      this.clockFace.appendChild(number);
    }

    // Add tick marks.
    for (let i = 0; i < 96; i++) {
      const tick = document.createElement("div");
      tick.className = i % 4 === 0 ? "tick hour" : "tick";
      tick.style.transform = `rotate(${i * 3.75}deg)`;
      this.clockFace.appendChild(tick);
    }

    this.updateHandlePosition(this.sleepHandle, this.sleepAngle);
    this.updateHandlePosition(this.wakeHandle, this.wakeAngle);
    this.updateArc();
  }

  setupHandles() {
    this.makeHandleDraggable(this.sleepHandle, (angle) => {
      const validAngle = this.getValidAngle(angle, this.wakeAngle, true);
      if (validAngle !== null) {
        this.sleepAngle = validAngle;
        this.updateArc();
        this.updateTimeDisplays();
      }
    });

    this.makeHandleDraggable(this.wakeHandle, (angle) => {
      const validAngle = this.getValidAngle(angle, this.sleepAngle, false);
      if (validAngle !== null) {
        this.wakeAngle = validAngle;
        this.updateArc();
        this.updateTimeDisplays();
      }
    });
  }

  setupArcDragging() {
    const startArcDrag = (e) => {
      if (e.touches && e.touches.length > 1) return;
      this.isDraggingArc = true;
      this.arcPath.style.cursor = "grabbing";
      const rect = this.outerContainer.getBoundingClientRect();
      this.dragStartX = (e.clientX || e.touches?.[0].clientX) - rect.left;
      this.dragStartY = (e.clientY || e.touches?.[0].clientY) - rect.top;
      this.dragStartSleepAngle = this.sleepAngle;
      this.dragStartWakeAngle = this.wakeAngle;
      e.preventDefault();
    };

    const dragArc = (e) => {
      if (!this.isDraggingArc) return;
      const rect = this.outerContainer.getBoundingClientRect();
      const currentX = (e.clientX || e.touches?.[0].clientX) - rect.left;
      const currentY = (e.clientY || e.touches?.[0].clientY) - rect.top;

      const startAngle = Math.atan2(
        this.dragStartY - this.clockCenter.y,
        this.dragStartX - this.clockCenter.x
      );
      const currentAngle = Math.atan2(
        currentY - this.clockCenter.y,
        currentX - this.clockCenter.x
      );

      let angleDiff = this.normalizeAngle(
        ((currentAngle - startAngle) * DEGREES_IN_HALF_CIRCLE) / Math.PI
      );
      if (angleDiff > DEGREES_IN_HALF_CIRCLE) angleDiff -= 360;

      angleDiff = Math.round(angleDiff / SNAP_TO_DEGREES) * SNAP_TO_DEGREES;

      this.sleepAngle = this.normalizeAngle(
        this.dragStartSleepAngle + angleDiff
      );
      this.wakeAngle = this.normalizeAngle(this.dragStartWakeAngle + angleDiff);

      this.updateHandlePosition(this.sleepHandle, this.sleepAngle);
      this.updateHandlePosition(this.wakeHandle, this.wakeAngle);
      this.updateArc();
      this.updateTimeDisplays();
    };

    const stopArcDrag = () => {
      this.isDraggingArc = false;
      this.arcPath.style.cursor = "grab";
    };

    this.arcPath.style.cursor = "grab";
    this.arcPath.addEventListener("mousedown", startArcDrag);
    this.arcPath.addEventListener("touchstart", startArcDrag, {
      passive: false,
    });
    document.addEventListener("mousemove", dragArc, { passive: true });
    document.addEventListener("touchmove", dragArc, { passive: true });
    document.addEventListener("mouseup", stopArcDrag, { passive: true });
    document.addEventListener("touchend", stopArcDrag, { passive: true });
  }

  setupTimeInputs() {
    this.sleepTimeInput.value = this.angleToTime(this.sleepAngle);
    this.wakeTimeInput.value = this.angleToTime(this.wakeAngle);

    const handleTimeInput = (isWakeTime, e) => {
      const rawMinutes = timeToMinutes(e.target.value);
      const roundedTime = minutesToTime(rawMinutes);
      e.target.value = roundedTime;
      const roundedMinutes = timeToMinutes(roundedTime);
      const newAngle = (roundedMinutes / MINUTES_PER_DAY) * DEGREES_IN_CIRCLE;
      const validAngle = this.getValidAngle(
        newAngle,
        isWakeTime ? this.sleepAngle : this.wakeAngle,
        !isWakeTime
      );

      if (isWakeTime) {
        this.wakeAngle = validAngle;
        this.updateHandlePosition(this.wakeHandle, validAngle);
      } else {
        this.sleepAngle = validAngle;
        this.updateHandlePosition(this.sleepHandle, validAngle);
      }

      if (this.isConstraintPushing) {
        if (isWakeTime) {
          this.sleepTimeInput.value = this.angleToTime(this.sleepAngle);
        } else {
          this.wakeTimeInput.value = this.angleToTime(this.wakeAngle);
        }
        this.isConstraintPushing = false;
      }

      this.updateArc();
      this.updateSleepDuration();
    };

    this.sleepTimeInput.addEventListener("change", (e) =>
      handleTimeInput(false, e)
    );
    this.wakeTimeInput.addEventListener("change", (e) =>
      handleTimeInput(true, e)
    );

    // Goal inputs
    const validateInput = (input, min, max) => {
      let value = parseInt(input.value);
      if (isNaN(value)) value = min;
      value = Math.max(min, Math.min(max, value));
      input.value = value;
      this.updateSleepDuration();
    };

    this.hoursInput.addEventListener("change", () =>
      validateInput(this.hoursInput, 4, 12)
    );
    this.minutesInput.addEventListener("change", () =>
      validateInput(this.minutesInput, 0, 55)
    );
  }

  getValidAngle(newAngle, otherAngle, isSleepHandle) {
    newAngle = Math.round(newAngle / SNAP_TO_DEGREES) * SNAP_TO_DEGREES;
    newAngle = this.normalizeAngle(newAngle);
    otherAngle = this.normalizeAngle(otherAngle);

    const minDiff = this.minSleepHours * DEGREES_PER_HOUR;
    const maxDiff = this.maxSleepHours * DEGREES_PER_HOUR;

    let diff = isSleepHandle
      ? this.normalizeAngle(otherAngle - newAngle)
      : this.normalizeAngle(newAngle - this.sleepAngle);

    if (diff < minDiff || diff > maxDiff) {
      this.isConstraintPushing = true;
      const adjustment = diff < minDiff ? minDiff : maxDiff;

      if (isSleepHandle) {
        this.wakeAngle = this.normalizeAngle(newAngle + adjustment);
        this.updateHandlePosition(this.wakeHandle, this.wakeAngle);
      } else {
        this.sleepAngle = this.normalizeAngle(newAngle - adjustment);
        this.updateHandlePosition(this.sleepHandle, this.sleepAngle);
      }
    }

    return newAngle;
  }

  makeHandleDraggable(handle, onDrag) {
    let isDragging = false;

    const startDrag = (e) => {
      if (e.touches && e.touches.length > 1) return;
      isDragging = true;
      this.isDraggingHandle = true;
      handle.classList.add("dragging");
      if (!e.touches || e.touches.length === 1) {
        e.preventDefault();
      }
      e.stopPropagation();

      const touch = e.touches ? e.touches[0] : e;
      const rect = this.outerContainer.getBoundingClientRect();
      const x = touch.clientX - rect.left - this.clockCenter.x;
      const y = touch.clientY - rect.top - this.clockCenter.y;

      let angle = this.normalizeAngle(
        (Math.atan2(y, x) * DEGREES_IN_HALF_CIRCLE) / Math.PI + DEGREES_90
      );
      this.updateHandlePosition(handle, angle);
      onDrag(angle);
    };

    const drag = (e) => {
      if (e.touches && e.touches.length > 1) {
        isDragging = false;
        this.isDraggingHandle = false;
        handle.classList.remove("dragging");
        return;
      }
      if (!isDragging) return;

      const touch = e.touches ? e.touches[0] : e;
      const rect = this.outerContainer.getBoundingClientRect();
      const x = touch.clientX - rect.left - this.clockCenter.x;
      const y = touch.clientY - rect.top - this.clockCenter.y;

      let angle = this.normalizeAngle(
        (Math.atan2(y, x) * DEGREES_IN_HALF_CIRCLE) / Math.PI + DEGREES_90
      );
      this.updateHandlePosition(handle, angle);
      onDrag(angle);
      this.updateSleepDuration();
    };

    const stopDrag = () => {
      isDragging = false;
      this.isDraggingHandle = false;
      this.isConstraintPushing = false;
      handle.classList.remove("dragging");
      this.updateArc();
    };

    handle.addEventListener("mousedown", startDrag);
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", stopDrag);
    handle.addEventListener("touchstart", startDrag, { passive: false });
    document.addEventListener("touchmove", drag, { passive: true });
    document.addEventListener("touchend", stopDrag, { passive: true });
    document.addEventListener("touchcancel", stopDrag, { passive: true });
  }

  updateHandlePosition(handle, angle) {
    const radians = ((angle - DEGREES_90) * Math.PI) / DEGREES_IN_HALF_CIRCLE;
    const x = this.clockCenter.x + this.arcRadius * Math.cos(radians);
    const y = this.clockCenter.y + this.arcRadius * Math.sin(radians);
    handle.style.left = `${x}px`;
    handle.style.top = `${y}px`;
  }

  updateArc() {
    let startAngle = this.sleepAngle;
    let endAngle = this.wakeAngle;
    if (endAngle < startAngle) endAngle += 360;
    this.arcPath.setAttribute("d", this.createArcPath(startAngle, endAngle));
    const ticksPathData = this.getTicksPath(
      startAngle,
      endAngle,
      this.arcRadius
    );
    this.ticksPath.setAttribute("d", ticksPathData);
  }

  createArcPath(startAngle, endAngle) {
    const outerRadius = this.arcRadius + this.handleRadius;
    const innerRadius = this.arcRadius - this.handleRadius;
    const startOuter = this.getPointOnCircle(startAngle, outerRadius);
    const endOuter = this.getPointOnCircle(endAngle, outerRadius);
    const startInner = this.getPointOnCircle(startAngle, innerRadius);
    const endInner = this.getPointOnCircle(endAngle, innerRadius);
    const largeArc = endAngle - startAngle <= DEGREES_IN_HALF_CIRCLE ? 0 : 1;

    return `
        M ${startOuter.x} ${startOuter.y}
        A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}
        A ${this.handleRadius} ${this.handleRadius} 0 0 1 ${endInner.x} ${endInner.y}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}
        A ${this.handleRadius} ${this.handleRadius} 0 0 1 ${startOuter.x} ${startOuter.y}
        Z`;
  }

  getTicksPath(startAngle, endAngle, radius) {
    const halfTickLength = this.tickLength / 2;
    let ticks = "";
    const firstTick =
      this.isDraggingArc || (this.isDraggingHandle && this.isConstraintPushing)
        ? startAngle
        : Math.ceil(startAngle / this.tickSpacing) * this.tickSpacing;

    for (let angle = firstTick; angle <= endAngle; angle += this.tickSpacing) {
      const normalizedAngle = angle % DEGREES_IN_CIRCLE;
      const outer = this.getPointOnCircle(
        normalizedAngle,
        radius + halfTickLength
      );
      const inner = this.getPointOnCircle(
        normalizedAngle,
        radius - halfTickLength
      );
      ticks += `M ${outer.x} ${outer.y} L ${inner.x} ${inner.y} `;
    }
    return ticks;
  }

  getPointOnCircle(angle, radius) {
    const radians = ((angle - DEGREES_90) * Math.PI) / DEGREES_IN_HALF_CIRCLE;
    return {
      x: this.clockCenter.x + radius * Math.cos(radians),
      y: this.clockCenter.y + radius * Math.sin(radians),
    };
  }

  angleToTime(angle) {
    const hours = Math.floor(angle / DEGREES_PER_HOUR);
    const minutes = Math.round((angle % DEGREES_PER_HOUR) * MINUTES_TO_ANGLE);
    return this.normalizeTimeString(hours, minutes);
  }

  normalizeTimeString(hours, minutes) {
    if (minutes === 60) {
      hours = (hours + 1) % 24;
      minutes = 0;
    }
    hours = hours === 24 ? 0 : hours;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  }

  normalizeAngle(angle) {
    return (
      ((angle % DEGREES_IN_CIRCLE) + DEGREES_IN_CIRCLE) % DEGREES_IN_CIRCLE
    );
  }

  updateTimeDisplays() {
    this.sleepTimeInput.value = this.angleToTime(this.sleepAngle);
    this.wakeTimeInput.value = this.angleToTime(this.wakeAngle);
  }

  updateSleepDuration() {
    let diff = this.normalizeAngle(this.wakeAngle - this.sleepAngle);
    const hours = Math.floor(diff / DEGREES_PER_HOUR);
    const minutes = Math.round((diff % DEGREES_PER_HOUR) * MINUTES_TO_ANGLE);
    const totalSleepElement = this.totalSleepDisplay;

    // Duration display
    totalSleepElement.textContent =
      minutes === 0 ? `${hours} hr` : `${hours} hr ${minutes} min`;

    // Add warning state handling with icon and message
    const totalMinutes = hours * MINUTES_PER_HOUR + minutes;
    const goalHours = parseInt(this.hoursInput.value) || 8;
    const goalMinutes = parseInt(this.minutesInput.value) || 0;
    const goalTotalMinutes = goalHours * MINUTES_PER_HOUR + goalMinutes;

    if (totalMinutes >= goalTotalMinutes) {
      this.container.classList.remove(WARNING_CLASS);
      goalStatusDisplay.innerHTML = GOAL_MET_MESSAGE;
    } else {
      this.container.classList.add(WARNING_CLASS);
      goalStatusDisplay.innerHTML = GOAL_NOT_MET_MESSAGE;
    }
  }
}

// Initialize the clock when the page loads
document.addEventListener("DOMContentLoaded", () => {
  new SleepClock();
});

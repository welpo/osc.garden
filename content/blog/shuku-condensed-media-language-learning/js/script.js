const ANIMATION_SETTINGS = {
  ANIMATION_SPEED: 1,
  BACKGROUND_COLOR: "var(--bg-0)",
  SEGMENT_COLOR: "var(--primary-color)",
  FONT_SIZE: 16,
};

const DIMENSIONS = {
  MARGIN: { top: 60, right: 0, bottom: 10, left: 0 },
  WIDTH: 800,
  HEIGHT: 240,
  BAR_HEIGHT: 40,
};

const ANIMATION_TIMINGS = {
  SHOW_INPUT: 1000 / ANIMATION_SETTINGS.ANIMATION_SPEED,
  SHOW_SEGMENTS: 2000 / ANIMATION_SETTINGS.ANIMATION_SPEED,
  SHOW_OUTPUT: 900 / ANIMATION_SETTINGS.ANIMATION_SPEED,
  FADE_OUT: 800 / ANIMATION_SETTINGS.ANIMATION_SPEED,
  PAUSE_BETWEEN_FILES: 1000 / ANIMATION_SETTINGS.ANIMATION_SPEED,
  TOTAL_LOOP: 8500 / ANIMATION_SETTINGS.ANIMATION_SPEED,
};

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
  return parts.join(" ");
}

function runAnimation(filmName, data) {
  d3.select("#animation-container").selectAll("*").remove();

  const width = DIMENSIONS.WIDTH - DIMENSIONS.MARGIN.left - DIMENSIONS.MARGIN.right;
  const height = DIMENSIONS.HEIGHT - DIMENSIONS.MARGIN.top - DIMENSIONS.MARGIN.bottom;

  const svg = d3
    .select("#animation-container")
    .append("svg")
    .attr("viewBox", `0 0 ${DIMENSIONS.WIDTH} ${DIMENSIONS.HEIGHT}`)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .append("g")
    .attr("transform", `translate(${DIMENSIONS.MARGIN.left},${DIMENSIONS.MARGIN.top})`);

  const xScale = d3
    .scaleLinear()
    .domain([0, data.totalDuration])
    .range([0, width]);

  const background = svg
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", DIMENSIONS.BAR_HEIGHT)
    .attr("fill", ANIMATION_SETTINGS.BACKGROUND_COLOR)
    .style("opacity", 0);

  const segments = svg
    .selectAll("rect.segment")
    .data(data.segments)
    .enter()
    .append("rect")
    .attr("class", "segment")
    .attr("x", (d) => xScale(d.start))
    .attr("y", 0)
    .attr("width", (d) => xScale(d.duration))
    .attr("height", DIMENSIONS.BAR_HEIGHT)
    .attr("fill", ANIMATION_SETTINGS.SEGMENT_COLOR)
    .style("opacity", 0);

  const totalCondensedDuration = data.segments.reduce(
    (sum, segment) => sum + segment.duration,
    0
  );

  const inputLabel = svg
    .append("text")
    .attr("class", "label")
    .attr("x", width / 2)
    .attr("y", -30)
    .attr("text-anchor", "middle")
    .text(filmName)
    .style("opacity", 0)
    .style("font-size", ANIMATION_SETTINGS.FONT_SIZE);

  const inputDuration = svg
    .append("text")
    .attr("class", "duration")
    .attr("x", width / 2)
    .attr("y", -10)
    .attr("text-anchor", "middle")
    .text(`${formatDuration(data.totalDuration)}`)
    .style("opacity", 0);

  const outputLabel = svg
    .append("text")
    .attr("class", "label")
    .attr("x", width / 2)
    .attr("y", DIMENSIONS.BAR_HEIGHT + 70)
    .attr("text-anchor", "middle")
    .text(filmName + " (condensed)")
    .style("opacity", 0)
    .style("font-size", ANIMATION_SETTINGS.FONT_SIZE);

  const outputDuration = svg
    .append("text")
    .attr("class", "duration")
    .attr("x", width / 2)
    .attr("y", DIMENSIONS.BAR_HEIGHT + 90)
    .attr("text-anchor", "middle")
    .text(`${formatDuration(totalCondensedDuration)}`)
    .style("opacity", 0);

  const condensedOutput = svg
    .append("rect")
    .attr("x", 0)
    .attr("y", DIMENSIONS.BAR_HEIGHT + 100)
    .attr("width", 0)
    .attr("height", DIMENSIONS.BAR_HEIGHT)
    .attr("fill", ANIMATION_SETTINGS.SEGMENT_COLOR)
    .style("opacity", 0);

  // Transitions
  const t1 = d3.transition().duration(ANIMATION_TIMINGS.SHOW_INPUT);
  const t2 = d3
    .transition()
    .duration(ANIMATION_TIMINGS.SHOW_SEGMENTS)
    .delay(ANIMATION_TIMINGS.SHOW_INPUT);
  const t3 = d3
    .transition()
    .duration(ANIMATION_TIMINGS.SHOW_OUTPUT)
    .delay(ANIMATION_TIMINGS.SHOW_INPUT + ANIMATION_TIMINGS.SHOW_SEGMENTS);
  const t4 = d3
    .transition()
    .duration(ANIMATION_TIMINGS.FADE_OUT)
    .delay(ANIMATION_TIMINGS.TOTAL_LOOP - ANIMATION_TIMINGS.FADE_OUT);

  background.transition(t1).style("opacity", 1);
  inputLabel.transition(t1).style("opacity", 1);
  inputDuration.transition(t1).style("opacity", 1);

  segments.transition(t2).style("opacity", 1);

  outputLabel.transition(t3).style("opacity", 1);
  outputDuration.transition(t3).style("opacity", 1);
  condensedOutput
    .transition(t3)
    .attr("width", xScale(totalCondensedDuration))
    .style("opacity", 1);

  svg.selectAll("rect, text").transition(t4).style("opacity", 0);
}

function runAnimationSequence() {
  let index = 0;

  function animateNext() {
    if (index < filesData.length) {
      runAnimation(filesData[index].name, filesData[index].data);
      index++;
      setTimeout(animateNext, ANIMATION_TIMINGS.TOTAL_LOOP);
    } else {
      index = 0;
      setTimeout(animateNext, ANIMATION_TIMINGS.PAUSE_BETWEEN_FILES);
    }
  }

  animateNext();
}

document.addEventListener("DOMContentLoaded", () => {
  runAnimationSequence();
});

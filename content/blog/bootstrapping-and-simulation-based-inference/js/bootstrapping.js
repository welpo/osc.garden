const BORDER_STYLE = '2px solid';
const HISTOGRAM_BAR_CLASS = 'histogram-bar';
const HISTOGRAM_BIN_WIDTH = 0;
const MAX_NUMBER_OF_HOURS = 15;
const NUMBER_CIRCLE_CLASS = 'number-circle';
const NUMBER_OF_SAMPLES = 10;
const barsContainer = document.getElementById('bars-container');
const ciLowerElements = document.querySelectorAll('.ci-lower');
const ciUpperElements = document.querySelectorAll('.ci-upper');
const largestMeanElement = document.getElementById('largest-mean');
const lastBootstrappedSampleMean = document.getElementById('last-bootstrapped-sample-mean');
const lastSampleElement = document.getElementById('last-bootstrapped-sample');
const modeMeanElement = document.getElementById('mode-mean');
const originalSampleElement = document.getElementById('original-sample');
const smallestMeanElement = document.getElementById('smallest-mean');
const totalBootstrappedSamplesElement = document.getElementById('total-bootstrapped-samples');
const ciText = document.getElementById('ci-text')

function getColor() {
    const hue = 360 * Math.random();
    const saturation = 65 + 80 * Math.random();
    const lightness = 85 + 5 * Math.random();
    const opacity = 0.5;
    return {
        background: `hsla(${hue}, ${saturation}%, ${lightness}%, ${opacity})`,
        border: `hsl(${hue}, ${saturation}%, ${lightness - 20}%)`
    };
}

const clearElementChildren = (element) => {
    element.innerHTML = '';
};

const calculateMean = (sample) => {
    let sum = 0;
    for (let i = 0; i < sample.children.length; i++) {
        sum += parseInt(sample.children[i].textContent);
    }
    return (sum / sample.children.length).toFixed(1);
};

const createBall = (number) => {
    const ball = document.createElement('div');
    ball.className = NUMBER_CIRCLE_CLASS;
    ball.textContent = number;
    if (number !== '?') {
        const color = getColor();
        ball.style.backgroundColor = color.background;
        ball.style.border = `${BORDER_STYLE} ${color.border}`;
    } else {
        // Apply style for empty balls.
        ball.style.backgroundColor = '#FFFFFF';
        ball.style.border = `2px solid #D4D4D4`;
    }
    return ball;
};

const initializeSample = (sampleElement, sampleMeanElementId, initialValue) => {
    clearElementChildren(sampleElement);
    for (let i = 0; i < NUMBER_OF_SAMPLES; i++) {
        const num = initialValue || Math.floor(Math.random() * (MAX_NUMBER_OF_HOURS + 1));
        sampleElement.appendChild(createBall(num));
    }
    const sampleMean = calculateMean(sampleElement);
    document.getElementById(sampleMeanElementId).textContent = sampleMean;
};

let originalSampleMean;

const initializeOriginalSample = () => {
    initializeSample(originalSampleElement, 'original-sample-mean');
    originalSampleMean = calculateMean(originalSampleElement);
};

const initializeBootstrapSample = () => {
    initializeSample(lastSampleElement, 'last-bootstrapped-sample-mean', '?');
    lastBootstrappedSampleMean.textContent = '?';
};


const createBootstrapSample = () => {
    clearElementChildren(lastSampleElement);
    for (let i = 0; i < NUMBER_OF_SAMPLES; i++) {
        const randomIndex = Math.floor(Math.random() * NUMBER_OF_SAMPLES);
        const originalBall = originalSampleElement.children[randomIndex];
        const newBall = originalBall.cloneNode(true);
        lastSampleElement.appendChild(newBall);
    }
    lastBootstrappedSampleMean.textContent = calculateMean(lastSampleElement);
};

function createSamplesAndUpdateHistogram(numSamples) {
    for (let i = 0; i < numSamples; i++) {
        createBootstrapSample();
        const lastSampleMean = calculateMean(lastSampleElement);
        updateHistogramData(lastSampleMean);
        updateTotalBootstrappedSamples();
    }
}

const updateTotalBootstrappedSamples = () => {
    const totalSamples = [...histogramData.values()].reduce((sum, count) => sum + count, 0);
    totalBootstrappedSamplesElement.textContent = totalSamples;
};

const histogramData = new Map();

const updateHistogramData = (mean) => {
    const binnedMean = HISTOGRAM_BIN_WIDTH === 0 ? mean : Math.round(mean / HISTOGRAM_BIN_WIDTH) * HISTOGRAM_BIN_WIDTH;
    const count = histogramData.get(binnedMean) || 0;
    histogramData.set(binnedMean, count + 1);
};

barsContainer.addEventListener('touchend', (e) => {
    if (e.target.classList.contains(HISTOGRAM_BAR_CLASS)) {
        e.preventDefault();
        toggleTooltip(e.target);
    }
});

const renderHistogram = () => {
    clearElementChildren(barsContainer);

    const sortedData = [...histogramData.entries()].sort((a, b) => a[0] - b[0]);
    const maxCount = Math.max(...histogramData.values());

    sortedData.forEach(([mean, count]) => {
        const normalizedMean = Math.round(mean * 100) / 100;
        const barHeight = (count / maxCount) * 100;
        const bar = document.createElement('div');
        bar.className = HISTOGRAM_BAR_CLASS;
        bar.style.height = `${barHeight}%`;

        bar.style.backgroundColor = normalizedMean == originalSampleMean ? 'var(--complementary-color)' : undefined;

        bar.dataset.mean = normalizedMean;
        bar.dataset.count = count;

        barsContainer.appendChild(bar);
    });

    updateHistogramStats();
    updateConfidenceInterval();
};

const updateHistogramStats = () => {
    const sortedData = [...histogramData.entries()].sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
    const smallestMean = sortedData[0][0];
    const largestMean = sortedData[sortedData.length - 1][0];
    const modeData = [...histogramData.entries()].reduce((acc, curr) => curr[1] > acc[1] ? curr : acc);
    const modeMean = modeData[0];

    smallestMeanElement.textContent = smallestMean;
    largestMeanElement.textContent = largestMean;
    modeMeanElement.textContent = modeMean;
};

const toggleTooltip = (bar) => {
    if (bar.classList.contains('active-tooltip')) {
        bar.classList.remove('active-tooltip');
    } else {
        // Remove active-tooltip class from all bars.
        const allBars = document.querySelectorAll('.histogram-bar');
        allBars.forEach(b => b.classList.remove('active-tooltip'));

        // Add active-tooltip class to the clicked bar.
        bar.classList.add('active-tooltip');
    }
};

const calculateConfidenceInterval = () => {
    const sampleMeans = [...histogramData.keys()].map(parseFloat).sort((a, b) => a - b);
    const lowerIndex = Math.floor(0.025 * sampleMeans.length);
    const upperIndex = Math.ceil(0.975 * sampleMeans.length) - 1; // Adjust for zero indexing.
    const lowerLimit = sampleMeans[lowerIndex];
    const upperLimit = sampleMeans[upperIndex];
    return { lower: lowerLimit, upper: upperLimit };
};

const updateConfidenceInterval = () => {
    const confidenceInterval = calculateConfidenceInterval();
    ciLowerElements.forEach(el => {
        el.textContent = confidenceInterval.lower.toFixed(1);
    });
    ciUpperElements.forEach(el => {
        el.textContent = confidenceInterval.upper.toFixed(1);
    });
    ciText.style.display = 'inline';
};

function handleSampleCreation(sampleSize) {
    createSamplesAndUpdateHistogram(sampleSize);
    renderHistogram();
}

function resetHistogram() {
    initializeBootstrapSample();
    clearElementChildren(barsContainer);
    initializeOriginalSample();

    totalBootstrappedSamplesElement.textContent = '';

    // Reset text content of elements
    ciLowerElements.forEach(element => {
        element.textContent = '?';
    });
    ciUpperElements.forEach(element => {
        element.textContent = '?';
    });
    smallestMeanElement.textContent = '?';
    modeMeanElement.textContent = '?';
    largestMeanElement.textContent = '?';

    histogramData.clear();
    ciText.style.display = 'none';
}

document.getElementById('create-one-sample').addEventListener('click', () => handleSampleCreation(1));
document.getElementById('create-fifty-samples').addEventListener('click', () => handleSampleCreation(50));
document.getElementById('create-five-hundred-samples').addEventListener('click', () => handleSampleCreation(500));
document.getElementById('reset-samples').addEventListener('click', resetHistogram);

// Deactivate tooltip on touchend events outside the active tooltip bar.
document.addEventListener('touchend', (e) => {
    const activeTooltipBar = document.querySelector('.histogram-bar.active-tooltip');
    if (activeTooltipBar && !activeTooltipBar.contains(e.target)) {
        activeTooltipBar.classList.remove('active-tooltip');
    }
});

initializeOriginalSample();
initializeBootstrapSample();

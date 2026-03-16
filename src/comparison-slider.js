/**
 * Create a before/after comparison slider inside the given container.
 *
 * @param {HTMLElement} container - The container to render into
 * @param {string} originalSrc - Data URL of the original image
 * @param {string} resultSrc - Data URL of the result (bg removed)
 */
export function createComparisonSlider(container, originalSrc, resultSrc) {
  container.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'comparison-wrapper';

  // After image (result — bottom layer, full width)
  const afterImg = document.createElement('img');
  afterImg.src = resultSrc;
  afterImg.className = 'comparison-after';
  afterImg.alt = 'Background removed';
  afterImg.draggable = false;

  // Before container (original — clipped)
  const beforeDiv = document.createElement('div');
  beforeDiv.className = 'comparison-before';
  const beforeImg = document.createElement('img');
  beforeImg.src = originalSrc;
  beforeImg.alt = 'Original';
  beforeImg.draggable = false;
  beforeDiv.appendChild(beforeImg);

  // Labels
  const labelBefore = document.createElement('span');
  labelBefore.className = 'comparison-label label-before';
  labelBefore.textContent = 'Original';

  const labelAfter = document.createElement('span');
  labelAfter.className = 'comparison-label label-after';
  labelAfter.textContent = 'Removed';

  // Handle (draggable divider)
  const handle = document.createElement('div');
  handle.className = 'comparison-handle';
  handle.innerHTML = '<span class="handle-circle">&#x2194;</span>';

  wrapper.append(afterImg, beforeDiv, handle, labelBefore, labelAfter);
  container.appendChild(wrapper);

  // Once the after image loads and sets the wrapper size, match the before image width
  afterImg.onload = () => {
    beforeImg.style.width = wrapper.offsetWidth + 'px';
  };
  // Also handle resize
  const resizeObserver = new ResizeObserver(() => {
    beforeImg.style.width = wrapper.offsetWidth + 'px';
  });
  resizeObserver.observe(wrapper);

  // Set initial position
  let position = 0.5;
  updatePosition(position);

  // Interaction
  let dragging = false;

  function onPointerDown(e) {
    dragging = true;
    wrapper.setPointerCapture(e.pointerId);
    updateFromEvent(e);
  }

  function onPointerMove(e) {
    if (!dragging) return;
    updateFromEvent(e);
  }

  function onPointerUp() {
    dragging = false;
  }

  function updateFromEvent(e) {
    const rect = wrapper.getBoundingClientRect();
    position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    updatePosition(position);
  }

  function updatePosition(pos) {
    const pct = pos * 100 + '%';
    beforeDiv.style.width = pct;
    handle.style.left = pct;
  }

  wrapper.addEventListener('pointerdown', onPointerDown);
  wrapper.addEventListener('pointermove', onPointerMove);
  wrapper.addEventListener('pointerup', onPointerUp);
  wrapper.addEventListener('pointercancel', onPointerUp);
}

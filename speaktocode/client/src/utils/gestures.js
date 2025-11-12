import { showToast } from './toast';

let touchStartX = 0;
let touchStartY = 0;
let touchStartDistance = 0;

export const setupGestures = (editorContext) => {
  const editorArea = document.querySelector('.editor-area');
  if (!editorArea) return;

  // Touch start
  editorArea.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      // Two finger gesture - prepare for pinch
      touchStartDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );
    } else if (e.touches.length === 3) {
      // Three finger gesture - prepare for swipe
      touchStartX = e.touches[0].pageX;
      touchStartY = e.touches[0].pageY;
    }
  });

  // Touch move
  editorArea.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
      // Pinch to zoom
      const currentDistance = Math.hypot(
        e.touches[0].pageX - e.touches[1].pageX,
        e.touches[0].pageY - e.touches[1].pageY
      );

      if (touchStartDistance > 0) {
        const delta = currentDistance - touchStartDistance;
        if (Math.abs(delta) > 20) {
          if (delta > 0) {
            adjustZoom(1, editorContext);
            showGestureIndicator('Zoom In');
          } else {
            adjustZoom(-1, editorContext);
            showGestureIndicator('Zoom Out');
          }
          touchStartDistance = currentDistance;
        }
      }
    } else if (e.touches.length === 3) {
      // Three finger swipe for tab navigation
      const deltaX = e.touches[0].pageX - touchStartX;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          navigateTabs(-1, editorContext);
          showGestureIndicator('Previous Tab');
        } else {
          navigateTabs(1, editorContext);
          showGestureIndicator('Next Tab');
        }
        touchStartX = e.touches[0].pageX;
      }
    }
  });

  // Wheel event for pinch zoom simulation (trackpad)
  editorArea.addEventListener('wheel', (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        adjustZoom(1, editorContext);
      } else {
        adjustZoom(-1, editorContext);
      }
    }
  }, { passive: false });
};

const adjustZoom = (delta, editorContext) => {
  const { settings, setSettings, saveSettings } = editorContext;
  const newFontSize = Math.max(10, Math.min(30, settings.fontSize + delta));
  
  const newSettings = { ...settings, fontSize: newFontSize };
  setSettings(newSettings);
  saveSettings(newSettings);
  
  showToast(`Font size: ${newFontSize}px`, 'info');
};

const navigateTabs = (direction, editorContext) => {
  const { openTabs, activeTabId, setActiveTabId } = editorContext;
  
  if (openTabs.length === 0) return;

  const currentIndex = openTabs.findIndex(t => t.id === activeTabId);
  let newIndex = currentIndex + direction;

  if (newIndex < 0) newIndex = openTabs.length - 1;
  if (newIndex >= openTabs.length) newIndex = 0;

  setActiveTabId(openTabs[newIndex].id);
  showToast(`Switched to ${openTabs[newIndex].name}`, 'info');
};

const showGestureIndicator = (text) => {
  let indicator = document.querySelector('.gesture-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'gesture-indicator';
    document.body.appendChild(indicator);
  }

  indicator.textContent = text;
  indicator.classList.add('active');

  setTimeout(() => {
    indicator.classList.remove('active');
  }, 1000);
};

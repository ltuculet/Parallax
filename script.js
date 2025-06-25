if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Registro exitoso', reg))
      .catch(err => console.warn('Error al tratar de registrar', err))
  }

// Function to detect iOS
function isIOS() {
  // Standard iOS platform checks
  if ([
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ].includes(navigator.platform)) {
    return true;
  }
  // Check for iOS devices identifying as Mac but are touch-capable
  // (e.g., iPadOS 13+ and potentially iOS 18+ on iPhones)
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 0) {
    // Further check to differentiate from actual Macs with touchscreens if necessary,
    // though for this PWA prompt, any touch-based "Safari" on a supposed MacIntel (likely Apple device) is relevant.
    // A more specific check could be navigator.userAgent.includes('iPhone') or 'iPad' if they still include that.
    // For now, being touch-capable on MacIntel is a strong indicator for iOS/iPadOS.
    return true;
  }
  return false;
}

// Function to detect Safari
function isSafari() {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function isStandalonePWA() {
    return (window.matchMedia('(display-mode: standalone)').matches);
}

document.addEventListener('DOMContentLoaded', () => {
  const iosInstallModal = document.getElementById('iosInstallModal');
  const closeIosInstallModal = document.getElementById('closeIosInstallModal');
  const understandIosInstallModal = document.getElementById('understandIosInstallModal');
  const iosPromptShownKey = 'iosInstallPromptShown';

  function showIosInstallModal() {
    if (iosInstallModal) {
      iosInstallModal.style.display = 'block';
      // Bootstrap 5 uses classes to control modal visibility, but since MDB might be different or older, direct style manipulation is a fallback.
      // For MDB, you might typically use something like:
      // const modal = new mdb.Modal(iosInstallModal);
      // modal.show();
      // However, to keep it simple and less dependent on MDB's specific JS API version, direct style is used.
      // Adding a class for potential CSS transitions if needed.
      iosInstallModal.classList.add('show');
    }
  }

  function hideIosInstallModal() {
    if (iosInstallModal) {
      iosInstallModal.style.display = 'none';
      iosInstallModal.classList.remove('show');
      // Similar to show, direct manipulation. MDB's JS API would be:
      // const modal = mdb.Modal.getInstance(iosInstallModal);
      // if (modal) modal.hide();
    }
  }

  if (isIOS() && isSafari() && !isStandalonePWA()) {
    const promptShown = localStorage.getItem(iosPromptShownKey);
    if (!promptShown) {
      console.log("iOS Safari detected, not in standalone mode, and prompt not shown before. Showing modal.");
      showIosInstallModal();
    } else {
      console.log("iOS Safari detected, but prompt already shown.");
    }
  }

  if (closeIosInstallModal) {
    closeIosInstallModal.addEventListener('click', () => {
      hideIosInstallModal();
      localStorage.setItem(iosPromptShownKey, 'true');
    });
  }

  if (understandIosInstallModal) {
    understandIosInstallModal.addEventListener('click', () => {
      hideIosInstallModal();
      localStorage.setItem(iosPromptShownKey, 'true');
    });
  }
});

// Parallax effect for background image using device orientation
if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function(event) {
        const fondo = document.getElementById('fondo');
        if (!fondo) return;

        let beta = event.beta; // Front-to-back tilt
        let gamma = event.gamma; // Left-to-right tilt

        const maxTilt = 20; // Max tilt in degrees for full effect range

        let yMovement = (beta / maxTilt);
        let xMovement = (gamma / maxTilt);

        yMovement = Math.max(-1, Math.min(1, yMovement));
        xMovement = Math.max(-1, Math.min(1, xMovement));

        const movementStrength = 20; // Max percentage to move the image from its -20% offset

        const transformX = -xMovement * movementStrength;
        const transformY = -yMovement * movementStrength;

        // Using requestAnimationFrame for smoother animations
        // and only updating if the transform value has changed to save resources.
        const newTransform = `translate(${transformX}%, ${transformY}%)`;
        if (fondo.style.transform !== newTransform) {
            requestAnimationFrame(() => {
                fondo.style.transform = newTransform;
            });
        }
    }, true); // Using capture phase for potentially faster response, though not strictly necessary.
} else {
    console.log("DeviceOrientationEvent not supported. Falling back to mousemove for parallax.");
    // Fallback for desktop: mouse-based parallax
    document.addEventListener('mousemove', function(e) {
        const fondo = document.getElementById('fondo');
        if (!fondo) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        const mouseX = (e.clientX - width / 2) / width; // -0.5 to 0.5
        const mouseY = (e.clientY - height / 2) / height; // -0.5 to 0.5

        const movementStrength = 10; // Reduced strength for mouse, more subtle

        const transformX = -mouseX * movementStrength;
        const transformY = -mouseY * movementStrength;

        const newTransform = `translate(${transformX}%, ${transformY}%)`;
        if (fondo.style.transform !== newTransform) {
            requestAnimationFrame(() => {
                fondo.style.transform = newTransform;
            });
        }
    });
}
import { readString, writeString } from './storage.js';

const dialog = document.getElementById('onboardingDialog');
const closeButton = document.getElementById('closeOnboardingBtn');
const openButton = document.getElementById('openOnboardingBtn');
const onboardingKey = 'mathGeniusOnboardingVersion';
const onboardingVersion = '1';

function closeOnboarding() {
    dialog.close();
    writeString(onboardingKey, onboardingVersion);
}

function openOnboarding() {
    dialog.showModal();
}

closeButton.addEventListener('click', closeOnboarding);
openButton.addEventListener('click', openOnboarding);

dialog.addEventListener('cancel', closeOnboarding);

if (readString(onboardingKey) !== onboardingVersion) {
    openOnboarding();
}

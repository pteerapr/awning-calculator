const calculatorSelect = document.getElementById('calculatorSelect');
const openButton = document.getElementById('openButton');

function updateButtonState() {
  openButton.disabled = !calculatorSelect.value;
}

calculatorSelect.addEventListener('change', updateButtonState);
openButton.addEventListener('click', () => {
  if (calculatorSelect.value) {
    window.location.href = calculatorSelect.value;
  }
});

updateButtonState();

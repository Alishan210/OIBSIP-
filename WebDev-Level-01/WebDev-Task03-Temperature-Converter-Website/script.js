document.getElementById('convertBtn').addEventListener('click', convertTemperature);

function convertTemperature() {
    const inputVal = document.getElementById('tempInput').value;
    const unit = document.getElementById('unitSelect').value;
    const errorMsg = document.getElementById('errorMsg');
    const resultArea = document.getElementById('resultArea');

    // Clear previous errors & results
    errorMsg.classList.add('hidden');
    resultArea.classList.add('hidden');
    errorMsg.innerText = '';

    // 1. Validation: Check if input is empty or non-numeric
    if (inputVal === '' || isNaN(inputVal)) {
        showError('Please enter a valid numeric temperature value.');
        return;
    }

    const temp = parseFloat(inputVal);
    let celsius, fahrenheit, kelvin;

    // Convert input value to Celsius first for baseline validation
    if (unit === 'celsius') {
        celsius = temp;
    } else if (unit === 'fahrenheit') {
        celsius = (temp - 32) * (5 / 9);
    } else if (unit === 'kelvin') {
        celsius = temp - 273.15;
    }

    // 2. Edge Case Handling: Absolute Zero Violation Check (-273.15°C / 0 K)
    if (celsius < -273.15) {
        showError('Temperature cannot be below Absolute Zero (−273.15°C / 0 K).');
        return;
    }

    // Complete all unit conversions
    fahrenheit = (celsius * 9 / 5) + 32;
    kelvin = celsius + 273.15;

    // Display formatted results (rounded to 2 decimal places)
    document.getElementById('celsiusVal').innerText = `${celsius.toFixed(2)} °C`;
    document.getElementById('fahrenheitVal').innerText = `${fahrenheit.toFixed(2)} °F`;
    document.getElementById('kelvinVal').innerText = `${kelvin.toFixed(2)} K`;

    // Show output area
    resultArea.classList.remove('hidden');
}

function showError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.innerText = message;
    errorMsg.classList.remove('hidden');
}
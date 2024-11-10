let correctCountry;
let options = [];
let score   = 0;
let guesses = 0;

function getCountryNameInEnglish(country) {
    return ((country.translations && country.translations.en) ? country.translations.en.common : country.name.common); // Check if has an English translation
}

function getRandomCountries() {
    // Fetch all countries data from the API and select a random country as the correct one
    fetch('https://restcountries.com/v3.1/all').then(response => response.json()).then(data => {
        const randomIndex = Math.floor(Math.random() * data.length);
        correctCountry    = data[randomIndex];
        options           = [correctCountry];

        // Adds 3 more options of random countries
        while (options.length < 4) {
            const randomOption = data[Math.floor(Math.random() * data.length)];
            if (!options.includes(randomOption)) {
                options.push(randomOption);
            }
        }

        options.sort(() => Math.random() - 0.5); // Shuffle the options
        displayQuestion();
    }).catch(error => console.error('Erro:', error));
}

function displayQuestion() {
    document.getElementById('flagImg').src           = correctCountry.flags.png; // Display the nation's flag
    document.getElementById('flagImg').style.display = 'block';
    document.getElementById('capital').innerHTML     = correctCountry.capital;

    const optionsDiv     = document.getElementById('options');
    optionsDiv.innerHTML = ''; // Clear previous options
    
    // Create buttons for the counstry options
    options.forEach(option => {
        const button     = document.createElement('button');
        button.innerText = getCountryNameInEnglish(option);
        button.onclick   = () => checkAnswer(option);
        optionsDiv.appendChild(button);
    });
}

function checkAnswer(selected) {
    const nextBtn    = document.getElementById('nextBtn');
    const optionsDiv = document.getElementById('options');
    
    guesses++; // Count all answers

    // Count all correct answers
    if (selected.name.common === correctCountry.name.common) {
        score++;
    }

    // Disable all options (to not answer more than once)
    Array.from(optionsDiv.children).forEach(button => {
        button.disabled = true;
        button.style.backgroundColor = ((button.innerText == correctCountry.name.common) ? 'green' : 'red'); // Change the color of the buttons according to the correct answer
    });

    document.getElementById('score').innerHTML     = score; // Display the score
    document.getElementById('guessRate').innerHTML = `${(score / guesses * 100).toFixed(1)}%`; // Display the guess rate
    nextBtn.disabled = false; // Enable the "Next" button
}

document.getElementById('nextBtn').onclick = () => {
    document.getElementById('nextBtn').disabled = true; // Disable the "next" button
    getRandomCountries(); // Load a new flag
};

// Check if it's light or dark theme
document.getElementById('light_dark_theme').onchange = () => {
    const isChecked = document.getElementById('light_dark_theme').checked;
    if (isChecked) {
        // Draw the moon icon
        document.getElementById('light_dark_icon').innerHTML =  '<svg id="moon-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                                                '    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' +
                                                                '</svg>';
    } else {
        // Draw the sun icon
        document.getElementById('light_dark_icon').innerHTML =  '<svg id="sun-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                                                                '    <circle cx="12" cy="12" r="5"></circle>' +
                                                                '    <line x1="12" y1="1" x2="12" y2="3"></line>' +
                                                                '    <line x1="12" y1="21" x2="12" y2="23"></line>' +
                                                                '    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>' +
                                                                '    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>' +
                                                                '    <line x1="1" y1="12" x2="3" y2="12"></line>' +
                                                                '    <line x1="21" y1="12" x2="23" y2="12"></line>' +
                                                                '    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>' +
                                                                '    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' +
                                                                '</svg>';
    }

    document.body.classList.toggle('dark-theme', isChecked); // Add the class 'dark-theme' on body when it is the dark theme
};

// Initial call to load the first flag and score
getRandomCountries();
document.getElementById('score').innerHTML     = score;
document.getElementById('guessRate').innerHTML = `${(0).toFixed(1)}%`;
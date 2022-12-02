const API_KEY = "04xkUteXqtvmUPW0tnKAX41mMMQ"; // Turn API key into variable to avoid pasting it in constantly
const API_URL = "https://ci-jshint.herokuapp.com/api"; // Turn API url into variable to avoid pasting it in constantly
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

document.getElementById("status").addEventListener("click", e => getStatus(e)); // Check status of API (end date) when button is clicked
document.getElementById("submit").addEventListener("click", e => postForm(e)); // Send data from form when submit button is clicked

/** 
 * Deal with options by pushing selected options into one comma separated list
*/
function processOptions(form) {

    let optArray = [];

    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optArray.push(entry[1]);
        }
    }
    form.delete("options");

    form.append("options", optArray.join());

    return form;
}

/**
 * Send form data to be checked
*/
async function postForm(e) {
    const form = processOptions(new FormData(document.getElementById("checksform")));

    const response = await fetch(API_URL, {
                        method: "POST",
                        headers: {
                                    "Authorization": API_KEY,
                                 },
                                 body: form,
    });

    const data = await response.json();

    if (response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

/**
 * Return any errors in code sent through the form
*/
function displayErrors(data) {

    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}

/**
 * Get status of API key to see if it's still in date
 */
async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;

    const response = await fetch(queryString);

    const data = await response.json();

    if (response.ok) {
        displayStatus(data.expiry);
    } else {
        throw new Error(data.error);
    }
}

/**
 * Display status of API in modal box after button is clicked 
 */
function displayStatus(data) {

    let heading = "API Key Status";
    let results = `<div>Your key is valid until</div>`
    results += `<div class="key-status">${data.expiry}</div>`

    document.getElementById("resultsModalTitle").innerHTML = heading;
    document.getElementById("results-content").innerHTML = results;

    resultsModal.show();
}
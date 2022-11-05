// Load databases

var page = document.getElementById("page").innerHTML;
document.getElementById("page").innerHTML = "Loading...";

import identifiers from '/identifiers.json' assert { type: 'json' };
import metadata from '/metadata.json' assert { type: 'json' };
import index from '/index.json' assert { type: 'json' };

document.getElementById("page").innerHTML = page;
document.getElementById("total").innerHTML = Math.floor(
    Object.keys(identifiers).length / 2);

// Extract random suggestions

var suggestions = ""
var numberOfKeywords = Object.keys(index).length;
for (let i = 0; i < 20; i++) {
    let random = Math.floor(Math.random() * numberOfKeywords);
    let keyword = Object.keys(index)[random];
    let a = `<a onclick="document.getElementById('search').value = '${keyword}'; submit()">${keyword}</a> `;
    suggestions = suggestions + a;
}
document.getElementById("suggestions").innerHTML = suggestions

// Enable enter

var input = document.getElementById("search");
input.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("submit").click();
    }
});


// Help functions

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

// Submit function

window.submit = function () {
    document.getElementById("result").innerHTML = "";
    // Validate search input
    let search = document.getElementById("search").value;
    search = search.toLowerCase();
    if (search == "") {
        return
    }
    // Perform search
    let searches = search.split("+");
    let result = [];
    searches.forEach(term => {
        term = term.trim()
        let termResult = index[term];
        if (termResult != null) {
            result = result.concat(termResult);
        };
    });
    // Apply "+"
    if (searches.length > 1) {
        searches.forEach(term => {
            term = term.trim();
            let termResult = index[term];
            if (termResult != null) {
                result = result.filter(x => termResult.includes(x));
            } else {
                result = [];
            };
        });
        result = result.filter(onlyUnique);
    };
    // Fill result template
    let html = "<table>";
    if (result != null) {
        let size = Object.keys(result).length;
        html = `${html}<tr><td></td><td>${size} results</td></tr>`
        result.forEach(hash => {
            let url = identifiers[hash];
            let img = metadata[hash]["T"];
            let a = `<a target="_blank" href="${img}">
            <img src="${img}" alt="thumbnail" width="150"></a>`;
            let desc = metadata[hash]["L"] + "<p>" + `<a target="_blank" href="${url}">${url}</a>`;
            html = `${html}<tr><td>${a}</td><td>${desc}</td></tr>`;
        })

    } else { html = `${html}<tr><td></td><td>0 results</td></tr>` };
    document.getElementById("result").innerHTML = html + "</table>";
}

// Set focus

window.onload = function () {
    document.getElementById("search").focus();
}
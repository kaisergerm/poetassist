// node.js modules for file access and user input
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// creates interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// determines the path to the wordlist file in the assets directory
const filePath = path.join(__dirname, 'assets/wordlist.txt');

function findRhymes(inputWord, wordList) { //finds rhymes for a given word
    let rhymes = [];
    const inputWordPhoneticEnd = extractPhoneticEnd(inputWord); // extracts phonetic end of the input word

    wordList.forEach(word => {
        if (word !== inputWord) {
            const wordPhoneticEnd = extractPhoneticEnd(word); // extracts phonetic end of the current word and checks if ends are similar
            if (isPhoneticallySimilar(inputWordPhoneticEnd, wordPhoneticEnd)) {
                rhymes.push(word); // adds the word to the list of rhymes if similar
            }
        }
    });
    return rhymes;
}

function extractPhoneticEnd(word) { // extracts the phonetic end of a word
    if (word.length <= 3) { // if the word is 3 or fewer characters, return the word itself
        return word;
    } else {
        const endIndex = word.length;
        const startIndex = endIndex - 3; //calculates the starting index for extracting the last 3 characters
        return word.substring(startIndex, endIndex); //returns the substring from startIndex to endIndex
    }
}

function isPhoneticallySimilar(end1, end2) { //determines if two phonetic ends are similar
    if (end1.length !== end2.length) { //if =lengths of the ends are different, return false
        return false;
    }

    let similarityScore = 0;
    for (let i = 0; i < end1.length; i++) {
        if (end1[i] === end2[i]) { //compares characters at the same position in both ends
            similarityScore++; //increments score if characters are the same
        }
    }

    const similarityThreshold = 0.7; // / defines  threshold for similarity (70% similarity)
    // returns true if similarity score meets or exceeds the threshold
    return (similarityScore / end1.length) >= similarityThreshold;
}

// read the file and process rhymes
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    let wordList = data.split('\n'); //splits the file data into an array of words

    //prompts user for input word
    rl.question('Enter a word to find rhymes: ', (inputWord) => {
        let rhymes = findRhymes(inputWord, wordList);
        console.log('Rhymes for "' + inputWord + '":', rhymes);
        rl.close();
    });
});
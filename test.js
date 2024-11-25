function extractNumbersFromText(inputString) {
    // Find the index of the hyphen
    const hyphenIndex = inputString.indexOf('-');

    // Extract the substring after the hyphen
    const substringAfterHyphen = inputString.slice(hyphenIndex + 1);

    // Find the index of "of"
    const ofIndex = inputString.indexOf('of');

    // Extract the substring after "of"
    const substringAfterOf = inputString.slice(ofIndex + 2);

    // Convert the substrings to numbers using parseInt
    const numberAfterHyphen = parseInt(substringAfterHyphen, 10);
    const totalResults = parseInt(substringAfterOf, 10);

    // Check if the parsed numbers are valid
    if (!isNaN(numberAfterHyphen) && !isNaN(totalResults)) {
        return { numberAfterHyphen, totalResults };
    } else {
        return null; // Or handle the case when the numbers are not valid
    }
}


setInterval(()=>{
    let x="Showing results 806 - 824 of 824";
    const {numberAfterHyphen,totalResults}=extractNumbersFromText(x);
    console.log({numberAfterHyphen,totalResults});
}, 2000); 

// func();
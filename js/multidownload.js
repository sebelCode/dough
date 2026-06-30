var tempLink = document.createElement('a');
document.body.appendChild(tempLink);

export function downloadMultipleFiles(fileUrls) {

    console.log("Beginning the multidownload")
    var fileIndex = 0

    setInterval(function() {

        var fileUrl = fileUrls[fileIndex];
        console.log(fileIndex, fileUrl)
        tempLink.setAttribute('href', fileUrl);
        tempLink.setAttribute('download', `sprite${fileIndex}`);
        tempLink.click();
        
        fileIndex += 1

        if (fileIndex >= fileUrl.length) {
            clearInterval()
        }

    }, 1500); // if less than 200, not all files are downloaded in Firefox
}
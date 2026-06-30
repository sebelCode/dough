var tempLink = document.createElement('a');
document.body.appendChild(tempLink);

export function downloadMultipleFiles(fileUrls) {
    var fileIndex = 0
    setTimeout(function() {

        var fileUrl = fileUrls[fileIndex];
        tempLink.setAttribute('href', fileUrl);
        tempLink.setAttribute('download', fileUrl);
        tempLink.click();
        
        if(fileIndex > -1) {
            fileUrls.splice(fileIndex, 1);
        }
        
        if(fileUrls.length > 0) {
            downloadMultipleFiles(fileUrls);
        } else {
            document.body.removeChild(tempLink);
        }
        fileIndex += 1

    }, 200); // if less than 200, not all files are downloaded in Firefox
}
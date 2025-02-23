const API_KEY = 'AIzaSyBHRmeT95ikCWxf1pCRBpevjMbRjQXyZsc'; // Replace with your API key
const FOLDER_ID = '1v0ZiLruErTZdOKnfW5fawrgnpk1XXk4v'; // Your folder ID

// Fetch files from Google Drive folder
async function fetchFiles(folderName) {
    console.log(`Fetching files from ${folderName} folder...`);
    try {
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+and+name='${folderName}'&key=${API_KEY}`
        );
        const data = await response.json();
        console.log('Folder response:', data);

        if (!data.files || data.files.length === 0) {
            console.error(`Folder "${folderName}" not found.`);
            return [];
        }

        const folderId = data.files[0].id; // Get the folder ID for Photos, Videos, or Audios
        console.log(`Folder ID for ${folderName}:`, folderId);

        const filesResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${API_KEY}`
        );
        const filesData = await filesResponse.json();
        console.log('Files in folder:', filesData.files);

        return filesData.files;
    } catch (error) {
        console.error('Error fetching files:', error);
        return [];
    }
}

// Display files on the website
async function displayFiles(folderName, galleryId) {
    const files = await fetchFiles(folderName);
    const gallery = document.getElementById(galleryId);

    if (files.length === 0) {
        console.error(`No files found in ${folderName} folder.`);
        gallery.innerHTML = `<p>No files found in ${folderName} folder.</p>`;
        return;
    }

    files.forEach(file => {
        const fileUrl = `https://drive.google.com/uc?export=view&id=${file.id}`;
        if (folderName === 'Photos') {
            gallery.innerHTML += `
                <a href="${fileUrl}" data-lightbox="photos">
                    <img src="${fileUrl}" alt="${file.name}" loading="lazy">
                </a>
            `;
        } else if (folderName === 'Videos') {
            gallery.innerHTML += `
                <video controls>
                    <source src="${fileUrl}" type="video/mp4">
                    Your browser does not support the video tag.
                </video>
            `;
        } else if (folderName === 'Audios') {
            gallery.innerHTML += `
                <audio controls>
                    <source src="${fileUrl}" type="audio/mpeg">
                    Your browser does not support the audio tag.
                </audio>
            `;
        }
    });
}

// Load files on page load
window.addEventListener('load', () => {
    displayFiles('Photos', 'photos-gallery');
    displayFiles('Videos', 'videos-gallery');
    displayFiles('Audios', 'audios-gallery');
});
document.addEventListener("DOMContentLoaded", () => {
  browser.tabs
    .executeScript({
      code: `Array.from(document.images).map(img => ({ src: img.src, width: img.width, height: img.height }));`,
    })
    .then((results) => {
      const imageGrid = document.getElementById("image-grid");
      const PopUp = document.getElementById("PopUp");
      if (results.length === 0) {
        PopUp.innerHTML =
          "<div  style='color: white;'>No images found on this page.</div>";
        return;
      }

      const uniqueImages = Array.from(
        new Set(results[0].map((img) => img.src))
      ).map((src) => results[0].find((img) => img.src === src));
      const onlyHttps = uniqueImages.filter((img) =>
        img.src.startsWith("https://")
      );
      onlyHttps.forEach(({ src, width, height }) => {
        const imgContainer = document.createElement("div");
        imgContainer.classList.add("img-container");

        const imgElement = document.createElement("img");
        imgElement.src = src;
        imgElement.classList.add("thumbnail");
        imgElement.style.gridRowEnd = `span ${Math.ceil(height / 100)}`;
        imgElement.style.gridColumnEnd = `span ${Math.ceil(width / 100)}`;

        const downloadLink = document.createElement("a");
        downloadLink.href = src;
        downloadLink.download = src.split("/").pop();
        downloadLink.innerText = "Download";
        downloadLink.classList.add("download-link");

        imgContainer.appendChild(imgElement);
        imgContainer.appendChild(downloadLink);
        imageGrid.appendChild(imgContainer);
      });
    })
    .catch((error) => console.error("Error fetching images: ", error));
});

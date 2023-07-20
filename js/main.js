const errorElement = document.getElementById("error");
const imagesElement = document.getElementById("image");

imagesElement.addEventListener("change", function () {
  const files = imagesElement.files;

  this.style.borderColor = "";

  if (hasValidFiles(files)) {
    errorElement.style.display = "none";
  } else {
    errorElement.style.display = "block";
  }
});

function handleSubmit(event) {
  event.preventDefault();

  const files = imagesElement.files;

  if (files.length > 0) {
    if (hasValidFiles(files)) {
      convertHeicFilesToJpg(files);
    } else {
      showToast("Please select only .HEIC files");
    }
  } else {
    showToast();
  }
}

async function convertHeicFilesToJpg(files) {
  startUploading();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const res = await fetch(event.target.result);
        const blob = await res.blob();

        const finalBlob = await heic2any({
          blob: blob,
          toType: "image/jpeg",
          quality: 0.8,
        });

        downloadBlob(finalBlob, file.name.replace(".heic", ".jpg"));
      };

      reader.readAsDataURL(file);
    } catch (e) {
      console.log(e);
    }

    stopUploading();
  }
}

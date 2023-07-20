function hasValidFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!isHeicFile(file.name)) {
      return false;
    }
  }

  return true;
}

function isHeicFile(fileName) {
  return fileName.endsWith(".heic") || fileName.endsWith(".HEIC");
}

function showToast(message) {
  Toastify({
    text: message ?? "Please, select an image!",

    duration: 3000,
  }).showToast();
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  a.href = url;
  a.download = filename || "download";

  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      a.removeEventListener("click", clickHandler);
    }, 150);
  };

  a.addEventListener("click", clickHandler, false);
  a.click();

  return a;
}

function startUploading() {
  $("#submit-button").prop("disabled", true).css("background-color", "grey");
  $("#button-text").addClass("hidden");
  $("#spinner").removeClass("hidden");
}

function stopUploading() {
  $("#submit-button").prop("disabled", false).css("background-color", "");
  $("#button-text").removeClass("hidden");
  $("#spinner").addClass("hidden");
}

document.getElementById("downloadPdf").addEventListener("click", () => {
  const element = document.getElementById("cvpage");
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.display = "block";

  const updateProgress = (text, percent) => {
    btn.innerText = text;
    progressBar.value = percent;
  };
  const opt = {
    margin: [0.1, 0.1, 0.1, 0.1],
    filename: "Arman_CV.pdf",
    image: { type: "png", quality: 1 },
    html2canvas: { scale: 3, dpi: 300, letterRendering: true, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  const btn = document.getElementById("downloadPdf");
  const origText = btn.innerHTML;
  btn.innerHTML = "Generating PDF...";
  btn.disabled = true;

  html2pdf()
    .set(opt)
    .from(element)
    .toContainer()
    .then(() => {
      updateProgress("Parsing HTML content", 25);
    })
    .toCanvas()
    .then(() => {
      updateProgress("Rendering element to canvas", 50);
    })
    .toImg()
    .then(() => {
      updateProgress("Converting to image", 75);
    })
    .toPdf()
    .then(() => {
      updateProgress("Downloading...", 100);
    })
    .save()
    .then(() => {
      btn.innerHTML = origText;
      progressBar.style.display = "none";
    })
    .catch((err) => {
      console.error("Error generating PDF", err);
      btn.innerHTML = origText;
      btn.disabled = false;
    });
});

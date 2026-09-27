const element = document.getElementById("cvpage");
const progressBar = document.getElementById("progress-bar");
const btn = document.getElementById("downloadPdf");
const origText = btn ? btn.innerHTML : "Download PDF";
const previewbox=document.getElementById("preview")
const updateProgress = (text, percent) => {
  if (!btn || !progressBar) return;
  btn.innerText = text;
  progressBar.value = percent;
};

const prepareImagesForPdf = () => {
  if (!element) return;

  element.querySelectorAll("img").forEach((img) => {
    if (!img.crossOrigin) {
      img.crossOrigin = "anonymous";
    }
  });
};

const waitForImages = () => {
  if (!element) return Promise.resolve();

  const images = [...element.querySelectorAll("img")];
  return Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = img.onerror = resolve;
      });
    }),
  );
};

btn?.addEventListener("click", async () => {
  previewbox.remove();
  if (!element || !progressBar || !btn) return;

  progressBar.style.display = "block";
  progressBar.value = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
  prepareImagesForPdf();

  try {
    await waitForImages();

    const opt = {
      margin: [0, 0, 0, 0],
      filename: "Arman_CV.pdf",
      image: { type: "jpeg", quality: 0.92 },
      html2canvas: {
        scale: 2,
        dpi: 200,
        letterRendering: true,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#ffffff",
        scrollY: 0,
        scrollX: 0,
        ignoreElements: (el) =>
          el && (el.id === "downloadPdf" || el.id === "progress-bar"),
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    };

    btn.innerHTML = "Generating PDF...";
    btn.disabled = true;

    await html2pdf()
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
      .save();

    btn.innerHTML = origText;
    btn.disabled = false;
    progressBar.style.display = "none";
  } catch (err) {
    console.error("Error generating PDF", err);
    btn.innerHTML = origText;
    btn.disabled = false;
    progressBar.style.display = "none";
  }
});

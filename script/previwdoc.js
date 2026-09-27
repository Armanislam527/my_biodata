const element = document.getElementById("cvpage");
const progressBar = document.getElementById("progress-bar");
const btn = document.getElementById("downloadPdf");
const origText = btn ? btn.innerHTML : "Download PDF";

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
    })
  );
};

// Helper function to handle the preview modal creation and display
const showPdfPreview = (pdfUrl) => {
  // Check if a preview modal already exists, remove it if it does
  const existingModal = document.getElementById("pdf-preview-modal");
  if (existingModal) existingModal.remove();

  // Create the modal container wrapper
  const modal = document.createElement("div");
  modal.id = "pdf-preview-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  modal.style.zIndex = "99999";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";
  modal.style.padding = "20px";
  modal.style.boxSizing = "border-box";

  // Create a toolbar area for controls
  const toolbar = document.createElement("div");
  toolbar.style.width = "80%";
  toolbar.style.maxWidth = "900px";
  toolbar.style.display = "flex";
  toolbar.style.justifyContent = "flex-end";
  toolbar.style.marginBottom = "10px";

  // Close Button
  const closeBtn = document.createElement("button");
  closeBtn.innerText = "❌ Close Preview";
  closeBtn.style.padding = "8px 16px";
  closeBtn.style.cursor = "pointer";
  closeBtn.style.backgroundColor = "#ff4d4d";
  closeBtn.style.color = "#fff";
  closeBtn.style.border = "none";
  closeBtn.style.borderRadius = "4px";
  closeBtn.style.fontWeight = "bold";
  closeBtn.onclick = () => modal.remove();

  toolbar.appendChild(closeBtn);

  // Create the Iframe to render the compiled PDF Blob
  const iframe = document.createElement("iframe");
  iframe.src = pdfUrl;
  iframe.style.width = "80%";
  iframe.style.maxWidth = "900px";
  iframe.style.height = "85vh";
  iframe.style.border = "none";
  iframe.style.backgroundColor = "#fff";
  iframe.style.borderRadius = "4px";

  // Assemble and append to body
  modal.appendChild(toolbar);
  modal.appendChild(iframe);
  document.body.appendChild(modal);
};

btn?.addEventListener("click", async () => {
  if (!element || !progressBar || !btn) return;

  progressBar.style.display = "block";
  progressBar.value = 0;
  window.scrollTo({ top: 0, behavior: "instant" });
  prepareImagesForPdf();

  try {
    await waitForImages();

    const opt = {
      margin:[5, 5, 5, 5],
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
          el && (el.id === "downloadPdf" || el.id === "progress-bar" || el.id === "pdf-preview-modal"),
        logging: false,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      },
    };

    btn.innerHTML = "Generating PDF Preview...";
    btn.disabled = true;

    // Use outputPdf('bloburl') instead of save() to review the output locally
    const pdfBlobUrl = await html2pdf()
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
        updateProgress("Opening Preview...", 100);
      })
      .outputPdf('bloburl'); 

    // Launch the interactive on-screen iframe viewer
    showPdfPreview(pdfBlobUrl);

    btn.innerHTML = origText;
    btn.disabled = false;
    progressBar.style.display = "none";
  } catch (err) {
    console.error("Error generating PDF preview", err);
    btn.innerHTML = origText;
    btn.disabled = false;
    progressBar.style.display = "none";
  }
});

document.getElementById('downloadPdf').addEventListener('click', () => {
            const element = document.getElementById('cvpage');
            const opt = {
                margin: [0.1,.1,.1,.1],
                filename: 'Arman_CV.pdf',
                image: { type: 'png', quality: 1 },
                html2canvas: { scale: 3, dpi: 300, letterRendering: true,useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            const btn=document.getElementById("downloadPdf");
            const origText=btn.innerHTML;
            btn.innerHTML="Generating PDF...";
            btn.disabled=true;

            html2pdf().set(opt).from(element).save().then(
                () => {
                    btn.innerText=origText;
                    btn.disabled=false;
                }
            ).catch(err=>{
                console.error("Error generating PDF",err);
                btn.innerHTML=origText;
                btn.disabled=false;

            });
        });
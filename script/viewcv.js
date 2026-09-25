document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('downloadPdf');
    if (!btn) return;

    btn.addEventListener('click', async () => {
        if (typeof html2pdf === 'undefined') {
            alert('PDF generator not loaded. Please check your internet connection.');
            return;
        }

        const srcEl = document.getElementById('cvpage');
        if (!srcEl) {
            alert('CV content not found.');
            return;
        }

        // Disable button while generating
        btn.disabled = true;
        const origText = btn.textContent;
        btn.textContent = 'Generating...';

        // Clone and sanitize
        const clone = srcEl.cloneNode(true);

        // Remove or replace iframes (user requested no iframe content in PDF)
        const iframes = clone.querySelectorAll('iframe');
        iframes.forEach((frame) => {
            const url = frame.getAttribute('src') || '';
            const wrapper = document.createElement('div');
            wrapper.style.fontSize = '9pt';
            wrapper.style.margin = '4px 0';
            const link = document.createElement('a');
            link.href = url || '#';
            link.textContent = url ? `Open project: ${url}` : 'External content removed for PDF';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            wrapper.appendChild(link);
            frame.parentNode.replaceChild(wrapper, frame);
        });

        // Remove any elements that might be interactive or hidden in print
        clone.querySelectorAll('.controls, .btn').forEach(n => n.remove());

        // Append clone off-screen for rendering
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        document.body.appendChild(clone);

        const opt = {
            margin: 0.2,
            filename: 'Arman_CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, dpi: 300, letterRendering: true, useCORS: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        try {
            await html2pdf().set(opt).from(clone).save();
        } catch (err) {
            console.error('PDF generation error:', err);
            alert('Failed to generate PDF. See console for details.');
        } finally {
            // cleanup
            document.body.removeChild(clone);
            btn.disabled = false;
            btn.textContent = origText;
        }
    });
});
 const skillsList = [
            'HTML5', 'CSS3', 'JavaScript', 'React.js', 'Node.js', 'Python', 'Java', 'C/C++', 'PHP', 'MySQL', 'MongoDB', 'Docker', 'Git/GitHub', 'Linux', 'Raspberry Pi', 'Arduino', 'ESP32/8266', 'PIC Microcontroller', 'ROS Basics', 'SolidWorks 3D', 'Ultimaker Cura', 'Proteus', 'Circuit Simulation', 'PCB Design Basics'
        ];
        const skillsEl = document.getElementById('skills');
        skillsList.forEach(s => {
            const span = document.createElement('span');
            span.className = 'skill';
            span.textContent = s;
            skillsEl.appendChild(span);
        });

        document.getElementById('downloadPdf').addEventListener('click', () => {
            const element = document.getElementById('cvpage');
            const opt = {
                margin: 0.2,
                filename: 'Arman_CV.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, dpi: 300, letterRendering: true },
                jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
        });
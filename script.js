// Run the script once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Destructure jsPDF from the jspdf library
  const { jsPDF } = window.jspdf;

  // Get references to all input elements by their IDs
  const nameInput = document.getElementById('nameInput');
  const contactInput = document.getElementById('contactInput');
  const eduSchoolInput = document.getElementById('eduSchoolInput');
  const eduTimeInput = document.getElementById('eduTimeInput');
  const eduMajorInput = document.getElementById('eduMajorInput');
  const workCompanyInput = document.getElementById('workCompanyInput');
  const workTimeInput = document.getElementById('workTimeInput');
  const workPositionInput = document.getElementById('workPositionInput');
  const workDescInput = document.getElementById('workDescInput');
  const skillsInput = document.getElementById('skillsInput');
  const summaryInput = document.getElementById('summaryInput');
  const resumePreview = document.getElementById('resumePreview');

  // Buttons for exporting the resume
  const exportTxtBtn = document.getElementById('exportTxtBtn');
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const clearBtn = document.getElementById('clearBtn');

  // Create an array of all input elements for easier processing
  const inputs = [
    nameInput, contactInput, eduSchoolInput, eduTimeInput, eduMajorInput,
    workCompanyInput, workTimeInput, workPositionInput, workDescInput,
    skillsInput, summaryInput
  ];

  // Restore saved data from localStorage if it exists
  const savedData = localStorage.getItem('resumeData');

  if (savedData) {
    const data = JSON.parse(savedData);
    nameInput.value = data.name || '';
    contactInput.value = data.contact || '';
    eduSchoolInput.value = data.eduSchool || '';
    eduTimeInput.value = data.eduTime || '';
    eduMajorInput.value = data.eduMajor || '';
    workCompanyInput.value = data.workCompany || '';
    workTimeInput.value = data.workTime || '';
    workPositionInput.value = data.workPosition || '';
    workDescInput.value = data.workDesc || '';
    skillsInput.value = data.skills || '';
    summaryInput.value = data.summary || '';
  }

  // Function to update the preview pane and save data
  function updatePreview() {
    // Get trimmed values from inputs
    const name = nameInput.value.trim();
    const contact = contactInput.value.trim();
    const eduSchool = eduSchoolInput.value.trim();
    const eduTime = eduTimeInput.value.trim();
    const eduMajor = eduMajorInput.value.trim();
    const workCompany = workCompanyInput.value.trim();
    const workTime = workTimeInput.value.trim();
    const workPosition = workPositionInput.value.trim();
    const workDesc = workDescInput.value.trim();
    const skills = skillsInput.value.trim();
    const summary = summaryInput.value.trim();

    // Format the resume preview text
    const previewText = `

    Name: ${name}

    Contact: ${contact}

    Education:
      ${eduSchool} (${eduTime})
      Major: ${eduMajor}

    Work Experience:
      ${workCompany} (${workTime})
      Position: ${workPosition}
      Description: ${workDesc}

    Skills:
    ${skills.split(',').map(skill => skill.trim()).join('\n')}
    Summary:
    ${summary}
    `;

    // Display the formatted text in the preview area
    resumePreview.textContent = previewText;

    // Save the data to localStorage
    const resumeData = {
      name, contact, eduSchool, eduTime, eduMajor,
      workCompany, workTime, workPosition, workDesc,
      skills, summary
    };
    localStorage.setItem('resumeData', JSON.stringify(resumeData));
  }

  // Attach input event listener to each field to update preview on typing
  inputs.forEach(input => input.addEventListener('input', updatePreview));

  // Clear all input fields and remove saved data
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all content? This action cannot be undone.')) {
      inputs.forEach(input => input.value = ''); // Reset all input fields
      localStorage.removeItem('resumeData');     // Remove data from localStorage
      updatePreview();                           // Refresh the preview display
    }
  });

  // Export the preview text as a .txt file
  exportTxtBtn.addEventListener('click', () => {
    const text = resumePreview.textContent;

    // Create a Blob (Binary Large Object) that contains plain text content
    // [text] is an array, and the array holds the content to be written into the Blob.
    const blob = new Blob([text], { type: 'text/plain' }); 
    
    // Generate a temporary URL for downloading the Blob
    const url = URL.createObjectURL(blob);
    // Create a temporary link element and simulate a click to start download
    const a = document.createElement('a');
    a.href = url;

    // Set the default name of the downloaded file to resume.txt
    // When the user clicks the link, the browser will download the file instead of opening it
    // and save it with this name
    a.download = 'resume.txt';
    document.body.appendChild(a);
    // Simulate a click on the link, as if the user had clicked it manually, which triggers the download
    a.click();

     // Clean up the temporary element and revoke the URL
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up the temporary URL
  });

  // Export the preview as a PDF using jsPDF
  exportPdfBtn.addEventListener('click', () => {
    const doc = new jsPDF();
    const text = resumePreview.textContent;
    const margin = 10;
    const lineHeight = 7;
    const pageHeight = doc.internal.pageSize.height;
    let y = margin;

    // Split the text by new lines and add them one by one
    text.split('\n').forEach((line) => {
      // If the current Y position goes beyond page height, create a new page
      if (y + lineHeight > pageHeight - margin) {
        doc.addPage(); // Start new page if needed
        y = margin; // Reset Y position for the new page
      }
      doc.text(line, margin, y); // Add text to current Y position
      y += lineHeight; // Move down for the next line
    });

    // Save the PDF file with the specified name
    doc.save('resume.pdf');  // Trigger download
  });

  updatePreview(); // Call once to initialize preview on page load
});

// A second event listener (redundant, could be removed) to restore and preview saved data
window.addEventListener('DOMContentLoaded', () => {
  const savedData = localStorage.getItem('resumeData');
  if (savedData) {
    const {
      name, contact, eduSchool, eduTime, eduMajor,
      workCompany, workTime, workPosition, workDesc,
      skills, summary
    } = JSON.parse(savedData);

    nameInput.value = name || '';
    contactInput.value = contact || '';
    eduSchoolInput.value = eduSchool || '';
    eduTimeInput.value = eduTime || '';
    eduMajorInput.value = eduMajor || '';
    workCompanyInput.value = workCompany || '';
    workTimeInput.value = workTime || '';
    workPositionInput.value = workPosition || '';
    workDescInput.value = workDesc || '';
    skillsInput.value = skills || '';
    summaryInput.value = summary || '';
  }

  // Refresh preview with restored data
  updatePreview();
});

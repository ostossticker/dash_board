import { url } from '@/lib/url';
import React, { useEffect, useState, useRef } from 'react';


const AutoFillInput =() => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    const component = componentRef.current;
    if (!component) return;

    // Get the HTML content of the component
    const htmlContent = component.innerHTML;

    // Create a new Blob object containing the HTML content
    const blob = new Blob([htmlContent], { type: 'application/pdf' });

    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'downloaded-file.pdf';

    // Simulate click on the link to trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Downloadable PDF Component</h1>
      <div ref={componentRef}>
        <p>This is a downloadable React component!</p>
        <p>You can include any HTML content you want here.</p>
      </div>
      <button onClick={handleDownloadPDF}>Download PDF</button>
    </div>
  );
};

export default AutoFillInput;

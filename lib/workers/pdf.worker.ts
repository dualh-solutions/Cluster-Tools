import { PDFDocument, PageSizes } from 'pdf-lib';

self.onmessage = async (e: MessageEvent) => {
  try {
    const { files, pageSize = 'A4', orientation = 'portrait' } = e.data as {
      files: { buffer: ArrayBuffer; type: string }[];
      pageSize?: 'A4' | 'Letter' | 'Fit';
      orientation?: 'portrait' | 'landscape';
    };

    const pdfDoc = await PDFDocument.create();

    for (let i = 0; i < files.length; i++) {
      const { buffer, type } = files[i];
      let image;
      
      if (type === 'image/png') {
        image = await pdfDoc.embedPng(buffer);
      } else if (type === 'image/webp') {
        const blob = new Blob([buffer], { type: 'image/webp' });
        const imageBitmap = await createImageBitmap(blob);
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(imageBitmap, 0, 0);
          const jpgBlob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.95 });
          const jpgBuffer = await jpgBlob.arrayBuffer();
          image = await pdfDoc.embedJpg(jpgBuffer);
        } else {
          throw new Error('Could not get 2d context');
        }
      } else {
        image = await pdfDoc.embedJpg(buffer);
      }

      const imgDims = image.scale(1);
      let pageDims: [number, number];

      if (pageSize === 'Fit') {
        pageDims = [imgDims.width, imgDims.height];
      } else {
        const standardSize = pageSize === 'Letter' ? PageSizes.Letter : PageSizes.A4;
        pageDims = orientation === 'landscape' ? [standardSize[1], standardSize[0]] : standardSize;
      }

      const page = pdfDoc.addPage(pageDims);

      // Scale image to fit within the page while maintaining aspect ratio
      const scale = Math.min(
        pageDims[0] / imgDims.width,
        pageDims[1] / imgDims.height
      );

      // If 'Fit', scale is 1
      const finalScale = pageSize === 'Fit' ? 1 : scale;
      const drawDims = image.scale(finalScale);

      // Center the image
      const x = (pageDims[0] - drawDims.width) / 2;
      const y = (pageDims[1] - drawDims.height) / 2;

      page.drawImage(image, {
        x,
        y,
        width: drawDims.width,
        height: drawDims.height,
      });

      // Report progress
      self.postMessage({ type: 'progress', progress: Math.round(((i + 1) / files.length) * 50) });
    }

    const pdfBytes = await pdfDoc.save();
    
    self.postMessage({ 
      type: 'done', 
      result: new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }) 
    });
    
  } catch (error: unknown) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

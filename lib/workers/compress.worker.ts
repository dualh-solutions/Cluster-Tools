self.onmessage = async (e: MessageEvent) => {
  try {
    const { buffer, type, quality, targetSize } = e.data;
    
    const blob = new Blob([buffer], { type });
    const imageBitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2d context for OffscreenCanvas');
    }

    // Default to a white background if compressing PNG -> JPEG (which we might do if they want a smaller file size, though usually PNG stays PNG. In Compressor we keep same format)
    if (type === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.drawImage(imageBitmap, 0, 0);

    let resultBlob: Blob;

    if (targetSize) {
      // Binary search for quality to hit targetSize
      let minQ = 0.0;
      let maxQ = 1.0;
      let bestBlob: Blob | null = null;
      let currentQ = 0.5;

      // We only do binary search for formats that support lossy compression (JPEG, WebP)
      if (type === 'image/jpeg' || type === 'image/webp') {
        for (let i = 0; i < 7; i++) { // 7 iterations usually enough for precision
          const tempBlob = await canvas.convertToBlob({ type, quality: currentQ });
          if (!bestBlob || Math.abs(tempBlob.size - targetSize) < Math.abs(bestBlob.size - targetSize)) {
            // Keep the one closest to target size that is ideally under the target size
            if (tempBlob.size <= targetSize || !bestBlob) {
               bestBlob = tempBlob;
            }
          }
          
          if (tempBlob.size > targetSize) {
            maxQ = currentQ;
          } else {
            minQ = currentQ;
          }
          currentQ = (minQ + maxQ) / 2;
        }
        resultBlob = bestBlob || await canvas.convertToBlob({ type, quality: 0.5 });
      } else {
        // PNG doesn't use quality parameter in canvas.convertToBlob the same way, but we can just re-encode
        resultBlob = await canvas.convertToBlob({ type });
      }
    } else {
      // Direct quality setting
      resultBlob = await canvas.convertToBlob({ 
        type, 
        quality: quality !== undefined ? quality / 100 : undefined 
      });
    }

    self.postMessage({ type: 'done', result: resultBlob });
    
  } catch (error: unknown) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

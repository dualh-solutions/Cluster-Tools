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

    let outType = type;
    // Default to a white background if compressing to JPEG
    if (type === 'image/jpeg' || type === 'image/jpg') {
      outType = 'image/jpeg';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // For PNG, GIF, BMP, etc., we convert to WebP to support quality compression and transparency
      outType = 'image/webp';
    }
    
    ctx.drawImage(imageBitmap, 0, 0);

    let resultBlob: Blob;

    if (targetSize) {
      // Binary search for quality to hit targetSize
      let minQ = 0.0;
      let maxQ = 1.0;
      let bestBlob: Blob | null = null;
      let currentQ = 0.5;

      for (let i = 0; i < 7; i++) {
        const tempBlob = await canvas.convertToBlob({ type: outType, quality: currentQ });
        if (!bestBlob || Math.abs(tempBlob.size - targetSize) < Math.abs(bestBlob.size - targetSize)) {
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
      resultBlob = bestBlob || await canvas.convertToBlob({ type: outType, quality: 0.5 });
    } else {
      // Direct quality setting
      resultBlob = await canvas.convertToBlob({ 
        type: outType, 
        quality: quality !== undefined ? quality / 100 : undefined 
      });
    }

    self.postMessage({ type: 'done', result: resultBlob, mimeType: resultBlob.type });
    
  } catch (error: unknown) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

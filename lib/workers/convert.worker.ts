self.onmessage = async (e: MessageEvent) => {
  try {
    const { buffer, type, targetFormat, backgroundColor = '#FFFFFF' } = e.data;
    
    // Create an object URL for the buffer to load it into an ImageBitmap
    const blob = new Blob([buffer], { type });
    const imageBitmap = await createImageBitmap(blob);
    
    // Create an OffscreenCanvas
    const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get 2d context for OffscreenCanvas');
    }

    // If converting to JPG, fill the background first to remove transparency
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    ctx.drawImage(imageBitmap, 0, 0);
    
    // Quality is only applicable to JPEG
    const resultBlob = await canvas.convertToBlob({ 
      type: targetFormat,
      quality: targetFormat === 'image/jpeg' ? 0.9 : undefined
    });
    
    self.postMessage({ type: 'done', result: resultBlob });
    
  } catch (error: unknown) {
    self.postMessage({ type: 'error', message: error instanceof Error ? error.message : String(error) });
  }
};

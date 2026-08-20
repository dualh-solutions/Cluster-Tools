self.onmessage = async (e: MessageEvent) => {
  const { file, crop } = e.data;
  
  try {
    // crop is in percentage or absolute pixels depending on how we send it.
    // Let's assume absolute pixels (x, y, width, height) relative to the natural image size.
    
    // Create an ImageBitmap from the blob
    const bitmap = await createImageBitmap(file);
    
    const canvas = new OffscreenCanvas(crop.width, crop.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    
    // Draw the cropped portion
    ctx.drawImage(
      bitmap,
      crop.x, crop.y, crop.width, crop.height,
      0, 0, crop.width, crop.height
    );
    
    // Convert back to blob
    const type = file.type || "image/jpeg";
    const quality = type === "image/jpeg" || type === "image/webp" ? 0.9 : undefined;
    
    const blob = await canvas.convertToBlob({ type, quality });
    
    self.postMessage({ success: true, blob });
  } catch (error: unknown) {
    self.postMessage({ success: false, error: error instanceof Error ? error.message : String(error) });
  }
};

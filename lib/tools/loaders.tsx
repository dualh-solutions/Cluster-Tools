import dynamic from "next/dynamic";
import { ComponentType } from "react";

// Explicitly define each loader to ensure strong code splitting and prevent bundling everything together
const toolComponents: Record<string, ComponentType<unknown>> = {
  CompressImageTool: dynamic(() => import("@/components/tools/interfaces/CompressImageTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JpgToPdfTool: dynamic(() => import("@/components/tools/interfaces/JpgToPdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JpgToPngTool: dynamic(() => import("@/components/tools/interfaces/JpgToPngTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PdfToJpgTool: dynamic(() => import("@/components/tools/interfaces/PdfToJpgTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PngToJpgTool: dynamic(() => import("@/components/tools/interfaces/PngToJpgTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  ResizeImageTool: dynamic(() => import("@/components/tools/interfaces/ResizeImageTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  CompressPdfTool: dynamic(() => import("@/components/tools/interfaces/CompressPdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  MergePdfTool: dynamic(() => import("@/components/tools/interfaces/MergePdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PercentageCalculatorTool: dynamic(() => import("@/components/tools/interfaces/PercentageCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  AgeCalculatorTool: dynamic(() => import("@/components/tools/interfaces/AgeCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  WordCounterTool: dynamic(() => import("@/components/tools/interfaces/WordCounterTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JsonFormatterTool: dynamic(() => import("@/components/tools/interfaces/JsonFormatterTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  ImageCropperTool: dynamic(() => import("@/components/tools/interfaces/ImageCropperTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  WebpToJpgTool: dynamic(() => import("@/components/tools/interfaces/WebpToJpgTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  HeicToJpgTool: dynamic(() => import("@/components/tools/interfaces/HeicToJpgTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  SplitPdfTool: dynamic(() => import("@/components/tools/interfaces/SplitPdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  RotatePdfTool: dynamic(() => import("@/components/tools/interfaces/RotatePdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  LoanCalculatorTool: dynamic(() => import("@/components/tools/interfaces/LoanCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  MortgageCalculatorTool: dynamic(() => import("@/components/tools/interfaces/MortgageCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  DiscountCalculatorTool: dynamic(() => import("@/components/tools/interfaces/DiscountCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PngToWebpTool: dynamic(() => import("@/components/tools/interfaces/PngToWebpTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JpgToWebpTool: dynamic(() => import("@/components/tools/interfaces/JpgToWebpTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  ImageToPdfTool: dynamic(() => import("@/components/tools/interfaces/ImageToPdfTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  ExtractPdfPagesTool: dynamic(() => import("@/components/tools/interfaces/ExtractPdfPagesTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  DeletePdfPagesTool: dynamic(() => import("@/components/tools/interfaces/DeletePdfPagesTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PdfPageCounterTool: dynamic(() => import("@/components/tools/interfaces/PdfPageCounterTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PdfMetadataViewerTool: dynamic(() => import("@/components/tools/interfaces/PdfMetadataViewerTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  CompoundInterestCalculatorTool: dynamic(() => import("@/components/tools/interfaces/CompoundInterestCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  RoiCalculatorTool: dynamic(() => import("@/components/tools/interfaces/RoiCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  ProfitMarginCalculatorTool: dynamic(() => import("@/components/tools/interfaces/ProfitMarginCalculatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  CharacterCounterTool: dynamic(() => import("@/components/tools/interfaces/CharacterCounterTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  CaseConverterTool: dynamic(() => import("@/components/tools/interfaces/CaseConverterTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  RemoveDuplicateLinesTool: dynamic(() => import("@/components/tools/interfaces/RemoveDuplicateLinesTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  TextDiffCheckerTool: dynamic(() => import("@/components/tools/interfaces/TextDiffCheckerTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JsonValidatorTool: dynamic(() => import("@/components/tools/interfaces/JsonValidatorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JsonMinifierTool: dynamic(() => import("@/components/tools/interfaces/JsonMinifierTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  Base64EncoderDecoderTool: dynamic(() => import("@/components/tools/interfaces/Base64EncoderDecoderTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  UrlEncoderDecoderTool: dynamic(() => import("@/components/tools/interfaces/UrlEncoderDecoderTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  // Batch 5
  MetaTagGeneratorTool: dynamic(() => import("@/components/tools/interfaces/MetaTagGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  RobotsTxtGeneratorTool: dynamic(() => import("@/components/tools/interfaces/RobotsTxtGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  XmlSitemapGeneratorTool: dynamic(() => import("@/components/tools/interfaces/XmlSitemapGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  SeoSnippetPreviewTool: dynamic(() => import("@/components/tools/interfaces/SeoSnippetPreviewTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  KeywordDensityCheckerTool: dynamic(() => import("@/components/tools/interfaces/KeywordDensityCheckerTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  SlugGeneratorTool: dynamic(() => import("@/components/tools/interfaces/SlugGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  QrCodeGeneratorTool: dynamic(() => import("@/components/tools/interfaces/QrCodeGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  PasswordGeneratorTool: dynamic(() => import("@/components/tools/interfaces/PasswordGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  UuidGeneratorTool: dynamic(() => import("@/components/tools/interfaces/UuidGeneratorTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
  JwtDecoderTool: dynamic(() => import("@/components/tools/interfaces/JwtDecoderTool"), {
    loading: () => <ToolLoadingSkeleton />
  }),
};

export function getToolComponent(componentKey: string): ComponentType<unknown> | null {
  return toolComponents[componentKey] || null;
}

function ToolLoadingSkeleton() {
  return (
    <div className="w-full max-w-[768px] mx-auto px-4 py-12 flex flex-col items-center animate-pulse">
      <div className="w-3/4 h-12 bg-surface border border-border rounded-lg mb-4"></div>
      <div className="w-1/2 h-6 bg-surface border border-border rounded-lg mb-12"></div>
      <div className="w-full h-[300px] bg-surface border-2 border-dashed border-border rounded-xl"></div>
    </div>
  );
}

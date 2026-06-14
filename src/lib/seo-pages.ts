import type { FaqItem } from "@/lib/structured-data";

export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  tool: string;
  toolLabel: string;
  category: "bg-remover" | "convert" | "merge-pdf" | "pdf-editor";
  archetype: "subject" | "use-case" | "format" | "comparison" | "general";
  color: string;
  keywords: string[];
  /** Unique 2-3 sentence answer-first intro (crawlable body prose). */
  intro: string;
  /** Exactly 3 direct-answer steps. */
  howItWorks: string[];
  features: string[];
  useCases: string[];
  /** 3-4 unique question/answer pairs. */
  faqs: FaqItem[];
}

/**
 * Returns up to `limit` related pages in the same category, excluding the page
 * itself. Used to build the internal-link graph and kill orphan pages.
 */
export function getRelatedPages(slug: string, limit = 4): SeoPage[] {
  const current = SEO_PAGES.find((p) => p.slug === slug);
  if (!current) return [];
  const sameCategory = SEO_PAGES.filter(
    (p) => p.slug !== slug && p.category === current.category,
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  // Fall back to any other pages if the category is small.
  const others = SEO_PAGES.filter(
    (p) => p.slug !== slug && p.category !== current.category,
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export const SEO_PAGES: SeoPage[] = [
  // ── Background Remover ──────────────────────────────────────────

  {
    slug: "remove-background-from-photo",
    title: "Remove Background from Photo Free Online",
    description:
      "Remove the background from any photo instantly using AI. Runs in your browser, no uploads required. Free, private, and works offline.",
    h1: "Remove Background from Photo",
    subtitle: "AI-powered background removal that runs 100% in your browser. No sign up, no uploads, no limits.",
    tool: "/bg-remover",
    toolLabel: "Open Background Remover",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from photo", "photo background remover", "free background removal"],
    intro:
      "Riftcut removes the background from any photo for free using AI that runs entirely in your browser. There is no upload step and no waiting queue — drop in a photo, and the subject is cut out in seconds while the file never leaves your device.",
    howItWorks: [
      "Open the background remover and select a photo (JPG, PNG, or WebP).",
      "The AI detects the main subject and erases the background automatically.",
      "Download a transparent PNG, or replace the background with a color or image first.",
    ],
    features: [
      "AI-powered edge detection for clean cutouts",
      "Replace background with solid colors or custom images",
      "Crop, resize, and adjust brightness/contrast",
      "Download as PNG with transparent background",
    ],
    useCases: [
      "Clean up product photos for your online store",
      "Create professional headshots from casual photos",
      "Make transparent PNGs for presentations and designs",
      "Remove distracting backgrounds from travel photos",
    ],
    faqs: [
      {
        question: "Is removing photo backgrounds really free?",
        answer:
          "Yes. There are no limits, watermarks, or sign-ups. You can process as many photos as you like at no cost.",
      },
      {
        question: "Are my photos uploaded to a server?",
        answer:
          "No. The AI runs in your browser, so your photos stay on your device and are never uploaded anywhere.",
      },
      {
        question: "What image formats can I use?",
        answer:
          "You can remove backgrounds from JPG, PNG, and WebP photos, and the result downloads as a transparent PNG.",
      },
    ],
  },
  {
    slug: "remove-background-from-image",
    title: "Remove Background from Image Free -- AI Background Eraser",
    description:
      "Erase image backgrounds in one click using AI. Works with JPG, PNG, WebP. 100% free and private -- your images never leave your device.",
    h1: "Remove Background from Image",
    subtitle: "Upload any image and get a clean cutout in seconds. No watermarks, no limits, no account needed.",
    tool: "/bg-remover",
    toolLabel: "Remove Background Now",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from image", "image background eraser", "background removal tool"],
    intro:
      "Erase the background from any image in a single click. Riftcut's AI background eraser identifies the subject automatically and runs locally in your browser, so there are no uploads, no watermarks, and no usage caps.",
    howItWorks: [
      "Add an image in JPG, PNG, or WebP format.",
      "The background eraser isolates the subject and removes everything behind it.",
      "Save the cutout as a transparent PNG or drop in a new background.",
    ],
    features: [
      "Works with JPG, PNG, WebP, and more",
      "AI detects subjects automatically",
      "Add new backgrounds or keep transparent",
      "Batch-ready -- process as many images as you need",
    ],
    useCases: [
      "Prepare images for graphic design projects",
      "Create stickers and cutouts from any photo",
      "Remove backgrounds for social media posts",
      "Make transparent logos from existing images",
    ],
    faqs: [
      {
        question: "How accurate is the AI background eraser?",
        answer:
          "It uses a modern segmentation model that handles complex edges like hair and fur well, producing clean cutouts without manual selection.",
      },
      {
        question: "Can I remove the background from many images?",
        answer:
          "Yes. There are no limits, so you can process as many images as you need, one after another.",
      },
      {
        question: "Do I need to install anything?",
        answer:
          "No. Everything runs in your web browser — there is no software to download or account to create.",
      },
    ],
  },
  {
    slug: "remove-background-from-selfie",
    title: "Remove Background from Selfie Free Online",
    description:
      "Remove the background from selfies and portraits instantly with AI. Perfect cutouts for profile pictures, resumes, and social media. Free and private.",
    h1: "Remove Background from Selfie",
    subtitle: "Turn any selfie into a professional portrait with a clean or custom background.",
    tool: "/bg-remover",
    toolLabel: "Upload Your Selfie",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove selfie background", "selfie background remover", "portrait background removal"],
    intro:
      "Turn a casual selfie into a polished portrait by removing the background with AI. Riftcut is tuned for human subjects, cleanly separating hair and edges, and it runs privately in your browser so your face photos never get uploaded.",
    howItWorks: [
      "Upload your selfie or portrait photo.",
      "The AI separates you from the background, keeping hair and edges clean.",
      "Add a solid color or professional backdrop, then download.",
    ],
    features: [
      "AI optimized for human subjects and portraits",
      "Clean hair and edge detection",
      "Replace with solid colors or professional backdrops",
      "Perfect for LinkedIn, resumes, and ID photos",
    ],
    useCases: [
      "Create a professional headshot from a phone selfie",
      "Make passport or ID-style photos at home",
      "Update your LinkedIn profile picture",
      "Create fun profile pictures with custom backgrounds",
    ],
    faqs: [
      {
        question: "Will it handle hair and fine edges?",
        answer:
          "Yes. The model is optimized for people and does a good job tracing hair and soft edges for natural-looking cutouts.",
      },
      {
        question: "Is it private enough for personal photos?",
        answer:
          "Completely. Your selfie is processed on your own device and is never uploaded, stored, or seen by anyone else.",
      },
      {
        question: "Can I add a new background?",
        answer:
          "Yes. After removing the original background you can drop in a solid color or a professional backdrop image.",
      },
    ],
  },
  {
    slug: "remove-background-from-product-photo",
    title: "Remove Background from Product Photo -- Free for E-Commerce",
    description:
      "Get clean white or transparent backgrounds for your product photos. AI-powered, runs locally in your browser. Perfect for Etsy, Amazon, Shopify listings.",
    h1: "Remove Background from Product Photo",
    subtitle: "Clean product images for your online store. White backgrounds, transparent PNGs, no watermarks.",
    tool: "/bg-remover",
    toolLabel: "Clean Product Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["product photo background remover", "ecommerce background removal", "white background product photo"],
    intro:
      "Get marketplace-ready product photos with clean white or transparent backgrounds, no photo studio required. Riftcut's AI removes cluttered backgrounds locally in your browser, so you can prep an entire catalog for free without watermarks.",
    howItWorks: [
      "Upload a product photo taken on any background.",
      "The AI removes the background and isolates your product.",
      "Add a white background for listings or keep it transparent, then download.",
    ],
    features: [
      "Get marketplace-ready white backgrounds",
      "Export transparent PNGs for any design",
      "Adjust sizing for Amazon, Etsy, or Shopify requirements",
      "Process multiple product photos in one session",
    ],
    useCases: [
      "Prepare product listings for Amazon or Etsy",
      "Create consistent product catalogs",
      "Remove messy backgrounds from handmade item photos",
      "Make professional listings without a photo studio",
    ],
    faqs: [
      {
        question: "Can I get a pure white background for marketplaces?",
        answer:
          "Yes. After removing the original background, replace it with solid white to meet Amazon, Etsy, and eBay listing requirements.",
      },
      {
        question: "Is it free for a whole product catalog?",
        answer:
          "Yes. There are no per-image fees or limits, so you can process your entire catalog at no cost.",
      },
      {
        question: "Will the product edges look clean?",
        answer:
          "The AI detects product edges automatically, giving sharp cutouts suitable for professional listings.",
      },
    ],
  },
  {
    slug: "remove-background-from-logo",
    title: "Remove Background from Logo -- Make Transparent PNG Free",
    description:
      "Make your logo transparent in seconds. Remove white or colored backgrounds from logos and export as PNG. Free, no sign up required.",
    h1: "Remove Background from Logo",
    subtitle: "Convert any logo to a transparent PNG. Works with JPG, PNG, and scanned logos.",
    tool: "/bg-remover",
    toolLabel: "Make Logo Transparent",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove logo background", "transparent logo maker", "logo background remover"],
    intro:
      "Make any logo transparent in seconds by removing its white or colored background. Riftcut keeps the original resolution and exports a clean PNG, all processed privately in your browser with no sign-up.",
    howItWorks: [
      "Upload your logo as a JPG, PNG, or scanned image.",
      "The AI removes the white or colored background around the mark.",
      "Download a transparent PNG ready to place on any design.",
    ],
    features: [
      "Remove white, colored, or complex backgrounds",
      "Export high-quality transparent PNGs",
      "Works with scanned or photographed logos",
      "No quality loss -- keeps original resolution",
    ],
    useCases: [
      "Make a transparent version of your brand logo",
      "Clean up scanned logos for digital use",
      "Prepare logos for overlays on videos or images",
      "Convert JPG logos to transparent PNGs",
    ],
    faqs: [
      {
        question: "Can it remove a white background from a logo?",
        answer:
          "Yes. White, off-white, and colored backgrounds are detected and removed, leaving just the logo on transparency.",
      },
      {
        question: "Will my logo lose quality?",
        answer:
          "No. The tool preserves the original resolution, so your transparent PNG stays just as sharp.",
      },
      {
        question: "Does it work with scanned logos?",
        answer:
          "Yes. Scanned or photographed logos work well, though clean, high-contrast scans give the best edges.",
      },
    ],
  },
  {
    slug: "remove-background-from-headshot",
    title: "Remove Background from Headshot -- Professional Photos Free",
    description:
      "Create professional headshots by removing backgrounds with AI. Perfect for corporate profiles, resumes, and team pages. Free and private.",
    h1: "Remove Background from Headshot",
    subtitle: "Turn any photo into a professional headshot. Add solid or gradient backgrounds instantly.",
    tool: "/bg-remover",
    toolLabel: "Fix Your Headshot",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["headshot background remover", "professional headshot free", "corporate headshot background"],
    intro:
      "Create a professional headshot from any photo by swapping a distracting background for a clean studio-style backdrop. Riftcut's AI produces crisp edges and runs entirely in your browser, free and private.",
    howItWorks: [
      "Upload the photo you want to use as a headshot.",
      "The AI removes the background and keeps your portrait sharp.",
      "Add a solid or gradient backdrop and crop to a headshot ratio, then download.",
    ],
    features: [
      "AI-powered subject detection for clean edges",
      "Add professional solid or gradient backgrounds",
      "Crop to standard headshot dimensions",
      "Download in high resolution for print or web",
    ],
    useCases: [
      "Corporate team page photos",
      "Resume and CV headshots",
      "Conference speaker profiles",
      "Professional social media avatars",
    ],
    faqs: [
      {
        question: "Can I use this for a corporate team page?",
        answer:
          "Yes. Removing backgrounds and adding a consistent backdrop is an easy way to make varied photos look like a uniform set.",
      },
      {
        question: "What backgrounds work best for headshots?",
        answer:
          "Solid neutral tones or subtle gradients read as professional. You can apply either after the original background is removed.",
      },
      {
        question: "Is it really free for professional use?",
        answer:
          "Yes. There are no watermarks or fees, so the output is suitable for resumes, profiles, and print.",
      },
    ],
  },
  {
    slug: "transparent-background-maker",
    title: "Transparent Background Maker -- Free Online PNG Tool",
    description:
      "Make any image background transparent instantly. AI removes backgrounds and exports clean PNGs. No uploads to servers -- everything runs in your browser.",
    h1: "Transparent Background Maker",
    subtitle: "Turn any image into a transparent PNG in one click. Free, private, unlimited.",
    tool: "/bg-remover",
    toolLabel: "Make Transparent",
    category: "bg-remover",
    archetype: "general",
    color: "#FF6B6B",
    keywords: ["transparent background maker", "make background transparent", "transparent png maker"],
    intro:
      "Make any image background transparent in one click and export a clean PNG. Riftcut's AI handles the cutout automatically and runs in your browser, so there are no uploads, no compression, and no limits.",
    howItWorks: [
      "Select any image you want to make transparent.",
      "The AI removes the background and leaves a transparent area.",
      "Download a transparent PNG with no quality loss.",
    ],
    features: [
      "One-click background removal with AI",
      "Export as transparent PNG instantly",
      "Works with any image format",
      "No quality degradation or compression",
    ],
    useCases: [
      "Create transparent assets for web design",
      "Make stickers from photos",
      "Prepare images for video editing overlays",
      "Design collages with transparent elements",
    ],
    faqs: [
      {
        question: "What file format do I get?",
        answer:
          "You get a PNG with a transparent background, which is the standard format for transparency across design tools.",
      },
      {
        question: "Does it compress my image?",
        answer:
          "No. The output keeps your original resolution with no added compression or quality loss.",
      },
      {
        question: "Is there a limit on how many I can make?",
        answer:
          "No. The transparent background maker is unlimited and free to use as often as you like.",
      },
    ],
  },
  {
    slug: "ai-background-remover",
    title: "AI Background Remover -- Free, Local, No Upload",
    description:
      "Remove image backgrounds using AI that runs entirely in your browser. No cloud processing — your images never leave your device. The most private background remover online.",
    h1: "AI Background Remover",
    subtitle: "State-of-the-art AI runs directly on your device. Your images never touch a server.",
    tool: "/bg-remover",
    toolLabel: "Try AI Background Remover",
    category: "bg-remover",
    archetype: "general",
    color: "#FF6B6B",
    keywords: ["ai background remover", "local ai background removal", "private background remover"],
    intro:
      "Riftcut is an AI background remover that runs the model directly on your device using WebGPU and WebAssembly. Because nothing is sent to a server, it is one of the most private ways to remove backgrounds — and it keeps working offline after the first load.",
    howItWorks: [
      "Open the tool, which loads the AI model into your browser.",
      "Add an image and let the on-device model remove the background.",
      "Download the result — your images never leave your computer.",
    ],
    features: [
      "AI model runs on your device via WebGPU/WASM",
      "Images never sent to any server",
      "Works offline after first load",
      "Handles complex edges like hair and fur",
    ],
    useCases: [
      "Remove backgrounds from confidential documents",
      "Process sensitive images without cloud risk",
      "Work offline on flights or in low-connectivity areas",
      "Bulk process images without usage limits",
    ],
    faqs: [
      {
        question: "Where does the AI actually run?",
        answer:
          "Entirely in your browser via WebGPU or WebAssembly. The model is downloaded once and then runs on your own hardware.",
      },
      {
        question: "Is any data sent to the cloud?",
        answer:
          "No. There is no server-side processing, so your images and the results never leave your device.",
      },
      {
        question: "Does it work without internet?",
        answer:
          "Yes. After the first load the model is cached, so background removal keeps working offline.",
      },
    ],
  },
  {
    slug: "remove-white-background",
    title: "Remove White Background from Image Free Online",
    description:
      "Remove white backgrounds from images and make them transparent. Perfect for logos, screenshots, and scanned documents. AI-powered, free, and private.",
    h1: "Remove White Background from Image",
    subtitle: "Convert white backgrounds to transparent in one click. No manual editing needed.",
    tool: "/bg-remover",
    toolLabel: "Remove White Background",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove white background", "white background to transparent", "remove white background from image"],
    intro:
      "Turn a white background transparent in one click — no manual erasing or magic-wand selecting. Riftcut's AI detects white and near-white backgrounds and removes them cleanly, all in your browser for free.",
    howItWorks: [
      "Upload an image that has a white or light background.",
      "The AI detects the background and removes it automatically.",
      "Download a transparent PNG with clean edges.",
    ],
    features: [
      "AI detects and removes white backgrounds automatically",
      "Also handles off-white and light gray backgrounds",
      "Clean edges without manual selection",
      "Export as transparent PNG",
    ],
    useCases: [
      "Make scanned signatures transparent",
      "Clean up screenshots for presentations",
      "Convert white-background logos to transparent",
      "Prepare images for dark-mode websites",
    ],
    faqs: [
      {
        question: "Does it only remove pure white?",
        answer:
          "No. It also handles off-white and light gray backgrounds, not just pure white pixels.",
      },
      {
        question: "Do I need to select the background manually?",
        answer:
          "No. The AI detects the background for you, so there is no magic wand or manual erasing involved.",
      },
      {
        question: "Is this good for signatures?",
        answer:
          "Yes. Removing the white background from a scanned signature gives you a transparent version you can place on PDFs and documents.",
      },
    ],
  },
  {
    slug: "passport-photo-background-remover",
    title: "Passport Photo Background Remover -- Free Online Tool",
    description:
      "Remove and replace passport photo backgrounds with the correct white or light background. AI-powered, runs locally. Free for visa, ID, and passport photos.",
    h1: "Passport Photo Background Remover",
    subtitle: "Get the correct white background for passport and ID photos. Crop to standard sizes.",
    tool: "/bg-remover",
    toolLabel: "Fix Passport Photo",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["passport photo background", "id photo background remover", "visa photo background"],
    intro:
      "Most passport and visa applications require a plain white or light background. Riftcut removes whatever is behind you and replaces it with the correct backdrop, processing your photo privately in your browser so sensitive ID images stay on your device.",
    howItWorks: [
      "Upload a clear, front-facing photo of yourself.",
      "The AI removes the existing background behind you.",
      "Apply a white background, crop to the required size, and download.",
    ],
    features: [
      "Remove any background and replace with white",
      "Crop to passport photo dimensions",
      "Works for visa, ID, and driver's license photos",
      "No uploads -- your photo stays on your device",
    ],
    useCases: [
      "Create passport photos at home",
      "Fix visa application photos",
      "Prepare ID card photos with proper backgrounds",
      "Save money on professional passport photo services",
    ],
    faqs: [
      {
        question: "Can I get the official white background?",
        answer:
          "Yes. After removing your original background, apply solid white to match passport and visa requirements.",
      },
      {
        question: "Is it safe to use for ID photos?",
        answer:
          "Yes. Your photo is processed locally and never uploaded, which is ideal for sensitive identity documents.",
      },
      {
        question: "Will it meet exact size requirements?",
        answer:
          "You can crop to standard dimensions, but always confirm the precise pixel and print size your authority requires.",
      },
    ],
  },

  // ── File Converter ──────────────────────────────────────────────

  {
    slug: "jpg-to-pdf",
    title: "Convert JPG to PDF Free Online -- No Upload Required",
    description:
      "Convert JPG images to PDF files instantly in your browser. No file uploads, no servers. Free, private, and works offline.",
    h1: "Convert JPG to PDF",
    subtitle: "Turn your JPG images into PDF documents. Fast, free, and completely private.",
    tool: "/convert",
    toolLabel: "Convert JPG to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["jpg to pdf", "convert jpg to pdf", "jpeg to pdf free"],
    intro:
      "Convert JPG and JPEG images into PDF files instantly, right in your browser. Riftcut preserves the original image quality and never uploads your files, so the conversion is both private and free.",
    howItWorks: [
      "Select one or more JPG images to convert.",
      "Riftcut places each image into a PDF in your browser.",
      "Download the finished PDF immediately.",
    ],
    features: [
      "Instant conversion with no file upload",
      "Preserves original image quality",
      "Works with any JPG/JPEG file",
      "Download PDF immediately after conversion",
    ],
    useCases: [
      "Convert scanned documents to PDF",
      "Create PDF portfolios from photos",
      "Submit image-based forms as PDF",
      "Archive photos as PDF documents",
    ],
    faqs: [
      {
        question: "Are my JPG files uploaded?",
        answer:
          "No. The conversion happens entirely in your browser, so your images never leave your device.",
      },
      {
        question: "Does converting reduce image quality?",
        answer:
          "No. Your JPG is embedded at its original quality, so the PDF looks the same as the source image.",
      },
      {
        question: "Is JPG to PDF conversion free?",
        answer:
          "Yes, completely free with no watermarks, limits, or sign-up.",
      },
    ],
  },
  {
    slug: "png-to-pdf",
    title: "Convert PNG to PDF Free Online -- Private & Instant",
    description:
      "Convert PNG images to PDF files directly in your browser. High quality, no uploads, no watermarks. Free and unlimited.",
    h1: "Convert PNG to PDF",
    subtitle: "Transform PNG files into PDF documents without losing quality. No sign up, no limits.",
    tool: "/convert",
    toolLabel: "Convert PNG to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["png to pdf", "convert png to pdf", "png to pdf free online"],
    intro:
      "Convert PNG images into PDF documents without losing quality or uploading anything. Riftcut handles the conversion locally in your browser, making it a fast and private way to turn screenshots and exports into PDFs.",
    howItWorks: [
      "Choose the PNG images you want in your PDF.",
      "Riftcut converts and arranges them into a PDF on your device.",
      "Download the PDF instantly — no waiting on a server.",
    ],
    features: [
      "Preserves transparency information",
      "No compression or quality loss",
      "Convert multiple PNGs in sequence",
      "Instant download as PDF",
    ],
    useCases: [
      "Convert screenshots to shareable PDFs",
      "Create documents from design exports",
      "Package PNG illustrations as PDFs",
      "Convert infographics to printable format",
    ],
    faqs: [
      {
        question: "What happens to PNG transparency?",
        answer:
          "Transparent areas are flattened onto the PDF page, since PDF pages are not themselves transparent.",
      },
      {
        question: "Can I combine several PNGs into one PDF?",
        answer:
          "Yes. Add multiple PNGs and they are placed into a single PDF in order.",
      },
      {
        question: "Is it really private?",
        answer:
          "Yes. The conversion runs in your browser and your PNG files are never uploaded.",
      },
    ],
  },
  {
    slug: "image-to-pdf",
    title: "Convert Image to PDF Free -- JPG, PNG, WebP to PDF",
    description:
      "Convert any image format to PDF for free. Supports JPG, PNG, WebP, GIF, and BMP. All processing happens in your browser -- no uploads, no servers.",
    h1: "Convert Image to PDF",
    subtitle: "Turn any image into a PDF. Supports all major formats. Free, private, instant.",
    tool: "/convert",
    toolLabel: "Convert to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["image to pdf", "convert image to pdf", "photo to pdf"],
    intro:
      "Convert images in JPG, PNG, WebP, GIF, or BMP format into a PDF for free. Riftcut runs the whole conversion in your browser with no file size limits, so your images stay private and the PDF is ready instantly.",
    howItWorks: [
      "Add images in any supported format (JPG, PNG, WebP, GIF, BMP).",
      "Riftcut converts each one into PDF pages locally.",
      "Download a single PDF containing your images.",
    ],
    features: [
      "Supports JPG, PNG, WebP, GIF, BMP formats",
      "Maintains original resolution and quality",
      "No file size limits",
      "Works on mobile and desktop browsers",
    ],
    useCases: [
      "Convert camera photos to PDF for email",
      "Create PDF versions of digital art",
      "Package screenshots into documents",
      "Submit image files as PDF attachments",
    ],
    faqs: [
      {
        question: "Which image formats are supported?",
        answer:
          "JPG, PNG, WebP, GIF, and BMP can all be converted to PDF.",
      },
      {
        question: "Is there a file size limit?",
        answer:
          "There is no fixed limit. Because it runs locally, the practical ceiling depends on your device's memory.",
      },
      {
        question: "Does it work on mobile?",
        answer:
          "Yes. The converter works in mobile browsers as well as on desktop.",
      },
    ],
  },
  {
    slug: "word-to-pdf",
    title: "Convert Word to PDF Free Online -- DOCX to PDF",
    description:
      "Convert Word documents (.doc, .docx) to PDF entirely in your browser. No upload to servers — your documents never leave your device. Free and private.",
    h1: "Convert Word to PDF",
    subtitle: "Transform Word documents into PDF files without uploading them anywhere. 100% local.",
    tool: "/convert",
    toolLabel: "Convert Word to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf free"],
    intro:
      "Convert Word documents (.doc and .docx) to PDF without Microsoft Office and without uploading your file. Riftcut processes the document in your browser, keeping your content private while preserving the layout.",
    howItWorks: [
      "Select a .doc or .docx file from your device.",
      "Riftcut renders it to PDF locally, keeping the formatting.",
      "Download the PDF, ready to share or archive.",
    ],
    features: [
      "Converts .doc and .docx files",
      "Preserves formatting and layout",
      "No Microsoft Office required",
      "Completely local -- no server uploads",
    ],
    useCases: [
      "Convert resumes to PDF before sending",
      "Create PDF versions of reports",
      "Share documents without requiring Word",
      "Archive Word files as PDFs",
    ],
    faqs: [
      {
        question: "Do I need Microsoft Word installed?",
        answer:
          "No. The conversion happens in your browser, so you do not need Word or any other office software.",
      },
      {
        question: "Will my formatting be kept?",
        answer:
          "The converter preserves layout and formatting; very complex documents may differ slightly, so review the result.",
      },
      {
        question: "Is my document uploaded?",
        answer:
          "No. Your Word file is processed locally and never sent to a server.",
      },
    ],
  },
  {
    slug: "webp-to-pdf",
    title: "Convert WebP to PDF Free Online",
    description:
      "Convert WebP images to PDF directly in your browser. No upload, no servers. Free and private with no watermarks.",
    h1: "Convert WebP to PDF",
    subtitle: "Turn WebP files into PDF documents. Fast, free, and completely private.",
    tool: "/convert",
    toolLabel: "Convert WebP to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["webp to pdf", "convert webp to pdf", "webp to pdf free"],
    intro:
      "WebP is great for the web but awkward to share as a document — Riftcut converts WebP images to PDF in seconds. Everything runs in your browser, so there are no uploads and no watermarks.",
    howItWorks: [
      "Add one or more WebP images.",
      "Riftcut converts them to PDF pages on your device.",
      "Download the PDF right away.",
    ],
    features: [
      "Full WebP format support",
      "Preserves image quality during conversion",
      "No software installation needed",
      "Instant PDF download",
    ],
    useCases: [
      "Convert web-downloaded images to PDF",
      "Create documents from WebP screenshots",
      "Package WebP assets into printable format",
      "Convert browser-saved images to PDF",
    ],
    faqs: [
      {
        question: "Why convert WebP to PDF?",
        answer:
          "PDF is more universally supported for sharing and printing, while WebP is mainly a web image format.",
      },
      {
        question: "Is quality preserved?",
        answer:
          "Yes. The WebP image is embedded at its original quality in the PDF.",
      },
      {
        question: "Can I convert multiple WebP files at once?",
        answer:
          "Yes. Several WebP images can be combined into a single PDF.",
      },
    ],
  },
  {
    slug: "free-file-converter",
    title: "Free File Converter Online -- Convert Images & Docs to PDF",
    description:
      "Convert images and documents to PDF for free. Supports JPG, PNG, WebP, Word, and more. Runs in your browser -- no uploads, no sign-up, no limits.",
    h1: "Free File Converter",
    subtitle: "Convert any file to PDF without uploading it to a server. All processing happens on your device.",
    tool: "/convert",
    toolLabel: "Start Converting",
    category: "convert",
    archetype: "general",
    color: "#FFDE59",
    keywords: ["free file converter", "online file converter", "convert to pdf free"],
    intro:
      "Riftcut is a free file converter that turns images and Word documents into PDF without uploading anything. All processing happens on your device, so it is private by design with no accounts, tracking, or limits.",
    howItWorks: [
      "Choose images (JPG, PNG, WebP, GIF, BMP) or Word files (DOC, DOCX).",
      "Riftcut converts them to PDF locally in your browser.",
      "Download the converted PDF instantly.",
    ],
    features: [
      "Multi-format support: images and documents",
      "Zero server uploads -- total privacy",
      "No account or sign up required",
      "Unlimited conversions with no watermarks",
    ],
    useCases: [
      "Quick document conversion without installing software",
      "Convert files on shared or work computers securely",
      "Process sensitive documents without cloud risk",
      "Convert files on the go from any device",
    ],
    faqs: [
      {
        question: "What can I convert?",
        answer:
          "Images (JPG, PNG, WebP, GIF, BMP) and Word documents (DOC, DOCX) can be converted to PDF.",
      },
      {
        question: "Is it free with no limits?",
        answer:
          "Yes. There are no conversion limits, watermarks, or sign-ups.",
      },
      {
        question: "How is my data kept private?",
        answer:
          "Files are converted in your browser and never uploaded, so nothing is stored or tracked.",
      },
    ],
  },

  // ── PDF Merger ──────────────────────────────────────────────────

  {
    slug: "merge-pdf-online",
    title: "Merge PDF Online Free -- Combine PDF Files Instantly",
    description:
      "Merge multiple PDF files into one document for free. Drag to reorder pages, preview before download. No uploads -- runs entirely in your browser.",
    h1: "Merge PDF Online",
    subtitle: "Combine multiple PDFs into a single document. Drag to reorder, preview, and download.",
    tool: "/merge-pdf",
    toolLabel: "Merge PDFs Now",
    category: "merge-pdf",
    archetype: "general",
    color: "#4CC9F0",
    keywords: ["merge pdf online", "combine pdf", "merge pdf free"],
    intro:
      "Merge several PDF files into one document online, for free, without uploading them anywhere. Riftcut lets you drag to reorder and preview before saving, and the whole merge runs in your browser.",
    howItWorks: [
      "Add the PDF files you want to combine.",
      "Drag them into the order you want and preview the pages.",
      "Download the merged PDF as a single file.",
    ],
    features: [
      "Drag and drop to add and reorder files",
      "Preview pages before merging",
      "Mix PDFs with images in one document",
      "No page limits or file size restrictions",
    ],
    useCases: [
      "Combine invoice or receipt PDFs into one file",
      "Merge chapters into a complete document",
      "Consolidate scanned pages into a single PDF",
      "Create presentation packets from multiple files",
    ],
    faqs: [
      {
        question: "Can I reorder pages before merging?",
        answer:
          "Yes. Drag files into any order and preview the result before downloading.",
      },
      {
        question: "Is there a limit on the number of PDFs?",
        answer:
          "No. You can merge as many PDFs as your device can handle, with no page limits.",
      },
      {
        question: "Are my PDFs uploaded?",
        answer:
          "No. Merging happens locally in your browser, so your files stay private.",
      },
    ],
  },
  {
    slug: "combine-pdf",
    title: "Combine PDF Files Free -- No Upload, No Sign Up",
    description:
      "Combine multiple PDF files into one. All processing happens locally in your browser. Free, private, and unlimited. No account needed.",
    h1: "Combine PDF Files",
    subtitle: "Join multiple PDFs into a single file. Works offline, your files never leave your device.",
    tool: "/merge-pdf",
    toolLabel: "Combine PDFs",
    category: "merge-pdf",
    archetype: "general",
    color: "#4CC9F0",
    keywords: ["combine pdf", "join pdf files", "combine pdf free online"],
    intro:
      "Combine multiple PDF files into a single document with no upload and no sign-up. Riftcut runs the merge in your browser and works offline after the first load, so it is both private and convenient.",
    howItWorks: [
      "Add all the PDFs you want to combine.",
      "Arrange them in the desired order.",
      "Download one combined PDF file.",
    ],
    features: [
      "Merge unlimited PDF files at once",
      "Drag to reorder before combining",
      "Preview all pages in the browser",
      "Download combined PDF instantly",
    ],
    useCases: [
      "Combine contract pages into one file",
      "Merge split scan results",
      "Join separate report sections",
      "Consolidate application documents",
    ],
    faqs: [
      {
        question: "Does combining PDFs require an account?",
        answer:
          "No. There is no sign-up — just add your files and download the combined PDF.",
      },
      {
        question: "Can I use it offline?",
        answer:
          "Yes. After the first load, the tool works without an internet connection.",
      },
      {
        question: "Is it free with no watermark?",
        answer:
          "Yes. Combining PDFs is free and adds no watermark to your document.",
      },
    ],
  },
  {
    slug: "merge-images-to-pdf",
    title: "Merge Images to PDF Free -- Combine Photos into One PDF",
    description:
      "Combine multiple images into a single PDF document. Supports JPG, PNG, WebP. Drag to reorder, preview, and download. Free and private.",
    h1: "Merge Images to PDF",
    subtitle: "Turn multiple images into a single PDF document. Perfect for photo albums and portfolios.",
    tool: "/merge-pdf",
    toolLabel: "Merge Images to PDF",
    category: "merge-pdf",
    archetype: "use-case",
    color: "#4CC9F0",
    keywords: ["merge images to pdf", "combine images into pdf", "multiple images to pdf"],
    intro:
      "Combine several images into a single PDF — ideal for photo albums, receipts, or portfolios. Riftcut lets you mix images with PDFs, reorder them, and preview, all privately in your browser.",
    howItWorks: [
      "Add your images (JPG, PNG, WebP) and any PDFs.",
      "Drag to arrange them in the order you want.",
      "Download a single PDF containing everything.",
    ],
    features: [
      "Add JPG, PNG, WebP images",
      "Drag to reorder pages",
      "Mix images with existing PDFs",
      "Preview before downloading",
    ],
    useCases: [
      "Create photo albums as PDF",
      "Compile receipts and screenshots",
      "Build image-based portfolios",
      "Package reference images into one file",
    ],
    faqs: [
      {
        question: "Can I mix images and PDFs?",
        answer:
          "Yes. You can combine images and existing PDF files into one document.",
      },
      {
        question: "Which image formats can I add?",
        answer:
          "JPG, PNG, and WebP images are supported.",
      },
      {
        question: "Can I reorder the images?",
        answer:
          "Yes. Drag images and pages into any order before downloading.",
      },
    ],
  },
  {
    slug: "pdf-joiner",
    title: "PDF Joiner -- Join PDF Files Free Online",
    description:
      "Join PDF files together without uploading them to any server. Fast, free, and private. Works on any device with a modern browser.",
    h1: "PDF Joiner",
    subtitle: "Join PDF documents into one file. No servers, no uploads, no limits.",
    tool: "/merge-pdf",
    toolLabel: "Join PDFs",
    category: "merge-pdf",
    archetype: "general",
    color: "#4CC9F0",
    keywords: ["pdf joiner", "join pdf files", "pdf joiner online free"],
    intro:
      "Join PDF files into a single document quickly and privately. Riftcut's PDF joiner runs in your browser, preserves the original formatting, and never uploads your files to a server.",
    howItWorks: [
      "Add the PDF files you want to join.",
      "Order them and confirm the page sequence.",
      "Download the joined PDF.",
    ],
    features: [
      "Join any number of PDF files",
      "Preserves original formatting and quality",
      "Works offline after first load",
      "No watermarks on output files",
    ],
    useCases: [
      "Join split documents back together",
      "Combine forms with supporting documents",
      "Merge daily reports into weekly summaries",
      "Create single-file submissions from multiple PDFs",
    ],
    faqs: [
      {
        question: "Does joining change my PDF formatting?",
        answer:
          "No. The original formatting and quality of each PDF is preserved in the joined file.",
      },
      {
        question: "Is there a watermark?",
        answer:
          "No. The output PDF has no watermark.",
      },
      {
        question: "Does it work on any device?",
        answer:
          "Yes. It runs in any modern browser on desktop or mobile.",
      },
    ],
  },

  // ── PDF Editor ──────────────────────────────────────────────────

  {
    slug: "add-image-to-pdf",
    title: "Add Image to PDF Free Online -- Drag & Drop Editor",
    description:
      "Add images to any PDF page. Drag to position, resize visually, and download. Free, private, no upload to servers.",
    h1: "Add Image to PDF",
    subtitle: "Place images anywhere on your PDF pages. Drag, resize, and download. Completely free.",
    tool: "/pdf-editor",
    toolLabel: "Add Images to PDF",
    category: "pdf-editor",
    archetype: "general",
    color: "#FF914D",
    keywords: ["add image to pdf", "insert image in pdf", "overlay image on pdf"],
    intro:
      "Add an image to any PDF page with a visual drag-and-drop editor. Riftcut lets you position and resize images exactly where you want them, and because it runs in your browser, your PDF is never uploaded.",
    howItWorks: [
      "Open your PDF in the editor.",
      "Drag an image onto any page and resize or reposition it.",
      "Download the updated PDF with your image embedded.",
    ],
    features: [
      "Visual drag-and-drop image placement",
      "Resize images on any page",
      "Add multiple images across pages",
      "Preserves original PDF content",
    ],
    useCases: [
      "Add a signature image to contracts",
      "Insert a logo on every page of a report",
      "Add stamps or watermarks to documents",
      "Place photos into PDF templates",
    ],
    faqs: [
      {
        question: "Can I place an image precisely?",
        answer:
          "Yes. Drag to position and resize visually so the image lands exactly where you want it.",
      },
      {
        question: "Can I add images to multiple pages?",
        answer:
          "Yes. You can add images across different pages of the same PDF.",
      },
      {
        question: "Is my PDF uploaded?",
        answer:
          "No. Editing happens in your browser, so your PDF stays on your device.",
      },
    ],
  },
  {
    slug: "pdf-image-editor",
    title: "PDF Image Editor Free -- Insert Photos into PDF Online",
    description:
      "Edit PDFs by inserting images onto any page. Visual editor with drag-and-drop positioning. Free, no uploads, runs in your browser.",
    h1: "PDF Image Editor",
    subtitle: "A visual editor for placing images onto PDF pages. No software to install.",
    tool: "/pdf-editor",
    toolLabel: "Open PDF Editor",
    category: "pdf-editor",
    archetype: "general",
    color: "#FF914D",
    keywords: ["pdf image editor", "edit pdf images", "insert photo in pdf"],
    intro:
      "Riftcut's PDF image editor is a visual, WYSIWYG tool for inserting photos and graphics onto PDF pages. There is no software to install and nothing to upload — you edit directly in the browser and download the result.",
    howItWorks: [
      "Open a PDF in the editor.",
      "Drag images onto pages and adjust their size and position.",
      "Download your edited PDF instantly.",
    ],
    features: [
      "WYSIWYG editing interface",
      "Drag and drop images onto pages",
      "Resize and reposition freely",
      "Download edited PDF instantly",
    ],
    useCases: [
      "Annotate PDFs with reference images",
      "Add product photos to spec sheets",
      "Insert diagrams into reports",
      "Customize PDF templates with images",
    ],
    faqs: [
      {
        question: "Do I need to install software?",
        answer:
          "No. The editor runs entirely in your web browser.",
      },
      {
        question: "Can I resize images after placing them?",
        answer:
          "Yes. Images can be freely resized and repositioned until they look right.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, completely free with no watermarks or sign-up.",
      },
    ],
  },
  {
    slug: "add-signature-to-pdf",
    title: "Add Signature to PDF Free Online -- No Upload Required",
    description:
      "Add your signature image to any PDF document. Drag to position, resize to fit. Free, private -- your document never leaves your browser.",
    h1: "Add Signature to PDF",
    subtitle: "Place your signature anywhere on a PDF. Private, free, no account needed.",
    tool: "/pdf-editor",
    toolLabel: "Add Signature",
    category: "pdf-editor",
    archetype: "use-case",
    color: "#FF914D",
    keywords: ["add signature to pdf", "sign pdf free", "insert signature pdf"],
    intro:
      "Sign a PDF by adding your signature as an image and placing it exactly on the signature line. Because Riftcut runs in your browser, your contract or agreement is never uploaded — which matters for sensitive documents.",
    howItWorks: [
      "Open your PDF and upload a photo or scan of your signature.",
      "Drag the signature onto the right spot and resize it to fit.",
      "Download the signed PDF.",
    ],
    features: [
      "Upload your signature as an image",
      "Position it precisely on any page",
      "Resize to match signature lines",
      "Document never uploaded to any server",
    ],
    useCases: [
      "Sign contracts and agreements digitally",
      "Add signatures to forms without printing",
      "Sign rental or lease agreements remotely",
      "Complete signed document requests quickly",
    ],
    faqs: [
      {
        question: "How do I add my signature?",
        answer:
          "Upload a photo or scan of your signature as an image, then drag it onto the PDF. A transparent PNG looks cleanest.",
      },
      {
        question: "Is signing this way private?",
        answer:
          "Yes. Your document and signature stay in your browser and are never uploaded.",
      },
      {
        question: "Is this a legally binding e-signature?",
        answer:
          "It places a visual signature on the PDF. For legally binding e-signatures with audit trails, use a dedicated e-signature service.",
      },
    ],
  },
  {
    slug: "add-logo-to-pdf",
    title: "Add Logo to PDF Free -- Brand Your Documents Online",
    description:
      "Add your company logo to PDF documents. Place on any page, resize, and position visually. Free tool that runs in your browser.",
    h1: "Add Logo to PDF",
    subtitle: "Brand your PDF documents by adding your logo to any page. Free and private.",
    tool: "/pdf-editor",
    toolLabel: "Add Your Logo",
    category: "pdf-editor",
    archetype: "use-case",
    color: "#FF914D",
    keywords: ["add logo to pdf", "insert logo in pdf", "brand pdf with logo"],
    intro:
      "Brand your invoices, proposals, and reports by adding your company logo to PDF pages. Riftcut places the logo visually and runs in your browser, so your documents stay private and free of watermarks.",
    howItWorks: [
      "Open the PDF you want to brand.",
      "Drag your logo onto a page and size it to fit the header or corner.",
      "Repeat on other pages if needed, then download.",
    ],
    features: [
      "Place logo on any page of the PDF",
      "Resize and position with drag-and-drop",
      "Works with PNG, JPG, and WebP logos",
      "Add to multiple pages at once",
    ],
    useCases: [
      "Brand invoices with your company logo",
      "Add logos to proposals and presentations",
      "Customize PDF templates with branding",
      "Watermark documents with your logo",
    ],
    faqs: [
      {
        question: "What logo formats can I use?",
        answer:
          "PNG, JPG, and WebP logos all work. A transparent PNG blends best onto the page.",
      },
      {
        question: "Can I add the logo to every page?",
        answer:
          "Yes. Place the logo on each page where you want it to appear.",
      },
      {
        question: "Does it add a watermark of its own?",
        answer:
          "No. Only your logo is added — Riftcut never stamps its own watermark.",
      },
    ],
  },
  {
    slug: "free-pdf-editor",
    title: "Free PDF Editor Online -- Edit PDFs in Your Browser",
    description:
      "Edit PDF files for free. Add images, signatures, and logos to any page. Visual editor that runs locally -- no uploads, no servers, no sign up.",
    h1: "Free PDF Editor",
    subtitle: "Edit PDFs without installing software. Add images, resize, reposition, and download.",
    tool: "/pdf-editor",
    toolLabel: "Edit PDF Free",
    category: "pdf-editor",
    archetype: "general",
    color: "#FF914D",
    keywords: ["free pdf editor", "edit pdf online", "pdf editor no sign up"],
    intro:
      "Riftcut is a free PDF editor that lets you add images, signatures, and logos to any page using a visual drag-and-drop interface. It runs locally in your browser with no uploads, no servers, and no sign-up.",
    howItWorks: [
      "Open a PDF in the editor.",
      "Add and arrange images, signatures, or logos on the pages.",
      "Download the edited PDF.",
    ],
    features: [
      "Visual drag-and-drop editing",
      "Add images and overlays to any page",
      "Resize and position elements freely",
      "No software installation or account required",
    ],
    useCases: [
      "Quick edits without Adobe Acrobat",
      "Add missing images to documents",
      "Prepare documents on shared computers",
      "Edit PDFs on any device with a browser",
    ],
    faqs: [
      {
        question: "What can I edit in a PDF?",
        answer:
          "You can add images, signatures, and logos, then position and resize them anywhere on the page.",
      },
      {
        question: "Do I need Adobe Acrobat?",
        answer:
          "No. Riftcut runs in your browser, so there is no need for Acrobat or any installed software.",
      },
      {
        question: "Is it free and private?",
        answer:
          "Yes. It is free with no sign-up, and your PDF is never uploaded to a server.",
      },
    ],
  },

  // ── General / Multipurpose ──────────────────────────────────────

  {
    slug: "free-online-photo-editor",
    title: "Free Online Photo Editor -- Edit Photos in Your Browser",
    description:
      "Edit photos for free online. Remove backgrounds, adjust brightness and contrast, crop, add text, and more. No uploads, 100% private.",
    h1: "Free Online Photo Editor",
    subtitle: "Edit your photos directly in the browser. Remove backgrounds, crop, filter, and export.",
    tool: "/bg-remover",
    toolLabel: "Edit Photos Free",
    category: "bg-remover",
    archetype: "general",
    color: "#FF6B6B",
    keywords: ["free photo editor", "online photo editor", "edit photos free"],
    intro:
      "Riftcut is a free online photo editor that runs entirely in your browser. Remove backgrounds with AI, adjust brightness and contrast, crop to any ratio, and add text — all without uploading your photos or installing software.",
    howItWorks: [
      "Open the editor and add a photo.",
      "Remove the background, crop, adjust colors, or add text.",
      "Export the finished image to your device.",
    ],
    features: [
      "AI background removal",
      "Brightness, contrast, and saturation controls",
      "Crop to custom or preset aspect ratios",
      "Add text overlays with custom fonts",
    ],
    useCases: [
      "Quick photo edits without installing Photoshop",
      "Fix photos on the go from your phone",
      "Prepare images for social media",
      "Edit photos on work computers without admin rights",
    ],
    faqs: [
      {
        question: "What editing tools are included?",
        answer:
          "AI background removal, brightness/contrast/saturation adjustments, cropping, and text overlays.",
      },
      {
        question: "Is it really free?",
        answer:
          "Yes. All editing features are free with no watermarks or sign-up.",
      },
      {
        question: "Are my photos uploaded?",
        answer:
          "No. Editing happens in your browser, so your photos never leave your device.",
      },
    ],
  },
  {
    slug: "free-pdf-tools",
    title: "Free PDF Tools Online -- Merge, Edit, Convert PDFs",
    description:
      "All-in-one free PDF toolkit. Merge PDFs, add images, convert files to PDF. Everything runs in your browser. No uploads, no limits, no sign up.",
    h1: "Free PDF Tools",
    subtitle: "Merge, edit, and convert PDFs without uploading your files. 100% private and free.",
    tool: "/merge-pdf",
    toolLabel: "Open PDF Tools",
    category: "merge-pdf",
    archetype: "general",
    color: "#4CC9F0",
    keywords: ["free pdf tools", "pdf tools online", "pdf toolkit free"],
    intro:
      "Riftcut bundles a full set of free PDF tools — merge, edit, and convert — that all run in your browser. There are no uploads, no limits, and no sign-up, so you can handle PDF tasks privately without paid software.",
    howItWorks: [
      "Pick the PDF task you need: merge, add images, or convert to PDF.",
      "Work with your files locally in the browser.",
      "Download the finished PDF.",
    ],
    features: [
      "Merge multiple PDFs into one",
      "Add images and signatures to PDFs",
      "Convert images and Word docs to PDF",
      "All processing happens locally",
    ],
    useCases: [
      "Handle all PDF tasks without paid software",
      "Process sensitive documents privately",
      "Work with PDFs on any device",
      "Quick PDF fixes without installing anything",
    ],
    faqs: [
      {
        question: "What PDF tools are available?",
        answer:
          "You can merge PDFs, add images and signatures, and convert images and Word documents to PDF.",
      },
      {
        question: "Do these tools cost anything?",
        answer:
          "No. Every PDF tool is free with no limits or watermarks.",
      },
      {
        question: "Are my PDFs safe?",
        answer:
          "Yes. All processing is local to your browser, so files are never uploaded.",
      },
    ],
  },
  {
    slug: "private-file-tools",
    title: "Private File Tools -- No Upload, No Tracking, Free",
    description:
      "File editing tools that never upload your files. Background removal, PDF editing, file conversion -- all running 100% in your browser. Free and offline-capable.",
    h1: "Private File Tools",
    subtitle: "Tools that respect your privacy. No uploads, no accounts. Your files stay on your device.",
    tool: "/",
    toolLabel: "Browse All Tools",
    category: "bg-remover",
    archetype: "general",
    color: "#A7F205",
    keywords: ["private file tools", "no upload file editor", "offline file tools"],
    intro:
      "Riftcut is a suite of private file tools that never upload your files. Background removal, PDF editing, and file conversion all run in your browser, work offline after the first load, and require no account.",
    howItWorks: [
      "Choose a tool — background remover, converter, or PDF editor.",
      "Process your file entirely on your device.",
      "Download the result; nothing was ever uploaded.",
    ],
    features: [
      "Files never sent to servers -- ever",
      "Works offline after first load",
      "No accounts or tracking",
      "Open source processing in your browser",
    ],
    useCases: [
      "Handle confidential documents safely",
      "Edit files on restricted networks",
      "Process files without trusting third-party servers",
      "Work with sensitive images and documents",
    ],
    faqs: [
      {
        question: "What makes these tools private?",
        answer:
          "All processing runs in your browser, so your files are never uploaded, stored, or tracked.",
      },
      {
        question: "Which tools are included?",
        answer:
          "A background remover, a file converter, a PDF merger, and a PDF image editor.",
      },
      {
        question: "Can I use them offline?",
        answer:
          "Yes. After the first load, the tools keep working without an internet connection.",
      },
    ],
  },
  {
    slug: "offline-image-editor",
    title: "Offline Image Editor -- Edit Photos Without Internet",
    description:
      "An image editor that works offline. Remove backgrounds, crop, adjust colors, and add text -- all without an internet connection after first load.",
    h1: "Offline Image Editor",
    subtitle: "Edit images anytime, anywhere. No internet required after the first visit.",
    tool: "/bg-remover",
    toolLabel: "Open Image Editor",
    category: "bg-remover",
    archetype: "general",
    color: "#FF6B6B",
    keywords: ["offline image editor", "edit images offline", "no internet photo editor"],
    intro:
      "Riftcut works as an offline image editor: after the first visit, the AI and all editing tools are cached so you can remove backgrounds, crop, adjust colors, and add text with no internet connection. Nothing is ever sent to a server.",
    howItWorks: [
      "Load the editor once while online so it caches.",
      "Edit images offline — background removal, crop, filters, and text all work.",
      "Export your edited image without any network request.",
    ],
    features: [
      "Full functionality without internet",
      "AI background removal works offline",
      "Crop, filter, and text editing offline",
      "No data ever sent to external servers",
    ],
    useCases: [
      "Edit photos during flights",
      "Work in areas with poor connectivity",
      "Process images on air-gapped computers",
      "Reliable editing without depending on cloud services",
    ],
    faqs: [
      {
        question: "How does offline editing work?",
        answer:
          "The app and AI model are cached on first load, so they keep running in your browser without internet.",
      },
      {
        question: "Does AI background removal work offline?",
        answer:
          "Yes. The model runs on your device, so it works the same with or without a connection.",
      },
      {
        question: "Is anything sent to a server?",
        answer:
          "No. There is no network request during editing — your images stay on your device.",
      },
    ],
  },
  {
    slug: "no-upload-file-editor",
    title: "No Upload File Editor -- Edit Files Without Uploading",
    description:
      "Edit images and PDFs without uploading them anywhere. All processing happens in your browser using local AI. Free, private, and secure.",
    h1: "No Upload File Editor",
    subtitle: "Your files never leave your device. Edit images, PDFs, and documents 100% locally.",
    tool: "/",
    toolLabel: "Browse Tools",
    category: "bg-remover",
    archetype: "general",
    color: "#A7F205",
    keywords: ["no upload editor", "local file editor", "browser file editor"],
    intro:
      "Riftcut is a no-upload file editor: every action happens client-side in your browser, so your images and PDFs never leave your device. That makes it a secure choice for confidential, NDA, or compliance-bound files.",
    howItWorks: [
      "Open a tool and add your file from your device.",
      "Edit or convert it entirely in the browser — no upload occurs.",
      "Download the result, which also never touches a server.",
    ],
    features: [
      "All processing runs client-side",
      "No server communication during editing",
      "Works with images, PDFs, and documents",
      "Free with no usage limits",
    ],
    useCases: [
      "Edit sensitive corporate documents",
      "Process medical or legal images privately",
      "Work on files covered by NDA or compliance rules",
      "Use on shared computers without privacy concerns",
    ],
    faqs: [
      {
        question: "Are files ever uploaded?",
        answer:
          "No. Every operation runs in your browser, so files are never uploaded or stored remotely.",
      },
      {
        question: "What file types can I work with?",
        answer:
          "Images and PDFs, via background removal, conversion, merging, and PDF editing.",
      },
      {
        question: "Is it suitable for confidential files?",
        answer:
          "Yes. Because nothing leaves your device, it suits NDA and compliance-sensitive work.",
      },
    ],
  },

  // ── Subject Background Removal (new) ────────────────────────────

  {
    slug: "remove-background-from-car",
    title: "Remove Background from Car Photo Free Online",
    description:
      "Remove the background from car photos with AI. Perfect for dealership listings and marketplace ads. Free, private, runs in your browser.",
    h1: "Remove Background from Car Photo",
    subtitle: "Get clean car cutouts for listings and ads. AI-powered, free, and private.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Car Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from car", "car photo background remover", "car background removal"],
    intro:
      "Make your car photos stand out by removing busy parking-lot or driveway backgrounds. Riftcut's AI isolates the vehicle and runs in your browser, so dealership and marketplace photos are clean, consistent, and free to produce.",
    howItWorks: [
      "Upload a photo of the car.",
      "The AI cuts the vehicle out from its background.",
      "Add a clean studio backdrop or keep it transparent, then download.",
    ],
    features: [
      "AI isolates the vehicle from busy backgrounds",
      "Replace with a clean studio-style backdrop",
      "Consistent look across a full inventory",
      "Export transparent PNGs for ads",
    ],
    useCases: [
      "Dealership inventory listings",
      "Marketplace and classified car ads",
      "Car rental and fleet catalogs",
      "Automotive social media posts",
    ],
    faqs: [
      {
        question: "Can I use this for dealership listings?",
        answer:
          "Yes. Removing distracting backgrounds gives your inventory a consistent, professional look across every photo.",
      },
      {
        question: "Will it handle a full car shape cleanly?",
        answer:
          "The AI detects the vehicle automatically; clear, well-lit photos produce the cleanest edges.",
      },
      {
        question: "Is it free for many cars?",
        answer:
          "Yes. There are no limits, so you can process an entire inventory for free.",
      },
    ],
  },
  {
    slug: "remove-background-from-dog",
    title: "Remove Background from Dog Photo Free Online",
    description:
      "Remove the background from dog and pet photos with AI. Clean cutouts even around fur. Free, private, runs in your browser.",
    h1: "Remove Background from Dog Photo",
    subtitle: "Cut out your dog from any photo, fur and all. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Cut Out Your Dog",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from dog", "dog photo background remover", "pet background removal"],
    intro:
      "Cut your dog out of any photo, fur and all, using AI built to handle soft edges. Riftcut processes pet photos in your browser for free, so you can make stickers, prints, and posts without uploading anything.",
    howItWorks: [
      "Upload a photo of your dog.",
      "The AI traces around the fur and removes the background.",
      "Download a transparent PNG or add a fun new background.",
    ],
    features: [
      "Handles fur and soft edges well",
      "Make transparent pet cutouts",
      "Add playful custom backgrounds",
      "Great for prints, stickers, and posts",
    ],
    useCases: [
      "Create pet stickers and emojis",
      "Design custom pet portraits and prints",
      "Make fun social media posts",
      "Prepare pet photos for greeting cards",
    ],
    faqs: [
      {
        question: "Does it handle dog fur well?",
        answer:
          "Yes. The model is good at tracing fur and soft edges, though sharp, well-lit photos give the best results.",
      },
      {
        question: "Can I make a sticker from my dog photo?",
        answer:
          "Yes. Export a transparent PNG and use it as a sticker or in any design tool.",
      },
      {
        question: "Does it work for other pets too?",
        answer:
          "Yes. Cats, rabbits, and other pets work just as well as dogs.",
      },
    ],
  },
  {
    slug: "remove-background-from-cat",
    title: "Remove Background from Cat Photo Free Online",
    description:
      "Remove the background from cat photos with AI. Clean cutouts around whiskers and fur. Free, private, runs in your browser.",
    h1: "Remove Background from Cat Photo",
    subtitle: "Cut out your cat from any photo. Free, private, and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Cut Out Your Cat",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from cat", "cat photo background remover", "cat background removal"],
    intro:
      "Cut your cat out of any photo with AI that handles fur and whiskers gracefully. Riftcut runs in your browser for free, making it easy to turn cat photos into stickers, prints, and posts without uploads.",
    howItWorks: [
      "Upload a photo of your cat.",
      "The AI removes the background while keeping fur detail.",
      "Save a transparent PNG or add a new background.",
    ],
    features: [
      "Traces fur and whiskers cleanly",
      "Create transparent cat cutouts",
      "Add custom or playful backgrounds",
      "Perfect for stickers and prints",
    ],
    useCases: [
      "Create cat stickers and memes",
      "Design custom pet portraits",
      "Make fun social media content",
      "Prepare photos for cards and gifts",
    ],
    faqs: [
      {
        question: "Will whiskers and fur look natural?",
        answer:
          "The AI does well with fur and fine detail; high-contrast, well-lit photos produce the cleanest edges.",
      },
      {
        question: "Can I add a new background behind my cat?",
        answer:
          "Yes. After removal you can drop in a solid color or any background image.",
      },
      {
        question: "Is it free and private?",
        answer:
          "Yes. It is free with no limits and runs entirely in your browser.",
      },
    ],
  },
  {
    slug: "remove-background-from-hair",
    title: "Remove Background Around Hair -- Clean Hair Cutouts Free",
    description:
      "Remove backgrounds around hair with AI that traces fine strands. Clean cutouts for portraits and headshots. Free, private, in your browser.",
    h1: "Remove Background Around Hair",
    subtitle: "Get clean cutouts even around fine hair strands. Free and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Try Hair Cutouts",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background hair", "hair cutout", "background removal around hair"],
    intro:
      "Hair is the hardest part of any cutout, and Riftcut's AI is built to trace fine strands instead of leaving a hard outline. It runs in your browser for free, producing natural portrait and headshot cutouts with no manual masking.",
    howItWorks: [
      "Upload a portrait where hair detail matters.",
      "The AI segments the subject, following hair strands.",
      "Download a transparent cutout or add a new backdrop.",
    ],
    features: [
      "Designed to trace fine hair strands",
      "Avoids hard, cut-out-with-scissors edges",
      "Great for portraits and headshots",
      "No manual masking required",
    ],
    useCases: [
      "Portrait and headshot cutouts",
      "Hair salon and stylist portfolios",
      "Professional profile photos",
      "Composites that need realistic edges",
    ],
    faqs: [
      {
        question: "Why is hair hard to cut out?",
        answer:
          "Fine strands blend into the background, so basic tools leave a hard edge. The AI is trained to follow those strands more naturally.",
      },
      {
        question: "Do I need to mask anything manually?",
        answer:
          "No. The AI handles the segmentation automatically.",
      },
      {
        question: "What photo gives the best hair edges?",
        answer:
          "Even lighting and good contrast between the hair and background produce the cleanest results.",
      },
    ],
  },
  {
    slug: "remove-background-from-person",
    title: "Remove Background from Person Photo Free Online",
    description:
      "Remove the background from photos of people with AI. Clean full-body and portrait cutouts. Free, private, runs in your browser.",
    h1: "Remove Background from Person",
    subtitle: "Cut out a person from any photo cleanly. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Cut Out a Person",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from person", "cut out person from photo", "person background remover"],
    intro:
      "Cut a person out of any photo — full body or portrait — with AI tuned for human subjects. Riftcut runs in your browser for free, giving you clean people cutouts for composites, designs, and posts without uploads.",
    howItWorks: [
      "Upload a photo containing the person.",
      "The AI detects the person and removes everything else.",
      "Download a transparent cutout or place them on a new background.",
    ],
    features: [
      "Optimized for human subjects",
      "Works for portraits and full-body shots",
      "Clean edges around hair and clothing",
      "Export transparent PNGs for compositing",
    ],
    useCases: [
      "Create composites and montages",
      "Place people on new backgrounds",
      "Design posters and flyers",
      "Make cutouts for presentations",
    ],
    faqs: [
      {
        question: "Does it work for full-body photos?",
        answer:
          "Yes. The AI handles both close-up portraits and full-body shots.",
      },
      {
        question: "Can I composite the person onto a new scene?",
        answer:
          "Yes. Export a transparent PNG and place it over any background.",
      },
      {
        question: "Are the photos kept private?",
        answer:
          "Yes. Processing is local to your browser, so photos of people are never uploaded.",
      },
    ],
  },
  {
    slug: "remove-background-from-food",
    title: "Remove Background from Food Photo Free Online",
    description:
      "Remove the background from food photos with AI. Perfect for menus, delivery apps, and recipes. Free, private, runs in your browser.",
    h1: "Remove Background from Food Photo",
    subtitle: "Make food photos pop for menus and delivery apps. Free and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Food Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from food", "food photo background remover", "food background removal"],
    intro:
      "Make dishes pop by removing cluttered table backgrounds from food photos. Riftcut's AI isolates the plate and runs in your browser, so menus, delivery listings, and recipe cards look clean and appetizing for free.",
    howItWorks: [
      "Upload a photo of the dish.",
      "The AI cuts the food out from its background.",
      "Add a clean background or keep transparent, then download.",
    ],
    features: [
      "Isolate dishes from busy table settings",
      "Clean backgrounds for menus and apps",
      "Transparent PNGs for design layouts",
      "Consistent look across a menu",
    ],
    useCases: [
      "Restaurant menus and signage",
      "Food delivery app listings",
      "Recipe blogs and cards",
      "Food brand social media",
    ],
    faqs: [
      {
        question: "Is this good for a delivery app menu?",
        answer:
          "Yes. Clean, consistent food cutouts make menu and delivery listings look more professional and appetizing.",
      },
      {
        question: "Can I keep the food on transparency?",
        answer:
          "Yes. Export a transparent PNG to drop the dish into any design layout.",
      },
      {
        question: "Is it free to do a whole menu?",
        answer:
          "Yes. There are no limits, so you can process every dish for free.",
      },
    ],
  },
  {
    slug: "remove-background-from-jewelry",
    title: "Remove Background from Jewelry Photo Free Online",
    description:
      "Remove the background from jewelry photos with AI. Clean white or transparent backgrounds for listings. Free, private, in your browser.",
    h1: "Remove Background from Jewelry Photo",
    subtitle: "Get clean jewelry product shots for listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Jewelry Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from jewelry", "jewelry photo background remover", "jewelry product photo"],
    intro:
      "Give rings, necklaces, and earrings clean white or transparent backgrounds for your shop. Riftcut's AI isolates small, detailed jewelry pieces in your browser for free — no studio or photo editor required.",
    howItWorks: [
      "Upload a photo of the jewelry piece.",
      "The AI removes the background around it.",
      "Add a white background for listings or keep it transparent, then download.",
    ],
    features: [
      "Isolates small, detailed pieces",
      "White backgrounds for marketplace listings",
      "Transparent PNGs for design use",
      "Consistent catalog look",
    ],
    useCases: [
      "Etsy and Shopify jewelry listings",
      "Jewelry brand catalogs",
      "Instagram and Pinterest posts",
      "Lookbooks and ad creatives",
    ],
    faqs: [
      {
        question: "Can it handle small, detailed jewelry?",
        answer:
          "Yes. The AI isolates intricate pieces; sharp, well-lit close-ups give the cleanest edges.",
      },
      {
        question: "Can I get a white background for listings?",
        answer:
          "Yes. Replace the removed background with solid white to meet marketplace requirements.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, completely free with no watermarks or limits.",
      },
    ],
  },
  {
    slug: "remove-background-from-clothing",
    title: "Remove Background from Clothing Photo Free Online",
    description:
      "Remove the background from clothing and apparel photos with AI. Clean cutouts for fashion listings. Free, private, runs in your browser.",
    h1: "Remove Background from Clothing Photo",
    subtitle: "Clean apparel cutouts for fashion listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Apparel Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from clothing", "clothing photo background remover", "apparel background removal"],
    intro:
      "Get clean cutouts of shirts, dresses, and apparel for your fashion shop. Riftcut's AI removes the background — whether the item is flat-laid or on a model — privately in your browser and for free.",
    howItWorks: [
      "Upload a flat-lay or on-model clothing photo.",
      "The AI removes the background around the garment.",
      "Add a white backdrop for listings or keep transparent, then download.",
    ],
    features: [
      "Works for flat-lay and on-model shots",
      "Clean white backgrounds for listings",
      "Transparent PNGs for lookbooks",
      "Consistent fashion catalog look",
    ],
    useCases: [
      "Fashion and apparel listings",
      "Resale and thrift shop photos",
      "Lookbooks and catalogs",
      "Clothing brand social media",
    ],
    faqs: [
      {
        question: "Does it work for clothes on a model?",
        answer:
          "Yes. Both flat-lay garments and on-model shots work, though clean backgrounds help accuracy.",
      },
      {
        question: "Can I standardize my whole shop?",
        answer:
          "Yes. Applying the same white or transparent background gives your listings a consistent look.",
      },
      {
        question: "Is it free for resellers?",
        answer:
          "Yes. There are no limits, so resellers can process every item for free.",
      },
    ],
  },
  {
    slug: "remove-background-from-furniture",
    title: "Remove Background from Furniture Photo Free Online",
    description:
      "Remove the background from furniture photos with AI. Clean cutouts for marketplace and store listings. Free, private, in your browser.",
    h1: "Remove Background from Furniture Photo",
    subtitle: "Clean furniture cutouts for listings and catalogs. Free and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Furniture Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from furniture", "furniture photo background remover", "furniture background removal"],
    intro:
      "Sell furniture faster with clean product shots that remove the room clutter behind each piece. Riftcut's AI isolates sofas, chairs, and tables in your browser for free, ready for marketplace and store listings.",
    howItWorks: [
      "Upload a photo of the furniture piece.",
      "The AI removes the surrounding room or background.",
      "Add a clean backdrop or keep transparent, then download.",
    ],
    features: [
      "Isolates large items from cluttered rooms",
      "Clean backgrounds for listings",
      "Transparent PNGs for room mockups",
      "Consistent catalog presentation",
    ],
    useCases: [
      "Marketplace furniture listings",
      "Furniture store catalogs",
      "Interior design mockups",
      "Resale and consignment photos",
    ],
    faqs: [
      {
        question: "Can it isolate furniture from a full room?",
        answer:
          "Yes. The AI detects the main piece; clear separation between the item and the room helps accuracy.",
      },
      {
        question: "Can I use cutouts in room mockups?",
        answer:
          "Yes. Transparent PNGs can be placed into interior design mockups.",
      },
      {
        question: "Is it free for many items?",
        answer:
          "Yes. Process your entire catalog at no cost.",
      },
    ],
  },
  {
    slug: "remove-background-from-shoes",
    title: "Remove Background from Shoes Photo Free Online",
    description:
      "Remove the background from shoe and sneaker photos with AI. Clean cutouts for resellers and listings. Free, private, in your browser.",
    h1: "Remove Background from Shoes Photo",
    subtitle: "Clean sneaker and shoe cutouts for listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Shoe Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from shoes", "sneaker background remover", "shoe photo background removal"],
    intro:
      "Sneaker and shoe resellers can get clean, consistent product shots in seconds. Riftcut's AI removes the background around footwear in your browser for free, perfect for marketplace listings and drops.",
    howItWorks: [
      "Upload a photo of the shoes or sneakers.",
      "The AI removes the background around them.",
      "Add a white backdrop for listings or keep transparent, then download.",
    ],
    features: [
      "Clean cutouts for footwear",
      "White backgrounds for marketplaces",
      "Transparent PNGs for ad creatives",
      "Consistent look across listings",
    ],
    useCases: [
      "Sneaker reselling listings",
      "Shoe store catalogs",
      "StockX and marketplace photos",
      "Footwear brand social media",
    ],
    faqs: [
      {
        question: "Is this good for sneaker reselling?",
        answer:
          "Yes. Clean, consistent shoe cutouts make resale listings look more professional.",
      },
      {
        question: "Can I add a white background?",
        answer:
          "Yes. Replace the removed background with white for marketplace listings.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
    ],
  },
  {
    slug: "remove-background-from-flowers",
    title: "Remove Background from Flower Photo Free Online",
    description:
      "Remove the background from flower and plant photos with AI. Clean cutouts for shops and designs. Free, private, runs in your browser.",
    h1: "Remove Background from Flower Photo",
    subtitle: "Clean flower and plant cutouts for shops and designs. Free and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Flower Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from flowers", "flower photo background remover", "plant background removal"],
    intro:
      "Cut flowers and plants out of any photo for florist listings, designs, and prints. Riftcut's AI traces petals and leaves in your browser for free, producing clean transparent cutouts without manual editing.",
    howItWorks: [
      "Upload a photo of the flower or plant.",
      "The AI removes the background around the petals and leaves.",
      "Download a transparent PNG or add a new background.",
    ],
    features: [
      "Traces petals and leaves",
      "Transparent cutouts for designs",
      "Clean backgrounds for shop listings",
      "Great for prints and cards",
    ],
    useCases: [
      "Florist and plant shop listings",
      "Greeting cards and invitations",
      "Botanical design projects",
      "Social media and ad creatives",
    ],
    faqs: [
      {
        question: "Will it trace petals cleanly?",
        answer:
          "The AI handles detailed shapes well; high-contrast, well-lit photos give the cleanest petal edges.",
      },
      {
        question: "Can I use the cutout in a design?",
        answer:
          "Yes. Export a transparent PNG to use in cards, invitations, or layouts.",
      },
      {
        question: "Is it private and free?",
        answer:
          "Yes. It runs in your browser at no cost and never uploads your photos.",
      },
    ],
  },
  {
    slug: "remove-background-from-glasses",
    title: "Remove Background from Glasses Photo Free Online",
    description:
      "Remove the background from eyewear and glasses photos with AI. Clean cutouts for optical listings. Free, private, runs in your browser.",
    h1: "Remove Background from Glasses Photo",
    subtitle: "Clean eyewear cutouts for optical listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Eyewear Photos",
    category: "bg-remover",
    archetype: "subject",
    color: "#FF6B6B",
    keywords: ["remove background from glasses", "eyewear background remover", "glasses photo background removal"],
    intro:
      "Get clean cutouts of glasses and sunglasses for optical shops and eyewear brands. Riftcut's AI isolates frames in your browser for free, giving you consistent product shots for listings and ads.",
    howItWorks: [
      "Upload a photo of the glasses or sunglasses.",
      "The AI removes the background around the frames.",
      "Add a white background for listings or keep transparent, then download.",
    ],
    features: [
      "Isolates frames and lenses",
      "White backgrounds for listings",
      "Transparent PNGs for ad creatives",
      "Consistent eyewear catalog look",
    ],
    useCases: [
      "Optical shop and eyewear listings",
      "Sunglasses brand catalogs",
      "E-commerce product galleries",
      "Eyewear social media ads",
    ],
    faqs: [
      {
        question: "Does it handle thin frames?",
        answer:
          "Yes. The AI isolates frames automatically; sharp, well-lit photos give the cleanest edges.",
      },
      {
        question: "Can I get a consistent catalog look?",
        answer:
          "Yes. Apply the same white or transparent background across all your eyewear photos.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
    ],
  },

  // ── Use-case / Persona (new) ────────────────────────────────────

  {
    slug: "background-remover-for-ebay",
    title: "Background Remover for eBay -- Free White Background Tool",
    description:
      "Remove backgrounds from eBay listing photos with AI. Get clean white backgrounds for free, no uploads. Runs in your browser.",
    h1: "Background Remover for eBay",
    subtitle: "Clean white backgrounds for your eBay listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up eBay Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for ebay", "ebay white background", "ebay listing photo editor"],
    intro:
      "eBay listings convert better with clean, distraction-free photos. Riftcut removes the background from your item photos and lets you add a white backdrop, all free and private in your browser — ideal for high-volume sellers.",
    howItWorks: [
      "Upload your eBay item photo.",
      "The AI removes the cluttered background.",
      "Add a white background and download for your listing.",
    ],
    features: [
      "Clean white backgrounds for listings",
      "Free for unlimited items",
      "No uploads -- photos stay private",
      "Consistent look across your store",
    ],
    useCases: [
      "Standardize a full eBay store",
      "Improve click-through on listings",
      "Clean up phone-camera item photos",
      "Prep photos for eBay's gallery view",
    ],
    faqs: [
      {
        question: "Does eBay prefer white backgrounds?",
        answer:
          "Clean, uncluttered photos — often on white — tend to look more professional and can improve listing performance.",
      },
      {
        question: "Is it free for a high-volume store?",
        answer:
          "Yes. There are no per-image fees or limits, so you can process your whole store for free.",
      },
      {
        question: "Are my photos uploaded?",
        answer:
          "No. Everything runs in your browser, so your item photos stay private.",
      },
    ],
  },
  {
    slug: "background-remover-for-etsy",
    title: "Background Remover for Etsy -- Free Product Photo Tool",
    description:
      "Remove backgrounds from Etsy product photos with AI. Clean white or transparent backgrounds for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Etsy",
    subtitle: "Clean product photos for your Etsy shop. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Etsy Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for etsy", "etsy product photo", "etsy white background"],
    intro:
      "Make your handmade and vintage items shine on Etsy with clean product photos. Riftcut removes busy backgrounds and lets you add white or transparent backdrops, free and private in your browser.",
    howItWorks: [
      "Upload your Etsy product photo.",
      "The AI removes the background around your item.",
      "Add a white or transparent background and download.",
    ],
    features: [
      "Clean white or transparent backgrounds",
      "Perfect for handmade and vintage items",
      "Free for your whole shop",
      "No uploads -- total privacy",
    ],
    useCases: [
      "Handmade craft listings",
      "Vintage and resale items",
      "Consistent Etsy shop branding",
      "Thumbnail and gallery photos",
    ],
    faqs: [
      {
        question: "Is this good for handmade items?",
        answer:
          "Yes. Clean backgrounds let the detail of handmade and vintage pieces stand out in your listings.",
      },
      {
        question: "Can I keep a transparent background?",
        answer:
          "Yes. Export a transparent PNG, or add a solid color for a uniform shop look.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
    ],
  },
  {
    slug: "background-remover-for-amazon",
    title: "Background Remover for Amazon -- Free White Background Tool",
    description:
      "Remove backgrounds from Amazon product photos with AI. Get the pure white background Amazon requires, free. Runs in your browser.",
    h1: "Background Remover for Amazon",
    subtitle: "Pure white backgrounds for Amazon listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Amazon Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for amazon", "amazon white background", "amazon product photo"],
    intro:
      "Amazon's main product images require a pure white background. Riftcut removes whatever is behind your product and applies solid white in your browser for free, helping your listings meet Amazon's image standards.",
    howItWorks: [
      "Upload your Amazon product photo.",
      "The AI removes the existing background.",
      "Apply pure white and download for your listing.",
    ],
    features: [
      "Pure white backgrounds for main images",
      "Helps meet Amazon image standards",
      "Free for unlimited products",
      "No uploads -- photos stay private",
    ],
    useCases: [
      "Amazon main product images",
      "Standardize a product catalog",
      "Prep photos for A+ content",
      "Clean up supplier-provided images",
    ],
    faqs: [
      {
        question: "Does Amazon require a white background?",
        answer:
          "Amazon's main product image must have a pure white background. Applying solid white after removal helps meet that rule.",
      },
      {
        question: "Is it free for many products?",
        answer:
          "Yes. There are no limits, so you can process an entire catalog at no cost.",
      },
      {
        question: "Always check Amazon's current rules?",
        answer:
          "Yes. Image requirements can change, so confirm the latest guidelines for your category.",
      },
    ],
  },
  {
    slug: "background-remover-for-shopify",
    title: "Background Remover for Shopify -- Free Product Photo Tool",
    description:
      "Remove backgrounds from Shopify product photos with AI. Clean, consistent store images for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Shopify",
    subtitle: "Clean, consistent product photos for your Shopify store. Free and AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Shopify Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for shopify", "shopify product photo", "shopify white background"],
    intro:
      "A consistent product gallery makes a Shopify store look trustworthy. Riftcut removes backgrounds and applies a uniform white or transparent backdrop across your catalog, free and private in your browser.",
    howItWorks: [
      "Upload your Shopify product photo.",
      "The AI removes the background.",
      "Apply a consistent backdrop and download.",
    ],
    features: [
      "Consistent backgrounds across products",
      "White or transparent output",
      "Free for your entire catalog",
      "No uploads -- photos stay private",
    ],
    useCases: [
      "Shopify product galleries",
      "Consistent store branding",
      "Collection and feature banners",
      "Dropshipping image cleanup",
    ],
    faqs: [
      {
        question: "Can I make my whole store consistent?",
        answer:
          "Yes. Apply the same background to every product photo for a uniform, professional gallery.",
      },
      {
        question: "Is it good for dropshipping images?",
        answer:
          "Yes. Clean up inconsistent supplier photos by removing and standardizing their backgrounds.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
    ],
  },
  {
    slug: "background-remover-for-real-estate",
    title: "Background Remover for Real Estate Photos -- Free Tool",
    description:
      "Remove and clean up backgrounds in real estate photos with AI. Isolate items and declutter listings for free. Runs in your browser.",
    h1: "Background Remover for Real Estate",
    subtitle: "Clean, professional images for property listings. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Listing Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover real estate", "real estate photo editor", "property listing photo"],
    intro:
      "Real estate marketing often needs clean cutouts — agent headshots, furniture for virtual staging, or branded graphics. Riftcut removes backgrounds in your browser for free, helping listings and agent branding look polished.",
    howItWorks: [
      "Upload an agent photo, furniture shot, or listing graphic.",
      "The AI removes the background around the subject.",
      "Add a clean backdrop or keep transparent, then download.",
    ],
    features: [
      "Clean agent headshot cutouts",
      "Isolate furniture for virtual staging",
      "Transparent assets for listing graphics",
      "Free and private in your browser",
    ],
    useCases: [
      "Agent headshots and team pages",
      "Virtual staging furniture cutouts",
      "Listing flyers and social posts",
      "Branded marketing graphics",
    ],
    faqs: [
      {
        question: "Can I use it for virtual staging assets?",
        answer:
          "Yes. Cut out furniture pieces as transparent PNGs to use in staging mockups.",
      },
      {
        question: "Is it good for agent headshots?",
        answer:
          "Yes. Remove the background and add a clean, consistent backdrop for team pages.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
    ],
  },
  {
    slug: "background-remover-for-resume",
    title: "Background Remover for Resume Photo -- Free & Private",
    description:
      "Remove the background from your resume or CV photo with AI. Clean, professional headshots for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Resume Photo",
    subtitle: "A clean, professional photo for your resume or CV. Free and private.",
    tool: "/bg-remover",
    toolLabel: "Fix Your Resume Photo",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for resume", "cv photo background", "resume photo editor"],
    intro:
      "A clean headshot makes a resume or CV look more professional. Riftcut removes the background from your photo and lets you add a neutral backdrop, all processed privately in your browser for free.",
    howItWorks: [
      "Upload the photo you want on your resume.",
      "The AI removes the background behind you.",
      "Add a neutral backdrop, crop, and download.",
    ],
    features: [
      "Professional, neutral backgrounds",
      "Clean edges around hair and shoulders",
      "Crop to a headshot ratio",
      "Free and private -- no uploads",
    ],
    useCases: [
      "Resume and CV headshots",
      "Job application profiles",
      "LinkedIn and portfolio photos",
      "Professional bio images",
    ],
    faqs: [
      {
        question: "What background is best for a resume photo?",
        answer:
          "A neutral, solid color reads as professional. Apply one after the original background is removed.",
      },
      {
        question: "Is my photo kept private?",
        answer:
          "Yes. It is processed in your browser and never uploaded.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no watermarks or sign-up.",
      },
    ],
  },
  {
    slug: "background-remover-for-linkedin",
    title: "Background Remover for LinkedIn Photo -- Free Tool",
    description:
      "Remove the background from your LinkedIn profile photo with AI. Clean, professional headshots for free. Runs in your browser, no uploads.",
    h1: "Background Remover for LinkedIn",
    subtitle: "A polished, professional LinkedIn profile photo. Free and private.",
    tool: "/bg-remover",
    toolLabel: "Fix Your LinkedIn Photo",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for linkedin", "linkedin profile photo", "linkedin headshot background"],
    intro:
      "Your LinkedIn photo is often a first impression. Riftcut removes a distracting background and lets you add a clean, professional backdrop — free, private, and entirely in your browser.",
    howItWorks: [
      "Upload your current profile photo.",
      "The AI removes the background behind you.",
      "Add a professional backdrop, crop square, and download.",
    ],
    features: [
      "Professional backdrops for profiles",
      "Clean hair and edge detection",
      "Square crop for profile photos",
      "Free and private -- no uploads",
    ],
    useCases: [
      "LinkedIn profile photos",
      "Professional networking profiles",
      "Speaker and bio headshots",
      "Consistent personal branding",
    ],
    faqs: [
      {
        question: "Will it crop square for LinkedIn?",
        answer:
          "Yes. You can crop to a square ratio that fits LinkedIn's profile photo.",
      },
      {
        question: "Is my photo uploaded?",
        answer:
          "No. It is processed locally in your browser.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no watermarks or sign-up.",
      },
    ],
  },
  {
    slug: "background-remover-for-poshmark",
    title: "Background Remover for Poshmark -- Free Closet Photo Tool",
    description:
      "Remove backgrounds from Poshmark listing photos with AI. Clean, consistent closet photos for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Poshmark",
    subtitle: "Clean, consistent closet photos for Poshmark. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Poshmark Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for poshmark", "poshmark listing photo", "poshmark closet photo"],
    intro:
      "Stand out in Poshmark feeds with clean, consistent listing photos. Riftcut removes cluttered backgrounds from your closet items in your browser for free, so your listings look curated and professional.",
    howItWorks: [
      "Upload your Poshmark item photo.",
      "The AI removes the background around the item.",
      "Add a clean backdrop and download for your listing.",
    ],
    features: [
      "Clean backgrounds for closet items",
      "Consistent look across your closet",
      "Free for unlimited listings",
      "No uploads -- photos stay private",
    ],
    useCases: [
      "Poshmark clothing and accessory listings",
      "Consistent closet branding",
      "Cover shots for shares",
      "Resale and thrift items",
    ],
    faqs: [
      {
        question: "Will this make my closet look consistent?",
        answer:
          "Yes. Applying the same clean background across listings gives your closet a curated, professional feel.",
      },
      {
        question: "Is it free for many listings?",
        answer:
          "Yes. There are no limits or fees.",
      },
      {
        question: "Are my photos private?",
        answer:
          "Yes. Processing happens in your browser with no uploads.",
      },
    ],
  },
  {
    slug: "background-remover-for-depop",
    title: "Background Remover for Depop -- Free Listing Photo Tool",
    description:
      "Remove backgrounds from Depop listing photos with AI. Clean, scroll-stopping photos for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Depop",
    subtitle: "Clean, scroll-stopping photos for Depop. Free, private, AI-powered.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Depop Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover for depop", "depop listing photo", "depop photo editor"],
    intro:
      "Depop is a visual marketplace where clean photos win. Riftcut removes busy backgrounds from your items in your browser for free, helping your listings stand out in the feed without a studio setup.",
    howItWorks: [
      "Upload your Depop item photo.",
      "The AI removes the cluttered background.",
      "Add a clean or colorful backdrop and download.",
    ],
    features: [
      "Clean or colorful backgrounds",
      "Scroll-stopping listing photos",
      "Free for unlimited items",
      "No uploads -- photos stay private",
    ],
    useCases: [
      "Depop fashion and vintage listings",
      "Consistent shop aesthetic",
      "Bright, eye-catching cover shots",
      "Resale and thrift items",
    ],
    faqs: [
      {
        question: "Can I add a colorful background?",
        answer:
          "Yes. After removing the original background, add any solid color or image to match your shop's aesthetic.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no limits or watermarks.",
      },
      {
        question: "Are my photos uploaded?",
        answer:
          "No. Everything runs locally in your browser.",
      },
    ],
  },
  {
    slug: "background-remover-for-marketplace",
    title: "Background Remover for Facebook Marketplace -- Free Tool",
    description:
      "Remove backgrounds from Facebook Marketplace photos with AI. Clean, professional listing photos for free. Runs in your browser, no uploads.",
    h1: "Background Remover for Marketplace",
    subtitle: "Clean, professional photos for Marketplace listings. Free and private.",
    tool: "/bg-remover",
    toolLabel: "Clean Up Marketplace Photos",
    category: "bg-remover",
    archetype: "use-case",
    color: "#FF6B6B",
    keywords: ["background remover marketplace", "facebook marketplace photo", "marketplace listing photo"],
    intro:
      "Items sell faster on Facebook Marketplace when the photo is clean and clear. Riftcut removes the background around your item in your browser for free, helping your listings look more professional and trustworthy.",
    howItWorks: [
      "Upload your Marketplace item photo.",
      "The AI removes the cluttered background.",
      "Add a clean backdrop and download for your listing.",
    ],
    features: [
      "Clean backgrounds for any item",
      "More professional, trustworthy listings",
      "Free for unlimited items",
      "No uploads -- photos stay private",
    ],
    useCases: [
      "Facebook Marketplace listings",
      "Local classifieds and resale",
      "Decluttering and moving sales",
      "Small business product photos",
    ],
    faqs: [
      {
        question: "Will clean photos help items sell?",
        answer:
          "Clear, uncluttered photos tend to look more trustworthy and can attract more buyers.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes. There are no fees or limits.",
      },
      {
        question: "Are my photos private?",
        answer:
          "Yes. Processing happens in your browser with no uploads.",
      },
    ],
  },

  // ── Format → PDF (new) ──────────────────────────────────────────

  {
    slug: "gif-to-pdf",
    title: "Convert GIF to PDF Free Online -- No Upload",
    description:
      "Convert GIF images to PDF files in your browser. No uploads, no servers. Free, private, and instant.",
    h1: "Convert GIF to PDF",
    subtitle: "Turn GIF images into PDF documents. Free, private, and instant.",
    tool: "/convert",
    toolLabel: "Convert GIF to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["gif to pdf", "convert gif to pdf", "gif to pdf free"],
    intro:
      "Convert GIF images into PDF documents instantly, right in your browser. Riftcut captures the GIF frame into a PDF page without uploading your file, so the conversion is fast, free, and private.",
    howItWorks: [
      "Select the GIF image you want to convert.",
      "Riftcut places it into a PDF page locally.",
      "Download the finished PDF.",
    ],
    features: [
      "Convert GIF images to PDF",
      "No upload -- runs in your browser",
      "Combine multiple GIFs into one PDF",
      "Instant, watermark-free download",
    ],
    useCases: [
      "Archive GIF graphics as PDF",
      "Share GIF stills in document form",
      "Package GIF assets for printing",
      "Submit GIF images as PDF attachments",
    ],
    faqs: [
      {
        question: "Will the PDF be animated?",
        answer:
          "No. PDF is a static document format, so a still frame of the GIF is placed into the PDF.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no watermarks or limits.",
      },
      {
        question: "Is my GIF uploaded?",
        answer:
          "No. The conversion runs in your browser.",
      },
    ],
  },
  {
    slug: "bmp-to-pdf",
    title: "Convert BMP to PDF Free Online -- No Upload",
    description:
      "Convert BMP images to PDF files in your browser. No uploads, no servers. Free, private, and instant.",
    h1: "Convert BMP to PDF",
    subtitle: "Turn BMP images into PDF documents. Free, private, and instant.",
    tool: "/convert",
    toolLabel: "Convert BMP to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["bmp to pdf", "convert bmp to pdf", "bmp to pdf free"],
    intro:
      "Convert BMP bitmap images into PDF documents in seconds. Riftcut runs the conversion in your browser with no upload, preserving the image so you can share or archive it as a standard PDF.",
    howItWorks: [
      "Select the BMP image you want to convert.",
      "Riftcut places it into a PDF page locally.",
      "Download the finished PDF.",
    ],
    features: [
      "Convert BMP images to PDF",
      "Preserves image quality",
      "Combine multiple BMPs into one PDF",
      "No upload -- runs in your browser",
    ],
    useCases: [
      "Archive legacy BMP files as PDF",
      "Share bitmap scans in document form",
      "Package BMP assets for printing",
      "Convert old image files for modern sharing",
    ],
    faqs: [
      {
        question: "Why convert BMP to PDF?",
        answer:
          "BMP files are large and not ideal for sharing. PDF is compact and universally supported.",
      },
      {
        question: "Is quality preserved?",
        answer:
          "Yes. The bitmap is embedded into the PDF without quality loss.",
      },
      {
        question: "Is it free and private?",
        answer:
          "Yes. It is free, and the conversion runs in your browser with no upload.",
      },
    ],
  },
  {
    slug: "docx-to-pdf",
    title: "Convert DOCX to PDF Free Online -- No Upload",
    description:
      "Convert DOCX documents to PDF entirely in your browser. No upload, no Microsoft Office. Free and private.",
    h1: "Convert DOCX to PDF",
    subtitle: "Turn DOCX files into PDF documents. Free, private, no Office needed.",
    tool: "/convert",
    toolLabel: "Convert DOCX to PDF",
    category: "convert",
    archetype: "format",
    color: "#FFDE59",
    keywords: ["docx to pdf", "convert docx to pdf", "docx to pdf free"],
    intro:
      "Convert DOCX documents to PDF without Microsoft Office and without uploading your file. Riftcut renders the document to PDF in your browser, keeping the layout while keeping your content private.",
    howItWorks: [
      "Select a .docx file from your device.",
      "Riftcut renders it to PDF locally, preserving formatting.",
      "Download the PDF, ready to share.",
    ],
    features: [
      "Convert .docx to PDF",
      "Preserves formatting and layout",
      "No Microsoft Office required",
      "Completely local -- no uploads",
    ],
    useCases: [
      "Convert resumes and cover letters to PDF",
      "Create PDF reports from Word",
      "Share documents without Word",
      "Archive DOCX files as PDF",
    ],
    faqs: [
      {
        question: "Do I need Microsoft Word?",
        answer:
          "No. The conversion runs in your browser without any office software.",
      },
      {
        question: "Will formatting be preserved?",
        answer:
          "Layout and formatting are preserved; very complex documents may vary slightly, so review the output.",
      },
      {
        question: "Is my document uploaded?",
        answer:
          "No. It is processed locally and never sent to a server.",
      },
    ],
  },

  // ── Comparison / Alternative (new) ──────────────────────────────

  {
    slug: "remove-bg-alternative",
    title: "Free remove.bg Alternative -- Private, No Upload",
    description:
      "A free, private alternative for removing image backgrounds. Runs in your browser with no uploads and no credits. AI-powered and unlimited.",
    h1: "A Free, Private remove.bg Alternative",
    subtitle: "Remove backgrounds with AI -- free, unlimited, and processed entirely in your browser.",
    tool: "/bg-remover",
    toolLabel: "Try the Free Alternative",
    category: "bg-remover",
    archetype: "comparison",
    color: "#FF6B6B",
    keywords: ["remove.bg alternative", "free remove bg alternative", "background remover no credits"],
    intro:
      "Riftcut is a free background remover that works differently from cloud tools like remove.bg: the AI runs entirely in your browser, so there are no uploads, no credit system, and no full-resolution paywall. It is a private, unlimited option for removing image backgrounds.",
    howItWorks: [
      "Open the background remover -- the AI loads into your browser.",
      "Add an image and let the on-device model remove the background.",
      "Download the full-resolution result for free.",
    ],
    features: [
      "Runs in your browser -- no uploads",
      "No credits or per-image paywall",
      "Full-resolution downloads for free",
      "Unlimited use with no sign up",
    ],
    useCases: [
      "Remove backgrounds without buying credits",
      "Process sensitive images privately",
      "Bulk-edit photos without limits",
      "Work offline after the first load",
    ],
    faqs: [
      {
        question: "How is this different from remove.bg?",
        answer:
          "Riftcut runs the AI locally in your browser instead of on a server, so there are no uploads, no credits, and full-resolution downloads are free.",
      },
      {
        question: "Is it really unlimited and free?",
        answer:
          "Yes. There are no credits or per-image fees, and there is no watermark on the output.",
      },
      {
        question: "Is the quality comparable?",
        answer:
          "It uses a modern AI segmentation model that handles most photos well, including tricky edges like hair.",
      },
    ],
  },
  {
    slug: "photoroom-alternative",
    title: "Free Photoroom Alternative -- No Upload Background Remover",
    description:
      "A free, private alternative to Photoroom for removing image backgrounds. Runs in your browser, no uploads, no subscription.",
    h1: "A Free Photoroom Alternative",
    subtitle: "Remove backgrounds in your browser -- free, private, no subscription.",
    tool: "/bg-remover",
    toolLabel: "Try the Free Alternative",
    category: "bg-remover",
    archetype: "comparison",
    color: "#FF6B6B",
    keywords: ["photoroom alternative", "free photoroom alternative", "background remover no subscription"],
    intro:
      "Riftcut offers a free, no-subscription way to remove image backgrounds, with the AI running entirely in your browser. There are no uploads and no recurring fee — a simple, private alternative for clean product and photo cutouts.",
    howItWorks: [
      "Open the tool and add your image.",
      "The on-device AI removes the background.",
      "Add a new background if you like, then download for free.",
    ],
    features: [
      "No subscription or recurring fees",
      "Runs in your browser -- no uploads",
      "Add solid colors or image backgrounds",
      "Unlimited use with no watermark",
    ],
    useCases: [
      "Product photos without a subscription",
      "Private edits with no uploads",
      "Quick cutouts for listings and posts",
      "Offline editing after first load",
    ],
    faqs: [
      {
        question: "How does this compare to Photoroom?",
        answer:
          "Riftcut focuses on free, private background removal that runs locally in your browser, with no subscription required.",
      },
      {
        question: "Does it have templates like Photoroom?",
        answer:
          "Riftcut focuses on background removal and basic editing rather than a large template library, keeping it simple and free.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes, with no subscription, limits, or watermark.",
      },
    ],
  },
  {
    slug: "canva-background-remover-alternative",
    title: "Free Canva Background Remover Alternative -- No Pro Needed",
    description:
      "A free alternative to Canva's background remover. No Pro subscription, no uploads. AI background removal in your browser.",
    h1: "A Free Canva Background Remover Alternative",
    subtitle: "Remove backgrounds free -- no Canva Pro, no uploads, no sign up.",
    tool: "/bg-remover",
    toolLabel: "Try the Free Alternative",
    category: "bg-remover",
    archetype: "comparison",
    color: "#FF6B6B",
    keywords: ["canva background remover alternative", "free background remover no pro", "canva alternative background"],
    intro:
      "Canva's background remover requires a Pro subscription, while Riftcut removes backgrounds for free with no account at all. The AI runs in your browser, so there are no uploads and no paywall on the feature.",
    howItWorks: [
      "Open the background remover and add your image.",
      "The on-device AI removes the background -- no Pro required.",
      "Download a transparent PNG or add a new background.",
    ],
    features: [
      "No Pro subscription required",
      "Runs in your browser -- no uploads",
      "Transparent PNG export for free",
      "No account or sign up",
    ],
    useCases: [
      "Remove backgrounds without Canva Pro",
      "Export transparent assets for designs",
      "Quick cutouts for social posts",
      "Private edits with no uploads",
    ],
    faqs: [
      {
        question: "Do I need Canva Pro to use this?",
        answer:
          "No. Riftcut is a separate free tool — background removal works without any Canva subscription.",
      },
      {
        question: "Can I use the cutouts in Canva?",
        answer:
          "Yes. Export a transparent PNG from Riftcut and import it into Canva or any design tool.",
      },
      {
        question: "Is it free with no sign up?",
        answer:
          "Yes. There is no account, subscription, or watermark.",
      },
    ],
  },
];

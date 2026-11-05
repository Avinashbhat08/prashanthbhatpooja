import React, { useRef, useState, useMemo, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  X,
  Download,
  Share2,
  Printer,
  RotateCcw,
  CheckCircle2,
  Phone,
  Flame,
  MessageCircle,
} from 'lucide-react';
import { PoojaDetailsFormData, SelectedItem } from '../../types/index.js';
import { useLanguage } from '../../contexts/LanguageContext.js';
import { useToast } from '../common/Toast.js';

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  details: PoojaDetailsFormData;
  selectedItems: SelectedItem[];
}

interface PageSlice {
  pageNumber: number;
  totalPages: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  items: { item: SelectedItem; globalIndex: number }[];
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  onReset,
  details,
  selectedItems,
}) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('/logo.svg');

  // Pre-rasterize logo.svg to high-res PNG data URL so html2canvas renders it reliably without SVG culling
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 300, 300);
          const dataUrl = canvas.toDataURL('image/png');
          if (isMounted) setLogoDataUrl(dataUrl);
          return;
        }
      } catch (err) {
        console.warn('Could not rasterize logo to PNG data URL, using vector fallback', err);
      }
      if (isMounted) setLogoDataUrl('/logo.svg');
    };

    img.onerror = () => {
      if (isMounted) setLogoDataUrl('/logo.svg');
    };

    img.src = '/logo.svg';

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Pagination calculation:
  // Page 1: Full Header + Document Title + 2-Column Details Box + Table Header + Footer.
  // Holds 16 items comfortably.
  // Page 2+: Compact running header + Table Header + Footer.
  // Holds 24 items per page.
  const pages: PageSlice[] = useMemo(() => {
    const totalItems = selectedItems.length;
    if (totalItems === 0) {
      return [
        {
          pageNumber: 1,
          totalPages: 1,
          isFirstPage: true,
          isLastPage: true,
          items: [],
        },
      ];
    }

    const PAGE1_CAPACITY = 16;
    const SUBSEQUENT_CAPACITY = 24;

    const pageSlices: { item: SelectedItem; globalIndex: number }[][] = [];

    // Slice 1: Page 1 items
    const page1Items = selectedItems.slice(0, PAGE1_CAPACITY).map((item, idx) => ({
      item,
      globalIndex: idx,
    }));
    pageSlices.push(page1Items);

    let currentIndex = PAGE1_CAPACITY;
    while (currentIndex < totalItems) {
      const nextChunk = selectedItems
        .slice(currentIndex, currentIndex + SUBSEQUENT_CAPACITY)
        .map((item, idx) => ({
          item,
          globalIndex: currentIndex + idx,
        }));
      pageSlices.push(nextChunk);
      currentIndex += SUBSEQUENT_CAPACITY;
    }

    const totalPages = pageSlices.length;

    return pageSlices.map((slice, idx) => ({
      pageNumber: idx + 1,
      totalPages,
      isFirstPage: idx === 0,
      isLastPage: idx === totalPages - 1,
      items: slice,
    }));
  }, [selectedItems]);

  if (!isOpen) return null;

  const sanitizedPoojaName =
    (details.poojaName || 'Pooja')
      .replace(/[\/\\]/g, ' ')
      .replace(/[^a-zA-Z0-9\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30) || 'Pooja-Samagri';

  const defaultPdfFilename = `${sanitizedPoojaName}-${details.poojaDate || new Date().toISOString().split('T')[0]}.pdf`;

  // Generate multi-page jsPDF directly from the rendered preview elements
  // This guarantees 100% fidelity between preview and downloaded PDF
  const generatePdfBlob = async (): Promise<{ doc: jsPDF; blob: Blob }> => {
    if (!previewContainerRef.current) {
      throw new Error('PDF document container not ready');
    }

    // Ensure all Unicode fonts (especially Noto Sans Kannada) are decoded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const container = previewContainerRef.current;
    const pageElements = container.querySelectorAll<HTMLElement>('.pdf-a4-page-preview');

    if (pageElements.length === 0) {
      throw new Error('No printable pages found in preview container');
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < pageElements.length; i++) {
      const pageEl = pageElements[i];

      // High scale for razor-sharp typography and exact Kannada conjunct glyph shaping
      const canvas = await html2canvas(pageEl, {
        scale: 2.5,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
      });

      const imgData = canvas.toDataURL('image/png');

      if (i > 0) {
        doc.addPage('a4', 'portrait');
      }

      // Exact A4 dimensions in mm: 210 x 297
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
    }

    const blob = doc.output('blob');
    return { doc, blob };
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const { doc } = await generatePdfBlob();
      doc.save(defaultPdfFilename);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download PDF error:', error);
      showToast('Failed to generate PDF. Please try again or use the Print button.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      const { doc, blob } = await generatePdfBlob();
      const file = new File([blob], defaultPdfFilename, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Pooja Samagri List - ${details.poojaName}`,
          text: `Sacred Pooja Samagri list for ${details.poojaName} conducted by Shree Prashanth Bhat (9242359692).`,
        });
        showToast('Shared successfully!', 'success');
      } else {
        doc.save(defaultPdfFilename);
        showToast(t('share_not_supported') || 'Downloaded PDF to your device.', 'info');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share error:', error);
        showToast('Sharing cancelled or not supported on this browser.', 'info');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(
      `*Pooja Samagri List / ಪೂಜಾ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ*\n` +
      `*Pooja:* ${details.poojaName}\n` +
      `*Date:* ${details.poojaDate} | *Time:* ${details.poojaTime}\n` +
      `*Yajamana:* ${details.personName}\n` +
      `*Total Items:* ${selectedItems.length} items\n` +
      `*Purohit:* Shree Prashanth Bhat (9242359692)\n` +
      `Bangalore North - 560077\n\n` +
      `Attached PDF contains complete bilingual item checklist.`
    );
    window.open(`https://api.whatsapp.com/send?text=${message}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // Shared Header Component for Page 1
  const renderPage1Header = () => (
    <div className="pb-3 border-b-2 border-spiritual-gold/40 flex-shrink-0">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Circular Ganesha Logo & Business Titles */}
        <div className="flex items-center gap-3.5" style={{ width: '60%', maxWidth: '60%' }}>
          <div className="w-14 h-14 flex-shrink-0 rounded-full p-0.5 bg-gradient-to-tr from-spiritual-maroon via-spiritual-gold to-spiritual-saffron shadow-xs flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-full p-1 flex items-center justify-center">
              <img
                src={logoDataUrl}
                alt="Lord Ganesha & Sudarshana Chakra"
                className="w-full h-full object-contain"
                crossOrigin="anonymous"
              />
            </div>
          </div>
          <div className="min-w-0">
            <h1 className="font-serif font-black text-lg text-spiritual-maroon tracking-wider leading-tight">
              SHREE PRASHANTH BHAT
            </h1>
            <h2 className="font-kannada font-bold text-base text-spiritual-saffron-dark leading-tight mt-0.5">
              ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್
            </h2>
            <p className="text-[9.5px] font-bold text-neutral-600 tracking-wider uppercase mt-0.5">
              Traditional Vedic Priest & Pooja Services
            </p>
          </div>
        </div>

        {/* Right: Phone & Full Business Address */}
        <div className="text-right space-y-1" style={{ width: '40%', maxWidth: '40%' }}>
          <p className="font-bold text-spiritual-maroon flex items-center justify-end gap-1.5 text-xs">
            <Phone className="w-3.5 h-3.5 text-spiritual-saffron flex-shrink-0" />
            <span className="font-sans font-extrabold tracking-wide">9242359692</span>
          </p>
          <p className="text-[9.5px] leading-tight text-neutral-600 font-sans break-words">
            #42, 5th Cross, Kempe Gowda Layout, N. Nagenahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
          </p>
        </div>
      </div>
    </div>
  );

  // Shared Running Header for Subsequent Pages (Page 2+)
  const renderSubsequentHeader = () => (
    <div className="pb-2 border-b border-spiritual-gold/40 flex items-center justify-between text-xs flex-shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-serif font-bold text-spiritual-maroon">
          SHREE PRASHANTH BHAT
        </span>
        <span className="text-neutral-400">•</span>
        <span className="font-kannada font-semibold text-spiritual-saffron-dark text-[11px]">
          ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ (9242359692)
        </span>
      </div>
      <div className="text-right text-[10px] text-neutral-500 font-medium font-kannada">
        {details.poojaName} • ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ
      </div>
    </div>
  );

  // Integrated, Clean Pooja Details Box (No Blank Rectangles)
  const renderPoojaDetailsBox = () => (
    <div className="my-2.5 bg-spiritual-cream-100/90 rounded-lg p-3 border border-spiritual-gold/40 text-xs flex-shrink-0">
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {/* Left Column */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
              Pooja / ಪೂಜೆ:
            </span>
            <span className="font-bold text-spiritual-maroon text-xs font-kannada break-words">
              {details.poojaName}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
              Date & Time / ದಿನಾಂಕ & ಸಮಯ:
            </span>
            <span className="font-semibold text-neutral-800 text-xs">
              {details.poojaDate} • {details.poojaTime}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
              Yajamana / ಯಜಮಾನರು:
            </span>
            <span className="font-bold text-spiritual-maroon text-xs font-kannada break-words">
              {details.personName}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
              Location / ಸ್ಥಳ:
            </span>
            <span className="font-semibold text-neutral-800 text-xs break-words">
              {details.location || 'Bangalore, Karnataka'}
            </span>
          </div>
          {(details.gothra || details.nakshatra) && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
                Gothra & Nakshatra:
              </span>
              <span className="font-semibold text-neutral-800 text-xs break-words">
                {[details.gothra, details.nakshatra].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}
          {details.contactNumber && (
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
                Contact / ದೂರವಾಣಿ:
              </span>
              <span className="font-semibold text-neutral-800 text-xs">
                {details.contactNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Optional Notes Row */}
      {details.notes && (
        <div className="mt-1.5 pt-1.5 border-t border-spiritual-gold/25 flex items-baseline gap-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-500 whitespace-nowrap">
            Notes / ಟಿಪ್ಪಣಿ:
          </span>
          <span className="text-xs text-neutral-700 italic break-words">
            {details.notes}
          </span>
        </div>
      )}
    </div>
  );

  // 5-Column Samagri Table with Checkbox / Status Indicator
  const renderSamagriTable = (page: PageSlice) => (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Section Header on Page 1 */}
      {page.isFirstPage && (
        <div className="flex items-center justify-between mb-1.5 flex-shrink-0">
          <h4 className="font-serif font-bold text-xs text-spiritual-maroon tracking-wide">
            REQUIRED SAMAGRI CHECKLIST / ಅಗತ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು
          </h4>
          <span className="text-[11px] font-bold text-spiritual-maroon bg-spiritual-saffron/15 border border-spiritual-saffron/30 px-2 py-0.5 rounded-md">
            {selectedItems.length} Items Total
          </span>
        </div>
      )}

      {/* Table with fixed calculated column widths & explicit checkboxes */}
      <table className="w-full text-left text-xs border-collapse border border-neutral-300">
        <thead>
          <tr className="bg-gradient-to-r from-spiritual-maroon to-spiritual-saffron-700 text-white font-serif">
            <th style={{ width: '8%' }} className="py-2 px-2 text-center text-[11px] font-bold border-r border-white/20">
              No.
            </th>
            <th style={{ width: '8%' }} className="py-2 px-1 text-center text-[11px] font-bold border-r border-white/20">
              Status
            </th>
            <th style={{ width: '38%' }} className="py-2 px-3 text-left text-[11px] font-bold border-r border-white/20">
              English Item Name
            </th>
            <th style={{ width: '32%' }} className="py-2 px-3 text-left text-[11px] font-bold border-r border-white/20 font-kannada">
              ಕನ್ನಡ ಹೆಸರು (Kannada Name)
            </th>
            <th style={{ width: '14%' }} className="py-2 px-2 text-right text-[11px] font-bold">
              Quantity / ಪ್ರಮಾಣ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {page.items.map(({ item: sel, globalIndex }) => {
            const isEven = globalIndex % 2 === 0;
            return (
              <tr
                key={sel.item.id || globalIndex}
                className={isEven ? 'bg-white' : 'bg-spiritual-cream-50'}
                style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}
              >
                {/* 1. Item Number */}
                <td style={{ width: '8%' }} className="py-1.5 px-2 text-center font-bold text-neutral-500 border-r border-neutral-200 text-[11px]">
                  {globalIndex + 1}
                </td>
                {/* 2. Checkbox / Selection Indicator */}
                <td style={{ width: '8%' }} className="py-1.5 px-1 text-center border-r border-neutral-200">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded bg-emerald-700 text-white text-[10px] font-extrabold shadow-xs">
                    ✓
                  </span>
                </td>
                {/* 3. English Item Name */}
                <td style={{ width: '38%' }} className="py-1.5 px-3 font-semibold text-neutral-900 border-r border-neutral-200 text-[11px] break-words">
                  {sel.item.nameEnglish}
                </td>
                {/* 4. Kannada Item Name */}
                <td style={{ width: '32%' }} className="py-1.5 px-3 font-bold text-spiritual-maroon border-r border-neutral-200 font-kannada text-[12px] break-words">
                  {sel.item.nameKannada}
                </td>
                {/* 5. Quantity */}
                <td style={{ width: '14%' }} className="py-1.5 px-2 text-right font-bold text-neutral-800 text-[11px] break-words">
                  {sel.quantity || sel.item.defaultQuantity || '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // Footer for Each Page
  const renderPageFooter = (page: PageSlice) => (
    <div className="mt-auto pt-3 border-t border-spiritual-gold/40 flex-shrink-0 text-center">
      {page.isLastPage && (
        <div className="flex items-center justify-center gap-2 mb-1">
          <Flame className="w-3.5 h-3.5 text-spiritual-saffron" />
          <p className="font-kannada font-bold text-xs text-spiritual-maroon">
            || ಲೋಕಾಃ ಸಮಸ್ತಾಃ ಸುಖಿನೋ ಭವಂತು ||
          </p>
          <Flame className="w-3.5 h-3.5 text-spiritual-saffron" />
        </div>
      )}
      <div className="flex items-center justify-between text-[9.5px] text-neutral-500">
        <span>Shree Prashanth Bhat • Traditional Vedic Priest • 9242359692</span>
        <span className="font-semibold text-neutral-700">
          Page {page.pageNumber} of {page.totalPages}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-100 rounded-2xl shadow-2xl border border-neutral-300 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Action Toolbar */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron to-spiritual-maroon p-3 sm:p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-spiritual-gold-light" />
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-spiritual-gold-light leading-tight">
                {t('pdf_ready_title') || 'POOJA SAMAGRI CHECKLIST'}
              </h3>
              <span className="text-[10px] text-white/80">
                {pages.length} {pages.length === 1 ? 'Page' : 'Pages'} • {selectedItems.length} Items Selected
              </span>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="min-h-[38px] flex items-center gap-1.5 px-3.5 py-1.5 bg-spiritual-gold text-spiritual-maroon-dark text-xs sm:text-sm font-bold rounded-lg hover:bg-spiritual-gold-light transition shadow disabled:opacity-50 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={isGenerating}
              className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-white/30 transition shadow active:scale-95"
              title="Print or Save as Vector PDF"
            >
              <Printer className="w-4 h-4 text-spiritual-gold-light" />
              <span className="hidden sm:inline">Print / Vector PDF</span>
            </button>

            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 bg-white/15 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-white/25 transition shadow active:scale-95"
              title="Share PDF Document"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="min-h-[38px] flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow active:scale-95"
              title="Send to WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              onClick={onClose}
              className="min-h-[38px] min-w-[38px] flex items-center justify-center p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Area - Capturing from this visible, painted container */}
        <div
          ref={previewContainerRef}
          id="pooja-printable-document"
          className="flex-1 overflow-y-auto p-3 sm:p-6 bg-neutral-200/90 flex flex-col items-center gap-6 overflow-x-auto"
        >
          {pages.map((page) => (
            <div
              key={`preview-page-${page.pageNumber}`}
              className="pdf-a4-page-preview pdf-a4-page bg-white shadow-xl text-neutral-900 font-sans border border-spiritual-gold/30 flex flex-col relative"
              style={{
                width: '794px',
                minWidth: '794px',
                maxWidth: '794px',
                height: '1123px',
                minHeight: '1123px',
                maxHeight: '1123px',
                boxSizing: 'border-box',
                padding: '32px 36px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {/* Top Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-spiritual-maroon via-spiritual-gold to-spiritual-saffron rounded-t-sm mb-3 flex-shrink-0" />

              {/* Header */}
              {page.isFirstPage ? renderPage1Header() : renderSubsequentHeader()}

              {/* Document Title Banner on Page 1 */}
              {page.isFirstPage && (
                <div className="text-center my-2.5 flex-shrink-0">
                  <div className="inline-block bg-spiritual-saffron-50 border border-spiritual-saffron/40 px-4 py-1.5 rounded-full">
                    <h3 className="font-serif font-black text-xs text-spiritual-maroon tracking-wider">
                      POOJA DETAILS & SAMAGRI CHECKLIST
                    </h3>
                    <h4 className="font-kannada font-bold text-xs text-spiritual-saffron-dark">
                      ಪೂಜೆಯ ವಿವರಗಳು ಹಾಗೂ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ
                    </h4>
                  </div>
                </div>
              )}

              {/* 2-Column Details Box on Page 1 */}
              {page.isFirstPage && renderPoojaDetailsBox()}

              {/* Samagri Table with Checkboxes */}
              {renderSamagriTable(page)}

              {/* Footer */}
              {renderPageFooter(page)}
            </div>
          ))}
        </div>

        {/* Bottom Bar Controls */}
        <div className="p-3 sm:p-4 bg-white border-t border-neutral-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-600 hover:text-spiritual-maroon hover:bg-neutral-100 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('btn_generate_another') || 'Reconfigure Samagri'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
            >
              {t('btn_cancel') || 'Close'}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs font-bold rounded-lg shadow hover:shadow-spiritual transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Download PDF Document'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

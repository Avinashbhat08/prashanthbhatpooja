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
  // - If 18 or fewer items (e.g. Satyanarayana Pooja standard 18 items), all 18 items fit on Page 1!
  // - If more than 18 items, Page 1 holds 16 items and subsequent pages hold 22 items each.
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

    if (totalItems <= 18) {
      return [
        {
          pageNumber: 1,
          totalPages: 1,
          isFirstPage: true,
          isLastPage: true,
          items: selectedItems.map((item, idx) => ({ item, globalIndex: idx })),
        },
      ];
    }

    const PAGE1_CAPACITY = 16;
    const SUBSEQUENT_CAPACITY = 22;

    const pageSlices: { item: SelectedItem; globalIndex: number }[][] = [];

    // Page 1
    pageSlices.push(
      selectedItems.slice(0, PAGE1_CAPACITY).map((item, idx) => ({
        item,
        globalIndex: idx,
      }))
    );

    let currentIndex = PAGE1_CAPACITY;
    while (currentIndex < totalItems) {
      pageSlices.push(
        selectedItems.slice(currentIndex, currentIndex + SUBSEQUENT_CAPACITY).map((item, idx) => ({
          item,
          globalIndex: currentIndex + idx,
        }))
      );
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
  const generatePdfBlob = async (): Promise<{ doc: jsPDF; blob: Blob }> => {
    if (!previewContainerRef.current) {
      throw new Error('PDF document container not ready');
    }

    // Ensure all Unicode fonts (especially Noto Sans Kannada) are decoded
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
      // Brief pause to allow the layout engine to settle font metrics
      await new Promise((resolve) => setTimeout(resolve, 150));
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

      // Scale 2 is optimal: 200 DPI crispness, perfect glyph positioning without kerning bugs
      const canvas = await html2canvas(pageEl, {
        scale: 2,
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
    <div
      style={{
        paddingBottom: '10px',
        borderBottom: '2px solid rgba(212, 175, 55, 0.5)',
        flexShrink: 0,
        width: '100%',
        letterSpacing: 'normal',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', width: '100%' }}>
        {/* Left: Circular Ganesha Logo & Business Titles */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '60%', maxWidth: '60%' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              flexShrink: 0,
              borderRadius: '50%',
              padding: '2px',
              background: 'linear-gradient(135deg, #7B1113, #D4AF37, #E65100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '50%',
                padding: '3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logoDataUrl}
                alt="Lord Ganesha & Sudarshana Chakra"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                crossOrigin="anonymous"
              />
            </div>
          </div>
          <div style={{ minWidth: 0 }}>
            <h1
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontWeight: 900,
                fontSize: '17px',
                color: '#7B1113',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              SHREE PRASHANTH BHAT
            </h1>
            <h2
              style={{
                fontFamily: "'Noto Sans Kannada', system-ui, sans-serif",
                fontWeight: 700,
                fontSize: '15px',
                color: '#AC1900',
                letterSpacing: 'normal',
                lineHeight: 1.25,
                margin: '2px 0 0 0',
              }}
            >
              ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್
            </h2>
            <p
              style={{
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: '9.5px',
                fontWeight: 700,
                color: '#525252',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: '2px 0 0 0',
              }}
            >
              Traditional Vedic Priest & Pooja Services
            </p>
          </div>
        </div>

        {/* Right: Phone & Full Business Address */}
        <div style={{ width: '40%', maxWidth: '40%', textAlign: 'right' }}>
          <p
            style={{
              fontWeight: 800,
              color: '#7B1113',
              fontSize: '12px',
              margin: '0 0 2px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '6px',
              fontFamily: "'Inter', system-ui, sans-serif",
            }}
          >
            <Phone style={{ width: '13px', height: '13px', color: '#E65100', flexShrink: 0 }} />
            <span>9242359692</span>
          </p>
          <p
            style={{
              fontSize: '9.5px',
              lineHeight: 1.3,
              color: '#525252',
              fontFamily: "'Inter', system-ui, sans-serif",
              margin: 0,
              wordBreak: 'break-word',
            }}
          >
            #42, 5th Cross, Kempe Gowda Layout, N. Nagenahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
          </p>
        </div>
      </div>
    </div>
  );

  // Shared Running Header for Subsequent Pages (Page 2+)
  const renderSubsequentHeader = () => (
    <div
      style={{
        paddingBottom: '8px',
        borderBottom: '1px solid rgba(212, 175, 55, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        flexShrink: 0,
        letterSpacing: 'normal',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 800, color: '#7B1113' }}>
          SHREE PRASHANTH BHAT
        </span>
        <span style={{ color: '#a3a3a3' }}>•</span>
        <span style={{ fontFamily: "'Noto Sans Kannada', sans-serif", fontWeight: 700, color: '#AC1900' }}>
          ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್ (9242359692)
        </span>
      </div>
      <div style={{ textAlign: 'right', fontSize: '10.5px', color: '#737373', fontFamily: "'Noto Sans Kannada', sans-serif" }}>
        {details.poojaName} • ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ
      </div>
    </div>
  );

  // Both Headings Displayed in the Rounded Cream Container
  const renderSectionHeading = () => (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '8px 0', flexShrink: 0 }}>
      <div
        style={{
          backgroundColor: '#FFF8E7',
          border: '1.5px solid #E65100',
          borderRadius: '12px',
          padding: '8px 32px',
          textAlign: 'center',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          maxWidth: '620px',
          width: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div
          style={{
            fontFamily: "'Cinzel', Georgia, serif",
            fontWeight: 800,
            fontSize: '13px',
            color: '#7B1113',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            textTransform: 'uppercase',
          }}
        >
          POOJA DETAILS & SAMAGRI CHECKLIST
        </div>
        <div
          style={{
            fontFamily: "'Noto Sans Kannada', system-ui, sans-serif",
            fontWeight: 700,
            fontSize: '12.5px',
            color: '#BF360C',
            letterSpacing: 'normal',
            lineHeight: 1.3,
            marginTop: '3px',
          }}
        >
          ಪೂಜೆಯ ವಿವರಗಳು ಹಾಗೂ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ
        </div>
      </div>
    </div>
  );

  // Integrated, Clean Pooja Details Box (No Blank Rectangles)
  const renderPoojaDetailsBox = () => (
    <div
      style={{
        margin: '6px 0 10px 0',
        backgroundColor: '#FAF6EE',
        borderRadius: '8px',
        padding: '10px 14px',
        border: '1px solid rgba(212, 175, 55, 0.45)',
        fontSize: '11px',
        flexShrink: 0,
        letterSpacing: 'normal',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '24px', rowGap: '6px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
              Pooja / ಪೂಜೆ:
            </span>
            <span style={{ fontWeight: 800, color: '#7B1113', fontSize: '11.5px', fontFamily: "'Noto Sans Kannada', sans-serif", wordBreak: 'break-word' }}>
              {details.poojaName}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
              Date & Time / ದಿನಾಂಕ & ಸಮಯ:
            </span>
            <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px' }}>
              {details.poojaDate} • {details.poojaTime}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
              Yajamana / ಯಜಮಾನರು:
            </span>
            <span style={{ fontWeight: 800, color: '#7B1113', fontSize: '11.5px', fontFamily: "'Noto Sans Kannada', sans-serif", wordBreak: 'break-word' }}>
              {details.personName}
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
              Location / ಸ್ಥಳ:
            </span>
            <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px', wordBreak: 'break-word' }}>
              {details.location || 'Bangalore, Karnataka'}
            </span>
          </div>
          {(details.gothra || details.nakshatra) && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
                Gothra & Nakshatra:
              </span>
              <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px', wordBreak: 'break-word' }}>
                {[details.gothra, details.nakshatra].filter(Boolean).join(' • ')}
              </span>
            </div>
          )}
          {details.contactNumber && (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
                Contact / ದೂರವಾಣಿ:
              </span>
              <span style={{ fontWeight: 700, color: '#1f2937', fontSize: '11px' }}>
                {details.contactNumber}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Optional Notes Row */}
      {details.notes && (
        <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid rgba(212, 175, 55, 0.25)', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: '#6b7280', whiteSpace: 'nowrap' }}>
            Notes / ಟಿಪ್ಪಣಿ:
          </span>
          <span style={{ fontSize: '11px', color: '#4b5563', fontStyle: 'italic', wordBreak: 'break-word' }}>
            {details.notes}
          </span>
        </div>
      )}
    </div>
  );

  // 5-Column Samagri Table with fixed table layout and zero column overflow
  const renderSamagriTable = (page: PageSlice) => (
    <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {/* Section Sub-heading on Page 1 */}
      {page.isFirstPage && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexShrink: 0 }}>
          <h4 style={{ fontFamily: "'Cinzel', Georgia, serif", fontWeight: 800, fontSize: '11.5px', color: '#7B1113', margin: 0 }}>
            REQUIRED SAMAGRI CHECKLIST / ಅಗತ್ಯ ಪೂಜಾ ಸಾಮಗ್ರಿಗಳು
          </h4>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#7B1113',
              backgroundColor: '#FFE0B2',
              border: '1px solid #FFB74D',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            {selectedItems.length} Items Total
          </span>
        </div>
      )}

      {/* Table strictly obeying 100% width via table-layout: fixed */}
      <table
        style={{
          width: '100%',
          tableLayout: 'fixed',
          borderCollapse: 'collapse',
          border: '1px solid #d1d5db',
          letterSpacing: 'normal',
          boxSizing: 'border-box',
        }}
      >
        <thead>
          <tr
            style={{
              background: 'linear-gradient(90deg, #7B1113 0%, #BF360C 100%)',
              color: '#ffffff',
            }}
          >
            <th
              style={{
                width: '6%',
                padding: '6px 4px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                borderRight: '1px solid rgba(255,255,255,0.2)',
                verticalAlign: 'middle',
              }}
            >
              No.
            </th>
            <th
              style={{
                width: '8%',
                padding: '6px 4px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: 700,
                borderRight: '1px solid rgba(255,255,255,0.2)',
                verticalAlign: 'middle',
              }}
            >
              Status
            </th>
            <th
              style={{
                width: '38%',
                padding: '6px 8px',
                textAlign: 'left',
                fontSize: '11px',
                fontWeight: 700,
                borderRight: '1px solid rgba(255,255,255,0.2)',
                verticalAlign: 'middle',
              }}
            >
              English Item Name
            </th>
            <th
              style={{
                width: '32%',
                padding: '6px 8px',
                textAlign: 'left',
                fontSize: '11.5px',
                fontWeight: 700,
                fontFamily: "'Noto Sans Kannada', system-ui, sans-serif",
                borderRight: '1px solid rgba(255,255,255,0.2)',
                verticalAlign: 'middle',
              }}
            >
              ಕನ್ನಡ ಹೆಸರು (Kannada Name)
            </th>
            <th
              style={{
                width: '16%',
                padding: '6px 8px',
                textAlign: 'right',
                fontSize: '11px',
                fontWeight: 700,
                verticalAlign: 'middle',
              }}
            >
              Quantity / ಪ್ರಮಾಣ
            </th>
          </tr>
        </thead>
        <tbody>
          {page.items.map(({ item: sel, globalIndex }) => {
            const isEven = globalIndex % 2 === 0;
            return (
              <tr
                key={sel.item.id || globalIndex}
                style={{
                  backgroundColor: isEven ? '#ffffff' : '#FAF6EE',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid',
                  borderBottom: '1px solid #e5e7eb',
                }}
              >
                {/* 1. Item Number */}
                <td
                  style={{
                    width: '6%',
                    padding: '5px 4px',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: '#6b7280',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle',
                  }}
                >
                  {globalIndex + 1}
                </td>

                {/* 2. Checkbox / Selection Indicator */}
                <td
                  style={{
                    width: '8%',
                    padding: '5px 4px',
                    textAlign: 'center',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      backgroundColor: '#047857',
                      color: '#ffffff',
                      fontSize: '11px',
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    ✓
                  </span>
                </td>

                {/* 3. English Item Name */}
                <td
                  style={{
                    width: '38%',
                    padding: '5px 8px',
                    textAlign: 'left',
                    fontWeight: 600,
                    fontSize: '11px',
                    color: '#111827',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: 1.3,
                  }}
                >
                  {sel.item.nameEnglish}
                </td>

                {/* 4. Kannada Item Name */}
                <td
                  style={{
                    width: '32%',
                    padding: '5px 8px',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '12px',
                    color: '#7B1113',
                    fontFamily: "'Noto Sans Kannada', system-ui, sans-serif",
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: 1.4,
                  }}
                >
                  {sel.item.nameKannada}
                </td>

                {/* 5. Quantity */}
                <td
                  style={{
                    width: '16%',
                    padding: '5px 8px',
                    textAlign: 'right',
                    fontWeight: 700,
                    fontSize: '11px',
                    color: '#1f2937',
                    verticalAlign: 'middle',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                    lineHeight: 1.3,
                  }}
                >
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
    <div
      style={{
        marginTop: 'auto',
        paddingTop: '8px',
        borderTop: '1px solid rgba(212, 175, 55, 0.45)',
        flexShrink: 0,
        textAlign: 'center',
        width: '100%',
        letterSpacing: 'normal',
      }}
    >
      {page.isLastPage && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
          <Flame style={{ width: '13px', height: '13px', color: '#E65100' }} />
          <p
            style={{
              fontFamily: "'Noto Sans Kannada', sans-serif",
              fontWeight: 800,
              fontSize: '12px',
              color: '#7B1113',
              margin: 0,
            }}
          >
            || ಲೋಕಾಃ ಸಮಸ್ತಾಃ ಸುಖಿನೋ ಭವಂತು ||
          </p>
          <Flame style={{ width: '13px', height: '13px', color: '#E65100' }} />
        </div>
      )}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '9.5px',
          color: '#6b7280',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span>Shree Prashanth Bhat • Traditional Vedic Priest • 9242359692</span>
        <span style={{ fontWeight: 700, color: '#374151' }}>
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
              className="pdf-a4-page-preview pdf-a4-page bg-white shadow-xl text-neutral-900 border border-spiritual-gold/30 flex flex-col relative"
              style={{
                width: '794px',
                minWidth: '794px',
                maxWidth: '794px',
                height: '1123px',
                minHeight: '1123px',
                maxHeight: '1123px',
                boxSizing: 'border-box',
                padding: '28px 36px',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                flexShrink: 0,
                letterSpacing: 'normal',
              }}
            >
              {/* Top Accent Line */}
              <div
                style={{
                  height: '5px',
                  background: 'linear-gradient(90deg, #7B1113 0%, #D4AF37 50%, #E65100 100%)',
                  borderRadius: '2px 2px 0 0',
                  marginBottom: '10px',
                  flexShrink: 0,
                }}
              />

              {/* Header */}
              {page.isFirstPage ? renderPage1Header() : renderSubsequentHeader()}

              {/* Both English & Kannada Section Headings in Rounded Cream Box */}
              {page.isFirstPage && renderSectionHeading()}

              {/* 2-Column Details Box on Page 1 */}
              {page.isFirstPage && renderPoojaDetailsBox()}

              {/* 5-Column Samagri Table with Checkboxes */}
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

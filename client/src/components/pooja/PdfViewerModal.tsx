import React, { useRef, useState } from 'react';
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
  MapPin,
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

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  onReset,
  details,
  selectedItems,
}) => {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedPdfBlob, setGeneratedPdfBlob] = useState<Blob | null>(null);

  if (!isOpen) return null;

  // Generate jsPDF from container
  const generatePdfBlob = async (): Promise<{ doc: jsPDF; blob: Blob }> => {
    if (!pdfContainerRef.current) throw new Error('PDF container not mounted');

    const container = pdfContainerRef.current;

    // Use html2canvas with high scale for ultra-sharp typography and exact Kannada glyph shaping
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: container.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Subsequent pages if list is lengthy
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const blob = pdf.output('blob');
    return { doc: pdf, blob };
  };

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const { doc, blob } = await generatePdfBlob();
      setGeneratedPdfBlob(blob);

      const sanitizedPooja = details.poojaName.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 25);
      const filename = `Pooja-Samagri-${sanitizedPooja}-${details.poojaDate}.pdf`;
      doc.save(filename);
      showToast('PDF downloaded successfully!', 'success');
    } catch (error) {
      console.error('Download PDF error:', error);
      showToast('Failed to generate PDF. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsGenerating(true);
      const { doc, blob } = await generatePdfBlob();
      setGeneratedPdfBlob(blob);

      const sanitizedPooja = details.poojaName.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 25);
      const filename = `Pooja-Samagri-${sanitizedPooja}-${details.poojaDate}.pdf`;
      const file = new File([blob], filename, { type: 'application/pdf' });

      // Check for Web Share API with file support
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Pooja Samagri List - ${details.poojaName}`,
          text: `Sacred Pooja Samagri list for ${details.poojaName} conducted by Shree Prashanth Bhat (9242359692).`,
        });
        showToast('Shared successfully!', 'success');
      } else {
        // Fallback: download the file and offer WhatsApp message guidance
        doc.save(filename);
        showToast(t('share_not_supported'), 'info');
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-neutral-100 rounded-2xl shadow-2xl border border-neutral-300 flex flex-col max-h-[95vh] overflow-hidden">
        {/* Top Action Toolbar */}
        <div className="bg-gradient-to-r from-spiritual-maroon via-spiritual-saffron to-spiritual-maroon p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md flex-shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-spiritual-gold-light" />
            <h3 className="font-serif font-bold text-base sm:text-lg text-spiritual-gold-light">
              {t('pdf_ready_title')}
            </h3>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-spiritual-gold text-spiritual-maroon-dark text-xs sm:text-sm font-bold rounded-lg hover:bg-spiritual-gold-light transition shadow disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Processing...' : t('btn_download_pdf')}</span>
            </button>

            <button
              onClick={handleShare}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-white/30 transition shadow disabled:opacity-50"
            >
              <Share2 className="w-4 h-4" />
              <span>{t('btn_share_pdf')}</span>
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-emerald-700 transition shadow"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('btn_whatsapp_share')}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition"
              title="Print directly"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition ml-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-neutral-200">
          {/* A4 Printable Document Container */}
          <div
            ref={pdfContainerRef}
            id="pooja-printable-document"
            className="w-full max-w-[800px] bg-white p-8 sm:p-12 shadow-2xl rounded-sm text-neutral-900 font-sans border-2 border-spiritual-gold/40 relative"
            style={{ minHeight: '1050px' }}
          >
            {/* Traditional Auspicious Header Top Border */}
            <div className="h-2.5 bg-gradient-to-r from-spiritual-maroon via-spiritual-gold to-spiritual-saffron rounded-t-sm mb-6" />

            {/* HEADER SECTION */}
            <div className="flex items-start justify-between border-b-2 border-spiritual-gold/50 pb-6 mb-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src="/logo.svg"
                    alt="Lord Ganesha & Sudarshana Chakra Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="font-serif font-black text-2xl text-spiritual-maroon tracking-wider">
                    SHREE PRASHANTH BHAT
                  </h1>
                  <h2 className="font-kannada font-bold text-lg text-spiritual-saffron-dark">
                    ಶ್ರೀ ಪ್ರಶಾಂತ್ ಭಟ್
                  </h2>
                  <p className="text-xs font-semibold text-neutral-600 tracking-wide mt-0.5 uppercase">
                    Traditional Vedic Priest & Pooja Services
                  </p>
                </div>
              </div>

              <div className="text-right text-xs text-neutral-700 space-y-1 max-w-[280px]">
                <p className="font-bold text-spiritual-maroon flex items-center justify-end gap-1 text-sm">
                  <Phone className="w-3.5 h-3.5 text-spiritual-saffron" />
                  <span>9242359692</span>
                </p>
                <p className="text-[11px] leading-tight text-neutral-600">
                  #42, 5th Cross, Kempe Gowda Layout, N. Nagennahalli, R.K. Hegde Nagar, Bangalore North, Karnataka - 560077
                </p>
              </div>
            </div>

            {/* DOCUMENT TITLE */}
            <div className="text-center my-6">
              <div className="inline-block bg-spiritual-saffron-50 border border-spiritual-saffron/40 px-6 py-2 rounded-full">
                <h3 className="font-serif font-extrabold text-lg text-spiritual-maroon tracking-wide">
                  POOJA DETAILS & SAMAGRI CHECKLIST
                </h3>
                <h4 className="font-kannada font-bold text-base text-spiritual-saffron-dark">
                  ಪೂಜೆಯ ವಿವರಗಳು ಹಾಗೂ ಸಾಮಗ್ರಿಗಳ ಪಟ್ಟಿ
                </h4>
              </div>
            </div>

            {/* DETAILS SECTION */}
            <div className="bg-spiritual-cream-100 rounded-xl p-5 border border-spiritual-gold/40 mb-8 shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-4 text-xs">
                <div>
                  <span className="text-neutral-500 font-medium block">Pooja Name / ಪೂಜೆ:</span>
                  <span className="font-bold text-spiritual-maroon text-sm font-kannada">
                    {details.poojaName}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 font-medium block">Pooja Date / ದಿನಾಂಕ:</span>
                  <span className="font-bold text-neutral-800 text-sm">
                    {details.poojaDate}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 font-medium block">Pooja Time / ಸಮಯ:</span>
                  <span className="font-bold text-neutral-800 text-sm">
                    {details.poojaTime}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-500 font-medium block">Person Name / ಯಜಮಾನರು:</span>
                  <span className="font-bold text-spiritual-maroon text-sm font-kannada">
                    {details.personName}
                  </span>
                </div>

                {details.gothra && (
                  <div>
                    <span className="text-neutral-500 font-medium block">Gothra / ಗೋತ್ರ:</span>
                    <span className="font-bold text-neutral-800">{details.gothra}</span>
                  </div>
                )}

                {details.nakshatra && (
                  <div>
                    <span className="text-neutral-500 font-medium block">Nakshatra / ನಕ್ಷತ್ರ:</span>
                    <span className="font-bold text-neutral-800">{details.nakshatra}</span>
                  </div>
                )}

                {details.contactNumber && (
                  <div>
                    <span className="text-neutral-500 font-medium block">Contact / ದೂರವಾಣಿ:</span>
                    <span className="font-bold text-neutral-800">{details.contactNumber}</span>
                  </div>
                )}

                {details.location && (
                  <div>
                    <span className="text-neutral-500 font-medium block">Location / ಸ್ಥಳ:</span>
                    <span className="font-bold text-neutral-800">{details.location}</span>
                  </div>
                )}

                {details.notes && (
                  <div className="col-span-2 sm:col-span-3 pt-1 border-t border-spiritual-gold/20">
                    <span className="text-neutral-500 font-medium block">Notes / ಹೆಚ್ಚುವರಿ ಟಿಪ್ಪಣಿಗಳು:</span>
                    <span className="font-medium text-neutral-700 italic">{details.notes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* ITEMS SECTION - TABLE */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-serif font-bold text-base text-spiritual-maroon">
                  REQUIRED SAMAGRI ITEMS / ಅಗತ್ಯ ಸಾಮಗ್ರಿಗಳು
                </h4>
                <span className="text-xs font-semibold bg-spiritual-saffron/10 text-spiritual-saffron px-3 py-1 rounded-full border border-spiritual-saffron/20">
                  {selectedItems.length} Items Selected
                </span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-neutral-300">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-spiritual-maroon to-spiritual-saffron-700 text-white font-serif">
                      <th className="py-2.5 px-3 font-semibold w-12 text-center border-r border-white/20">
                        No. / ಕ್ರ.ಸಂ
                      </th>
                      <th className="py-2.5 px-3 font-semibold border-r border-white/20">
                        English Item Name
                      </th>
                      <th className="py-2.5 px-3 font-semibold border-r border-white/20 font-kannada">
                        ಕನ್ನಡ ಹೆಸರು (Kannada Name)
                      </th>
                      <th className="py-2.5 px-3 font-semibold w-32 text-right">
                        Quantity / ಪ್ರಮಾಣ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {selectedItems.map((sel, idx) => (
                      <tr
                        key={sel.item.id || idx}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-spiritual-cream-50'}
                      >
                        <td className="py-2 px-3 text-center font-bold text-neutral-500 border-r border-neutral-200">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 font-medium text-neutral-900 border-r border-neutral-200">
                          {sel.item.nameEnglish}
                        </td>
                        <td className="py-2 px-3 font-semibold text-spiritual-maroon border-r border-neutral-200 font-kannada text-[13px]">
                          {sel.item.nameKannada}
                        </td>
                        <td className="py-2 px-3 text-right font-medium text-neutral-700">
                          {sel.quantity || sel.item.defaultQuantity || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER SECTION */}
            <div className="mt-12 pt-6 border-t-2 border-spiritual-gold/50 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="w-4 h-4 text-spiritual-saffron" />
                <p className="font-kannada font-bold text-sm text-spiritual-maroon">
                  || ಲೋಕಾಃ ಸಮಸ್ತಾಃ ಸುಖಿನೋ ಭವಂತು ||
                </p>
                <Flame className="w-4 h-4 text-spiritual-saffron" />
              </div>
              <p className="text-xs text-neutral-500 font-serif">
                May the divine blessings of Lord Ganesha and the auspicious deities bring peace, health, and prosperity to your home.
              </p>
              <p className="text-[10px] text-neutral-400 mt-2">
                Shree Prashanth Bhat • 9242359692 • Bangalore North, Karnataka
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar Controls */}
        <div className="p-4 bg-white border-t border-neutral-200 flex items-center justify-between flex-shrink-0">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-spiritual-maroon hover:bg-neutral-100 rounded-lg transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('btn_generate_another')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
            >
              {t('btn_cancel')}
            </button>
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-spiritual-saffron to-spiritual-maroon text-white text-xs font-bold rounded-lg shadow hover:shadow-spiritual transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : t('btn_download_pdf')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


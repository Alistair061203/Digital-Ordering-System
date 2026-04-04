import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QrScanner from 'qr-scanner';

const QRScannerPage = () => {
  const videoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const qrScanner = new QrScanner(
      videoRef.current,
      result => {
        // On any QR scan, redirect to menu page
        navigate('/Test/table/1/menu');
      },
      {
        highlightScanRegion: true,
        highlightCodeOutline: true,
      }
    );

    qrScanner.start();

    return () => {
      qrScanner.destroy();
    };
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Scan QR Code</h1>
      <video ref={videoRef} className="w-full max-w-md"></video>
      <p className="mt-4 text-gray-600">Point your camera at a QR code to proceed to the menu.</p>
    </div>
  );
};

export default QRScannerPage;
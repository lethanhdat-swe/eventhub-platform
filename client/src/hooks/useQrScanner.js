import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export function useQrScanner({
  scannerElementId,
  onDecoded,
}) {
  const scannerRef = useRef(null);
  const isHandlingScanRef = useRef(false);

  const [isScanning, setIsScanning] =
    useState(false);

  const [scanError, setScanError] =
    useState(null);

  const stopScanner = useCallback(
    async ({ resetHandling = true } = {}) => {
      const scanner = scannerRef.current;

      if (!scanner) {
        setIsScanning(false);

        if (resetHandling) {
          isHandlingScanRef.current = false;
        }

        return;
      }

      try {
        if (scanner.isScanning) {
          await scanner.stop();
        }
      } catch {
        // ignore stop errors
      } finally {
        try {
          scanner.clear();
        } catch {
          // ignore clear errors
        }

        scannerRef.current = null;
        setIsScanning(false);

        if (resetHandling) {
          isHandlingScanRef.current = false;
        }
      }
    },
    []
  );

  const handleDecoded = useCallback(
    async (decodedText) => {
      if (isHandlingScanRef.current) {
        return;
      }

      isHandlingScanRef.current = true;

      await stopScanner({
        resetHandling: false,
      });

      try {
        await onDecoded(decodedText);
      } finally {
        isHandlingScanRef.current = false;
      }
    },
    [onDecoded, stopScanner]
  );

  const startScanner = useCallback(() => {
    if (scannerRef.current || isScanning) {
      return;
    }

    setScanError(null);
    setIsScanning(true);
    isHandlingScanRef.current = false;
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning || scannerRef.current) {
      return;
    }

    let isCancelled = false;

    const timerId = window.setTimeout(
      async () => {
        if (
          isCancelled ||
          scannerRef.current
        ) {
          return;
        }

        const scannerElement =
          document.getElementById(
            scannerElementId
          );

        if (!scannerElement) {
          setScanError(
            'Không tìm thấy khu vực camera.'
          );
          setIsScanning(false);
          return;
        }

        const scanner =
          new Html5Qrcode(
            scannerElementId
          );

        scannerRef.current = scanner;

        try {
          await scanner.start(
            {
              facingMode: 'environment',
            },
            {
              fps: 10,
              qrbox: {
                width: 250,
                height: 250,
              },
            },
            handleDecoded,
            () => {
              // ignore scan errors
            }
          );

          if (isCancelled) {
            try {
              if (
                scanner.isScanning
              ) {
                await scanner.stop();
              }

              scanner.clear();
            } catch {
              // ignore cleanup errors
            }

            scannerRef.current = null;
          }
        } catch {
          try {
            scanner.clear();
          } catch {
            // ignore clear errors
          }

          scannerRef.current = null;

          if (!isCancelled) {
            setScanError(
              'Không thể mở camera. Vui lòng kiểm tra quyền truy cập camera.'
            );

            setIsScanning(false);
          }
        }
      },
      100
    );

    return () => {
      isCancelled = true;
      window.clearTimeout(timerId);
    };
  }, [
    isScanning,
    scannerElementId,
    handleDecoded,
  ]);

  useEffect(() => {
    return () => {
      const scanner =
        scannerRef.current;

      scannerRef.current = null;
      isHandlingScanRef.current = false;

      if (!scanner) {
        return;
      }

      const clearScanner = () => {
        try {
          scanner.clear();
        } catch {
          // ignore clear errors
        }
      };

      if (scanner.isScanning) {
        scanner
          .stop()
          .then(clearScanner)
          .catch(clearScanner);

        return;
      }

      clearScanner();
    };
  }, []);

  return {
    isScanning,
    scanError,
    startScanner,
    stopScanner,
  };
}
import { useEffect, useRef, useState } from "react";

const Camera = () => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const payload = {
            action: 'REQUEST_CAMERA_PERMISSION',
            content: 'Web 請求 App 取得相機權限',
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));

        const handleMessage = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);
                if (data.action === 'CAMERA_PERMISSION_SENT') {
                    setHasPermission(data.granted);
                }
            } catch (error) {
                console.error(`Message 解析錯誤`, error);
            }
        }

        window.addEventListener('message', handleMessage);
        document.addEventListener('message', handleMessage as EventListener);

        return () => {
            window.removeEventListener('message', handleMessage);
            document.removeEventListener('message', handleMessage as EventListener);
        }
    }, []);

    // 開啟/關閉相機
    const toggleCamera = () => {
        if (isCameraOn) {
            stopCamera();
        } else {
            startCamera();
        }
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode }, // user前鏡頭、environment後鏡頭
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setIsCameraOn(true);
            }
        } catch (err) {
            console.error('相機開啟失敗', err);
            setError('無法開啟相機，檢查權限或裝置是否支援');
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const stream = videoRef.current?.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop()); // video track, audio track..
            videoRef.current.srcObject = null; // 將來源清空
            setIsCameraOn(false);
        }
    }

    // 拍照
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/png'); // 轉成base64 png
            setPhotoUrl(dataUrl);
        }
    }

    // 切換前後鏡頭
    const switchCamera = async () => {
        if (!isCameraOn) return;

        stopCamera();
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
        useEffect(() => {
            if (isCameraOn) startCamera();
        }, [facingMode]);
    }


    const sendPhoto = () => {
        console.log('photoUrl', photoUrl);

        const payload = {
            action: 'SEND_PHOTO',
            content: '傳送拍攝照片',
            photoUrl: photoUrl,
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Web相機</h2>

            {hasPermission === false && (
                <p style={{ color: 'red' }}>⚠️未授權相機，無法使用拍照功能</p>
            )}

            {hasPermission === true && (
                <>
                    <div style={{ marginBottom: '20px' }}>
                        <button onClick={toggleCamera} style={{ marginRight: '10px' }}>
                            {isCameraOn ? '關閉相機' : '啟動相機'}
                        </button>
                        <button onClick={capturePhoto} disabled={!isCameraOn} style={{ marginRight: '10px' }}>
                            拍照
                        </button>
                        <button onClick={switchCamera} disabled={!isCameraOn}>
                            切換前/後鏡頭
                        </button>
                    </div>

                    {error && <p style={{ color: 'red' }}>{error}</p>}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                        {/* 即時影像 */}
                        <video
                            ref={videoRef}
                            style={{ width: '320px', border: '1px solid #ccc', borderRadius: '8px' }}
                            playsInline
                            autoPlay
                            muted
                        />

                        {/* 預覽圖 */}
                        {photoUrl && (
                            <div>
                                <img
                                    src={photoUrl}
                                    alt="拍照"
                                    style={{ width: '320px', borderRadius: '8px', border: '1px solid #666' }} />
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* 隱藏 canvas */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* 下載按鈕 */}
            {photoUrl && (
                <div style={{ marginTop: '20px' }}>
                    <button onClick={sendPhoto}>
                        下載照片
                    </button>
                </div>
            )}
        </div>
    )
}

export default Camera;
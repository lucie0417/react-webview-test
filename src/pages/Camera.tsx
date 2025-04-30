import { useRef, useState } from "react";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // user前鏡頭、environment後鏡頭
                audio: false,
            });
            console.log('stream', stream);

            console.log('canvasRef', canvasRef);

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

    // 下載
    // const downloadPhoto = () => {
    //     if (!photoUrl) return;

    //     const link = document.createElement('a');
    //     link.href = photoUrl;
    //     link.download = 'download_photo.png';
    //     link.click();
    // }

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

            <div style={{ marginBottom: '20px' }}>
                <button onClick={startCamera} style={{ marginRight: '10px' }}>啟動相機</button>
                <button onClick={capturePhoto} disabled={!isCameraOn}>拍照</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {/* 即時影像 */}
                <video
                    ref={videoRef}
                    style={{ width: '320px', border: '1px solid #ccc', borderRadius: '8px' }}
                    playsInline
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
    );

}

export default Camera;
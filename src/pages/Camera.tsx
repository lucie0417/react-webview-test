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

    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;

        // 設定 canvas 尺寸跟 video 一樣
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/png'); // 轉成 base64 png 圖片
            setPhotoUrl(dataUrl); // 儲存照片
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h2>Web相機</h2>

            <div style={{ marginBottom: '20px' }}>
                <button onClick={startCamera} style={{ marginRight: '10px' }}>啟動相機</button>
                <button onClick={capturePhoto} disabled={!isCameraOn}>拍照</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* 即時影像 */}
            <video
                ref={videoRef}
                style={{ width: '90%', border: '1px solid #ccc', borderRadius: '8px' }}
                playsInline
                muted
            />

            {/* canvas 是隱藏的，不直接顯示 */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* 預覽圖 */}
            {photoUrl && (
                <div style={{ marginTop: '20px' }}>
                    <h4>預覽</h4>
                    <img
                        src={photoUrl}
                        alt="拍照"
                        style={{ maxWidth: '90%', borderRadius: '8px', border: '1px solid #666' }}
                    />
                    {/* <div style={{ marginTop: '10px' }}>
                    <button onClick={downloadPhoto} style={{ marginRight: '10px' }}>
                        下載照片
                    </button>
                    <button onClick={uploadPhoto}>
                        上傳照片
                    </button>
                </div> */}
                </div>
            )}
        </div>
    )
}

export default Camera;
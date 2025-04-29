import { useRef, useState } from "react";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [error, setError] = useState<string | null>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, // 'user' = 前鏡頭，'environment' = 後鏡頭
                audio: false,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            }
        } catch (err) {
            console.error('開啟相機失敗', err);
            setError('無法開啟相機，請檢查權限或裝置支援度');
        }
    }

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <h3>Web相機預覽</h3>

            <button onClick={startCamera}>
                啟動相機
            </button>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginTop: '20px' }}>
                <video
                    ref={videoRef}
                    style={{ width: '90%', borderRadius: '10px', border: '1px solid #ccc' }}
                    playsInline
                    muted
                />
            </div>
        </div>
    )
}

export default Camera;
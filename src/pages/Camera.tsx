import { useEffect } from "react";

const Camera = () => {
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);

                if (data.status === 'sendPhoto') {
                    alert(data.message);
                }
            } catch (error) {
                console.error('訊息錯誤', error);
            }
        }

        window.addEventListener('message', handleMessage); // Init取得座標
        document.addEventListener('message', handleMessage as EventListener); // For Android 特定系統使用

        return () => {
            window.removeEventListener('message', handleMessage);
            document.removeEventListener('message', handleMessage as EventListener);
        }
    }, []);

    const openCamera = () => {
        const payload = {
            action: 'openCamera',
            payload: '開啟相機!',
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));
    }

    return (
        <div>
            <h3>我是React Web~~</h3>

            <button onClick={openCamera}>拍照</button>
        </div>
    )
}

export default Camera;
import { useEffect, useState } from "react";

const GPS = () => {
    const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    useEffect(() => {
        const gpsStatus = localStorage.getItem('GPS_ENABLED');
        if (gpsStatus === 'true') requestInitLocation();

        const handleMessage = (e: MessageEvent) => {
            try {
                const data = JSON.parse(e.data);

                if (data.status === 'LOCATION_INFO') {
                    setLocation({
                        latitude: data.latitude,
                        longitude: data.longitude,
                    });
                    alert(`LOCATION_INFO ${JSON.stringify(e.data)}`);
                }
            } catch (error) {
                console.error('Native訊息錯誤', error);
            }
        }
        window.addEventListener('message', handleMessage); // Init取得座標
        document.addEventListener('message', handleMessage as EventListener); // For Android 特定系統使用
        return () => window.removeEventListener('message', handleMessage);
    }, []);


    // 通知APP取得初始定位
    const requestInitLocation = () => {
        const payload = {
            action: 'GET_INIT_LOCATION',
            content: '請求進行初始定位!'
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));
    }

    // 重取座標
    const updateLocation = () => {
        const payload = {
            action: 'UPDATE_LOCATION',
            content: '重取座標!'
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));

        localStorage.setItem('GPS_ENABLED', 'true');
    }

    // 關閉GPS
    const turnOffGPS = () => {
        const payload = {
            action: 'GPS_OFF',
            content: '關閉GPS!'
        };
        (window as any).ReactNativeWebView?.postMessage(JSON.stringify(payload));

        localStorage.setItem('GPS_ENABLED', 'false');
    }


    return (
        <>
            <div>
                <h3>我是React Web~~</h3>
                <p>
                    目前位置:
                    {location ? (
                        <span> [{location?.longitude} , {location?.latitude}]</span>
                    ) : '尚未取得位置'}
                </p>
                <button onClick={updateLocation}>向APP框要求位置</button>
                <button onClick={turnOffGPS}>關閉GPS</button>
            </div>
        </>
    )
}

export default GPS;
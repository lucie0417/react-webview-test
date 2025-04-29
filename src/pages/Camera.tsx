import { useEffect, useState } from "react";

const Camera = () => {
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            try {

            } catch (error) {

            }
        }
    }, []);

    const openCamera = () => {
        const payload = {
            action: 'openCamera',
            content: '開啟相機!',
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
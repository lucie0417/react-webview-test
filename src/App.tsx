import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [messageFromNative, setMessageFromNative] = useState('');
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        alert(`React收到來自Native ${JSON.stringify(e.data)}`);
        const data = JSON.parse(e.data);
        if (data.type === 'UPDATE_LOCATION') {
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
          })
        }

        setMessageFromNative(JSON.stringify(e.data));
      } catch (error) {
        console.error('Native訊息錯誤', error);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const sendMsgToNative = () => {
    const msg = JSON.stringify({ type: 'FROM_WEB', content: 'Hello from Web~~~' });
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(msg);
    }
  }

  return (
    <>
      <div>
        <h3>我是Webview~~</h3>
        <p>來自Native框的訊息: {messageFromNative}</p>
        <button onClick={sendMsgToNative}>傳送訊息到Native框</button>
      </div>
    </>
  )
}

export default App

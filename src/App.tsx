import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);


  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        alert(`Init取得座標 ${JSON.stringify(e.data)}`);
        if (data.type === 'UPDATE_LOCATION') {
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
          })
        }
      } catch (error) {
        console.error('Native訊息錯誤', error);
      }
    }

    window.addEventListener('message', handleMessage); // Init取得座標
    return () => window.removeEventListener('message', handleMessage);
  }, []);


  const sendMsgToNative = () => {
    const msg = JSON.stringify({ type: 'FROM_WEB', content: 'Hello from Web~~~' });
    if ((window as any).ReactNativeWebView) {
      (window as any).ReactNativeWebView.postMessage(msg);
    } else {
      alert('sendMsgToNative Failed!');
    }
  }

  return (
    <>
      <div>
        <h3>我是React Webview~~</h3>
        <p>
            目前位置:
            {location ? (
              <span> [{location.longitude} , {location.latitude}]</span>
            ) : '尚未取得位置'}
        </p>
        <button onClick={sendMsgToNative}>向Native框要求位置</button>
      </div>
    </>
  )
}

export default App

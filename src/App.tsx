import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [messageFromNative, setMessageFromNative] = useState('');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        console.log('React收到來自Native', e);
        const data = JSON.parse(e.data);
        setMessageFromNative(data);
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

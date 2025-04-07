import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [messageFromNative, setMessageFromNative] = useState('');

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        console.log('React收到來自Native', e);
      } catch (error) {
        console.error('解析 Native 訊息錯誤', error);
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <>
      <div>
        <h3>React Web嵌入Webview</h3>
        <p>來自Native的訊息: {messageFromNative}</p>

      </div>
    </>
  )
}

export default App

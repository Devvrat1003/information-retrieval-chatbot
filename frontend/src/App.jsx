import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  const [question, setQuestion] = useState("")

  const getResult = async () => {
    const res = await fetch("http://127.0.0.1:8000/askLLM/" + question)

    let ans = await res.json();
    console.log(ans);
  }

  return (
    <div className='bg-black'>
      <div className='flex gap-2'>
        <input className='outline-none' type="text" onChange={(e) => {
          setQuestion(e.target.value)
        }} />

        <button onClick={getResult}>
          ask Groq
        </button>
      </div>


    </div>
  )
}

export default App

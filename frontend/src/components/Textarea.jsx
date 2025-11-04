import React, { useState } from "react";

const Textarea = () => {
  const [text, setText] = useState(
    "India, officially the Republic of India, is a South Asian country that has been the world's most populous democracy since its independence in 1947. The country is surrounded by the Indian Ocean, Arabian Sea, and Bay of Bengal, and shares land borders with Pakistan, China, Nepal, Bhutan, Bangladesh, and Myanmar.  Its Andaman and Nicobar Islands share a maritime border with Thailand, Myanmar, and Indonesia.Modern humans arrived on the Indian subcontinent from Africa around 55,000 years ago, leading to a highly diverse region. Settled life emerged in the western margins of the Indus river basin 9,000 years ago, evolving into the Indus Valley Civilisation of the third millennium BCE. By 1200 BCE, an archaic form of Sanskrit had diffused into India from the northwest, with evidence found in the Rigveda. Hinduism emerged in India, but the Dravidian languages were supplanted in the northern and western regions.  The early medieval era saw the establishment of Christianity, Islam, Judaism, and Zoroastrianism on India's southern and western coasts. Muslim armies from Central Asia intermittently overran India's northern plains, eventually founding the Delhi Sultanate and drawing northern India into the cosmopolitan networks of medieval Islam.In the 15th century, the Vijayanagara Empire created a long-lasting composite Hindu culture in south India, while Sikhism emerged in the Punjab.   The Mughal Empire in 1526 ushered in two centuries of relative peace and left a legacy of luminous architecture.  Gradually expanding rule of the British East India Company turned India into a colonial economy and consolidated its sovereignty. British Crown rule began in 1858, and a pioneering nationalist movement emerged, leading to the partition of the British Indian Empire into two independent dominions in 1947."
  );
  const [result, setResult] = useState("");
  const [byratio, setByratio] = useState(false);
  const [loading, setLoading] = useState(false);

  const [ratio, setRatio] = useState(0.3);
  const [num_sentences, setNum_sentences] = useState(5);
  const [min_length, setMin_length] = useState(25);
  const [max_length, setMax_length] = useState(300);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = byratio
      ? `http://127.0.0.1:8080/summarize_by_ratio?ratio=${ratio}&min_length=${min_length}&max_length=${max_length}`
      : `http://127.0.0.1:8080/summarize_by_sentence?num_sentences=${num_sentences}&min_length=${min_length}&max_length=${max_length}`;

    console.log({ ratio, num_sentences, min_length, max_length });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: text,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

      const summaryData = data.summary;
      console.log(summaryData);

      setResult(summaryData);
    } catch (error) {
      console.error("Failed to summarize the text:", error);
      setResult(`Failed to summarize the text: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="space-x-4 py-5">
        <button
          className={`p-2 mt-2 transition-colors duration-300 ${
            byratio
              ? "bg-black text-white"
              : "bg-blue-500 text-white hover:bg-black"
          }`}
          onClick={() => setByratio(false)}
        >
          Summarize by sentence
        </button>
        <button
          className={`p-2 mt-2 transition-colors duration-300 ${
            !byratio
              ? "bg-black text-white"
              : "bg-blue-500 text-white hover:bg-black"
          }`}
          onClick={() => setByratio(true)}
        >
          Summarize by ratio
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          cols="30"
          rows="10"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to summarize"
          className="border p-2 w-full"
        ></textarea>
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 text-white p-2 mt-2"
        >
          Summarize
        </button>

        <div className="space-y-4 space-x-4 mt-4">
          <label>
            {byratio ? "Ratio : " : "Sentence : "}
            <input
              type="number"
              value={byratio ? ratio : num_sentences}
              onChange={
                byratio
                  ? (e) => setRatio(parseFloat(e.target.value))
                  : (e) => setNum_sentences(parseFloat(e.target.value))
              }
              className="border p-2"
            />
          </label>
          <label>
            Min Length :
            <input
              type="number"
              value={min_length}
              onChange={(e) => setMin_length(parseFloat(e.target.value))}
              className="border p-2"
            />
          </label>
          <label>
            Max Length :
            <input
              type="number"
              value={max_length}
              onChange={(e) => setMax_length(parseFloat(e.target.value))}
              className="border p-2"
            />
          </label>
        </div>
      </form>
      <h3 className="mt-10">Summary:</h3>
      <div className="mt-4">
        {loading ? (
          <span className="loading loading-bars loading-lg"></span>
        ) : (
          <p className={result ? "border p-2" : ""}>{result}</p>
        )}
      </div>
    </div>
  );
};

export default Textarea;

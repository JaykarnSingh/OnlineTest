import { useState, useRef, useEffect } from "react";
import { quiz } from "./questions";
import "./quiz.css";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
const TestPage = () => {




  const [recording, setRecording] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);



  const value1 = localStorage.getItem('usertest');
  const test=JSON.parse(value1);
  const value=test.id;
  const valName=test.name;


  const [stream, setStream] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  // const [screenshots, setScreenshots] = useState([]);
  const videoRef = useRef(null);

  // const [data,setData]=useNavigate('');

  const [length, setLength] = useState("");
  const [score, setScore] = useState("");
  const [cans, setCans] = useState("");
  const [wans, setWans] = useState("");
  // const [iddata, setId] = useState("");

  const navigate = useNavigate();

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const { questions } = quiz;
  const { question, choices, correctAnswer } = questions[activeQuestion];

  const onClickNext = () => {
    setSelectedAnswerIndex(null);
    setResult((prev) =>
      selectedAnswer
        ? {
            ...prev,
            score: prev.score + 5,
            correctAnswers: prev.correctAnswers + 1,
          }
        : { ...prev, wrongAnswers: prev.wrongAnswers + 1 }
    );
    if (activeQuestion !== questions.length - 1) {
      setActiveQuestion((prev) => prev + 1);
    } else {
      setActiveQuestion(0);
      setShowResult(true);
    }
  };

  const onAnswerSelected = (answer, index) => {
    setSelectedAnswerIndex(index);
    if (answer === correctAnswer) {
      setSelectedAnswer(true);
    } else {
      setSelectedAnswer(false);
    }
  };

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  var logout = () => {

    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    fetch("http://localhost:5000/userscore", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        length: questions.length,
        score: result.score,
        cans: result.correctAnswers,
        wans: result.wrongAnswers,
        id:value
      }),
    })
      .then((response) => response.json())
      .then((datas) => {
        
        localStorage.clear();
        navigate("/user");
        console.log(datas);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  //yha screen shot ka logic lg rha hai

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error(error);
      }
    };

    initCamera();

    const interval = setInterval(() => {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const scale = 0.5; // adjust this value to control the screenshot size
      canvas.width = videoRef.current.videoWidth * scale;
      canvas.height = videoRef.current.videoHeight * scale;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        async (blob) => {
          const compressedImage = await compressImage(blob);
          setScreenshot(compressedImage);
          sendScreenshot(compressedImage);
        },
        "image/jpeg",
        0.7
      ); // adjust the quality value as needed
    }, 950);

    return () => {
      clearInterval(interval);
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
     
    };
  }, []);

  const compressImage = async (blob) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          const maxWidth = 100; // adjust this value to control the image width
          const scale = Math.min(maxWidth / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          context.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (compressedBlob) => {
              resolve(compressedBlob);
            },
            "image/jpeg",
            0.7
          ); // adjust the quality value as needed
        };
      };
    });
  };

  const sendScreenshot = async (data) => {
    try {
      const formData = new FormData();
      const blobData = dataURItoBlob(data);
      formData.append("screenshot", blobData);
      const response = await fetch("http://localhost:5000/screenshot", {
        method: "POST",
        body: formData,
      });
      const result = await response.text();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const dataURItoBlob = (dataURI) => {
    if (dataURI instanceof Blob) {
      return dataURI;
    }
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };


  //yha audio ka logic a rha hai
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener('stop', async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log('audioBlob', audioBlob);
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        const response = await fetch('http://localhost:5000/upload-audio', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        setRecording(data.audioUrl);
        console.log("Recording URL:", data.audioUrl);
        // console.log("we're fine", recording)
      });

      mediaRecorder.start();
      setIsRecording(true);
    
    } catch (error) {
      console.error(error);
    }
  };

  const stopRecording = () => {
    mediaStream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    
  };



  return (
    <>
      <h3>{value}</h3>
      <h1>{valName}</h1>

      <div>
      {recording && (
        <audio controls src={`http://localhost:5000/play-audio/${recording}`}  />
      )}
      {!isRecording && (
        <button onClick={startRecording}>Start Recording</button>
      )}
      {isRecording && (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
    </div>


      <video
        ref={videoRef}
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          marginLeft: "900px",
        }}
        autoPlay
      />
      
      <div className="quiz-container" id="testquiz">
        {!showResult ? (
          <div>
            <div>
              <span className="active-question-no">
                {addLeadingZero(activeQuestion + 1)}
              </span>
              <span className="total-question">
                /{addLeadingZero(questions.length)}
              </span>
            </div>
            <h2>{question}</h2>
            <ul>
              {choices.map((answer, index) => (
                <li
                  onClick={() => onAnswerSelected(answer, index)}
                  key={answer}
                  className={
                    selectedAnswerIndex === index ? "selected-answer" : null
                  }
                >
                  {answer}
                </li>
              ))}
            </ul>
            <div className="flex-right">
              {activeQuestion === questions.length - 1 ? (
                <button
                  onClick={logout}
                  disabled={selectedAnswerIndex === null}
                >
                
                  Finish
                </button>
              ) : (
                <button
                  onClick={onClickNext}
                  disabled={selectedAnswerIndex === null}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="result">
            <h3>Result</h3>
          
            <p>
              Total Question:{" "}
              <span value={length} onChange={(e) => setLength(e.target.value)}>
                {questions.length}
              </span>
            </p>
            <p>
              Total Score:
              <span value={score} onChange={(e) => setScore(e.target.value)}>
                {" "}
                {result.score}
              </span>
            </p>
            <p>
              Correct Answers:
              <span value={cans} onChange={(e) => setCans(e.target.value)}>
                {" "}
                {result.correctAnswers}
              </span>
            </p>
            <p>
              Wrong Answers:
              <span value={wans} onChange={(e) => setWans(e.target.value)}>
                {" "}
                {result.wrongAnswers}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default TestPage;

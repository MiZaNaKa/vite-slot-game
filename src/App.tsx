import { useState, useRef, useEffect,  } from 'react';
import styled from 'styled-components';
import Table from "./table"
import TableColumns from './TableColumn';
import Reel from './Reel';
import CustomModal from './modal';
import Icon from './Icon';
import SpinButton from './SpinButton';
import Table2 from './Table2';
import Mute from "./img/mute.png"
import Loud from "./img/loud.png"
import "./App.css";

const symbols: string[] = ['🍒', '🍉', ];
// const table2No = 390; 
// const rows = 15; 



const groupArray = (array: string[]): string[][] => {
  if (array.length === 0) return [];

  const result: string[][] = [];
  let currentGroup: string[] = [array[0]];

  for (let i = 1; i < array.length; i++) {
    if (array[i] === array[i - 1]) {
      currentGroup.push(array[i]);
    } else {
      result.push(currentGroup);
      currentGroup = [array[i]];
    }
  }

  result.push(currentGroup);
  return result;
};


const SlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  // const [isActive, setActive] = useState(false);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(52);
  const [total, setTotal] = useState(10);
  const [matchingSymbol, setMatchingSymbol] = useState("");
  // const [totalList, setTotalList] = useState<string[]>([]);
  const [showSymbols, setShowSymbols] = useState('');
  const [showTimer, setShowTimer] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountM, setTotalCountM] = useState(0);
  // const [matchingMessage, setMatchingMessage] = useState('');
  const [allList, setAllList] = useState<string[]>([]);
  const [nestedArray, setNestedArray] = useState<string[][]>([]);
  
  const [count, setCount] = useState(0);
 
  const [finishedLoop, setFinishedLoop] = useState(false);
  // const [action, setAction] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);
  const [secondsLeft1, setSecondsLeft1] = useState(0);
  const [readySecondsLeft, setReadySecondsLeft] = useState(false);
  const [koreaTime, setKoreaTime] = useState<string>("");

   //table
   const [currentPageTable1, setCurrentPageTable1] = useState(1);
   const [currentPageTable2, setCurrentPageTable2] = useState(1);

  //pagination
  
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [totalPages, setTotalPages] = useState(0);
  // const [currentData, setCurrentData] =  useState<string[]>([]);

  //lefttime



  //Korea Time
  const [koreaRealTime, setKoreaRealTime] = useState<string>("");
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);



  const [currentPage, setCurrentPage] = useState(1);

  const isWithinTimeRange=false
  const spinAgain=true

  const data = allList || [];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
 
  
  useEffect(() => {
    console.log(currentData)
    console.log(currentPage)
    console.log(totalPages)
    if (currentData.length > 0  && currentPage === totalPages) {
      setTotalCountM((data.length - currentData.length)+1);
      setTotalCount((data.length - currentData.length)+1);      
    }
  }, [currentData, data]);


  useEffect(() => {
    console.log(currentPage)
    console.log(currentData)
    console.log(totalPages)
  }, [currentPage, currentData]);

  
  

  const itemsPerPageTable1 = 66;
  // const totalPagesTable1 = Math.ceil(data.length / itemsPerPageTable1);
  const Table1 = data.slice(
    (currentPageTable1 - 1) * itemsPerPageTable1,
    currentPageTable1 * itemsPerPageTable1
  );

  const itemsPerPageTable2 = 24;
  // const totalPagesTable2 = Math.ceil(nestedArray.length / itemsPerPageTable1);
  const Table2R = nestedArray.slice(
    (currentPageTable2 - 1) * itemsPerPageTable2,
    currentPageTable2 * itemsPerPageTable2
  );


  

  const number = 10; 
  const range = Array.from({ length: number }, (_, i) => i + 1); 
  // const number1 = 60; 
  const [isMuted, setIsMuted] = useState(false); 
  const [result, setResult] = useState([
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
  ]); 
  const winAudioRef = useRef<HTMLAudioElement | null>(null); 
  
  let tempArray: string[] = [];

  const toggleMute = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.muted = !isMuted; 
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const calculateCount = () => {
      const koreaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" });
      const now = new Date(koreaTime);
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const totalMinutesToday = currentHour * 60 + currentMinute;
      const startMinutes = 9 * 60;

      let count = 0;
      if (totalMinutesToday >= startMinutes) {
        count = totalMinutesToday - startMinutes;
      } else {
        count = 1440 - (startMinutes - totalMinutesToday);
      }
      setCount(count);
    };
    calculateCount();
    const executeLoop = () => {
        if (count > 0) {
          const tempAllList = [];
          for (let i = 0; i < count; i++) {
            const randomValue = chooseRandom();
            tempAllList.push(randomValue);
          }
          // localStorage.removeItem('allList');
          // var total=[]
          const localStorageAllList = localStorage.getItem("allList");
          
          if(localStorageAllList){
            var convertJson=JSON.parse(localStorageAllList)
            var minus=tempAllList.length-convertJson.length
            
            if(minus>0){
              const updatedTotal = tempAllList.slice(-minus)            
              if(updatedTotal.length>0){
                const mergedArray = [...convertJson, ...updatedTotal]; 
                localStorage.removeItem('allList');
                localStorage.setItem("allList", JSON.stringify(mergedArray));
                setAllList(mergedArray);   
                const nestedArray = groupArray(mergedArray);
                setNestedArray(nestedArray)     
              }
              else{
                setAllList(convertJson);   
                const nestedArray = groupArray(convertJson);
                setNestedArray(nestedArray)  
              }
            }
            else{
              setAllList(convertJson);   
              const nestedArray = groupArray(convertJson);
              setNestedArray(nestedArray)  
            }
            
          }
          else{
            localStorage.setItem("allList", JSON.stringify(tempAllList));
            setAllList(tempAllList); 
            const nestedArray = groupArray(tempAllList);
            setNestedArray(nestedArray)           
          }

          
          
          // const dividend = count;
          // const divisor = 10;
          // const result = Math.floor(dividend / divisor);
    
          const totalPages = Math.ceil(allList.length / itemsPerPage);
          const totalPagesTable1 = Math.ceil(allList.length / itemsPerPageTable1);
          const totalPagesTable2 = Math.ceil(nestedArray.length / itemsPerPageTable2);

          setCurrentPage(totalPages);
          setCurrentPageTable1(totalPagesTable1)
          setCurrentPageTable2(totalPagesTable2)
          // setTotalPages(totalPages);
          
          // setCurrentData(currentData);
          setFinishedLoop(true);
          
        }
    };
    
    executeLoop();
    // const interval = setInterval(calculateCount, 60000);
    // return () => clearInterval(interval);
  }, [count,finishedLoop]);
  
  const chooseRandom = () => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  };
  

  // secondsLeft
   useEffect(() => {
    const calculateKoreaTimeAndSecondsLeft = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const koreaTimeString = new Intl.DateTimeFormat("en-US", options).format(now);
      setKoreaTime(koreaTimeString);
      const koreaSeconds = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      ).getSeconds();
      setSecondsLeft(60 - koreaSeconds);
    };
    calculateKoreaTimeAndSecondsLeft();
    const interval = setInterval(calculateKoreaTimeAndSecondsLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const calculateKoreaTimeAndSecondsLeft = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      const koreaTimeString = new Intl.DateTimeFormat("en-US", options).format(now);
      setKoreaTime(koreaTimeString);
      const koreaSeconds = new Date(
        now.toLocaleString("en-US", { timeZone: "Asia/Seoul" })
      ).getSeconds();
      setSecondsLeft1(60 - koreaSeconds);
    };

    calculateKoreaTimeAndSecondsLeft();
    if(secondsLeft1>0){
      setTimer(secondsLeft1);
    }
    else{
      setTimer(52)
    }
    
  }, [finishedLoop,readySecondsLeft]);

 
  
  //KOREA TIME
  useEffect(() => {
    const updateTime = () => {
      const koreaTime = new Date().toLocaleTimeString("en-US", {
        timeZone: "Asia/Seoul",
        hour12: false, 
      });
      setKoreaRealTime(koreaTime);
    };

    updateTime(); 
    const timer22 = setInterval(updateTime, 1000);
    return () => clearInterval(timer22); 
  }, []);

  

  useEffect(() => {
    const calculateRemainingSeconds = () => {
      const now = new Date();
      const currentSeconds = now.getSeconds();
      const leftSeconds = 60 - currentSeconds;
      setRemainingSeconds(leftSeconds);
    };

    calculateRemainingSeconds(); 
    const timer1 = setInterval(calculateRemainingSeconds, 1000); 

    return () => clearInterval(timer1); 
  }, []);

  useEffect(() => {
    if (spinAudioRef.current) {
      spinAudioRef.current.addEventListener('canplaythrough', () => {
        console.log('Audio is ready to play');
      });
      spinAudioRef.current.load(); 
    }
  }, []);
  
  useEffect(() => {
    const KOREA_TIMEZONE = "Asia/Seoul";
    const startHour = 9; 

    const getKoreaTime = () => {
      const now = new Date();
      return new Date(
        new Intl.DateTimeFormat("en-US", {
          timeZone: KOREA_TIMEZONE,
        }).format(now)
      );
    };

    const resetState = () => {
      localStorage.removeItem('allList');
      window.location.reload();
    };

    const calculateNextReset = () => {
      const now = getKoreaTime();
      const nextReset = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        startHour,
        0,
        0,
        0
      );
      if (now >= nextReset) {
        nextReset.setDate(nextReset.getDate() + 1);
      }
      return nextReset.getTime() - now.getTime();
    };

    const timeUntilNextReset = calculateNextReset();
    const timerKorea = setTimeout(() => {
      resetState();
    }, timeUntilNextReset);

    const intervalKorea = setInterval(() => {
      resetState();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearTimeout(timerKorea);
      clearInterval(intervalKorea);
    };
  }, []);

  // const playAudio = () => {
  //   if (spinAudioRef.current) {
  //     spinAudioRef.current.play().catch((error) => {
  //       console.error("Error playing audio:", error);
  //     });
  //   }
  // };
  const handleUserInteraction = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };
  
  useEffect(() => {
    document.addEventListener('click', handleUserInteraction, { once: true });
    return () => document.removeEventListener('click', handleUserInteraction);
  }, []);

  const spinReels = () => { 
    if(currentData.length===10){
      setCurrentPage(currentPage+1)
    }

    if(Table1.length===itemsPerPageTable1){
      setCurrentPageTable1(currentPageTable1+1)
    }

    if(Table2R.length===itemsPerPageTable2){
      setCurrentPageTable2(currentPageTable2+1)
    }
    
    // if(total===0){
    //   // setCurrentPage(currentPage+1)
    //   // setTotalList([])
    //   setTotal(10)
    //   setTotalCount(allList.length)
    // }
    if (spinning) return;
    setSpinning(true);
    // setMatchingMessage(''); 
    // playAudio()

    if (spinAudioRef.current && !isMuted) {
      spinAudioRef.current.muted = isMuted;
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.src = '/sounds/slot-spin.mp3';
      spinAudioRef.current.load();
      // Try to play audio and catch any errors if they occur
      try {
        spinAudioRef.current.play();
      } catch (error) {
        console.error("Audio playback failed:", error);
      }
    }

    if (winAudioRef.current) {
      winAudioRef.current.currentTime = 0;
      winAudioRef.current.play();
    }
    
  
    setTimeout(() => {
      const newResult = [
        symbols[Math.floor(Math.random() * symbols.length)], 
        symbols[Math.floor(Math.random() * symbols.length)], 
        symbols[Math.floor(Math.random() * symbols.length)], 
      ];
  
      setResult(newResult);

      const [symbol1, symbol2, symbol3] = newResult;
      if (symbol1 === symbol2 || symbol1 === symbol3 || symbol2 === symbol3) {
        // setMatchingMessage('🎉 Two symbols are the same! 🎉');
  
        if (matchingSymbol) {
          if(matchingSymbol===symbol1){
            setNestedArray((prev) => {
              if (prev.length === 0) {
                return prev;
              }
              const updatedArray = [...prev];
              const lastIndex = updatedArray.length - 1;
              updatedArray[lastIndex] = [...updatedArray[lastIndex], symbol1];
              return updatedArray; 
            });
          }
          else{
            tempArray=[]
            tempArray.push(symbol1); 
            setNestedArray((prev) => [...prev, tempArray]);
          }
        } else {
          tempArray.push(symbol1); 
          setNestedArray((prev) => [...prev, tempArray]);
        }
       
        setMatchingSymbol(symbol1);
        setShowSymbols(symbol1);
        // setTotalList(prevList => [...prevList,symbol1]);
        setAllList(prevList => [...prevList,symbol1])
        setTotalCountM(totalCountM+1)
        localStorage.setItem("allList", JSON.stringify(allList));
      }
      
      setTimer(52)
      // setSecondsLeft(0)
      setShowTimer(3)  
      setSpinning(false);
      if(total>=0){
          
        openModal()
        setTotal((prevTotal) => {
          console.log("Previous Total:", prevTotal); 
          return prevTotal - 1;
        });
      }
      else if(total===0){
        // closeModal()
      }
      

      if (spinAudioRef.current && !isMuted) spinAudioRef.current.pause();
    }, 2000);
  };

  useEffect(() => {

    if(!modalIsOpen){
      openModal()
    }
    
    if(showSymbols){     
      let countdown2: number;
      if (modalIsOpen && showTimer > 0) {
        countdown2 = window.setInterval(() => {
          
          setShowTimer((prev) => prev - 1);
        }, 1000);
      } else if (showTimer === 0) {
        const hellokittyResult = localStorage.getItem("allList");
        if (hellokittyResult) {
          const myo = JSON.parse(hellokittyResult);
          if(myo.length===1439){
            localStorage.removeItem('allList'); 
            window.location.reload();
           
          }
        }
        setShowSymbols("")
        // setTimer(52);
        setTimer(secondsLeft);
        let countdown: number;
        if (modalIsOpen && timer > 0) {
          countdown = window.setInterval(() => {
            setTimer((prev) => prev - 1);
          }, 1000);
        } else if (timer === 0) {
          closeModal();
          spinReels()
          
        }
        return () => {
          clearInterval(countdown);
        };
      }
      return () => {
        clearInterval(countdown2);
      };
    }
    else{
      // alert("hello1")
      if(!readySecondsLeft){
        setReadySecondsLeft(true)
      }
      let countdown: number;
      if (modalIsOpen && timer > 0) {
        countdown = window.setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
      } else if (timer === 0) {
        closeModal();
        spinReels();
        // setTimer(52);
        // setShowTimer(3)  
      }
      return () => {
        clearInterval(countdown);
      };
    }
  }, [modalIsOpen, timer,showTimer,finishedLoop]);

  const openModal = () => {
    
    setIsOpen(true);
    // setTimer(52);
    // setShowTimer(3)    
    // setActive(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    
  };
  
  const handleNext = () => {
    
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
    setTotalCount(totalCount+10)
  };

  const handlePrevious = () => {
    
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
    
    setTotalCount(totalCount-10)
    // setAction(true)
  };

  return (
    <Wrapper>
      <Title>Slot Machine (Khin2 Thant) 
        {secondsLeft}
        <p>{koreaRealTime}  /  {remainingSeconds} seconds {koreaTime}
          count is {count}
        </p> current Page {currentPage}
        total page {totalPages}
      </Title>
      
      {/* <button onClick={openModal}>Open Modal</button> */}
      <CustomModal
        isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        showSymbols={showSymbols}
        // currentDate={currentDate}
        timer={timer}
        // total={total}
        // showTimer={showTimer}
        TotalCount={allList.length+1}
        Result={allList.length}
      />

      <div className='audioBox'>
        <button className='audioAc' onClick={toggleMute}>
          <img src={isMuted ? Mute : Loud} className='icon'/>
        </button>
      </div>
      
      <audio ref={spinAudioRef} src="/sounds/slot-spin.mp3" preload="auto"/>
      <Reels>
        {result.map((symbol, i) => (
          <Reel key={i}  targetSymbol={symbol} spinning={spinning} delay={i * 100} />
        ))}
      </Reels>
  
      <SpinButton isWithinTimeRange={isWithinTimeRange } spinAgain={spinAgain} spinning={spinning} modalIsOpen={modalIsOpen} spinReels={spinReels}/>
      {/* {result.every((s) => s === result[0]) && !spinning && <Result>🎉 You Win! 🎉</Result>} */}
      <Icon/>

      <div style={{width:1100,margin:'0 auto',display:'inline-block'}}>
        <TableColumns 
          totalCount={totalCount}
          data={range} 
          currentData={currentData}
          currentPage={currentPage}
          totalPages={totalPages}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
        <div>
          <div className='boxLeft'>
            <Table allList={Table1}/>
          </div>
          <div className='boxRight'>
            <Table2  nestedArray={Table2R}/>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  text-align: center;
  color: #fff;
  margin-top: 50px;
`;

const Title = styled.h1`
  color: #f39c12;
  font-size: 2rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
  margin-bottom:40px
`;

const Reels = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

export default SlotMachine;

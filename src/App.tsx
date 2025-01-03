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
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(52);
  const [total, setTotal] = useState(10);
  const [matchingSymbol, setMatchingSymbol] = useState("");
  const [showSymbols, setShowSymbols] = useState('');
  const [showTimer, setShowTimer] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountM, setTotalCountM] = useState(0);
  const [allList, setAllList] = useState<string[]>([]);
  const [nestedArray, setNestedArray] = useState<string[][]>([]);
  const [count, setCount] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);
  const [finishedLoop, setFinishedLoop] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [secondsLeft1, setSecondsLeft1] = useState(0);
  const [readySecondsLeft, setReadySecondsLeft] = useState(false);
  const [koreaTime, setKoreaTime] = useState<string>("");
  const [currentPageTable1, setCurrentPageTable1] = useState(1);
  const [currentPageTable2, setCurrentPageTable2] = useState(1);
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
 
  const itemsPerPageTable1 = 66;
  const Table1 = data.slice(
    (currentPageTable1 - 1) * itemsPerPageTable1,
    currentPageTable1 * itemsPerPageTable1
  );

  const itemsPerPageTable2 = 24;
  const Table2R = nestedArray.slice(
    (currentPageTable2 - 1) * itemsPerPageTable2,
    currentPageTable2 * itemsPerPageTable2
  );

  const number = 10; 
  const range = Array.from({ length: number }, (_, i) => i + 1); 
  const [isMuted, setIsMuted] = useState(false); 
  const [result, setResult] = useState([
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
  ]); 
  const winAudioRef = useRef<HTMLAudioElement | null>(null); 
  let tempArray: string[] = [];

  

  //setTotalCountM
   useEffect(() => {
    if (currentData.length > 0  && currentPage === totalPages) {
      setTotalCountM((data.length - currentData.length)+1);
      setTotalCount((data.length - currentData.length)+1);      
    }
  }, [currentData, data]);

  //remainingSeconds
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
      setCurrentCount(count);
    };
    calculateCount();
   
    const interval = setInterval(calculateCount, 60000);
    return () => clearInterval(interval);
  }, [remainingSeconds]);

  //count& loop
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

          const getOldItem = localStorage.getItem("allList");
          if(getOldItem){
            var checkStorage=JSON.parse(getOldItem)
            if(count < checkStorage.length){
              localStorage.removeItem('allList');
            }
          }
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

          const totalPages = Math.ceil(allList.length / itemsPerPage);
          const totalPagesTable1 = Math.ceil(allList.length / itemsPerPageTable1);
          const totalPagesTable2 = Math.ceil(nestedArray.length / itemsPerPageTable2);

          setCurrentPage(totalPages);
          setCurrentPageTable1(totalPagesTable1)
          setCurrentPageTable2(totalPagesTable2)
          setFinishedLoop(true);
          
        }
    };
    
    executeLoop();
  }, [count,finishedLoop]);
  
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

  // secondsLeft2
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
      if(secondsLeft1>=4){
        setTimer(secondsLeft1-4);
      }else{
        setTimer(0);
      }
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

  //remainingSeconds
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

  //Audio
  useEffect(() => {
    if (spinAudioRef.current) {
      spinAudioRef.current.addEventListener('canplaythrough', () => {
        console.log('Audio is ready to play');
      });
      spinAudioRef.current.load(); 
    }
  }, []);
  
  //ResetTime
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
    };

    const windowReload = () => {
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
      windowReload()
    }, timeUntilNextReset);

    const intervalKorea = setInterval(() => {
      resetState();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearTimeout(timerKorea);
      clearInterval(intervalKorea);
    };
  }, []);
  
  //AudioCheck
  useEffect(() => {
    document.addEventListener('click', handleUserInteraction, { once: true });
    return () => document.removeEventListener('click', handleUserInteraction);
  }, []);

  //OpenModal
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
        if(secondsLeft>=5){
          setTimer(secondsLeft-5);
        }else{
          setTimer(0);
        }
        
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
      }
      return () => {
        clearInterval(countdown);
      };
    }
  }, [modalIsOpen, timer,showTimer,finishedLoop]);

  

  const openModal = () => {
    setIsOpen(true);
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
  };

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
    
    if (spinning) return;
    setSpinning(true);
    if (spinAudioRef.current && !isMuted) {
      spinAudioRef.current.muted = isMuted;
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.src = '/sounds/slot-spin.mp3';
      spinAudioRef.current.load();
      
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
        setAllList(prevList => [...prevList,symbol1])
        setTotalCountM(totalCountM+1)
        localStorage.setItem("allList", JSON.stringify(allList));
      }
      
      setTimer(secondsLeft)
      setShowTimer(3)  
      setSpinning(false);
      if(total>=0){
        openModal()
        setTotal((prevTotal) => {
          console.log("Previous Total:", prevTotal); 
          return prevTotal - 1;
        });
      }
      if (spinAudioRef.current && !isMuted) spinAudioRef.current.pause();
    }, 2000);
  };

  const handleUserInteraction = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    }
  };

  const chooseRandom = () => {
    const randomIndex = Math.floor(Math.random() * symbols.length);
    return symbols[randomIndex];
  };

  const toggleMute = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.muted = !isMuted; 
      setIsMuted(!isMuted);
    }
  };

  return (
    <Wrapper>
      <Title>
        Slot Machine (Khin2 Thant) 
      </Title>
      
      
      <CustomModal
        isOpen={modalIsOpen}
        showSymbols={showSymbols}
        timer={timer}
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
      <p className="fontCR"> {koreaRealTime}  /  {remainingSeconds} , 
          count is {currentCount} ,
        </p> 
      <p className="fontCR"> {koreaTime}</p>
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

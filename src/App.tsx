import { useState, useRef, useEffect } from 'react';
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
const table2No = 390; 
const rows = 15; 
const columns = Math.ceil(table2No / rows);

const SlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  const [isActive, setActive] = useState(false);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(60);
  const [total, setTotal] = useState(10);
  const [matchingSymbol, setMatchingSymbol] = useState("");
  const [totalList, setTotalList] = useState<string[]>([]);
  const [showSymbols, setShowSymbols] = useState('');
  const [showTimer, setShowTimer] = useState(3);
  const [totalCount, setTotalCount] = useState(0);
  const [totalCountM, setTotalCountM] = useState(0);
  const [matchingMessage, setMatchingMessage] = useState('');
  const [allList, setAllList] = useState<string[]>([]);
  const [nestedArray, setNestedArray] = useState<string[][]>([]);
  const [isWithinTimeRange, setIsWithinTimeRange] = useState(false);
  const [spinAgain, setSpinAgain] = useState(true);
  const number = 10; 
  const range = Array.from({ length: number }, (_, i) => i + 1); 
  const number1 = 60; 
  const [isMuted, setIsMuted] = useState(true); 
  const [result, setResult] = useState([
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
  ]); 
  const winAudioRef = useRef<HTMLAudioElement | null>(null); 
  const [currentPage, setCurrentPage] = useState(1);
  let tempArray: string[] = [];
  const data = allList
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleMute = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.muted = !isMuted; 
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    if (spinAudioRef.current) {
      spinAudioRef.current.addEventListener('canplaythrough', () => {
       
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
    const timer = setTimeout(() => {
      resetState();
    }, timeUntilNextReset);

    const interval = setInterval(() => {
      resetState();
    }, 24 * 60 * 60 * 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  const playAudio = () => {
    if (spinAudioRef.current) {
      spinAudioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };
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
    
    if(total===0){
      setCurrentPage(currentPage+1)
      setTotalList([])
      setTotal(10)
      setTotalCount(allList.length)
    }
    if (spinning) return;
    setSpinning(true);
    setMatchingMessage(''); 
    // playAudio()

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
        setMatchingMessage('🎉 Two symbols are the same! 🎉');
  
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
        console.log(nestedArray);
  
        setMatchingSymbol(symbol1);
        setShowSymbols(symbol1);
        setTotalList(prevList => [...prevList,symbol1]);
        setAllList(prevList => [...prevList,symbol1])
        setTotalCountM(totalCountM+1)

      }
      setTimer(60);
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
    openModal()
    if(showSymbols){
     
      let countdown2: number;
      if (modalIsOpen && showTimer > 0) {
        countdown2 = window.setInterval(() => {
          
          setShowTimer((prev) => prev - 1);
        }, 1000);
      } else if (showTimer === 0) {
        
        // closeModal();
        // spinReels()
        setShowSymbols("")
        setTimer(60);
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
      let countdown: number;
      if (modalIsOpen && timer > 0) {
        countdown = window.setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
      } else if (timer === 0) {
        closeModal();
        spinReels();
        // setTimer(60);
        // setShowTimer(3)  
      }
      return () => {
        clearInterval(countdown);
      };
    }
    
  }, [modalIsOpen, timer,showTimer]);

  const openModal = () => {
    
    setIsOpen(true);
    // setTimer(60);
    // setShowTimer(3)    
    setActive(false);
    
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

  return (
    <Wrapper>
      <Title>Slot Machine (Khin2 Thant)</Title>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <CustomModal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        showSymbols={showSymbols}
        // currentDate={currentDate}
        timer={timer}
        total={total}
        showTimer={showTimer}
        TotalCount={totalCountM+1}
        Result={totalCountM}
      />

      <div className='audioBox'>
        <button className='audioAc' onClick={toggleMute}>
          <img src={isMuted ? Mute : Loud} className='icon'/>
        </button>
      </div>
      
      <audio ref={spinAudioRef} src="/sounds/slot-spin.mp3" preload="auto"/>
      <Reels>
        {result.map((symbol, i) => (
          <Reel key={i} isActive={isActive} targetSymbol={symbol} spinning={spinning} delay={i * 100} />
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
            <Table allList={allList}/>
          </div>
          <div className='boxRight'>
            <Table2 allList={allList} nestedArray={nestedArray}/>
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

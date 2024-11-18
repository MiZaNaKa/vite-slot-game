import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import Modal from 'react-modal';

const symbols: string[] = ['🍒', '🍉', ];

const customStyles = {
  content: {
    width: '400px',
    height: '170px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};


const fixedSymbols = ['🍒', '🍉'];

const SlotMachine = () => {
  let subtitle: HTMLHeadingElement | null = null;
  const [spinning, setSpinning] = useState(false);
  const [isActive, setActive] = useState(false);
  // const [result, setResult] = useState(['🍒', '🍉', '🍇']);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [timer, setTimer] = useState(10);
  const [total, setTotal] = useState(9);
  const [matchingSymbol, setMatchingSymbol] = useState("");
  const [totalList, setTotalList] = useState<string[]>([]);
  const [showSymbols, setShowSymbols] = useState("");
  const [showTimer, setShowTimer] = useState(3);
  const [matchingMessage, setMatchingMessage] = useState('');

  const symbols = ["P", "T", "F", "T", "P", "T", "F", "P", "T", "F", "P", "T", "F", "P", "T"];
  const numColumns = 5;

  const number = 10;
  const range = Array.from({ length: number }, (_, i) => i + 1); 
  

  const [result, setResult] = useState([
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)], 
    symbols[Math.floor(Math.random() * symbols.length)], 
  ]); 


  const currentDate = new Date().toLocaleDateString();

 
  const winAudioRef = useRef<HTMLAudioElement | null>(null); 
  

  // const spinReels = () => {
  //   if (spinning) return;
  //   setSpinning(true);

  //   if (spinAudioRef.current) {
  //     spinAudioRef.current.currentTime = 0;
  //     spinAudioRef.current.play();
  //   }

  //   setTimeout(() => {
  //     const newResult = [
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //     ];

  //     setResult(newResult);

  //     setSpinning(false);
  //     if (spinAudioRef.current) spinAudioRef.current.pause();
  //   }, 2000);
  // };
  
  

  // const spinReels = () => {
  //   if (spinning) return;
  //   setSpinning(true);
  //   setMatchingMessage('');

  //   if (spinAudioRef.current) {
  //     spinAudioRef.current.currentTime = 0;
  //     spinAudioRef.current.play();
  //   }

  //   setTimeout(() => {
  //     const newResult = [
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //       symbols[Math.floor(Math.random() * symbols.length)], 
  //     ];

  //     setResult(newResult);

  //     // Check if two symbols are the same
  //     const [symbol1, symbol2, symbol3] = newResult;
  //     if (symbol1 === symbol2 || symbol1 === symbol3 || symbol2 === symbol3) {
  //       setMatchingMessage('🎉 Two symbols are the same! 🎉');

  //       setMatchingSymbol(symbol1)
  //       setShowSymbols(symbol1)
  //       setTotalList(prevList => [symbol1, ...prevList]);
  //     }

  //     setSpinning(false);
  //     if (spinAudioRef.current) spinAudioRef.current.pause();
  //   }, 2000);
  // };

  const spinReels = () => { 
    if (spinning) return;
    setSpinning(true);
    setMatchingMessage(''); 
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play();
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
  
        if (winAudioRef.current) {
          winAudioRef.current.currentTime = 0;
          winAudioRef.current.play();
        }
  
        setMatchingSymbol(symbol1);
        setShowSymbols(symbol1);
        setTotalList(prevList => [...prevList,symbol1]);
      }
  
      setSpinning(false);
      if(total>0){
          
        openModal()
        setTotal(total-1)
      }
      if (spinAudioRef.current) spinAudioRef.current.pause();
    }, 2000);
  };
  

  useEffect(() => {
    if(showSymbols){
      let countdown2: number;
      if (modalIsOpen && showTimer > 0) {
        countdown2 = window.setInterval(() => {
          
          setShowTimer((prev) => prev - 1);
        }, 1000);
      } else if (showTimer === 0) {
        
        closeModal();
        spinReels()
        setShowSymbols("")
      }
      return () => {
        clearInterval(countdown2);
      };
    }
    else{
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
    
  }, [modalIsOpen, timer,showTimer]);

  const openModal = () => {
    setIsOpen(true);
    setTimer(10);
    setShowTimer(3)    
    setActive(false);
    
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <Wrapper>
      <Title>Slot Machine</Title>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        // onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {showSymbols ?
          <div>
            <p>{showSymbols}  {showTimer}</p>
          </div>
          :
          <div>
             <p>Today's date: {currentDate}</p>
             <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Timer: {timer} seconds total is {total}</h2>
          </div>
        }
       
        {/* <button onClick={closeModal}>Close</button> */}

        
      </Modal>
      <audio ref={spinAudioRef} src="/sounds/slot-spin.mp3" preload="auto"/>
      <Reels>
        {result.map((symbol, i) => (
          <Reel key={i} isActive={isActive} targetSymbol={symbol} spinning={spinning} delay={i * 100} />
        ))}
      </Reels>
     
      <Button onClick={spinReels} disabled={spinning || modalIsOpen}>
        {spinning ? 'Spinning...' : 'Start'}
      </Button>
      {/* <p style={{fontSize:22,color:'red'}}>{spinning ? 'Spinning...' : ''}</p> */}
      
      {result.every((s) => s === result[0]) && !spinning && <Result>🎉 You Win! 🎉</Result>}

     
      <div style={{width:600,margin:'0 auto',marginTop:30,display:'block'}}>
        <div style={{display:'block',float:'left',width:'50%'}}> <p style={{fontSize:60}}>🍒</p> </div>
        <div style={{display:'block',float:'left',width:'50%'}}> <p style={{fontSize:60}}>🍉</p> </div>
       
      </div>

      <div style={{width:900,margin:'0 auto',marginTop:80,display:'inline-block'}}>
        {/* {totalList.map((value,index)=>{
          return <div key={index} style={{display:'block',float:'left',padding:10}}>
              <div>
                <p>{value}</p>
              </div>
          </div>
        })} */}

       <div>
        {range.map((value,index) => (
          <div key={index} style={{display:'block',float:'left',width:'10%'}}>
          <div style={{
              borderLeft: '1px solid #000',
              borderTop: '1px solid #000',
              borderBottom: '1px solid #000',
              borderRight: value === 10 ? '1px solid #000' : '1px solid #fff'
          }}>
            <div style={{borderBottom:'1px solid #000',height:50}}>{totalList[index] ? <h3 style={{fontSize:18,color:"black"}}>{value}</h3> : <h3 style={{fontSize:18,color:"black"}}>-</h3>} </div>
            <div style={{height:70}}>
              <p style={{fontSize:18,color:"red",}}>{totalList[index] ? <h3 style={{fontSize:18,color:"black"}}>{totalList[index]}</h3> : <h3 style={{fontSize:18,color:"black"}}>-</h3>} </p>
              {totalList[index] ?
                <p style={{fontSize:18,color:"red",}}>{totalList[index]==='🍒' ?  <h3 style={{fontSize:18,color:"black"}}>C</h3> : <h3 style={{fontSize:18,color:"black"}}>W</h3>} </p>
                :
                null
              }
              
            </div>
           
          </div>
        </div>
        ))}
       </div>

        {totalList.slice().reverse().map((value, index) => {
          return <div key={index} style={{display:'block',float:'left',padding:10}}>
            <div>
              <div style={{background:'lightblue',paddingLeft:15,paddingRight:15,paddingTop:1,paddingBottom:1}}><h3>{index+1}</h3></div>
              <p style={{fontSize:24}}>{value}</p>
            </div>
          </div>
        })}
      </div>

      <div className="grid">
      {symbols.map((symbol, index) => (
        <div key={index} className="cell">
          {symbol}
        </div>
      ))}
    </div>
      
    </Wrapper>
  );
};

interface ReelProps {
  targetSymbol: string;
  spinning: boolean;
  delay: number;
  isActive:boolean
}

const Reel = ({ targetSymbol, spinning, delay, isActive }: ReelProps) => {
  const loopDistance = symbols.length * 100; 
  const stopPosition = symbols.indexOf(targetSymbol) * 100;

  const { y } = useSpring({
    from: { y: -loopDistance },
    to: async (next) => {
      if (spinning) {
        while (spinning) {
          await next({ y: 0, config: { tension: 500, friction: 20 } });
          await next({ y: -loopDistance, config: { tension: 500, friction: 20 } });
        }
      } else {
        await next({ y: -stopPosition, config: { tension: 100, friction: 40 } });
      }
    },
    // reset: true,
    delay,
  });

  const repeatedSymbols = Array(10).fill(symbols).flat(); 

  return (
    <ReelWrapper>
      <ReelContainer
        as={animated.div}
        style={{ transform: y.to((y) => `translateY(${y}px)`) }}
      >
        {repeatedSymbols.map((symbol, i) => (
          <Symbol key={i}>{symbol}</Symbol>
        ))}
      </ReelContainer>
    </ReelWrapper>
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
`;

const Reels = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
`;

const ReelWrapper = styled.div`
  width: 70px;
  height: 100px;
  overflow: hidden;
  background-color: #2c3e50;
  border-radius: 10px;
  position: relative;
  border: 3px solid #f39c12;
`;

const ReelContainer = styled(animated.div)`
  display: flex;
  flex-direction: column;
`;

const Symbol = styled.div`
  font-size: 2.5rem;
  text-align: center;
  height: 100px;
  line-height: 100px;
  color: #fff;
`;

const Button = styled.button`
  padding: 10px 20px;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #d35400;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const Result = styled.div`
  margin-top: 20px;
  font-size: 1.5rem;
  color: #2ecc71;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
`;

export default SlotMachine;

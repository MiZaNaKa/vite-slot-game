import { useState,useRef,useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';
import Modal from 'react-modal';

const symbols: string[] = ['🍒', '🍉', '🍇', '🍊', '🍋'];

const customStyles = {
  content: {
    width: '400px',      
    height: '300px',     
    margin: 'auto',      
    padding: '20px',     
    borderRadius: '10px', 
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
};

const SlotMachine = () => {
  let subtitle: HTMLHeadingElement | null = null;
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(['🍒', '🍉', '🍇']);
  const spinAudioRef = useRef<HTMLAudioElement | null>(null);
  const [modalIsOpen, setIsOpen] =useState(false);
  const [timer, setTimer] = useState(90); 


  const openModal = () => {
    setIsOpen(true);
    setTimer(90); 
  };


  const spinReels = () => {
    if (spinning) return;
    setSpinning(true);
  
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0; 
      spinAudioRef.current.play();
    }
  
    const newResult: string[] = [];
    const symbolCount: Record<string, number> = { '🍒': 0, '🍉': 0, '🍇': 0, '🍊': 0, '🍋': 0 };
    
    const weightedSymbols = [
      ...symbols.filter(symbol => symbol !== '🍒'), 
      '🍉', '🍇', '🍊', '🍋', 
    ];
  
    while (newResult.length < 3) {
      const symbol = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
  
      if (symbolCount[symbol] < 2) {
        newResult.push(symbol);
        symbolCount[symbol]++;
      }
    }
  
    setResult(newResult);

    setTimeout(() => {
      setSpinning(false);
  
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
      }
    }, 2000);

   
  };

  useEffect(() => {
    let countdown: number; 
    
    if (modalIsOpen && timer > 0) {
      countdown = window.setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      closeModal(); 
    }
  
    return () => clearInterval(countdown); 
  }, [modalIsOpen, timer]);
  

  const closeModal=()=>{
    setIsOpen(false);
  }
  

  return (
    <Wrapper>
      <Title>Slot Machine</Title>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Timer: {timer} seconds</h2>
        <button onClick={closeModal}>close</button>
        
      </Modal>
      <audio ref={spinAudioRef} src="/sounds/slot-spin.mp3" />
      <Reels>
        {result.map((symbol, i) => (
          <Reel key={i} targetSymbol={symbol} spinning={spinning} delay={i * 100} />
        ))}
      </Reels>
      <Button onClick={spinReels} disabled={spinning}>
        {spinning ? 'Spinning...' : 'Spin'}
      </Button>
      {result.every((s) => s === result[0]) && !spinning && <Result>🎉 You Win! 🎉</Result>}
    </Wrapper>
  );
};


interface ReelProps {
  targetSymbol: string;
  spinning: boolean;
  delay: number;
}
const Reel = ({ targetSymbol, spinning, delay }: ReelProps) => {
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
    reset: true,
    delay,
  });

  return (
    <ReelWrapper>
      <ReelContainer as={animated.div} style={{ transform: y.to((y) => `translateY(${y}px)`) }}>
        {Array(20)
          .fill(null)
          .map((_, i) => (
            <Symbol key={i}>{symbols[i % symbols.length]}</Symbol>
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

import { useState, useRef,useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated, config } from '@react-spring/web';

const symbols: string[] = ['🍒', '🍉', '🍇', '🍊', '🍋'];

const SlotMachine = () => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(['🍒', '🍉', '🍇']);
  

  const spinAudioRef = useRef<HTMLAudioElement | null>(null);

  const spinReels = () => {
    if (spinning) return;
    setSpinning(true);


    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0; 
      spinAudioRef.current.play();
    }

    const newResult = Array(3)
      .fill(null)
      .map(() => symbols[Math.floor(Math.random() * symbols.length)]);
    setResult(newResult);

    setTimeout(() => {
      setSpinning(false);
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
      }
    }, 2000);
  };

  return (
    <Wrapper>
      <audio ref={spinAudioRef} src="/sounds/slot-spin.mp3" />
      
      <Title>Slot Machine</Title>
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
  const [isLooping, setIsLooping] = useState(true);
  const numberOfSpins = 3; 
  const loopDistance = -symbols.length * 100; 

  
  const stopPosition = symbols.indexOf(targetSymbol) * -100;

  const { y } = useSpring({
    from: { y: 0 },
    to: async (next) => {
      if (spinning) {
       
        while (isLooping) {
          await next({ y: loopDistance, config: config.default });
          await next({ y: 0, config: config.default });
        }
      } else {
        
        await next({ y: loopDistance, config: config.default });
        await next({ y: stopPosition, config: { tension: 50, friction: 20 } });
      }
    },
    reset: true,
    delay,
    onRest: () => {
      if (!spinning) setIsLooping(false);
    },
  });

  useEffect(() => {
    if (spinning) {
      setIsLooping(true);
    }
  }, [spinning]);

  return (
    <ReelWrapper>
      <ReelContainer as={animated.div} style={{ transform: y.to((y) => `translateY(${y}px)`) }}>
      
        {Array(10)
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

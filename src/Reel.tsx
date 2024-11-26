import styled from 'styled-components';
import { useSpring, animated, } from '@react-spring/web';
interface ReelProps {
    targetSymbol: string;
    spinning: boolean;
    delay: number;
  }
  
  const Reel = ({ targetSymbol, spinning, delay,  }: ReelProps) => {
    const symbols: string[] = ['🍒', '🍉', ];
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
  
  export default Reel;
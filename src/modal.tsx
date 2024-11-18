import React from 'react';
import Modal from 'react-modal';


interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  showSymbols?: string;
  timer?: number;
  total?: number;
  showTimer?: number;

}

const customStyles = {
  content: {
    width: '300px',
    height: '200px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
};

const today = new Date();
const day = today.getDate();
const month = today.toLocaleString('default', { month: 'long' });
const year = today.getFullYear();

const formattedDate = `${day}.${month}.${year}`;
console.log(formattedDate);

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  showSymbols,
  timer,
  total,
  showTimer
}) => {
  return (
    <Modal
      isOpen={isOpen}
      // onRequestClose={onRequestClose}
      style={customStyles}
      contentLabel="Slot Machine Modal"
    >
      <div>
        <h2 className='Date'>{formattedDate}</h2>
        {showSymbols ?
          <div>
            <h3 className='timer'>The 616 Game Result</h3>

            <p className='showSymbols'>
              {showSymbols}{showSymbols === '🍒' ? "Cherry" : "Watermalon"}
              {/* {showTimer} */}
            </p>
          </div>
          :
          <div>
            <h2 className='timer'><span>{timer}</span> Seconds</h2>
            <h3 className='timer'><span>The 669 Game begins</span></h3>

            
            <p className='total'>Total is {total}</p>
          </div>
        }
      </div>
    </Modal>
  );
};

export default CustomModal;

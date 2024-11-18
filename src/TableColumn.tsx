import React from "react";

interface TableColumnsProps {
  data: (number | string)[]; 
  currentData: string[];
  currentPage: number;
  totalPages: number;
  totalCount: number;  
  handlePrevious: () => void;
  handleNext: () => void;
}

const TableColumns: React.FC<TableColumnsProps> = ({ data, currentData,currentPage,
  totalPages,
  totalCount,
  handlePrevious,
  handleNext, }) => {
  

  return (
    <div>
        <div className="paginationBox">
          <button className="paginationButton1" onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          
          <button className="paginationButton2" onClick={handleNext} disabled={currentPage === totalPages || totalPages===0}>
            Next
          </button>
        </div>
        {data.map((value,index) => (
          <div key={index} style={{display:'block',float:'left',width:'10%'}}>
            <div className='tablecol' style={{
                borderLeft: '1px solid #000',
                borderTop: '1px solid #000',
                borderBottom: '1px solid #000',
                borderRight: value === 10 ? '1px solid #000' : '1px solid #fff'
            }}>
              <div style={{borderBottom:'1px solid #000',height:50}}>{currentData[index] ? <h3 className="fontCB">{totalCount+index+1}</h3> : <h3 className="fontCB">-</h3>} </div>
              <div style={{height:70}}>
                <p className="fontCR">{currentData[index] ? <h3 className="fontCB">{currentData[index]}</h3> : <h3 className="fontCB">-</h3>} </p>
                {currentData[index] ?
                  <p className="fontCR">{currentData[index]==='🍒' ?  <h3 className="fontCB">C</h3> : <h3 className="fontCB">W</h3>} </p>
                  :
                  null
                }
                
              </div>
            </div>
          </div>
        ))}
       </div>
  );
};

export default TableColumns;

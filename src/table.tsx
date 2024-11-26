
import React from "react";

interface TableProps {
  allList: string[];
}

const Table: React.FC<TableProps> = ({ allList }) => {
  
  const number = 56; 
  const array = Array.from({ length: number }, (_, i) => i);
  var Data=allList
  var skip=0
  const rows1: number = 7;
  
  if (number === allList.length) {
    Data = [];
  } else if (number < allList.length) {
    skip = allList.length - number;
    Data = allList.slice(-skip); 
  } else {
    Data = allList; 
  }

 

  const prepareTableData = (arr: number[], rows: number): number[][] => {
    const result: number[][] = Array.from({ length: rows }, () => []);
    arr.forEach((value, index) => {
      result[index % rows].push(value);
    });
    return result;
  };

  const tableData: number[][] = prepareTableData(array, rows1);



  return (
    <div className="table">
      {tableData.map((row, rowIndex) => (
        <div className="table-row" key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <div className="table-cell" key={`cell-${rowIndex}-${colIndex}`}>
              {Data[cell] ?
                <div style={{width:18,height:18,backgroundColor:Data[cell]==='🍒'? 'red':'green',margin:'0 auto',borderRadius:15}}>
                  <p className="symbolT">{Data[cell]==='🍒'? "C":"W"}</p>
                  <div>
                  </div>
                </div>
                :
                <p className="symbolT"></p>
              }         
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;

import React from "react";

interface TableProps {
  allList: string[];
  nestedArray:string[][]
}

const Table: React.FC<TableProps> = ({ allList,nestedArray }) => {
  const number = 133; 
  const array = Array.from({ length: number }, (_, i) => i + 1); 
  // const array: number[] = [0,1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,21,22,23,24,
  //   25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55
  // ];
  const rows1: number = 7;
  const Data=allList
  const nestedArrayAll= nestedArray

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
                {nestedArrayAll[colIndex] ?
                    <div>
                        {nestedArrayAll[colIndex][rowIndex] ? 
                          <div style={{width:15,height:15,backgroundColor:nestedArrayAll[colIndex][rowIndex]==='🍒'? 'red':'green',margin:'0 auto',borderRadius:15}}></div>
                          :
                          null
                        }
                    </div>
                    :
                    null
                }           
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;

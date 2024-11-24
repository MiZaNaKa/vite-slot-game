import React from "react";

interface TableProps {
  nestedArray: string[][];
}

const Table: React.FC<TableProps> = ({ nestedArray }) => {
  const number = 390; 
  const rows = 15;
  const columns = Math.ceil(number / rows); 
  const array = Array.from({ length: number }, (_, i) => i + 1); 

  const prepareTableData = (arr: number[], rows: number): number[][] => {
    const result: number[][] = Array.from({ length: rows }, () => []);
    arr.forEach((value, index) => {
      result[index % rows].push(value);
    });
    return result;
  };

  const tableData: number[][] = prepareTableData(array, rows);

 
  let adjustedNestedArray: string[][] = [];
  if (nestedArray.length >= columns) {
    adjustedNestedArray = nestedArray.slice(-columns); 
  } else {
    adjustedNestedArray = nestedArray; 
  }

  return (
    <div className="table">
      {tableData.map((row, rowIndex) => (
        <div className="table-row" key={`row-${rowIndex}`}>
          {row.map((cell, colIndex) => (
            <div className="table-cell2" key={cell}>
              {adjustedNestedArray[colIndex] && adjustedNestedArray[colIndex][rowIndex] ? (
                <div
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor:
                    adjustedNestedArray[colIndex][rowIndex] === "🍒" ? "red" : "green",
                    margin: "0 auto",
                    borderRadius: "50%",
                  }}
                >
                  {/* <p className="symbolT">{colIndex}</p>
                  <div>
                    <p className="symbolT">{adjustedNestedArray[colIndex][rowIndex]}</p>
                  </div> */}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;

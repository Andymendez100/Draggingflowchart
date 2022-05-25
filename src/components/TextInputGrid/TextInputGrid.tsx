import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from "@mui/material";
import "./TextInputGrid.css";

interface Col {
  field: string;
  headerName: string;
}

interface BacRow {
  taskWp: string;
  workPackage: string;
  budgetHours: number;
  budgetDollars: number;
  baselineStart: string;
  baselineFinish: string;
  march: number;
  april: number;
  may: number;
  june: number;
  july: number;
  aug: number;
  sep: number;
  oct: number;
  nov: number;
  dec: number;
  jan: number;
  feb: number;
  BAC: number | string;
}

// Used for simple month checks - based on formatting in data.json
const months = [
  "march",
  "april",
  "may",
  "june",
  "july",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
  "jan",
  "feb",
];

// Create our number formatter.
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const convertToCamelCase = (word: string) => {
  return word
    .trim()
    .toLowerCase()
    .replace(/([^A-Z0-9]+)(.)/gi, function () {
      return arguments[2].toUpperCase();
    });
};

const isMonth = (month: string) => months.includes(month.toLowerCase());

const TextInputGrid: React.FC<{ data: any; setCost: number }> = ({
  data,
  setCost,
}) => {
  const [tableData, setTableData] = useState(data.data);
  const [bacTotals, setBacTotals] = useState(0);

  const columns: Col[] = Object.keys(tableData[0]).map((header) => {
    return {
      field: header,
      headerName: header,
    };
  });

  columns.push({
    field: "BAC",
    headerName: "BAC",
  });

  const rows = tableData.map((row: { [x: string]: number }) => {
    // filter all items that aren't months, map to those values and add all values together
    const bac = Object.keys(row)
      .filter((cell) => isMonth(cell))
      .map((cell) => row[cell])
      .reduce((a, b) => Number(a) + Number(b));

    return { ...row, BAC: bac };
  });

  useEffect(() => {
    setBacTotals(
      rows
        .map((row: { BAC: string }) => {
          if (row.BAC) return Number(row.BAC.replace(/[^0-9.-]+/g, ""));
        })
        .filter((b: number) => !isNaN(b))
        .reduce((a: number, b: number) => Number(a) + Number(b))
    );
  }, [rows]);

  rows.push({
    filler: "",
    total: formatter.format(bacTotals),
  });

  const generateTableHeaders = (col: Col[]) => {
    return col.map((header: Col) => {
      return (
        <TableCell
          key={header.field}
          className={
            isMonth(header.headerName)
              ? "top-border bottom-border"
              : "all-borders"
          }
        >
          {header.headerName}
        </TableCell>
      );
    });
  };

  // add editable feature only if under a month header/column
  const generateTableRows = (rows: readonly BacRow[]) => {
    // each cell
    const cellData = (items: BacRow) => {
      const keys = Object.keys(items);
      const parent = items[keys[0] as keyof BacRow];

      return keys.map((item) => {
        let attributes: any = [];

        if (isMonth(item)) {
          attributes.contentEditable = true;
          attributes.suppressContentEditableWarning = true;
          attributes["data-month"] = item;
          attributes["data-parent"] = parent;
          attributes.style = { ...attributes.style, textAlign: "right" };
        }

        // spacing for total BAC
        if (item === "filler") {
          attributes.colSpan = 18;
        }

        // format bac as us money
        if (item === "BAC") {
          // check exceeding set cost for each task/row
          if (items[item] >= setCost) attributes.style = { color: "red" };

          // align right
          attributes.style = { ...attributes.style, textAlign: "right" };

          // formatter
          items[item] = formatter.format(items[item] as number);
        }

        return (
          <TableCell
            key={item}
            {...attributes}
            className={`${
              isMonth(item) || item === "total" || item === "filler"
                ? ""
                : "side-borders"
            } ${item === "total" || item === "filler" ? "top-border" : ""}`}
          >
            {items[item as keyof BacRow]}
          </TableCell>
        );
      });
    };
    // each row
    return rows.map((row: BacRow, index: number) => {
      return (
        <TableRow key={index} data-row={index}>
          {cellData(row)}
        </TableRow>
      );
    });
  };

  // update cell
  const handleCellUpdate = (event: any) => {
    // return early if not a TD element
    if (event.target.tagName !== "TD") return;

    // prepare data
    const parentRow = event.target.parentNode.dataset.row;
    const month = event.target.dataset.month;
    const dataValue = event.target.innerText;

    // create copy of current state
    const data = [...tableData];

    // update with new value
    data[parentRow][month] = dataValue;

    // update state
    setTableData(data);
  };

  // update cell when enter pressed
  const handleEnterPressed = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleCellUpdate(event);
    }
  };

  // check input is valid TODO: update to use event keys
  const handleInput = (event: React.KeyboardEvent) => {
    let charToCheck = String.fromCharCode(event.keyCode);

    // numpad numbers
    if (event.keyCode >= 96 && event.keyCode <= 105) {
      charToCheck = String.fromCharCode(event.keyCode - 48);
    }

    // NaN, backspace, del, periods and arrow keys
    if (
      isNaN(Number(charToCheck)) &&
      event.keyCode !== 8 &&
      event.keyCode !== 46 &&
      event.keyCode !== 190 &&
      event.keyCode !== 110 &&
      event.keyCode !== 37 &&
      event.keyCode !== 38 &&
      event.keyCode !== 39 &&
      event.keyCode !== 40
    ) {
      event.preventDefault();
    }
  };

  return (
    <TableContainer className="text-grid-container">
      <Table
        sx={{ maxWidth: 1270, maxHeight: 696, backgroundColor: "#F5F5F5" }}
        size="small"
        onBlur={handleCellUpdate}
        onKeyUp={handleEnterPressed}
        onKeyDown={handleInput}
      >
        <TableHead>
          <TableRow>{generateTableHeaders(columns)}</TableRow>
        </TableHead>
        <TableBody>{generateTableRows(rows)}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default TextInputGrid;

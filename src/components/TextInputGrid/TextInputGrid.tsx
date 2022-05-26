import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';
import './TextInputGrid.css';
import TableData from './tableData.json';
import { Input } from '@mui/material';

// column-row : value
const tableAnswers = {};

// Create our number formatter.
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
});

const isEmpty = (object: any) => {
  for (const property in object) {
    return false;
  }
  return true;
};

const TextInputGrid: React.FC = React.memo(() => {
  const [bacTotals, setBacTotals] = useState('');

  const updateBAC = (rowNumber: number) => {
    // map throw row
    let totalValue = 0;
    Array.from(Array(23)).map((data, index) => {
      const columnToCheck = document.querySelector(
        `[data-row='${rowNumber}'] [data-column='${index}'] > input `
      ) as HTMLInputElement;
      if (columnToCheck.value !== '') {
        const deformattedValue = columnToCheck.value
          .replace('$', '')
          .replaceAll(',', '');

        totalValue += parseInt(deformattedValue);
      }
    });

    const rowBac = document.querySelector(
      `[data-row='${rowNumber}'] [data-column='${23}'] > input `
    ) as HTMLInputElement;
    const updatedValue = formatter.format(totalValue);
    rowBac.value = updatedValue;
    updateTotalBAC();
  };

  const updateTotalBAC = () => {
    // map throw row
    let totalValue = 0;
    Array.from(Array(26)).map((data, index) => {
      const columnToCheck = document.querySelector(
        `[data-row='${index}'] [data-column='${23}'] > input `
      ) as HTMLInputElement;
      if (columnToCheck !== null && columnToCheck.value !== '') {
        const deformattedValue = columnToCheck.value
          .replace('$', '')
          .replaceAll(',', '');
        totalValue += parseInt(deformattedValue);
      }
    });
    console.log(totalValue);
    // BAC NUMBER HERE
    const updatedValue = formatter.format(totalValue);
    setBacTotals(updatedValue);
  };

  // // check input is valid TODO: update to use event keys
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

  const getDescription = (descriptionObject: any) => {
    if (isEmpty(descriptionObject)) return;
    return Object.keys(descriptionObject).map(function (key) {
      return (
        <>
          <p>
            {key}: {descriptionObject[key]}
          </p>
          <br />
        </>
      );
    });
  };

  const renderRows = () => {
    return TableData.data.map((row: any, i: number) => {
      if (row.fillerRow) {
        return (
          <TableRow key={i}>
            <TableCell className='side-borders'>{row['tasks/wp']}</TableCell>
            {Array.from(Array(30)).map(() => {
              return <TableCell className='side-borders stripes' />;
            })}
          </TableRow>
        );
      }
      return (
        <TableRow data-row={i} key={i}>
          <TableCell className='side-borders'>{row['tasks/wp']}</TableCell>
          <TableCell className='side-borders'>{row.budgetHours}</TableCell>
          <TableCell className='side-borders'>{row.budgetDollars}</TableCell>
          <TableCell className='side-borders'>{row.evt}</TableCell>
          <TableCell className='side-borders'>
            {getDescription(row.description)}
          </TableCell>
          <TableCell className='side-borders'>
            <TableCell>{row.baselineStartMonth}</TableCell>
            <TableCell>{row.baselineStartYear}</TableCell>
          </TableCell>
          <TableCell className='side-borders'>
            <TableCell>{row.baselineFinishMonth}</TableCell>
            <TableCell>{row.baselineFinishYear}</TableCell>
          </TableCell>
          {Array.from(Array(23)).map((data, index) => {
            return (
              <TableCell sx={{ minWidth: 50 }}>
                <Input
                  data-column={index}
                  type='text'
                  onFocus={(event) => {
                    if (event.target.value !== '') {
                      const deformattedValue = event.target.value
                        .replace('$', '')
                        .replaceAll(',', '');
                      event.target.value = deformattedValue;
                    }
                  }}
                  onBlur={(event) => {
                    if (event.target.value !== '') {
                      updateBAC(i);
                      const updatedValue = formatter.format(
                        parseInt(event.target.value)
                      );
                      event.target.value = updatedValue;
                    }
                  }}
                  onKeyDown={handleInput}
                />
              </TableCell>
            );
          })}
          <TableCell>
            <Input data-column={23} type='text' fullWidth disabled />
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <>
      <TableContainer className='text-grid-container' sx={{ maxHeight: 630 }}>
        <Table sx={{ backgroundColor: '#F5F5F5' }} stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' />
              <TableCell className='all-borders' align='center' colSpan={7}>
                Year 1
              </TableCell>
              <TableCell className='all-borders' align='center' colSpan={12}>
                Year 2
              </TableCell>
              <TableCell className='all-borders' align='center' colSpan={4}>
                Year 3
              </TableCell>
              <TableCell className='all-borders' />
            </TableRow>
            <TableRow>
              <TableCell className='all-borders' sx={{ minWidth: 300 }}>
                Task/WP
              </TableCell>
              <TableCell className='all-borders'>Budget Hours</TableCell>
              <TableCell className='all-borders'>Budget Dollars</TableCell>
              <TableCell className='all-borders' sx={{ minWidth: 100 }}>
                EVT
              </TableCell>
              <TableCell className='all-borders' sx={{ minWidth: 350 }}>
                Milestone Description
              </TableCell>
              <TableCell className='all-borders'>Baseline Start</TableCell>
              <TableCell className='all-borders'>BaseLine Finish</TableCell>
              <TableCell className='all-borders' sx={{ minWidth: 70 }}>
                June
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                July
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Aug.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Sept.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Oct.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Nov.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Dec.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Jan.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Feb.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Mar.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Apr.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                May
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                June
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                July
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Aug.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Sept.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Oct.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Nov.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Dec.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Jan.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Feb.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Mar.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                Apr.
              </TableCell>
              <TableCell
                className='all-borders'
                align='center'
                sx={{ minWidth: 70 }}
              >
                BAC
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </Table>
      </TableContainer>
      {/* <button
        type='button'
        onClick={() => {


        }}
      >
        Submit
      </button> */}
      Bac: {bacTotals}
    </>
  );
});

export default TextInputGrid;

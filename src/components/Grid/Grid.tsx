import React, { useState } from 'react';
import Xarrow, { Xwrapper } from 'react-xarrows';
// Allowed means cards it can connect to

import GridCards from './gridData.json';
import DraggableCard from './DraggableCard';
import './Grid.css';

const Grid: React.FC = () => {
  const [currentArrow, setCurrentArrow] = useState({
    start: '',
    end: '',
    allowed: '',
  });
  const [arrows, setArrows] = useState<
    { start: string; end: string; allowed: string; color?: string }[]
  >([]);
  let gridHeight = 5;
  let gridWidth = 14;

  const buildGrid = (width: number, height: number): any => {
    return Array.from(Array(height)).map((row: any, index: number) => {
      return (
        <tr data-row={index + 1} key={index}>
          {Array.from(Array(width)).map((column: any, index: number) => {
            return <td data-column={index + 1} key={index}></td>;
          })}
        </tr>
      );
    });
  };

  const handleConnection = (event: any) => {
    const currentTarget = event.target.parentNode.id;
    const remove: number[] = [];
    const disconnect = arrows.filter((arrow, index) => {
      const condition =
        (arrow.start === currentArrow.start && arrow.end === currentTarget) ||
        (arrow.start === currentTarget && arrow.end === currentArrow.start);

      if (condition) {
        remove.push(index);
      }
      return condition;
    });

    // if current drawn arrow is waiting for second point
    if (
      currentArrow.start !== '' &&
      currentArrow.start !== currentTarget &&
      disconnect.length === 0
    ) {
      setArrows(
        arrows.concat([
          {
            start: currentArrow.start,
            end: currentTarget,
            allowed: currentArrow.allowed,
          },
        ])
      );
      setCurrentArrow({ start: '', end: '', allowed: '' });
    }
    // check if this exists in state
    else if (disconnect.length !== 0) {
      // WIP
      setArrows(arrows.filter((arrow, index) => !remove.includes(index)));
      setCurrentArrow({ start: '', end: '', allowed: '' });
    } else {
      setCurrentArrow({
        ...currentArrow,
        start: currentTarget,
        allowed: event.target.parentNode.dataset.allowed,
      });
    }
  };

  const checkGrid = () => {
    return setArrows(
      arrows.map((lines) => {
        const search = lines.end.replace('draggableCard', '');
        if (lines.allowed.split(',').includes(search)) {
          // correct
          return { ...lines, color: 'green' };
        }
        return { ...lines, color: 'red' };
      })
    );
  };

  const buildCardRows = (data: any) => {
    const rowLength = 11;
    let row: any[] = [];
    let rows: any = [];

    // build the row up to rowLength
    GridCards.data.forEach((card: any, index: any) => {
      if (row.length < rowLength) {
        row.push(
          <DraggableCard
            id={`draggableCard${card.id}`}
            cardData={card}
            key={index}
            handleConnection={handleConnection}
          />
        );
      }

      if (row.length === rowLength || index + 1 === GridCards.data.length) {
        rows.push(
          <div className='card-row' key={rows.length}>
            {row}
          </div>
        );
        row = [];
      }
    });

    return rows;
  };

  const renderCardRows = (rows: any) => {
    return rows.map((card: any) => card);
  };

  return (
    <div>
      <Xwrapper>
        {/* render arrows here */}
        {arrows.map((arrow) => (
          <Xarrow
            {...arrow}
            lineColor={arrow.color ? arrow.color : '#3568c1'}
            headColor={arrow.color ? arrow.color : '#3568c1'}
            path='smooth'
            // gridBreak="110px"
            strokeWidth={2}
          />
        ))}
        <div id='card-container'>
          {renderCardRows(buildCardRows(GridCards))}
        </div>
        {/* 5x14 */}
        <div id='grid-container'>
          <table id='grid'>
            <tbody>{buildGrid(gridWidth, gridHeight)}</tbody>
          </table>
        </div>
      </Xwrapper>
      <button
        type='button'
        onClick={() => {
          checkGrid();
        }}
      >
        SUBMIT
      </button>
    </div>
  );
};

export default Grid;

import React, { useState } from 'react';
import Xarrow, { anchorType, Xwrapper } from 'react-xarrows';
// Allowed means cards it can connect to

import GridCards from './gridData.json';
import DraggableCard from './DraggableCard';
import './Grid.css';

const Grid: React.FC = () => {
  const rowSwimLanes = [
    'Telescope Assy Sell-Off',
    'Telescope Assy Procurement',
    'Telescope Assy I&T',
    'Telescope Receivers',
    'Telescope Assy Design',
  ];
  const [currentArrow, setCurrentArrow] = useState({
    start: '',
    end: '',
    allowed: '',
    endAnchor: '',
    startAnchor: '',
  });
  const [arrows, setArrows] = useState<
    {
      start: string;
      end: string;
      allowed: string;
      color?: string;
      endAnchor: string;
      startAnchor: string;
    }[]
  >([]);
  let gridHeight = 7;
  let gridWidth = 14;

  const buildGrid = (width: number, height: number): any => {
    return Array.from(Array(height)).map((row: any, rowindex: number) => {
      if (rowindex < 1) {
        return (
          <tr data-row={rowindex + 1} key={rowindex} className='draggable-row'>
            {GridCards.data.map((card, cardindex) => {
              if (cardindex < 12) {
                return (
                  <td
                    data-column={cardindex}
                    key={cardindex}
                    // id='swim-lane-box'
                    className='draggableBox'
                  >
                    <DraggableCard
                      id={`draggableCard${card.id}`}
                      cardData={card}
                      key={cardindex}
                      handleConnection={handleConnection}
                    />
                  </td>
                );
              }
              return null;
            })}
          </tr>
        );
      } else if (rowindex === 1) {
        return (
          <tr data-row={rowindex + 1} key={rowindex} className='draggable-row'>
            {GridCards.data.map((card, cardindex) => {
              if (cardindex > 11) {
                return (
                  <td
                    data-column={cardindex}
                    key={cardindex}
                    className='draggableBox'
                    // id='swim-lane-box'
                  >
                    <DraggableCard
                      id={`draggableCard${card.id}`}
                      cardData={card}
                      key={cardindex}
                      handleConnection={handleConnection}
                    />
                  </td>
                );
              }
              return null;
            })}
          </tr>
        );
      }
      return (
        <tr data-row={rowindex + 1} key={rowindex}>
          {Array.from(Array(width)).map((column: any, index: number) => {
            if (index === 0 && rowindex > 1) {
              return (
                <td data-column={index} key={index} id='swim-lane-box'>
                  <span id='swim-lanes'>{rowSwimLanes[rowindex - 2]}</span>
                </td>
              );
            }
            return <td data-column={index + 1} key={index}></td>;
          })}
        </tr>
      );
    });
  };

  const handleConnection = (event: any) => {
    const currentTarget = event.target.parentNode.id;
    const indexData = currentTarget.split('draggableCard')[1] - 1;
    console.log('currentTarget', indexData);
    console.log('GridCards', GridCards.data[indexData].startAnchor);
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
      console.log('endAnchor', GridCards.data[indexData]);
      setArrows(
        arrows.concat([
          {
            ...currentArrow,
            start: currentArrow.start,
            end: currentTarget,
            allowed: currentArrow.allowed,

            endAnchor: GridCards.data[indexData].endAnchor,
          },
        ])
      );
      setCurrentArrow({
        start: '',
        end: '',
        allowed: '',
        endAnchor: '',
        startAnchor: '',
      });
    }
    // check if this exists in state
    else if (disconnect.length !== 0) {
      setArrows(arrows.filter((arrow, index) => !remove.includes(index)));
      setCurrentArrow({
        start: '',
        end: '',
        allowed: '',
        endAnchor: '',
        startAnchor: '',
      });
    } else {
      console.log(
        'test',
        GridCards.data[parseInt(currentTarget.split('draggableCard')[1] + 1)]
      );
      setCurrentArrow({
        ...currentArrow,
        start: currentTarget,
        allowed: event.target.parentNode.dataset.allowed,
        // endAnchor: '',
        startAnchor: GridCards.data[indexData].startAnchor,
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

  return (
    <>
      <Xwrapper>
        {/* render arrows here */}
        {arrows.map((arrow, index) => (
          <Xarrow
            key={index}
            {...arrow}
            lineColor={arrow.color ? arrow.color : '#3568c1'}
            headColor={arrow.color ? arrow.color : '#3568c1'}
            path='grid'
            endAnchor={arrow.endAnchor as anchorType}
            startAnchor={arrow.startAnchor as anchorType}
            // gridBreak='50px'
            // _cpx1Offset={-150}
            // _cpy1Offset={-36}
            // _cpx2Offset={150}
            // _cpy2Offset={-38}
            strokeWidth={2}
          />
        ))}
        {/* <div id='grid-heading'>Telescope Assembly Network Diagram</div> */}
        {/* <div id='card-container'>{renderCardRows(buildCardRows())}</div> */}
        {/* 5x14 */}
        <div id='grid-container'>
          <table id='grid'>
            <span id='swim-lane-background'></span>
            <caption id='grid-heading'>
              Telescope Assembly Network Diagram
            </caption>
            <tbody className='tablebody'>
              {buildGrid(gridWidth, gridHeight)}
            </tbody>
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
    </>
  );
};

export default Grid;

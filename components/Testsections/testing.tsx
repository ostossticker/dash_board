"use client"
import React from 'react';
import DynamicContainer from './Dynamic';

const TestComponent = () => {
  return (
    <div>
      <DynamicContainer
        elements={[
          {
            element: (
              <table>
                <thead>
                  <tr>
                    <th>Header 1</th>
                    <th>Header 2</th>
                    <th>Header 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 1</p>, fontSize: 20 }]} />
                    </td>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 2</p>, fontSize: 20 }]} />
                    </td>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 3</p>, fontSize: 20 }]} />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 4</p>, fontSize: 20,className:"text-red-400" }]} />
                    </td>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 5</p>, fontSize: 20 }]} />
                    </td>
                    <td>
                      <DynamicContainer elements={[{ element: <p>Cell 6</p>, fontSize: 20 }]} />
                    </td>
                  </tr>
                </tbody>
              </table>
            ),
            fontSize: 20,
            width: 400,
            height: 300,
            className: 'table-container',
          },
          {
            element: <p>Resizable Paragraph 2</p>,
            fontSize: 16,
            width: 820,
            className: 'text-blue-500',
          },
          {
            element: <button>Resizable Button 3</button>,
            fontSize: 14,
            width: 130,
            height: 400,
            className: 'bg-green-300',
          },
        ]}
      />
    </div>
  );
};

export default TestComponent;

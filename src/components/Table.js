import React from 'react';
import {Table, Thead, Tr, Th, Tbody, Td} from '@patternfly/react-table';
import global_BackgroundColor_150 from '@patternfly/react-tokens/dist/esm/global_BackgroundColor_150';
import './Table.css';

export const TableMisc = () => {
  const repositories = [
    { content: 'L1TXprocessing', value: ''}, 
    { content: 'ULSCHencoding', value: ''}, 
    { content: 'L1RXprocessing', value: ''}, 
    { content: 'RateUnmatch', value: ''}, 
    { content: 'LDPCDecode', value: ''}, 
    { content: 'PDSCHunscrambling', value: ''}, 
    { content: 'PDCCHhandling', value: ''},
  ];

  const columnNames = {
    content: 'Content',
    value: 'Value',
  };

  const columnWidths = {
    content: '50%',
    value: '50%',
  };

  return <Table aria-label="Misc table" className="pf-m-compact">
      <Thead noWrap>
        <Tr backgroundColor="#a9a9a9">
          <Th  style={{ width: columnWidths.content }} className="title-row-class">{columnNames.content}</Th>
          <Th  style={{ width: columnWidths.value }} className="title-row-class">{columnNames.value}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {repositories.map((repo, rowIndex) => {
    const isOddRow = (rowIndex + 1) % 2;
    // const customStyle = {
    //   backgroundColor: global_BackgroundColor_150.var
    // };
    const rowClass = isOddRow ? 'odd-row-class' : 'even-row-class';
    // const contentColSpan = repo.branches === null && repo.prs === null ? 3 : 1;
    return <Tr key={repo.content} className={rowClass}>
              <Td dataLabel={columnNames.content} colSpan={1}>
                {repo.content}
              </Td>
              <Td dataLabel={columnNames.value} textCenter>{repo.value}</Td>
            </Tr>;
  })}
      </Tbody>
    </Table>;
};

export default TableMisc;
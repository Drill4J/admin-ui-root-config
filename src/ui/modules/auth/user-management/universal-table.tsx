import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import axios from 'axios'
import { runCatching } from '../util';
import { useApiData } from '../hooks/use-api-data';

async function getReport(): Promise<any> {
  const response = await runCatching<any>(axios.get(`/get-report`, {
    params: {
      newInstanceId: '8ab0bf7a-4e8e-42ab-9013-e1ca60319d9e',
      oldInstanceId: '7f553ee8-0842-44c8-b488-7a80cff763e5'
    }
  }));
  return response.data;
}

const getDataHook = () => useApiData(() => getReport());

const ApiTable: React.FC = () => {
  const { data, isLoading } = getDataHook()
  const [selectedRowId, setSelectedRowId] = useState<string | number | null>(null);

  if (!data  || Array.isArray(data) && (data.length == 0)) {
    return <div>no data</div>
  }
  
  const handleNavigateClick = (rowId: string | number) => {
    setSelectedRowId(rowId);
  };
 
  const columns = [
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: any) => (
        <Button onClick={() => handleNavigateClick(record.id)}>Navigate</Button>
      ),
    },
    ...Object.keys(data[0]).map(key => ({
      title: key,
      dataIndex: key,
      key: key,
      className: 'whitespace-nowrap',
      sorter: {
        compare: (a: any, b: any) => {
          if (!isNaN(a[key]) && !isNaN(b[key])) {
            // Numeric comparison
            return a[key] - b[key];
          } else {
            // Locale comparison for strings
            return (a[key] || '').localeCompare(b[key] || '');
          }
        },
        multiple: 0
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder={`Search ${key}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys((e.target as HTMLInputElement).value ? [(e.target as HTMLInputElement).value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined rev={undefined} />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters();
                setSelectedKeys([]);
                confirm();
              }}
              size="small"
              style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        return record[key] && record[key].toString().toLowerCase().includes(value.toLowerCase())
      },
    }))
  ];

  return <>
    <p>Selected Row ID: {selectedRowId}</p>
    <Table
      dataSource={data}
      columns={columns}
      scroll={{ x: true }}
      rowKey="id"
      // TODO add sticky-header with automatic scroll-x fix https://github.com/ant-design/ant-design/issues/15794#issuecomment-768782351
    />
  </>
};

export default ApiTable;

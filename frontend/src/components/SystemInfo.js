import React from 'react';
import { Card, Row, Col, Typography, Progress, message } from 'antd';

const { Text } = Typography;

const SystemInfo = ({ systemInfo, selectedDevices, setSelectedDevices }) => {
  
  const handleCardClick = (device) => {
    let newSelectedDevices = [...selectedDevices];

    if (device === 'cpu') {
      if (newSelectedDevices.includes('cpu')) {
        newSelectedDevices = newSelectedDevices.filter(d => d !== 'cpu');
      } else {
        if (newSelectedDevices.length > 0) {
          message.error('CPU and GPU cannot be selected at the same time');
          return;
        }
        newSelectedDevices.push('cpu');
      }
    } else {
      if (newSelectedDevices.includes(device.id)) {
        newSelectedDevices = newSelectedDevices.filter(d => d !== device.id);
      } else {
        if (newSelectedDevices.includes('cpu')) {
          message.error('CPU and GPU cannot be selected at the same time');
          return;
        }
        newSelectedDevices.push(device.id);
      }
    }

    setSelectedDevices(newSelectedDevices);
  };

  return (
    <Card title="System Info - Please Click to Select Devices" style={{ marginBottom: '20px' }}>
      {systemInfo ? (
        <Row gutter={16}>
          <Col span={24}>
            <Row gutter={16}>
              <Col span={6} onClick={() => handleCardClick('cpu')}>
                <Card 
                  type="inner" 
                  title="CPU" 
                  style={{ minHeight: '220px', cursor: 'pointer', backgroundColor: selectedDevices.includes('cpu') ? '#e6f7ff' : 'white' }}>
                  <Text>Physical Cores: {systemInfo.cpu.physical_cores}</Text><br />
                  <Text>Total Cores: {systemInfo.cpu.total_cores}</Text>
                </Card>
              </Col>
              {systemInfo.gpus.map((gpu, index) => (
                <Col span={6} key={index} onClick={() => handleCardClick(gpu)} style={{ cursor: 'pointer' }}>
                  <Card 
                    type="inner" 
                    title={`GPU ${gpu.id}`} 
                    style={{ minHeight: '220px', cursor: 'pointer', backgroundColor: selectedDevices.includes(gpu.id) ? '#e6f7ff' : 'white' }}>
                    <Text>Name: {gpu.name}</Text><br />
                    <Text>Load:</Text>
                    <Progress percent={Math.round(gpu.load)} status="active" /><br />
                    <Text>Memory Used:</Text>
                    <Progress percent={Math.round((gpu.memory_used / gpu.memory_total) * 100)} status="active" /><br />
                    <Text>Temperature: {gpu.temperature} °C</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      ) : (
        <Text>No system info available. Click "Get System Info" to load.</Text>
      )}
    </Card>
  );
};

export default SystemInfo;

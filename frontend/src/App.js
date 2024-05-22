import React, { useState, useEffect } from 'react';
import { Button, message, Layout, Row, Col, Card, Typography, Progress } from 'antd';
import { downloadDataset, trainYoloV8, trainYoloV9, evaluateYoloV8, evaluateYoloV9, evaluateYoloV8Best, evaluateYoloV9Best, getSystemInfo } from './services/ApiService';
import SystemInfo from './components/SystemInfo';
import './App.css';
import io from 'socket.io-client';

const { Title } = Typography;
const { Header, Content } = Layout;

function App() {
  const [systemInfo, setSystemInfo] = useState(null);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleGetSystemInfo();
    }, 1000);

    // Setup WebSocket connection
    const socket = io('http://localhost:5000');

    socket.on('log', (data) => {
      setLog((prevLog) => [...prevLog, data.data]);
    });

    socket.on('progress', (data) => {
      setProgress(data.progress);
    });

    // Cleanup the interval and WebSocket on component unmount
    return () => {
      clearInterval(interval);
      socket.disconnect();
    };
  }, []);

  const handleDownloadDataset = async () => {
    try {
      const result = await downloadDataset();
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleTrainYoloV8 = async () => {
    try {
      const batch = selectedDevices.length > 1 ? 16 : -1;
      const result = await trainYoloV8({ devices: selectedDevices, batch });
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleTrainYoloV9 = async () => {
    try {
      const batch = selectedDevices.length > 1 ? 16 : -1;
      const result = await trainYoloV9({ devices: selectedDevices, batch });
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEvaluateYoloV8 = async () => {
    try {
      const result = await evaluateYoloV8(selectedDevices);
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEvaluateYoloV9 = async () => {
    try {
      const result = await evaluateYoloV9(selectedDevices);
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEvaluateYoloV8Best = async () => {
    try {
      const result = await evaluateYoloV8Best(selectedDevices);
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleEvaluateYoloV9Best = async () => {
    try {
      const result = await evaluateYoloV9Best(selectedDevices);
      message.success(result);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleGetSystemInfo = async () => {
    try {
      const info = await getSystemInfo();
      setSystemInfo(info);
    } catch (error) {
      message.error(error.message);
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <Title level={2} style={{ color: 'white', textAlign: 'center' }}>YOLO Training GUI</Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <Row gutter={16} style={{ marginBottom: '20px' }}>
          <Col span={12}>
            <Button type="primary" block onClick={handleDownloadDataset}>Download Dataset</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={handleGetSystemInfo}>Get System Info</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Button type="primary" block onClick={handleTrainYoloV8}>Train YOLO v8</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={handleTrainYoloV9}>Train YOLO v9</Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Button type="primary" block onClick={handleEvaluateYoloV8}>Evaluate YOLO v8</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={handleEvaluateYoloV9}>Evaluate YOLO v9</Button>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: '20px' }}>
          <Col span={12}>
            <Button type="primary" block onClick={handleEvaluateYoloV8Best}>Evaluate YOLO v8 Best</Button>
          </Col>
          <Col span={12}>
            <Button type="primary" block onClick={handleEvaluateYoloV9Best}>Evaluate YOLO v9 Best</Button>
          </Col>
        </Row>

        <SystemInfo systemInfo={systemInfo} selectedDevices={selectedDevices} setSelectedDevices={setSelectedDevices} />

        <Card title="Training Logs" style={{ marginTop: '20px' }}>
          <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
            {log.map((entry, index) => (
              <div key={index}>{entry}</div>
            ))}
          </div>
        </Card>
        <Progress percent={progress} status="active" />
      </Content>
    </Layout>
  );
}

export default App;

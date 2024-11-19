import React from 'react';
import { Layout, Typography } from 'antd';
import TablaEmbarcacion from '../components/TablaEmbarcacion';
import '../index.css';

const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const Index: React.FC = () => {
  return (
    <Layout className="app-container">
      <Header>
        <Title level={1} style={{ color: 'white' }}>Aplicación de Embarcaciones</Title>
      </Header>
      <Content style={{ padding: '20px' }}>
        <TablaEmbarcacion />
      </Content>
      <Footer>
        <p>Gracias por todo Copilot</p>
      </Footer>
    </Layout>
  );
};

export default Index;
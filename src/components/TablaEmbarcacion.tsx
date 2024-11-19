import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Form, DatePicker, Modal, Space } from 'antd';
import axiosInstance from '../config/axios';
import moment from 'moment';

interface Embarcacion {
  id: number;
  nombre: string;
  capacidad: number;
  descripcion: string;
  fechaProgramada: string;
}

const TablaEmbarcacion: React.FC = () => {
  const [embarcaciones, setEmbarcaciones] = useState<Embarcacion[]>([]);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axiosInstance.get('/api/embarcaciones')
      .then(response => {
        setEmbarcaciones(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddEmbarcacion = (values: Omit<Embarcacion, 'id'>) => {
    const newEmbarcacion = { 
      ...values, 
      fechaProgramada: values.fechaProgramada.format('YYYY-MM-DD') 
    };
    
    axiosInstance.post('/api/embarcaciones', newEmbarcacion)
      .then(response => {
        setEmbarcaciones([...embarcaciones, response.data]);
        form.resetFields();
        setIsModalOpen(false);
      })
      .catch(error => {
        console.error('Error adding embarcacion:', error);
      });
  };

  const handleEditEmbarcacion = (id: number) => {
    const embarcacion = embarcaciones.find(e => e.id === id);
    if (embarcacion) {
      form.setFieldsValue({
        ...embarcacion,
        fechaProgramada: moment(embarcacion.fechaProgramada)
      });
      setEditingId(id);
      setIsModalOpen(true);
    }
  };

  const handleUpdateEmbarcacion = (values: Omit<Embarcacion, 'id'>) => {
    if (!editingId) return;

    const updatedEmbarcacion = {
      ...values,
      id: editingId,
      fechaProgramada: values.fechaProgramada.format('YYYY-MM-DD')
    };

    axiosInstance.put(`/api/embarcaciones/${editingId}`, updatedEmbarcacion)
      .then(response => {
        setEmbarcaciones(embarcaciones.map(emb => 
          emb.id === editingId ? response.data : emb
        ));
        setEditingId(null);
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch(error => {
        console.error('Error updating embarcacion:', error);
      });
  };

  const handleDeleteEmbarcacion = (id: number) => {
    Modal.confirm({
      title: '¿Está seguro de eliminar esta embarcación?',
      content: 'Esta acción no se puede deshacer',
      okText: 'Sí',
      cancelText: 'No',
      onOk() {
        axiosInstance.delete(`/api/embarcaciones/${id}`)
          .then(() => {
            setEmbarcaciones(embarcaciones.filter(emb => emb.id !== id));
          })
          .catch(error => {
            console.error('Error deleting embarcacion:', error);
          });
      }
    });
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Nombre', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Capacidad', dataIndex: 'capacidad', key: 'capacidad' },
    { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
    { title: 'Fecha Programada', dataIndex: 'fechaProgramada', key: 'fechaProgramada' },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Embarcacion) => (
        <Space>
          <Button onClick={() => handleEditEmbarcacion(record.id)} type="primary">
            Editar
          </Button>
          <Button onClick={() => handleDeleteEmbarcacion(record.id)} type="primary" danger>
            Eliminar
          </Button>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Añadir Embarcación
      </Button>
      <Modal
        title={editingId ? 'Editar Embarcación' : 'Añadir Embarcación'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form 
          form={form}
          onFinish={editingId ? handleUpdateEmbarcacion : handleAddEmbarcacion}
        >
          <Form.Item name="nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre' }]}>
            <Input placeholder="Nombre" />
          </Form.Item>
          <Form.Item name="capacidad" rules={[{ required: true, message: 'Por favor ingrese la capacidad' }]}>
            <Input placeholder="Capacidad" type="number" />
          </Form.Item>
          <Form.Item name="descripcion" rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}>
            <Input placeholder="Descripción" />
          </Form.Item>
          <Form.Item name="fechaProgramada" rules={[{ required: true, message: 'Por favor ingrese la fecha programada' }]}>
            <DatePicker placeholder="Fecha Programada" format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? 'Actualizar' : 'Añadir'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table dataSource={embarcaciones} columns={columns} rowKey="id" />
    </div>
  );
};

export default TablaEmbarcacion;
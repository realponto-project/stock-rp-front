import React, { useState } from 'react';
import { 
  Button,
  Form,
  Input,
  Select 
} from 'antd';

import styles from './style.module.css';

const { Option } = Select;

const ManageProducts = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onSearch = (val) => {
    console.log('search:', val);
  };
  
  const showSearch = () => {
    setVisible(!visible);
  };

  return (
    <div>
      <h1>Gerenciar produtos</h1>
      {visible ? (
        <div>
          <Button 
            type="primary" 
            onClick={showSearch}
          >
            Ocultar
          </Button>
          <div className={styles.divSearch}>
            <Form form={form} layout="vertical">
              <Form.Item label="SKU:" name="sku">
                <Input placeholder="Digite o SKU" />
              </Form.Item>
              <Form.Item label="Produto:" name="productName">
                <Input placeholder="Digite o produto" />
              </Form.Item>
              <Form.Item label="Categoria:" name="category">
                <Select
                  showSearch
                  placeholder="Selecione a categoria"
                  optionFilterProp="children"
                  onSearch={onSearch}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  <Option value="TODOS">TODOS</Option>
                  <Option value="PECA">PEÇA</Option>
                  <Option value="EQUIPAMENTO">EQUIPAMENTO</Option>
                  <Option value="OUTROS">OUTROS</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Marca:" name="mark">
                <Input placeholder="Digite a marca" />
              </Form.Item>
              <Form.Item label="Tipo:" name="type">
                <Input placeholder="Digite o tipo" />
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <Button 
          htmlType="submit"
          onClick={showSearch} 
          type="primary" 
          >
            Avançado
        </Button>
      )}
    </div>
  );
};

export default ManageProducts;
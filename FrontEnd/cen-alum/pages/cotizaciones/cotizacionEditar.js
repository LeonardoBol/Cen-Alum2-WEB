import { useState, useEffect } from 'react';
import data from '../../data/data.json';
import indice from '../../data/indice.json'
import styles from '../../styles/Home.module.css';
import ClientForm from '../../components/cotizacion Editar/clientForm';
import ShowDate from '../../components/cotizacion Editar/showDate';
import MaterialsForm from '../../components/cotizacion Editar/materialsForm';
import ObservationForm from '../../components/cotizacion Editar/observacionForm';
import TotalDisplay from '../../components/cotizacion/crear/totalDisplay';
import { Button, Tooltip, notification, Modal, Space } from 'antd';
import { SaveOutlined, WarningTwoTone } from '@ant-design/icons';
import Link from 'next/link';
let cotizacion = {
  No: "",
  Fecha: "",
  cliente: {
    name: "",
    id: "",
    address: "",
    phoneNumb: "",
    email: ""
  },
  productos: [],
  observacion: "",
  total: 0
}

function Cotizacion() {
  const validar = () => {
    if (data.cotizaciones[parseInt(indice.indice) - 1] === undefined)
      return cotizacion
    else return cotizacion = data.cotizaciones[parseInt(indice.indice) - 1]
  }
  validar();

  const [total, setTotal] = useState(0);
  const [client, setClient] = useState(cotizacion.cliente);
  const [materials, setMaterials] = useState([]);
  const [observation, setObservation] = useState(cotizacion.observacion);
  const [allOk, setAllOk] = useState('');
  const [visible, setVisible] = useState(false);

  //------------------------Data confirmation---------------------------------------
  const correctClient = () => {
    if (client.name == '' || client.name === undefined || client.id == '' || client.id === undefined) {
      return false;
    }
    else { return true }
  }
  const openNotificationWithIcon = (status, title, description) => {
    notification[status]({
      message: title,
      description:
        description,
    });
  };

  //--------------------------------------------------------------------------------

  const handleClientForm = e => {
    setClient(e);
  }

  const handleMaterialForm = e => {
    setMaterials(e);
  }

  const handleObservationForm = e => {
    setObservation(e);
  }
  const handleTotal = e => {
    setTotal(e);
  }
  const clientFields = e => {
    setAllOk('');
  }
  const onClick = e => {
    if (correctClient() || total != 0) {
      if (correctClient()) {
        if (total != 0) {
          setVisible(true);
        } else {
          openNotificationWithIcon('error', 'Lista de productos vacía',
            'Por favor agregue un producto a cotizar para que sea posible guardar la cotización.');
        }

      } else {
        openNotificationWithIcon('error', 'Campos vacios en cliente',
          'Los campos Nombre e Identificación son obligatorios. Por favor verifique que estén completos.');
        setAllOk('error');

      }
    } else {
      openNotificationWithIcon('error', 'Campos vacios',
        'Complete los campos para poder guardar la cotización');
    }
  }
  const handleOk = e => {

    data.cotizaciones[parseInt(indice.indice) - 1].cliente = client;
    data.cotizaciones[parseInt(indice.indice) - 1].total = total;
    data.cotizaciones[parseInt(indice.indice) - 1].observacion = observation;
    data.cotizaciones[parseInt(indice.indice) - 1].productos.map(pro => {
      pro = { ...materials, pro }
    });

    <Link href={'/Cotizaciones/cotizaciones'} >
    </Link>


    /*

    data.cotizaciones.push({
      materials: [...materials],
      client: client,
      total: total,
      observation: observation
    })*/
    openNotificationWithIcon('success', 'Cotización modificada con éxito', '');
    setVisible(false);
  };
  const handleCancel = e => {
    setVisible(false);
  };

  return (
    <>
      <div className='top'>
        <h1 className={styles.title}>
          Cotización (Editar)
       </h1>
        <ShowDate />
      </div>
      <div className='cotizacionPanel'>
        <ClientForm
          handleForm={handleClientForm}
          allOk={allOk}
          clientsField={clientFields}
          inputCliente={client}
        />
        <div className='middle'>
          <MaterialsForm handleForm={handleMaterialForm} getTotal={handleTotal}
            dataMaterials={cotizacion.productos} />
        </div>
        <div className='bot'>
          <ObservationForm handleForm={handleObservationForm}
            inputForm={observation} />
          <TotalDisplay total={total} />
          <div className='final'
          >

            <Space>
              <Link href={{ pathname: '/Cotizaciones/cotizaciones' }} >
                <Button type='default' danger>
                  <a>Volver</a>
                </Button>
              </Link>
              <Tooltip placement="top" title={"Guardar"}>
                <Button type="primary"
                  icon={<SaveOutlined />}
                  onClick={onClick}
                >Guardar
            </Button>
              </Tooltip>

            </Space>
          </div>
        </div>
      </div>
      <Modal
        title={'¿Está seguro de realizar esta Operación?'}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Por favor verifique que todos los datos estén bien antes de hacer clic en "Aceptar".</p>
      </Modal>
    </>)
}

export default Cotizacion;
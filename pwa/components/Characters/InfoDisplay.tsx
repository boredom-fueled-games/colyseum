import { Divider, Space, Typography } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons';

const {Text} = Typography;

type StatDisplayProps = {
  title: JSX.Element | string,
  value: JSX.Element | string | number,
  characterValue?: number,
  newValue?: number,
}

const InfoDisplay = ({title, value, characterValue = 0, newValue = 0}: StatDisplayProps): JSX.Element => (
  <Text
    type={
      characterValue === newValue
        ? undefined
        : characterValue < newValue ? 'success' : 'danger'
    }
  >
    <Space>
      <Divider orientation="left" style={{width: 200, marginTop: 8, marginBottom: 8}}>
        {title}
      </Divider>
      <Space align="center" style={{width: 100, justifyContent: 'center'}}>
        {value}{characterValue === newValue
        ? null
        : characterValue < newValue ? <ArrowUpOutlined style={{padding: 4}}/> :
          <ArrowDownOutlined style={{padding: 4}}/>}
      </Space>
    </Space>
  </Text>
);

export default InfoDisplay;

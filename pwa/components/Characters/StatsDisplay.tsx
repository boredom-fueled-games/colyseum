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

const StatsDisplay = ({title, value, characterValue, newValue}: StatDisplayProps): JSX.Element => (
  <Text
    type={
      characterValue === newValue
        ? null
        : characterValue < newValue ? 'success' : 'danger'
    }
  >
    <Space>
      <Divider orientation="left" style={{width: 200}}>
        {title}
      </Divider>
      <Space align="end">
        {value}{characterValue === newValue
        ? null
        : characterValue < newValue ? <ArrowUpOutlined style={{padding: 4}}/> :
          <ArrowDownOutlined style={{padding: 4}}/>}
      </Space>
    </Space>
  </Text>
);

export default StatsDisplay;

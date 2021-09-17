import { Divider, Space, Typography } from 'antd';
const {Text} = Typography;

type StatDisplayProps = {
  title: JSX.Element | string,
  value: JSX.Element | string | number,
  characterValue?: number,
  newValue?: number,
}

const StatsDisplay = ({title, value, characterValue, newValue}: StatDisplayProps): JSX.Element => <Space>
  <Divider orientation="left" style={{width: 200}}>
    <Text
      type={
        characterValue === newValue
          ? null
          : characterValue < newValue ? 'success' : 'danger'
      }
    >{title}</Text>
  </Divider>
  <Space>
    {value}
  </Space>
</Space>;

export default StatsDisplay;

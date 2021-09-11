import CombatLogs from 'pages/characters/[characterId]/combat_logs';
import { getServerSideAuth } from 'utils/sessionAuth';

const Character = (): JSX.Element => <CombatLogs />;

export default Character;

export const getServerSideProps = getServerSideAuth();

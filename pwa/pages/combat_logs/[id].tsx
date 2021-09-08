import { useCombatLog } from 'hooks/combatLogs';
import { useRouter } from 'next/router';
import { Timeline, Descriptions } from 'antd';
import CombatRound from 'types/CombatRound';

const CombatLogDetails = (): JSX.Element => {
    const Router = useRouter();
    const {id} = Router.query;
    const {combatLog, loading} = useCombatLog(id ? `/combat_logs/${id}` : null);

    const generateCombatRoundText = (round: CombatRound): JSX.Element => {
      let verb = `hits for ${round.damageDealt} damage`;
      if (round.evaded) {
        verb = 'misses';
      }
      if (round.blocked) {
        verb = 'is blocked';
      }

      return <><span style={{color: 'red', fontWeight: 'bold'}}>{round.attackerStats.identifier}</span> {verb}</>;
    };

    const rounds = loading ? [] : combatLog.combatRounds;

    return loading ? <div>Loading...</div> : (
      <>
        <Timeline mode="alternate">
          {!rounds ? null : <Timeline.Item
            key={1}
            label={`Attacker: ${rounds[0].attackerStats.identifier}`}
            dot={<i className="ra ra-crossed-swords ra-2x"/>}
          >
            {`Defender: ${rounds[0].defenderStats.identifier}`}
          </Timeline.Item>}
          {rounds.map((round) => (
            <Timeline.Item
              key={round['@id']}
              label={`${round.defenderStats.hp}/${round.defenderStats.constitution * 10 + 50} hp remaining`}
              color={round.evaded ? 'red' : round.blocked ? 'black' : 'green'}
              dot={round.evaded ? <i className="ra ra-footprint ra-lg"/> : round.blocked ?
                <i className="ra ra-shield ra-lg"/> :
                <i className="ra ra-sword ra-lg"/>}
            >
              {generateCombatRoundText(round)}
            </Timeline.Item>
          ))}
        </Timeline>
        <Descriptions title="Results" bordered>
          {combatLog.combatResults.filter((combatResult) => combatResult.winner).map((combatResult) => (
            <Descriptions.Item
              label="Winner"
              key={combatResult['@id']}
            >
              {combatResult.characterStats.identifier}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </>
    );
  }
;

export default CombatLogDetails;

import { Descriptions, Divider, Timeline } from 'antd';
import { useEffect, useState } from 'react';
import CombatLog from 'types/CombatLog';
import CombatRound from 'types/CombatRound';

type CombatReportProps = {
  combatLog: CombatLog
}

const CombatReport = ({combatLog}: CombatReportProps): JSX.Element => {
  const [visibleRounds, setVisibleRounds] = useState<CombatRound[]>([]);
  // const [enabledAutoScroll, setEnabledAutoscroll] = useState<boolean>(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setVisibleRounds(combatLog && combatLog.combatRounds ? combatLog.combatRounds.filter((round) => new Date(round.createdAt) <= now) : []);
    }, 500);

    return () => clearInterval(intervalId);
  }, [combatLog]);

  const finished = combatLog && combatLog.combatRounds && visibleRounds.length === combatLog.combatRounds.length;

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

  return !combatLog ? <div>Loading...</div> : (
    <>
      {finished && combatLog.combatResults.length ? (
        <>
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
          <Divider/>
        </>
      ) : null}
      {visibleRounds.length ? <Timeline mode="alternate" pending={!finished} reverse={true}>
        {!visibleRounds ? null : <Timeline.Item
          key={1}
          label={`Attacker: ${visibleRounds[0].attackerStats.identifier}`}
          dot={<i className="ra ra-crossed-swords ra-2x"/>}
          position="left"
        >
          {`Defender: ${visibleRounds[0].defenderStats.identifier}`}
        </Timeline.Item>}
        {visibleRounds.map((round) => (
          <Timeline.Item
            position={round.attackerStats.identifier !== visibleRounds[0].attackerStats.identifier ? 'left' : 'right'}
            key={round['@id']}
            label={round.damageDealt > 0 ? `${round.defenderStats.hp}/${round.defenderStats.constitution * 10 + 50} hp remaining` : null}
            color={round.evaded ? 'red' : round.blocked ? 'black' : 'green'}
            dot={round.evaded ? <i className="ra ra-footprint ra-lg"/> : round.blocked ?
              <i className="ra ra-shield ra-lg"/> :
              <i className="ra ra-sword ra-lg"/>}
          >
            {generateCombatRoundText(round)}
          </Timeline.Item>
        ))}
      </Timeline> : null}
      {/*{finished ? null : <Button className="center pinned" shape="round"*/}
      {/*                           onClick={() => setEnabledAutoscroll(!enabledAutoScroll)}>{enabledAutoScroll ? 'Disable' : 'Enable'} Autoscroll</Button>}*/}
    </>
  );
};

export default CombatReport;

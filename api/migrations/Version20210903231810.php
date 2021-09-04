<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210903231810 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE combat_logs (id UUID NOT NULL, started_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, ended_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN combat_logs.id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE characters_combat_logs (combat_log_id UUID NOT NULL, character_id UUID NOT NULL, PRIMARY KEY(combat_log_id, character_id))');
        $this->addSql('CREATE INDEX IDX_C358535845E363EF ON characters_combat_logs (combat_log_id)');
        $this->addSql('CREATE INDEX IDX_C35853581136BE75 ON characters_combat_logs (character_id)');
        $this->addSql('COMMENT ON COLUMN characters_combat_logs.combat_log_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN characters_combat_logs.character_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE combat_results (id UUID NOT NULL, character_id UUID NOT NULL, combat_log_id UUID NOT NULL, character_stats JSON DEFAULT \'[]\' NOT NULL, winner BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_AB62B9D61136BE75 ON combat_results (character_id)');
        $this->addSql('CREATE INDEX IDX_AB62B9D645E363EF ON combat_results (combat_log_id)');
        $this->addSql('COMMENT ON COLUMN combat_results.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN combat_results.character_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN combat_results.combat_log_id IS \'(DC2Type:ulid)\'');
        $this->addSql('CREATE TABLE combat_rounds (id UUID NOT NULL, combat_log_id UUID NOT NULL, attacker_id UUID NOT NULL, defender_id UUID NOT NULL, attacker_stats JSON DEFAULT \'[]\' NOT NULL, defender_stats JSON DEFAULT \'[]\' NOT NULL, round_result JSON DEFAULT \'[]\' NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_95FBEB3D45E363EF ON combat_rounds (combat_log_id)');
        $this->addSql('CREATE INDEX IDX_95FBEB3D65F8CAE3 ON combat_rounds (attacker_id)');
        $this->addSql('CREATE INDEX IDX_95FBEB3D4A3E3B6F ON combat_rounds (defender_id)');
        $this->addSql('COMMENT ON COLUMN combat_rounds.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN combat_rounds.combat_log_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN combat_rounds.attacker_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN combat_rounds.defender_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE characters_combat_logs ADD CONSTRAINT FK_C358535845E363EF FOREIGN KEY (combat_log_id) REFERENCES combat_logs (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE characters_combat_logs ADD CONSTRAINT FK_C35853581136BE75 FOREIGN KEY (character_id) REFERENCES characters (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE combat_results ADD CONSTRAINT FK_AB62B9D61136BE75 FOREIGN KEY (character_id) REFERENCES characters (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE combat_results ADD CONSTRAINT FK_AB62B9D645E363EF FOREIGN KEY (combat_log_id) REFERENCES combat_logs (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE combat_rounds ADD CONSTRAINT FK_95FBEB3D45E363EF FOREIGN KEY (combat_log_id) REFERENCES combat_logs (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE combat_rounds ADD CONSTRAINT FK_95FBEB3D65F8CAE3 FOREIGN KEY (attacker_id) REFERENCES characters (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE combat_rounds ADD CONSTRAINT FK_95FBEB3D4A3E3B6F FOREIGN KEY (defender_id) REFERENCES characters (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('DROP INDEX uniq_3a29410ea76ed395');
        $this->addSql('ALTER TABLE characters DROP currency');
        $this->addSql('CREATE INDEX IDX_3A29410EA76ED395 ON characters (user_id)');
        $this->addSql('ALTER TABLE users ADD currency INT DEFAULT 0 NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE characters_combat_logs DROP CONSTRAINT FK_C358535845E363EF');
        $this->addSql('ALTER TABLE combat_results DROP CONSTRAINT FK_AB62B9D645E363EF');
        $this->addSql('ALTER TABLE combat_rounds DROP CONSTRAINT FK_95FBEB3D45E363EF');
        $this->addSql('DROP TABLE combat_logs');
        $this->addSql('DROP TABLE characters_combat_logs');
        $this->addSql('DROP TABLE combat_results');
        $this->addSql('DROP TABLE combat_rounds');
        $this->addSql('ALTER TABLE users DROP currency');
        $this->addSql('DROP INDEX IDX_3A29410EA76ED395');
        $this->addSql('ALTER TABLE characters ADD currency INT NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX uniq_3a29410ea76ed395 ON characters (user_id)');
    }
}

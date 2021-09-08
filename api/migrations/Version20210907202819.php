<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210907202819 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE combat_rounds ADD evaded BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE combat_rounds ADD blocked BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE combat_rounds ADD damage_dealt INT NOT NULL');
        $this->addSql('ALTER TABLE combat_rounds DROP round_result');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE combat_rounds ADD round_result JSON DEFAULT \'[]\' NOT NULL');
        $this->addSql('ALTER TABLE combat_rounds DROP evaded');
        $this->addSql('ALTER TABLE combat_rounds DROP blocked');
        $this->addSql('ALTER TABLE combat_rounds DROP damage_dealt');
    }
}

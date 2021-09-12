<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210912140931 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE items (id UUID NOT NULL, identifier VARCHAR(30) NOT NULL, type VARCHAR(10) NOT NULL, price INT NOT NULL, durability INT NOT NULL, defense INT NOT NULL, minimal_damage INT NOT NULL, maximal_damage INT NOT NULL, block_chance INT NOT NULL, required_strength INT NOT NULL, required_dexterity INT NOT NULL, added_strength INT NOT NULL, added_dexterity INT NOT NULL, added_constitution INT NOT NULL, added_intelligence INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('COMMENT ON COLUMN items.id IS \'(DC2Type:ulid)\'');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE items');
    }
}

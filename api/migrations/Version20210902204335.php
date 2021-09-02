<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210902204335 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE characters (id UUID NOT NULL, user_id UUID DEFAULT NULL, identifier VARCHAR(25) NOT NULL, level INT NOT NULL, currency INT NOT NULL, experience INT NOT NULL, strength INT NOT NULL, dexterity INT NOT NULL, constitution INT NOT NULL, metadata JSON DEFAULT \'[]\' NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_3A29410EA76ED395 ON characters (user_id)');
        $this->addSql('COMMENT ON COLUMN characters.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN characters.user_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE characters ADD CONSTRAINT FK_3A29410EA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE characters');
    }
}

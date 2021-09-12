<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20210912150639 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE owned_items (id UUID NOT NULL, item_id UUID NOT NULL, user_id UUID NOT NULL, character_id UUID DEFAULT NULL, durability INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_1589759E126F525E ON owned_items (item_id)');
        $this->addSql('CREATE INDEX IDX_1589759EA76ED395 ON owned_items (user_id)');
        $this->addSql('CREATE INDEX IDX_1589759E1136BE75 ON owned_items (character_id)');
        $this->addSql('COMMENT ON COLUMN owned_items.id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN owned_items.item_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN owned_items.user_id IS \'(DC2Type:ulid)\'');
        $this->addSql('COMMENT ON COLUMN owned_items.character_id IS \'(DC2Type:ulid)\'');
        $this->addSql('ALTER TABLE owned_items ADD CONSTRAINT FK_1589759E126F525E FOREIGN KEY (item_id) REFERENCES items (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE owned_items ADD CONSTRAINT FK_1589759EA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE owned_items ADD CONSTRAINT FK_1589759E1136BE75 FOREIGN KEY (character_id) REFERENCES characters (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE owned_items');
    }
}

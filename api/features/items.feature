@items
Feature:
    @authorization
    Scenario: Requesting items without authentication should fail
        When a GET request is send to "/items"
        Then the response status code should be 401
        And the response should be in JSON

    @authorization
    @loginAsAdmin
    Scenario: Requesting items with authentication should succeed
        When a GET request is send to "/items"
        Then the response status code should be 200
        And the response should be in JSON

    @loginAsAdmin
    Scenario: Multiple items can be request in a single call
        Given the fixtures file "fixtures/items.yml" is loaded
        When a GET request is send to "/items"
        Then the response status code should be 200
        Then the response collection should contain:
            | identifier |
            | weapon_1   |
            | weapon_2   |
            | shield_1   |
            | shield_2   |
        And items in the response collection should only have the following fields:
            | @id               |
            | @type             |
            | identifier        |
            | type              |
            | price             |
            | durability        |
            | defense           |
            | minimalDamage     |
            | maximalDamage     |
            | blockChance       |
            | requiredStrength  |
            | requiredDexterity |
            | addedStrength     |
            | addedDexterity    |
            | addedConstitution |
            | addedIntelligence |
        And the response should be in JSON

    @loginAsAdmin
    Scenario: A single item can be requested
        Given the fixtures file "fixtures/items.yml" is loaded
        When a GET request is send to the iri of entity with class "App\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Item",
            "@type": "Item",
            "identifier": "weapon_1",
            "type": "weapon",
            "price": 0,
            "durability": 1000,
            "defense": 0,
            "minimalDamage": 0,
            "maximalDamage": 0,
            "blockChance": 0,
            "requiredStrength": 0,
            "requiredDexterity": 0,
            "addedStrength": 0,
            "addedDexterity": 0,
            "addedConstitution": 0,
            "addedIntelligence": 0
        }
        """

    @loginAsAdmin
    Scenario: An item can't be created
        When the request body is:
        """
        {
            "identifier": "new item"
        }
        """
        And a POST request is send to "/items"
        Then the response status code should be 405

    @loginAsAdmin
    Scenario: An item can't be deleted
        Given the fixtures file "fixtures/items.yml" is loaded
        When a DELETE request is send to the iri of entity with class "App\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405

    @loginAsAdmin
    Scenario: An item can't be patched
        Given the fixtures file "fixtures/items.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405

    @loginAsAdmin
    Scenario: An item can't be replaced
        Given the fixtures file "fixtures/items.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405

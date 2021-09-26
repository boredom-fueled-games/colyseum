@items
Feature:
    @authorization
    Scenario: Requesting items without authorization should fail
        When a GET request is send to "/items"
        Then the response status code should be 401
        And the response content should be JSON

    @authorization
    @loginAsAdmin
    Scenario: Requesting items with authorization should succeed
        When a GET request is send to "/items"
        Then the response status code should be 200
        And the response content should be JSON

    @loginAsAdmin
    Scenario: Multiple items can be requested in a single request
        Given the fixtures file "fixtures/items.yml" is loaded
        When a GET request is send to "/items"
        Then the response status code should be 200
        Then the response collection should contain:
            | identifier |
            | weapon_1   |
            | weapon_2   |
            | shield_1   |
            | shield_2   |
        And entities in the response content should all have these fields:
            | @id               |
            | @type             |
            | identifier        |
            | type              |
            | price             |
            | durability        |
        And the response content should be JSON

    @loginAsAdmin
    Scenario: A single item can be requested
        Given the fixtures file "fixtures/items.yml" is loaded
        When a GET request is send to the iri of entity with class "App\Core\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 200
        And the response content should be JSON
        And the response content matches:
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
        When the request content is:
        """
        {
            "identifier": "new item"
        }
        """
        And a POST request is send to "/items"
        Then the response status code should be 405
        And no entity with class "App\Core\Entity\Item" should exist:
        """
        {
            "identifier": "new item"
        }
        """

    @loginAsAdmin
    Scenario: An item can't be deleted
        Given the fixtures file "fixtures/items.yml" is loaded
        When a DELETE request is send to the iri of entity with class "App\Core\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405
        And an entity with class "App\Core\Entity\Item" should exist:
        """
        {
            "identifier": "weapon_1"
        }
        """

    @loginAsAdmin
    Scenario: An item can't be patched
        Given the fixtures file "fixtures/items.yml" is loaded
        When the request content is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Core\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405
        And no entity with class "App\Core\Entity\Item" should exist:
        """
        {
            "identifier": "new identifier"
        }
        """

    @loginAsAdmin
    Scenario: An item can't be replaced
        Given the fixtures file "fixtures/items.yml" is loaded
        When the request content is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Core\Entity\Item":
        """
        {
            "identifier": "weapon_1"
        }
        """
        Then the response status code should be 405
        And no entity with class "App\Core\Entity\Item" should exist:
        """
        {
            "identifier": "new identifier"
        }
        """

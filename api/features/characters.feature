@characters
Feature:
    @authorization
    Scenario: Requesting characters without authentication should fail
        When a GET request is send to "/characters"
        Then the response status code should be 401
        And the response should be in JSON

    @authorization
    @loginAsAdmin
    Scenario: Requesting characters with authentication should succeed
        When a GET request is send to "/characters"
        Then the response status code should be 200
        And the response should be in JSON

    @loginAsAdmin
    Scenario: Multiple non-player characters can be request in a single call
        Given the fixtures file "fixtures/non_player_characters.yml" is loaded
        When a GET request is send to "/characters"
        Then the response status code should be 200
        Then the response collection should contain:
            | identifier  |
            | character_1 |
            | character_2 |
            | character_3 |
            | character_4 |
            | character_5 |
        And items in the response collection should only have the following fields:
            | @id                       |
            | @type                     |
            | identifier                |
            | level                     |
            | wins                      |
            | losses                    |
            | experienceTillNextLevel   |
        And the response should be in JSON

    @loginAsAdmin
    Scenario: Multiple player-owned characters can be request in a single call
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When a GET request is send to "/characters"
        Then the response status code should be 200
        Then the response collection should contain:
            | identifier  |
            | character_1 |
            | character_2 |
            | character_3 |
            | character_4 |
            | character_5 |
        And items in the response collection should only have the following fields:
            | @id                       |
            | @type                     |
            | identifier                |
            | level                     |
            | wins                      |
            | losses                    |
            | experienceTillNextLevel   |
            | user                      |
        And the response should be in JSON

    @loginAsAdmin
    Scenario: A single non-player character can be requested
        Given the fixtures file "fixtures/non_player_characters.yml" is loaded
        When a GET request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Character",
            "@type": "Character",
            "identifier": "character_1"
        }
        """
        And the response body should not contain the field user

    @loginAsAdmin
    Scenario: A single player-owned character can be requested
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When a GET request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Character",
            "@type": "Character",
            "identifier": "character_1"
        }
        """
        And the response body should contain the field user

    @loginAsAdmin
    Scenario: A character can be created
        When the request body is:
        """
        {
            "identifier": "new character"
        }
        """
        And a POST request is send to "/characters"
        Then the response status code should be 201
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Character",
            "@type": "Character",
            "identifier": "new character"
        }
        """
        And an entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new character"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new character needs a long-enough identifier
        When the request body is:
        """
        {
            "identifier": "new"
        }
        """
        And a POST request is send to "/characters"
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new character needs a short-enough identifier
        When the request body is:
        """
        {
            "identifier": "this identifier is waaaaaaay too long to be used in this game"
        }
        """
        And a POST request is send to "/characters"
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "this identifier is waaaaaaay too long to be used in this game"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new character needs a unique identifier
        Given the fixtures file "fixtures/non_player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "character_1"
        }
        """
        And a POST request is send to "/characters"
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is already used."
                }
            ]
        }
        """

    @loginAsAdmin
    Scenario: A player-owned character can be deleted
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When a DELETE request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 204
        And the response should be empty
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "character_1"
        }
        """

    @loginAsAdmin
    Scenario: A player-owned character can be updated
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Character",
            "@type": "Character",
            "identifier": "new identifier"
        }
        """
        And an entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new identifier"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be updated using a long-enough identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be updated using a short-enough identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "long identifiers would be really hard to consistently fit into the viewport"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "long identifiers would be really hard to consistently fit into the viewport"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be updated using an unique identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "character_2"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is already used."
                }
            ]
        }
        """

    @loginAsAdmin
    Scenario: A player-owned character can be replaced
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new identifier"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/Character",
            "@type": "Character",
            "identifier": "new identifier"
        }
        """
        And an entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new identifier"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be replaced using a long-enough identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "new"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be replaced using a short-enough identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "long identifiers would be really hard to consistently fit into the viewport"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\Character" should exist:
        """
        {
            "identifier": "long identifiers would be really hard to consistently fit into the viewport"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A player-owned character has to be replaced using an unique identifier
        Given the fixtures file "fixtures/player_characters.yml" is loaded
        When the request body is:
        """
        {
            "identifier": "character_2"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\Character":
        """
        {
            "identifier": "character_1"
        }
        """
        Then the response status code should be 422
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "identifier",
                    "message": "This value is already used."
                }
            ]
        }
        """

@character
Feature:
    @authentication
    Scenario: Requesting characters without authentication should fail
        When a GET request is send to "/characters"
        Then the response status code should be 401
        And the response should be in JSON

    @authentication
    @login
    Scenario: Requesting characters with authentication should succeed
        When a GET request is send to "/characters"
        Then the response status code should be 200
        And the response should be in JSON

    @login
    Scenario: All characters can be request in a single call
        Given the fixtures file "fixtures/characters.yml" is loaded
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

    @login
    Scenario: A single character can be requested
        Given the fixtures file "fixtures/characters.yml" is loaded
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

    @focus
    @login
    Scenario: A character can be created
        When the request body is:
        """
        {
            "identifier": "new character",
            "password": "new password"
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

    @login
    Scenario: A character can be deleted
        Given the fixtures file "fixtures/characters.yml" is loaded
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

    @login
    Scenario: A character can be patched
        Given the fixtures file "fixtures/characters.yml" is loaded
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

    @login
    Scenario: A character can be replaced
        Given the fixtures file "fixtures/characters.yml" is loaded
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

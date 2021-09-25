Feature:
    Scenario: Requesting users without authentication should fail
        When I send a GET request to "/users"
        Then the response status code should be 401
        And the response should be in JSON

    @login
    Scenario: Requesting users with authentication should succeed
        When I send a GET request to "/users"
        Then the response status code should be 200
        And the response should be in JSON

    @login
    Scenario: I can request all users
        Given the fixtures file "fixtures/users.yml" is loaded
        When I send a GET request to "/users"
        Then the response status code should be 200
        Then the response collection should contain:
            | username  |
            | user_1    |
            | user_2    |
            | user_3    |
            | user_4    |
            | user_5    |
        And items in the response collection should only have the following fields:
            | @id       |
            | @type     |
            | username  |
        And the response should be in JSON

    @login
    Scenario: I can create user
        When the request body is:
        """
        {
            "username": "new user",
            "password": "new password"
        }
        """
        And I send a POST request to "/users"
        Then the response status code should be 201
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new user",
            "characters": [],
            "currency": 0
        }
        """

    @login
    Scenario: I can request a single user
        Given the fixtures file "fixtures/users.yml" is loaded
        And I send a GET request to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 200
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "user_1"
        }
        """

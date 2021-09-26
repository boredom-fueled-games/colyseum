@users
Feature:
    @authentication
    Scenario: Requesting users without authentication should fail
        When a GET request is send to "/users"
        Then the response status code should be 401
        And the response should be in JSON

    @authentication
    @loginAsAdmin
    Scenario: Requesting users with authentication should succeed
        When a GET request is send to "/users"
        Then the response status code should be 200
        And the response should be in JSON

    @loginAsAdmin
    Scenario: Multiple users can be request in a single call
        Given the fixtures file "fixtures/users.yml" is loaded
        When a GET request is send to "/users"
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

    @loginAsAdmin
    Scenario: A single user can be requested
        Given the fixtures file "fixtures/users.yml" is loaded
        When a GET request is send to the iri of entity with class "App\Entity\User":
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

    @loginAsAdmin
    Scenario: A user can be created
        When the request body is:
        """
        {
            "username": "new user",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 201
        And the response should be in JSON
        And the response body matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new user"
        }
        """

    @loginAsAdmin
    Scenario: A user can be deleted
        Given the fixtures file "fixtures/users.yml" is loaded
        When a DELETE request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 204
        And the response should be empty
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "user_1"
        }
        """

    @loginAsAdmin
    Scenario: A user can be patched
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request body is:
        """
        {
            "username": "new username"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\User":
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
            "username": "new username"
        }
        """

    @loginAsAdmin
    Scenario: A user can be replaced
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request body is:
        """
        {
            "username": "new username"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
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
            "username": "new username"
        }
        """

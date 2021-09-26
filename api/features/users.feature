@users
Feature:
    @authorization
    Scenario: Requesting users without authorization should fail
        When a GET request is send to "/users"
        Then the response status code should be 401
        And the response content should be JSON

    @authorization
    @loginAsAdmin
    Scenario: Requesting users with authorization should succeed
        When a GET request is send to "/users"
        Then the response status code should be 200
        And the response content should be JSON

    @loginAsAdmin
    Scenario: Multiple users can be requested in a single request
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
        And entities in the response content should all have these fields:
            | @id       |
            | @type     |
            | username  |
        And the response content should be JSON

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
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "user_1"
        }
        """

    @loginAsAdmin
    Scenario: A user can be created by an admin
        When the request content is:
        """
        {
            "username": "new user",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 201
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new user"
        }
        """
        And an entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new user"
        }
        """

    @authorization
    Scenario: A user can be created without authorization
        When the request content is:
        """
        {
            "username": "new user",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 201
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new user"
        }
        """
        And an entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new user"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new user needs a long-enough username
        When the request content is:
        """
        {
            "username": "new",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new user needs a short-enough username
        When the request content is:
        """
        {
            "username": "this username is waaaaaaay too long to be used in this game",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "this username is waaaaaaay too long to be used in this game"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new user needs a unique username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "user_1",
            "password": "new password"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is already used."
                }
            ]
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A new user needs a long-enough password
        When the request content is:
        """
        {
            "username": "new user",
            "password": "short"
        }
        """
        And a POST request is send to "/users"
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "password",
                    "message": "This value is too short. It should have 10 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
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
        And the response content should be empty
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "user_1"
        }
        """

    @loginAsAdmin
    Scenario: A user can be updated
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
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
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new username"
        }
        """
        And an entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new username"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be updated using a long-enough username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "new"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be updated using a short-enough username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "long usernames would be really hard to consistently fit into the viewport"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "long usernames would be really hard to consistently fit into the viewport"
        }
        """

    @validation
    @loginAsAdmin
    Scenario:  A user has to be updated using an unique username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "user_2"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is already used."
                }
            ]
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be updated using a long-enough password
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "password": "short"
        }
        """
        And the "CONTENT_TYPE" header is set to "application/merge-patch+json"
        And a PATCH request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "password",
                    "message": "This value is too short. It should have 10 characters or more."
                }
            ]
        }
        """

    @loginAsAdmin
    Scenario: A user can be replaced
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "new username",
            "password": "new password"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 200
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/User",
            "@type": "User",
            "username": "new username"
        }
        """
        And an entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new username"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be replaced using a long-enough username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "new",
            "password": "new password"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too short. It should have 5 characters or more."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "new"
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be replaced using a short-enough username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "long usernames would be really hard to consistently fit into the viewport",
            "password": "new password"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is too long. It should have 25 characters or less."
                }
            ]
        }
        """
        And no entity with class "App\Entity\User" should exist:
        """
        {
            "username": "long usernames would be really hard to consistently fit into the viewport"
        }
        """

    @validation
    @loginAsAdmin
    Scenario:  A user has to be replaced using an unique username
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "user_2",
            "password": "new password"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "username",
                    "message": "This value is already used."
                }
            ]
        }
        """

    @validation
    @loginAsAdmin
    Scenario: A user has to be replaced using a long-enough password
        Given the fixtures file "fixtures/users.yml" is loaded
        When the request content is:
        """
        {
            "username": "new username",
            "password": "short"
        }
        """
        And a PUT request is send to the iri of entity with class "App\Entity\User":
        """
        {
            "username": "user_1"
        }
        """
        Then the response status code should be 422
        And the response content should be JSON
        And the response content matches:
        """
        {
            "@context": "\/contexts\/ConstraintViolationList",
            "@type": "ConstraintViolationList",
            "violations": [
                {
                    "propertyPath": "password",
                    "message": "This value is too short. It should have 10 characters or more."
                }
            ]
        }
        """
